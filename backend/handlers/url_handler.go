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

// GetAllURLs returns a list of crawled URLs
func GetAllURLs(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var urls []models.URL
		if err := db.Order("created_at desc").Find(&urls).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not retrieve URLs"})
			return
		}
		c.JSON(http.StatusOK, urls)
	}
}

// GetURLDetails returns detail of a single URL with broken links
func GetURLDetails(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var url models.URL
		id := c.Param("id")

		if err := db.First(&url, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
			return
		}

		var brokenLinks []models.BrokenLink
		db.Where("url_id = ?", url.ID).Find(&brokenLinks)

		c.JSON(http.StatusOK, gin.H{
			"url":          url,
			"broken_links": brokenLinks,
		})
	}
}

func ReanalyzeURL(db *gorm.DB) gin.HandlerFunc {
  return func(c *gin.Context) {
    id := c.Param("id")

    var url models.URL
    if err := db.First(&url, id).Error; err != nil {
      c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
      return
    }

    url.Status = "queued"
    db.Save(&url)

    c.JSON(http.StatusOK, gin.H{"message": "URL requeued for analysis"})
  }
}

func DeleteURL(db *gorm.DB) gin.HandlerFunc {
  return func(c *gin.Context) {
    id := c.Param("id")

    db.Delete(&models.BrokenLink{}, "url_id = ?", id)
    db.Delete(&models.URL{}, id)

    c.JSON(http.StatusOK, gin.H{"message": "URL deleted"})
  }
}

func CancelURL(db *gorm.DB) gin.HandlerFunc {
  return func(c *gin.Context) {
    id := c.Param("id")

    var url models.URL
    if err := db.First(&url, id).Error; err != nil {
      c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
      return
    }

    if url.Status == "done" || url.Status == "error" {
      c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot cancel a finished crawl"})
      return
    }

    url.Status = "cancelled"
    db.Save(&url)

    c.JSON(http.StatusOK, gin.H{"message": "Crawl cancelled"})
  }
}

