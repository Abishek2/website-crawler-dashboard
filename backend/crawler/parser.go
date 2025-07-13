package crawler

import (
	"net/http"
	"strings"

	"golang.org/x/net/html"
)

// CrawlResult holds the result of parsing and analyzing a given URL.
type CrawlResult struct {
	Title          string
	HTMLVersion    string
	InternalLinks  int
	ExternalLinks  int
	LoginFormFound bool
}

// BrokenLink represents a hyperlink that returned an HTTP error (status code >= 400).
type BrokenLink struct {
	Link   string
	Status int
}

// ParseURL takes a raw URL string, performs an HTTP GET request, and parses the HTML content.
// It returns a CrawlResult summarizing the page and a list of broken links found.
func ParseURL(rawURL string) (CrawlResult, []BrokenLink) {
	resp, err := http.Get(rawURL)
	if err != nil {
		// If the URL is unreachable or malformed, return empty result
		return CrawlResult{}, nil
	}
	defer resp.Body.Close()

	// Create a tokenizer from the HTML body to iterate through tokens
	z := html.NewTokenizer(resp.Body)

	var result CrawlResult
	var broken []BrokenLink

	for {
		tt := z.Next()
		if tt == html.ErrorToken {
			// Reached end of the document
			break
		}

		t := z.Token()

		if t.Type == html.StartTagToken || t.Type == html.SelfClosingTagToken {
			switch t.Data {
			case "title":
				// Capture the title content
				z.Next()
				result.Title = z.Token().Data

			case "input":
				// Check for password input to detect login form
				for _, attr := range t.Attr {
					if attr.Key == "type" && attr.Val == "password" {
						result.LoginFormFound = true
					}
				}

			case "a":
				// Analyze anchor tags to classify internal/external and check for broken links
				for _, attr := range t.Attr {
					if attr.Key == "href" {
						href := attr.Val

						// Determine internal vs external
						if strings.HasPrefix(href, "/") || strings.Contains(href, rawURL) {
							result.InternalLinks++
						} else {
							result.ExternalLinks++
						}

						// Check for broken links
						status := checkLink(href)
						if status >= 400 {
							broken = append(broken, BrokenLink{Link: href, Status: status})
						}
					}
				}

			case "html":
				// Basic detection for HTML5 based on <html lang="...">
				for _, attr := range t.Attr {
					if attr.Key == "lang" {
						result.HTMLVersion = "HTML5"
					}
				}
			}
		}
	}

	return result, broken
}

// checkLink performs an HTTP HEAD request to the given link to check its status.
// If it fails or is a malformed link, returns 500.
func checkLink(link string) int {
	// Skip placeholder or non-HTTP links
	if strings.HasPrefix(link, "#") || strings.HasPrefix(link, "mailto:") || link == "" {
		return 200 // Treat as non-broken for simplicity
	}

	resp, err := http.Head(link)
	if err != nil {
		return 500
	}
	defer resp.Body.Close()

	return resp.StatusCode
}
