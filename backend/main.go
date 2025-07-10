package main


import (
  "github.com/gin-gonic/gin"
  "net/http"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"github.com/Abishek2/website-crawler-dashboard/backend/models"
	"github.com/Abishek2/website-crawler-dashboard/backend/handlers"
  "github.com/Abishek2/website-crawler-dashboard/backend/crawler"
)

func main() {
  r := gin.Default()
  dsn := "root:root@tcp(localhost:3306)/crawler?charset=utf8mb4&parseTime=True&loc=Local"
  db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

  if err != nil {
	panic("failed to connect to database")
}

db.AutoMigrate(&models.URL{}, &models.BrokenLink{})
crawler.StartWorker(db)

  r.GET("/health", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"status": "ok"})
  })

  r.POST("/urls", handlers.CreateURL(db))

  r.Run(":8080")

  
}
