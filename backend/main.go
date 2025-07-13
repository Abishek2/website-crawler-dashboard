package main

import (
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/Abishek2/website-crawler-dashboard/backend/crawler"
	"github.com/Abishek2/website-crawler-dashboard/backend/handlers"
	"github.com/Abishek2/website-crawler-dashboard/backend/models"
)

func main() {
	// Initialize the Gin engine
	r := gin.Default()

	// Enable CORS for frontend (e.g., React app running on port 5173)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// MySQL DSN connection string: username:password@host:port/database
	dsn := "root:root@tcp(localhost:3306)/crawler?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("❌ Failed to connect to database")
	}

	// Auto-create tables for URL and BrokenLink models if not already present
	db.AutoMigrate(&models.URL{}, &models.BrokenLink{})

	// Start background worker that continuously processes queued URLs
	crawler.StartWorker(db)

	// Simple health check route
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// API Routes for URL management
	r.POST("/urls", handlers.CreateURL(db))           // Add new URL for crawling
	r.GET("/urls", handlers.GetAllURLs(db))           // Get all URLs
	r.GET("/urls/:id", handlers.GetURLDetails(db))    // Get detail view for a URL
	r.POST("/urls/:id/reanalyze", handlers.ReanalyzeURL(db)) // Requeue for re-crawling
	r.DELETE("/urls/:id", handlers.DeleteURL(db))     // Delete a URL and its broken links
	r.POST("/urls/:id/cancel", handlers.CancelURL(db))// Cancel an ongoing/queued crawl

	// Start server on localhost:8080
	r.Run(":8080")
}
