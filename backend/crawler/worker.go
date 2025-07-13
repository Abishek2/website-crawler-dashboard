package crawler

import (
	"log"
	"time"

	"github.com/Abishek2/website-crawler-dashboard/backend/models"
	"gorm.io/gorm"
)

// StartWorker launches a background goroutine that continuously checks for
// queued URLs in the database and processes them.
func StartWorker(db *gorm.DB) {
	go func() {
		for {
			var url models.URL

			// Attempt to fetch the first URL that is marked as "queued"
			if err := db.Where("status = ?", "queued").First(&url).Error; err == nil {

				log.Println("Processing:", url.URL)

				// Update the status to "running" to avoid duplicate processing
				db.Model(&url).Update("status", "running")

				// Crawl and parse the given URL
				result, brokenLinks := ParseURL(url.URL)

				// Update the URL record with the analysis results
				db.Model(&url).Updates(models.URL{
					Title:          result.Title,
					HTMLVersion:    result.HTMLVersion,
					InternalLinks:  result.InternalLinks,
					ExternalLinks:  result.ExternalLinks,
					BrokenLinks:    len(brokenLinks),
					LoginFormFound: result.LoginFormFound,
					Status:         "done",
				})

				// Store each broken link found during the crawl
				for _, bl := range brokenLinks {
					db.Create(&models.BrokenLink{
						URLID:  url.ID,
						Link:   bl.Link,
						Status: bl.Status,
					})
				}
			}

			// Wait before checking for the next queued URL
			time.Sleep(3 * time.Second) // You can tweak this interval as needed
		}
	}()
}
