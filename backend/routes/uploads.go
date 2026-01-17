package routes

import (
	"react_go_backend/controller"

	"github.com/gin-gonic/gin"
)

func RegisterUploadRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.POST("/upload", controller.UploadWorkImage)
	}
}
