export interface Details {
  overview: string[]
}

export interface PortfolioEntry {
  id: string
  type: 'Project' | 'Experience'
  title: string
  company?: string
  period?: string
  tags: string[]
  shortDescription: string
  image: string | null
  accent: string
  details: Details
  links: Record<string, string>
}

export interface SkillGroup {
  category: string
  skills: string[]
}

export interface LeadershipItem {
  title: string
  organization: string
  period: string
  description: string
  category: 'Award' | 'Leadership'
  accent: string
}

export interface About {
  name: string
  role: string
  location: string
  intro: string
  education: string
  graduation: string
  gpa: string
  links: Record<string, string>
  contact: string
}
