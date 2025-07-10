package crawler

import (
	"log"
	"time"

	"github.com/Abishek2/website-crawler-dashboard/backend/models"
	"gorm.io/gorm"
)

func StartWorker(db *gorm.DB) {
	go func() {
		for {
			var url models.URL
			// Get one queued URL
			if err := db.Where("status = ?", "queued").First(&url).Error; err == nil {
				log.Println("Processing:", url.URL)
				db.Model(&url).Update("status", "running")

				result, brokenLinks := ParseURL(url.URL)

				db.Model(&url).Updates(models.URL{
					Title:          result.Title,
					HTMLVersion:    result.HTMLVersion,
					InternalLinks:  result.InternalLinks,
					ExternalLinks:  result.ExternalLinks,
					BrokenLinks:    len(brokenLinks),
					LoginFormFound: result.LoginFormFound,
					Status:         "done",
				})

				for _, bl := range brokenLinks {
					db.Create(&models.BrokenLink{
						URLID:  url.ID,
						Link:   bl.Link,
						Status: bl.Status,
					})
				}
			}
			time.Sleep(3 * time.Second) // adjust polling interval as needed
		}
	}()
}
