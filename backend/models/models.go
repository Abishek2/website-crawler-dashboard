package models

import "time"

// URL represents a website that has been submitted for crawling.
// It stores both the original URL and the metadata collected from crawling.
type URL struct {
	ID             uint      `gorm:"primaryKey" json:"id"`              // Unique identifier (auto-incremented by GORM)
	URL            string    `json:"url"`                               // The original URL submitted by the user
	Title          string    `json:"title"`                             // The <title> tag extracted from the HTML
	HTMLVersion    string    `json:"html_version"`                      // Detected HTML version (e.g., HTML5)
	InternalLinks  int       `json:"internal_links"`                    // Number of internal <a> links
	ExternalLinks  int       `json:"external_links"`                    // Number of external <a> links
	BrokenLinks    int       `json:"broken_links"`                      // Count of broken (error status) links
	LoginFormFound bool      `json:"login_form_found"`                  // Whether a password input field was detected
	Status         string    `json:"status"`                            // Status of the crawl job: "queued", "running", "done", "error", etc.
	CreatedAt      time.Time `json:"created_at"`                        // Timestamp when the record was created
}

// BrokenLink stores each individual broken link (status >= 400) found during crawling.
// It's associated with a specific URL via foreign key (URLID).
type BrokenLink struct {
	ID     uint   `gorm:"primaryKey" json:"id"`   // Unique identifier
	URLID  uint   `json:"url_id"`                 // Foreign key to the URL this link belongs to
	Link   string `json:"link"`                   // The actual link URL
	Status int    `json:"status"`                 // HTTP status code (e.g., 404, 500)
}
