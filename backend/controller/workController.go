package controller

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"react_go_backend/db"
	"react_go_backend/models"

	"github.com/gin-gonic/gin"
)

func GetWorks(c *gin.Context) {
	var works []models.Work

	// Images を含めて取得
	if err := db.DB.Preload("Images").Find(&works).Error; err != nil {
		log.Printf("[GetWorks] ポートフォリオデータの取得に失敗しました")

		return
	}

	c.JSON(http.StatusOK, works)
}

func GetWorkByID(c *gin.Context) {
	id := c.Param("id")
	var work models.Work

	if err := db.DB.Preload("Images").First(&work, id).Error; err != nil {
		log.Printf("[GetWorks] 指定のポートフォリオが見つかりません")

		return
	}

	c.JSON(http.StatusOK, work)
}

func UpdateWork(c *gin.Context) {
	id := c.Param("id")

	var input models.Work
	if err := c.ShouldBindJSON(&input); err != nil {
		log.Printf("[UpdateWork] JSONの形式が不正です")

		return
	}

	var work models.Work
	if err := db.DB.Preload("Images").First(&work, id).Error; err != nil {
		log.Printf("[UpdateWork] ポートフォリオが見つかりません")

		return
	}

	// ===== 基本情報更新 =====
	work.Title = input.Title
	work.Description = input.Description
	work.Category = input.Category
	work.Year = input.Year

	// ===== 画像削除判定 =====
	existing := map[uint]models.WorkImage{}
	for _, img := range work.Images {
		existing[img.ID] = img
	}

	incoming := map[uint]bool{}
	for _, img := range input.Images {
		if img.ID != 0 {
			incoming[img.ID] = true
		}
	}

	// 削除された画像
	for id, img := range existing {
		if !incoming[id] {
			// ファイル削除
			filePath := imageURLToFilePath(img.URL)
			_ = os.Remove(filePath)

			// DB削除
			db.DB.Delete(&img)
		}
	}

	// ===== 画像追加・更新 =====
	for _, img := range input.Images {
		if img.ID == 0 {
			// 新規
			db.DB.Create(&models.WorkImage{
				URL:         img.URL,
				Description: img.Description,
				WorkID:      work.ID,
			})
		} else {
			// 更新
			db.DB.Model(&models.WorkImage{}).
				Where("id = ?", img.ID).
				Updates(map[string]interface{}{
					"url":         img.URL,
					"description": img.Description,
				})
		}
	}

	db.DB.Save(&work)

	log.Printf("[UpdateWork] ポートフォリオの更新が完了しました")
}

func CreateWork(c *gin.Context) {
	// ===== ① 入力を受け取る =====
	log.Println("CreateWork CALLED")
	var input models.Work
	log.Printf("IMAGES: %+v\n", input.Images)
	if err := c.ShouldBindJSON(&input); err != nil {
		log.Printf("[CreateWork] JSONの形式が不正です")

		return
	}

	tx := db.DB.Begin()

	// ===== ② Work 本体を作成 =====
	work := models.Work{
		Title:       input.Title,
		Description: input.Description,
		Category:    input.Category,
		Year:        input.Year,
	}

	if err := tx.Create(&work).Error; err != nil {
		tx.Rollback()
		log.Printf("[CreateWork] ポートフォリオの作成に失敗しました")

		return
	}

	// ===== ③ 画像を登録 =====
	for _, img := range input.Images {
		image := models.WorkImage{
			WorkID:      work.ID,
			URL:         img.URL,
			Description: img.Description,
		}

		if err := tx.Create(&image).Error; err != nil {
			tx.Rollback()
			log.Printf("[CreateWork] 画像の保存に失敗しました")

			return
		}
	}

	tx.Commit()

	// ===== ④ レスポンス =====
	c.JSON(http.StatusCreated, gin.H{
		"message": "ポートフォリオを作成しました",
		"id":      work.ID,
	})
	log.Printf("[CreateWork] ポートフォリオを作成しました ID=%d", work.ID)

}

func DeleteWork(c *gin.Context) {
	id := c.Param("id")

	var work models.Work
	if err := db.DB.Preload("Images").First(&work, id).Error; err != nil {
		log.Printf("[DeleteWork] ポートフォリオが見つかりません")

		return
	}

	// === 画像ファイル削除 ===
	for _, img := range work.Images {
		filePath := imageURLToFilePath(img.URL)

		fmt.Println("delete file:", filePath)

		if err := os.Remove(filePath); err != nil {
			fmt.Println("ファイル削除失敗:", err)
			// ※ ここでは return しない（DB削除は続行）
		}
	}

	// === DB削除（子 → 親） ===
	db.DB.Where("work_id = ?", work.ID).Delete(&models.WorkImage{})
	db.DB.Delete(&work)

	log.Printf("[DeleteWork] ポートフォリオと画像を削除しました")

}

func imageURLToFilePath(url string) string {
	// フルURLでも相対URLでも対応
	url = strings.TrimPrefix(url, "http://localhost:8080")
	url = strings.TrimPrefix(url, "/")

	return filepath.Join("uploads", url[len("uploads/"):])
}
