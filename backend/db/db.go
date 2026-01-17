package db

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() *gorm.DB {
	dsn := "host=localhost user=user password=password dbname=portfolio port=5433 sslmode=disable TimeZone=Asia/Tokyo"
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("DB接続に失敗しました: %v", err)
	}

	fmt.Println("✅ PostgreSQL接続成功")
	DB = database
	return DB
}
