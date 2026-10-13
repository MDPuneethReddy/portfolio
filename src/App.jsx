import React, { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { profiles, experiences, projects, skills, education, certifications, person } from './data'
import Intro from './components/Intro'
import ProfileGate from './components/ProfileGate'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Row from './components/Row'
import { ExperienceCard, ProjectCard, SimpleCard, SkillCard } from './components/Cards'
import DetailModal from './components/DetailModal'
import Trailer from './components/Trailer'
import Buddy from './components/Buddy'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { PosterDefs } from './components/PosterArt'

const STORE_KEY = 'pr-profile'

function readStoredProfile() {
  try {
    const id = sessionStorage.getItem(STORE_KEY)
    return profiles.find((p) => p.id === id) || null
  } catch {
    return null
  }
}

// Normalize any content item into what the detail modal renders.
const asDetail = {
  experience: (x) => ({ id: x.id, kind: 'S E R I E S', title: x.company, subtitle: x.title, date: x.date, description: x.summary, tags: x.tags, points: x.points, art: x.art, genre: 'Engineering, Career' }),
  project: (x) => ({ id: x.id, kind: 'F I L M', title: x.title, description: x.description, tags: x.tech, art: x.art, genre: x.genre, link: x.link, linkLabel: x.linkLabel || 'View on GitHub' }),
  education: (x) => ({ id: x.id, kind: 'D O C U M E N T A R Y', title: x.school, subtitle: x.title, date: x.date, description: x.detail, art: x.art, genre: 'Education' }),
  certification: (x) => ({ id: x.id, kind: 'S P E C I A L', title: x.title, subtitle: x.issuer, description: `Verified credential issued by ${x.issuer}.`, art: x.art, link: x.link, linkLabel: 'Verify', genre: 'Certification' }),
}

export default function App() {
  const stored = readStoredProfile()
  const [stage, setStage] = useState(stored ? 'browse' : 'intro')
  const [profile, setProfile] = useState(stored || profiles[0])
  const [detail, setDetail] = useState(null)
  const [playing, setPlaying] = useState(false)

  const finishIntro = useCallback(() => setStage((s) => (s === 'intro' ? 'profiles' : s)), [])

  const pick = (p) => {
    try {
      sessionStorage.setItem(STORE_KEY, p.id)
    } catch {
      /* private mode */
    }
    setProfile(p)
    setStage('browse')
    window.scrollTo(0, 0)
  }

  const switchProfile = (p) => {
    if (p) return pick(p)
    try {
      sessionStorage.removeItem(STORE_KEY)
    } catch {
      /* ignore */
    }
    setStage('profiles')
  }

  const open = (kind) => (x) => setDetail(asDetail[kind](x))
  const closeDetail = useCallback(() => setDetail(null), [])
  const closeTrailer = useCallback(() => setPlaying(false), [])

  const topProjects = projects.slice(0, 10)

  const rows = {
    experience: (
      <Row key="experience" id="experience" title={`Continue Watching for ${profile.label}`} subtitle="Experience — every role, season by season">
        {experiences.map((x) => <ExperienceCard key={x.id} item={x} onOpen={open('experience')} />)}
      </Row>
    ),
    projects: (
      <Row key="projects" id="projects" title="Top 10 Projects in Your Country Today" variant="row-top10">
        {topProjects.map((x, i) => <ProjectCard key={x.id} item={x} rank={i + 1} onOpen={open('project')} />)}
      </Row>
    ),
    skills: (
      <Row key="skills" id="skills" title="Trending Now: My Tech Stack" variant="row-skills">
        {skills.map((s, i) => <SkillCard key={s.name} skill={s} i={i} />)}
      </Row>
    ),
    education: (
      <Row key="education" id="education" title="Award-Winning Documentaries: Education">
        {education.map((x) => <SimpleCard key={x.id} item={x} title={x.school} kicker={x.title} onOpen={open('education')} />)}
      </Row>
    ),
    certifications: (
      <Row key="certifications" id="certifications" title="Critically Acclaimed: Certifications">
        {certifications.map((x) => <SimpleCard key={x.id} item={x} title={x.title} kicker={x.issuer} onOpen={open('certification')} />)}
      </Row>
    ),
  }

  return (
    <>
      <PosterDefs />
      <AnimatePresence mode="wait">
        {stage === 'intro' && <Intro key="intro" onDone={finishIntro} />}
        {stage === 'profiles' && <ProfileGate key="gate" onPick={pick} />}
      </AnimatePresence>

      {stage === 'browse' && (
        <div className="browse" key={profile.id}>
          <Navbar profile={profile} onSwitch={switchProfile} />
          <Hero
            profile={profile}
            onPlay={() => setPlaying(true)}
            onInfo={() =>
              setDetail({
                id: 'about',
                kind: 'S E R I E S',
                title: person.name,
                subtitle: person.role,
                date: `${person.yearsExperience} years`,
                description:
                  'A results-driven software engineer with a strong full-stack background — designing and deploying scalable systems, optimizing performance, and collaborating across teams. Previously at Novartis; currently building at Florida State University. Holds an M.S. in Computer Science (FSU) and an integrated M.Tech in Software Engineering (VIT).',
                tags: ['React', 'Node.js', 'Python', 'FastAPI', 'GraphQL', 'Docker', 'RabbitMQ'],
                genre: 'Full Stack, Cloud, Data',
                art: { palette: ['#2a0306', '#E50914'], motif: 'rings' },
                link: person.resume,
                linkLabel: 'Resume',
              })
            }
          />
          <main className="rows">{profile.rows.map((r) => rows[r])}</main>
          <Contact />
          <Footer />
          <Buddy profile={profile} />
        </div>
      )}

      <AnimatePresence>
        {detail && <DetailModal key="detail" item={detail} onClose={closeDetail} />}
        {playing && <Trailer key="trailer" onClose={closeTrailer} />}
      </AnimatePresence>
    </>
  )
}
