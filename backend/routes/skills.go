package routes

import (
	"react_go_backend/controller"

	"github.com/gin-gonic/gin"
)

func RegisterSkillRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/skillCategories", controller.GetSkillCategories)
		api.GET("/skillCategory/:id", controller.GetSkillCategory)
		api.PUT("/skillCategory/:id", controller.UpdateSkillCategory)
		api.POST("/skillCategory", controller.CreateSkillCategory)
		api.DELETE("/skillCategory/:id", controller.DeleteSkillCategory)
	}
}
