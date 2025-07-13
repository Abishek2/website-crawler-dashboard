package handlers

import (
	"net/http"

	"github.com/Abishek2/website-crawler-dashboard/backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// URLInput represents the payload required to queue a new URL for crawling
type URLInput struct {
	URL string `json:"url" binding:"required,url"` // Validates presence and format
}

// CreateURL handles POST /urls to create a new crawl job
func CreateURL(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input URLInput

		// Validate JSON input
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Create a new URL record with "queued" status
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

// GetAllURLs handles GET /urls to return all crawled URLs ordered by latest
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

// GetURLDetails handles GET /urls/:id to return the full crawl result + broken links
func GetURLDetails(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var url models.URL
		id := c.Param("id")

		// Look up the URL by ID
		if err := db.First(&url, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
			return
		}

		// Retrieve related broken links for this URL
		var brokenLinks []models.BrokenLink
		db.Where("url_id = ?", url.ID).Find(&brokenLinks)

		// Send complete details
		c.JSON(http.StatusOK, gin.H{
			"url":          url,
			"broken_links": brokenLinks,
		})
	}
}

// ReanalyzeURL handles POST /urls/:id/reanalyze
// This sets the URL status back to "queued" to re-trigger crawling
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

// DeleteURL handles DELETE /urls/:id
// It deletes both the URL and associated broken link records
func DeleteURL(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		// Delete broken links first (to maintain foreign key integrity)
		db.Delete(&models.BrokenLink{}, "url_id = ?", id)

		// Then delete the URL itself
		db.Delete(&models.URL{}, id)

		c.JSON(http.StatusOK, gin.H{"message": "URL deleted"})
	}
}

// CancelURL handles POST /urls/:id/cancel
// Marks a running or queued URL as cancelled
func CancelURL(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var url models.URL
		if err := db.First(&url, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
			return
		}

		// If the crawl is already finished, cancellation is not allowed
		if url.Status == "done" || url.Status == "error" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot cancel a finished crawl"})
			return
		}

		// Otherwise, mark it as cancelled
		url.Status = "cancelled"
		db.Save(&url)

		c.JSON(http.StatusOK, gin.H{"message": "Crawl cancelled"})
	}
}
