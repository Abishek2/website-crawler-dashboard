package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Abishek2/website-crawler-dashboard/backend/models"
	"gorm.io/gorm"
)

type URLInput struct {
	URL string `json:"url" binding:"required,url"`
}

func CreateURL(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input URLInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		newURL := models.URL{
			URL:    input.URL,
			Status: "queued",
		}

		if err := db.Create(&newURL).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, newURL)
	}
}
