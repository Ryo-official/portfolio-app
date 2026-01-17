package controller

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

func UploadWorkImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		log.Printf("[UploadWorkImage] ファイルを取得できません")

		return
	}

	uploadDir := "uploads/works"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		log.Printf("[UploadWorkImage] ディレクトリ作成に失敗")

		return
	}

	// ファイル名にタイムスタンプ付与
	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), filepath.Base(file.Filename))
	savePath := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		log.Printf("[UploadWorkImage] ファイル保存に失敗")

		return
	}

	// クライアントにはアクセス用URLを返す
	c.JSON(http.StatusOK, gin.H{
		"url": fmt.Sprintf("http://localhost:8080/uploads/works/%s", filename),
	})
}
