package models

type Work struct {
	ID          uint        `json:"id"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	Category    string      `json:"category"`
	Year        int         `json:"year"`
	Images      []WorkImage `json:"images"`
}

type WorkImage struct {
	ID          uint   `json:"id"`
	URL         string `json:"url"`
	Description string `json:"description"`
	WorkID      uint   `json:"work_id"`
}
