import about from './about.json'
import experiences from './experiences.json'
import projects from './projects.json'
import skills from './skills.json'
import type { About, LeadershipItem, PortfolioEntry, SkillGroup } from '../types'
import leadership from './leadership.json'

const latestYear = (value: string): number => Math.max(...(value.match(/\d{4}/g) ?? ['0']).map(Number))
const periodStart = (value: string): number => {
  const year = Number(value.match(/\d{4}/)?.[0] ?? 0)
  const month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].findIndex((name) => value.toLowerCase().includes(name))
  return year * 12 + month
}

export class PortfolioRepository {
  readonly about: About = about
  readonly experiences: PortfolioEntry[] = [...experiences as PortfolioEntry[]].sort((first, second) => latestYear(second.period ?? '') - latestYear(first.period ?? ''))
  readonly projects: PortfolioEntry[] = [...projects as PortfolioEntry[]].sort((first, second) => first.title.localeCompare(second.title))
  readonly skillGroups: SkillGroup[] = [...skills].sort((first, second) => first.category.localeCompare(second.category)).map((group) => ({ ...group, skills: [...group.skills].sort((first, second) => first.localeCompare(second)) }))
  readonly leadership: LeadershipItem[] = [...leadership as LeadershipItem[]].sort((first, second) => periodStart(second.period) - periodStart(first.period))

  get allEntries(): PortfolioEntry[] {
    return [...this.experiences, ...this.projects]
  }

  findEntry(id: string): PortfolioEntry | undefined {
    return this.allEntries.find((entry) => entry.id === id)
  }
}
