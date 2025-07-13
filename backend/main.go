package main


import (
  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
  "net/http"
  "gorm.io/driver/mysql"
  "gorm.io/gorm"
  "github.com/Abishek2/website-crawler-dashboard/backend/models"
  "github.com/Abishek2/website-crawler-dashboard/backend/handlers"
  "github.com/Abishek2/website-crawler-dashboard/backend/crawler"
  "time"
)


func main() {
  r := gin.Default()
  r.Use(cors.New(cors.Config{
  AllowOrigins:     []string{"http://localhost:5173"}, 
  AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
  AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
  ExposeHeaders:    []string{"Content-Length"},
  AllowCredentials: true,
  MaxAge: 12 * time.Hour,
}))
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
r.GET("/urls", handlers.GetAllURLs(db))
r.GET("/urls/:id", handlers.GetURLDetails(db))
r.POST("/urls/:id/reanalyze", handlers.ReanalyzeURL(db))
r.DELETE("/urls/:id", handlers.DeleteURL(db))
r.POST("/urls/:id/cancel", handlers.CancelURL(db))

r.Run(":8080")  
}
