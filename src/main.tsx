import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownRight, ArrowUpRight, ExternalLink, Mail, Menu, X } from 'lucide-react'
import { PortfolioRepository } from './data/PortfolioRepository'
import type { LeadershipItem, PortfolioEntry } from './types'
import './styles.css'

const repository = new PortfolioRepository()

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return <section className="section" id={id}><div className="section-heading"><h2>{title}</h2></div>{children}</section>
}

function TagList({ tags }: { tags: string[] }) {
  return <div className="tags">{tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
}

function SocialIcon({ platform }: { platform: 'github' | 'linkedin' | 'youtube' }) {
  if (platform === 'github') return <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.76.5 12.25c0 5.2 3.44 9.61 8.21 11.16.6.11.82-.27.82-.58v-2.05c-3.34.74-4.04-1.64-4.04-1.64-.55-1.42-1.34-1.8-1.34-1.8-1.09-.76.08-.75.08-.75 1.2.09 1.83 1.25 1.83 1.25 1.07 1.88 2.8 1.34 3.48 1.02.11-.79.42-1.34.76-1.65-2.67-.31-5.47-1.37-5.47-5.79 0-1.28.45-2.33 1.18-3.15-.12-.3-.51-1.58.11-3.12 0 0 .96-.31 3.16 1.21a10.68 10.68 0 0 1 5.76 0c2.2-1.52 3.16-1.21 3.16-1.21.62 1.54.23 2.82.11 3.12.73.82 1.18 1.87 1.18 3.15 0 4.43-2.81 5.47-5.49 5.78.43.38.81 1.12.81 2.26v3.37c0 .31.22.7.83.58a11.75 11.75 0 0 0 8.19-11.16C23.5 5.76 18.35.5 12 .5Z" /></svg>
  if (platform === 'linkedin') return <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.16 3.5a2.08 2.08 0 1 0 0 4.16 2.08 2.08 0 0 0 0-4.16ZM3.38 9.25h3.56V20.5H3.38V9.25Zm5.8 0h3.41v1.54h.05c.47-.89 1.63-1.83 3.35-1.83 3.58 0 4.24 2.36 4.24 5.43v6.11h-3.55v-5.42c0-1.29-.03-2.95-1.8-2.95-1.8 0-2.08 1.41-2.08 2.86v5.51H9.18V9.25Z" /></svg>
  return <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m10 9 5 3-5 3V9Z" /></svg>
}

function EntryImage({ entry, location }: { entry: PortfolioEntry; location: 'card' | 'detail' }) {
  if (!entry.image) return null
  return <img className={`entry-image ${location}-image`} src={entry.image} alt={`${entry.title} project`} />
}

function FittingTitle({ title, level }: { title: string; level: 'card' | 'detail' }) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    const element = titleRef.current
    if (!element) return

    const fitTitle = () => {
      element.style.fontSize = ''
      const availableWidth = element.clientWidth
      if (availableWidth <= 0 || element.scrollWidth <= availableWidth) return
      const currentSize = Number.parseFloat(getComputedStyle(element).fontSize)
      element.style.fontSize = `${Math.max(12, currentSize * availableWidth / element.scrollWidth)}px`
    }

    const frame = requestAnimationFrame(fitTitle)
    const observer = new ResizeObserver(fitTitle)
    observer.observe(element)
    if (element.parentElement) observer.observe(element.parentElement)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [title])

  return level === 'card'
    ? <h3 ref={titleRef} className="fitting-title">{title}</h3>
    : <h1 ref={titleRef} className="fitting-title">{title}</h1>
}

function EntryCard({ entry, onOpen }: { entry: PortfolioEntry; onOpen: (id: string) => void }) {
  return <article className={`entry-card ${entry.accent} ${entry.type.toLowerCase()}`} onClick={() => onOpen(entry.id)} tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && onOpen(entry.id)}>
    <EntryImage entry={entry} location="card" /><div className="card-top"><span className="card-type">{entry.type}</span>{entry.period && <span className="card-period">{entry.period}</span>}</div>
    <div><FittingTitle title={entry.title} level="card" />{entry.company && <p className="company">{entry.company}</p>}</div>
    <p className="card-description">{entry.shortDescription}</p>
    <TagList tags={entry.tags} />
    <button className="card-arrow" aria-label={`View ${entry.title}`}><ArrowUpRight size={20} /></button>
  </article>
}

function LeadershipTab({ item }: { item: LeadershipItem }) {
  return <article className={`leadership-item ${item.accent}`}><div className="leadership-meta"><span>{item.category}</span><span>{item.period}</span></div><h3>{item.title}</h3><p className="company">{item.organization}</p><p>{item.description}</p></article>
}

function Navigation({ onHome, isHomePage }: { onHome: () => void; isHomePage: boolean }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <header className="site-header"><a className="brand" href="#top" onClick={() => { onHome(); close() }}>{repository.about.name}</a>{isHomePage && <><button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav className={open ? 'nav-open' : ''}><a href="#about" onClick={close}>About Me</a><a href="#experience" onClick={close}>Experiences</a><a href="#projects" onClick={close}>Projects</a><a href="#awards" onClick={close}>Awards &amp; Leadership</a><a href="#skills" onClick={close}>Skills</a><a className="nav-contact" href="#contact" onClick={close}>Contact &amp; Media</a></nav></>}</header>
}

function HomePage({ onOpen }: { onOpen: (id: string) => void }) {
  const { about, experiences, projects, skillGroups } = repository
  return <>
    <main id="top">
          <section className="hero"><div className="hero-copy"><h1>{about.name}</h1><p className="hero-role">{about.role}</p></div><div className="hero-aside"><div className="portrait-frame"><div className="portrait-shape"><img className="portrait-photo" src="/images/pfp.jpg" alt={`${about.name} profile`} /></div><span className="portrait-caption">CS / systems / curiosity</span></div><p className="scroll-note">Scroll to explore</p></div></section>
      <Section title="About Me" id="about"><div className="about-grid"><div className="about-statement"><p>{about.intro}</p></div><div className="about-details"><div className="education-section"><strong>Education</strong><span>{about.education}</span><span>{about.graduation}</span><br /><span>{about.gpa}</span></div><div className="about-links-section"><strong>Contact &amp; Media</strong><div className="about-links"><a href={`mailto:${about.contact}`}><Mail size={15} /> {about.contact}</a><a href={about.links.github} target="_blank" rel="noreferrer"><SocialIcon platform="github" /> GitHub</a><a href={about.links.linkedin} target="_blank" rel="noreferrer"><SocialIcon platform="linkedin" /> LinkedIn</a><a href={about.links.youtube} target="_blank" rel="noreferrer"><SocialIcon platform="youtube" /> YouTube</a></div></div></div></div></Section>
      <Section title="Experiences" id="experience"><div className="entry-grid">{experiences.map((entry) => <EntryCard entry={entry} onOpen={onOpen} key={entry.id} />)}</div></Section>
      <Section title="Projects" id="projects"><div className="entry-grid">{projects.map((entry) => <EntryCard entry={entry} onOpen={onOpen} key={entry.id} />)}</div></Section>
      <Section title="Awards & Leadership" id="awards"><div className="leadership-tab"><div className="leadership-grid">{repository.leadership.map((item) => <LeadershipTab item={item} key={`${item.title}-${item.period}`} />)}</div></div></Section>
      <Section title="Skills" id="skills"><div className="skills-layout"><div className="skill-groups">{skillGroups.map((group) => <div className="skill-group" key={group.category}><h3>{group.category}</h3><TagList tags={group.skills} /></div>)}</div></div></Section>
    </main>
    <footer id="contact"><div><h2>Contact &amp; Media</h2></div><div className="footer-links"><a href={`mailto:${about.contact}`}><Mail size={17} /> {about.contact}</a><a href={about.links.github} target="_blank" rel="noreferrer"><SocialIcon platform="github" /> GitHub</a><a href={about.links.linkedin} target="_blank" rel="noreferrer"><SocialIcon platform="linkedin" /> LinkedIn</a><a href={about.links.youtube} target="_blank" rel="noreferrer"><SocialIcon platform="youtube" /> YouTube</a></div></footer>
  </>
}

function DetailPage({ entry }: { entry: PortfolioEntry }) {
  return <main className="detail-page"><div className={`detail-hero ${entry.type.toLowerCase()}`}><span className="card-type">{entry.type}{entry.period && ` / ${entry.period}`}</span><FittingTitle title={entry.title} level="detail" />{entry.company && <p>{entry.company}</p>}<TagList tags={entry.tags} /><EntryImage entry={entry} location="detail" /></div><div className="detail-content"><div className="detail-overview"><span className="eyebrow">Links</span>{Object.keys(entry.links).length > 0 ? <div className="detail-links">{Object.entries(entry.links).map(([label, url]) => <a className="text-link" href={url} key={label} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={16} /></a>)}</div> : <p>No links available.</p>}</div><div className="detail-sections"><div className="detail-block"><h2>Overview</h2><ul>{entry.details.overview.map((item) => <li key={item}>{item}</li>)}</ul></div></div></div></main>
}

function App() {
  const getSelectedId = () => window.location.hash.startsWith('#entry/') ? window.location.hash.replace('#entry/', '') : null
  const [selectedId, setSelectedId] = useState<string | null>(getSelectedId)
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    const handleHashChange = () => setSelectedId(getSelectedId())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [selectedId])
  const openEntry = (id: string) => { window.history.pushState(null, '', `#entry/${id}`); setSelectedId(id); window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) }
  const goHome = () => { window.history.pushState(null, '', window.location.pathname + window.location.search); setSelectedId(null); window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) }
  const selected = selectedId ? repository.findEntry(selectedId) : undefined
  return <><Navigation onHome={goHome} isHomePage={!selected} />{selected ? <DetailPage entry={selected} /> : <HomePage onOpen={openEntry} />}</>
}

export default App

createRoot(document.getElementById('root')!).render(<App />)
