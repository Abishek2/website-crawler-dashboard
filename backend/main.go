package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
)

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"github.com/Abishek2/website-crawler-dashboard/backend/models"
)

func main() {
  r := gin.Default()
  dsn := "root:root@tcp(localhost:3306)/crawler?charset=utf8mb4&parseTime=True&loc=Local"
  db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

  if err != nil {
	panic("failed to connect to database")
}


  r.GET("/health", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"status": "ok"})
  })

  r.Run(":8080")

  db.AutoMigrate(&models.URL{}, &models.BrokenLink{})
}
