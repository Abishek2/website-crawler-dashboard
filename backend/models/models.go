package models

import "time"

type URL struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	URL            string    `json:"url"`
	Title          string    `json:"title"`
	HTMLVersion    string    `json:"html_version"`
	InternalLinks  int       `json:"internal_links"`
	ExternalLinks  int       `json:"external_links"`
	BrokenLinks    int       `json:"broken_links"`
	LoginFormFound bool      `json:"login_form_found"`
	Status         string    `json:"status"` // queued, running, done, error
	CreatedAt      time.Time `json:"created_at"`
}

type BrokenLink struct {
	ID      uint   `gorm:"primaryKey" json:"id"`
	URLID   uint   `json:"url_id"`
	Link    string `json:"link"`
	Status  int    `json:"status"`
}
