package crawler

import (
	"net/http"
	"strings"

	"golang.org/x/net/html"
)

type CrawlResult struct {
	Title          string
	HTMLVersion    string
	InternalLinks  int
	ExternalLinks  int
	LoginFormFound bool
}

type BrokenLink struct {
	Link   string
	Status int
}

func ParseURL(rawURL string) (CrawlResult, []BrokenLink) {
	resp, err := http.Get(rawURL)
	if err != nil {
		return CrawlResult{}, nil
	}
	defer resp.Body.Close()

	z := html.NewTokenizer(resp.Body)

	var result CrawlResult
	var broken []BrokenLink

	for {
		tt := z.Next()
		if tt == html.ErrorToken {
			break
		}
		t := z.Token()

		if t.Type == html.StartTagToken || t.Type == html.SelfClosingTagToken {
			switch t.Data {
			case "title":
				z.Next()
				result.Title = z.Token().Data
			case "input":
				for _, attr := range t.Attr {
					if attr.Key == "type" && attr.Val == "password" {
						result.LoginFormFound = true
					}
				}
			case "a":
				for _, attr := range t.Attr {
					if attr.Key == "href" {
						href := attr.Val
						if strings.HasPrefix(href, "/") || strings.Contains(href, rawURL) {
							result.InternalLinks++
						} else {
							result.ExternalLinks++
						}
						status := checkLink(href)
						if status >= 400 {
							broken = append(broken, BrokenLink{Link: href, Status: status})
						}
					}
				}
			case "html":
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

func checkLink(link string) int {
	resp, err := http.Head(link)
	if err != nil {
		return 500
	}
	defer resp.Body.Close()
	return resp.StatusCode
}
