package models

// SkillCategory モデル
type SkillCategory struct {
	ID          uint    `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Skills      []Skill `json:"skills" gorm:"foreignKey:CategoryID"`
}

// Skill モデル
type Skill struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Proficiency int    `json:"proficiency"` // ← 習熟度 (0〜100)
	CategoryID  uint   `json:"category_id"`
}
