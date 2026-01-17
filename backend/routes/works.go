package routes

import (
	"react_go_backend/controller"

	"github.com/gin-gonic/gin"
)

func RegisterWorkRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/works", controller.GetWorks)
		api.GET("/works/:id", controller.GetWorkByID)
		api.PUT("/works/:id", controller.UpdateWork)
		api.POST("/works", controller.CreateWork)
		api.DELETE("/works/:id", controller.DeleteWork)
	}
}
