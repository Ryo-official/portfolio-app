export interface Skill {
  name: string;
  icon: string;
  proficiency: number;
}

export interface SkillData {
  [category: string]: Skill[];
}
