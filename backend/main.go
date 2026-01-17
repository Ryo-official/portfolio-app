package main

import (
	"log"

	"react_go_backend/db"
	"react_go_backend/models"
	"react_go_backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// DB接続
	database := db.ConnectDB()

	// AutoMigrate（テーブル作成）
	err := database.AutoMigrate(
		&models.SkillCategory{},
		&models.Skill{},
		&models.Work{},
		&models.WorkImage{},
	)
	if err != nil {
		log.Fatalf("DBマイグレーションに失敗しました: %v", err)
	}

	// Ginルーター初期化
	router := gin.Default()

	// staticは他ルーティングより先に設定（上書き防止）
	router.Static("/uploads", "uploads")

	// -----------------------
	// CORS ミドルウェア（全ルートに適用）
	// -----------------------
	router.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			// 任意のOriginに動的に対応
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		// OPTIONSリクエストは早期に204で応答
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// -----------------------
	// ルーティング設定
	// -----------------------
	routes.RegisterSkillRoutes(router)
	routes.RegisterWorkRoutes(router)
	routes.RegisterUploadRoutes(router)

	// サーバー起動
	log.Println("✅ サーバー起動: http://localhost:8080")
	router.Run(":8080")
}
