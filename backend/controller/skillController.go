package controller

import (
	"log"
	"net/http"

	"react_go_backend/db"
	"react_go_backend/models"

	"github.com/gin-gonic/gin"
)

// GetSkillCategories カテゴリごとのスキル一覧を返す
func GetSkillCategories(c *gin.Context) {
	var categories []models.SkillCategory

	// 各カテゴリに紐づくスキルを含めて取得
	if err := db.DB.Preload("Skills").Find(&categories).Error; err != nil {

		log.Printf("[GetSkillCategories] カテゴリデータの取得に失敗しました")

		return
	}

	c.JSON(http.StatusOK, categories)
}

// GetSkillCategorie 選択されたカテゴリのスキル一覧を返す
func GetSkillCategory(c *gin.Context) {
	id := c.Param("id")

	var category models.SkillCategory

	if err := db.DB.
		Preload("Skills").
		Where("id = ?", id).
		First(&category).Error; err != nil {

		log.Printf("[GetSkillCategory] カテゴリデータの取得に失敗しました")

		return
	}

	c.JSON(http.StatusOK, category)
	log.Printf("%+v", category)
}

func UpdateSkillCategory(c *gin.Context) {
	id := c.Param("id")

	var req models.SkillCategory

	// ===== JSON Bind =====
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[UpdateSkillCategory] リクエストが不正です")

		return
	}

	// ===== 対象カテゴリ取得 =====
	var category models.SkillCategory
	if err := db.DB.
		Preload("Skills").
		First(&category, id).Error; err != nil {

		log.Printf("[UpdateSkillCategory] カテゴリが見つかりません")
		return
	}

	tx := db.DB.Begin()

	// ===== カテゴリ更新 =====
	if err := tx.Model(&category).Updates(map[string]interface{}{
		"name":        req.Name,
		"description": req.Description,
	}).Error; err != nil {

		tx.Rollback()
		log.Printf("[UpdateSkillCategory] カテゴリ更新に失敗しました")

		return
	}

	// ===== 既存 skill map =====
	existing := make(map[uint]models.Skill)
	for _, s := range category.Skills {
		existing[s.ID] = s
	}

	// ===== skill 更新 / 追加 =====
	for _, skill := range req.Skills {
		skill.CategoryID = category.ID // 必ず紐付ける

		if skill.ID != 0 {
			// 更新
			if err := tx.Model(&models.Skill{}).
				Where("id = ?", skill.ID).
				Updates(map[string]interface{}{
					"name":        skill.Name,
					"proficiency": skill.Proficiency,
				}).Error; err != nil {

				tx.Rollback()
				log.Printf("[UpdateSkillCategory] スキル更新に失敗しました")

				return
			}
			delete(existing, skill.ID)
		} else {
			// 新規
			if err := tx.Create(&skill).Error; err != nil {
				tx.Rollback()
				log.Printf("[UpdateSkillCategory] スキル追加に失敗しました")

				return
			}
		}
	}

	// ===== 削除 =====
	for _, s := range existing {
		if err := tx.Delete(&s).Error; err != nil {
			tx.Rollback()
			log.Printf("[UpdateSkillCategory] スキル削除に失敗しました")

			return
		}
	}

	tx.Commit()

	// ===== 更新後返却 =====
	var updated models.SkillCategory
	db.DB.Preload("Skills").First(&updated, id)

	c.JSON(http.StatusOK, updated)
}

func CreateSkillCategory(c *gin.Context) {
	var category models.SkillCategory

	// ===== SkillCategory そのものを受け取る =====
	if err := c.ShouldBindJSON(&category); err != nil {
		log.Printf("[CreateSkillCategory] リクエストが不正です")
		return
	}

	tx := db.DB.Begin()

	// ===== カテゴリ作成（Skills はまだ保存されない）=====
	if err := tx.Create(&models.SkillCategory{
		Name:        category.Name,
		Description: category.Description,
	}).Error; err != nil {
		tx.Rollback()
		log.Printf("[CreateSkillCategory] カテゴリ作成に失敗しました")
		return
	}

	// 作成されたカテゴリIDを取得
	var created models.SkillCategory
	if err := tx.Where("name = ?", category.Name).
		Order("id desc").
		First(&created).Error; err != nil {
		tx.Rollback()
		log.Printf("[CreateSkillCategory] カテゴリ取得に失敗しました")
		return
	}

	// ===== Skills は SkillCategory に属するものとして保存 =====
	for _, skill := range category.Skills {
		skill.CategoryID = created.ID

		if err := tx.Create(&skill).Error; err != nil {
			tx.Rollback()
			log.Printf("[CreateSkillCategory] スキル作成に失敗しました")
			return
		}
	}

	tx.Commit()

	// ===== 作成結果を返却 =====
	db.DB.Preload("Skills").First(&created, created.ID)
	c.JSON(http.StatusCreated, created)
}

func DeleteSkillCategory(c *gin.Context) {
	id := c.Param("id")

	var category models.SkillCategory
	result := db.DB.Preload("Skills").First(&category, id)

	if result.Error != nil {
		log.Printf(
			"[GetSkillCategory] DB error. id=%s, err=%v",
			id,
			result.Error,
		)

		c.JSON(http.StatusNotFound, gin.H{
			"message": "カテゴリが見つかりません",
		})
		return
	}

	// === DB削除（子 → 親） ===
	db.DB.
		Where("category_id = ?", category.ID).
		Delete(&models.Skill{})

	db.DB.Delete(&category)

	log.Printf(
		"[DeleteSkillCategory] スキルカテゴリーと紐づくスキルを削除しました categoryID=%d",
		category.ID,
	)
}
