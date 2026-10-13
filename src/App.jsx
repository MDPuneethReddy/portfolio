import React, { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { profiles, person } from './data'
import Intro from './components/Intro'
import ProfileGate from './components/ProfileGate'
import Navbar from './components/Navbar'
import TalkingHero from './components/TalkingHero'
import Marquee from './components/Marquee'
import About from './components/About'
import SideScroll from './components/SideScroll'
import PeriodicTable from './components/PeriodicTable'
import ProjectList from './components/ProjectList'
import DetailModal from './components/DetailModal'
import StoryMode from './components/StoryMode'
import Buddy from './components/Buddy'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
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

const asDetail = {
  experience: (x) => ({ id: x.id, kind: 'S E R I E S', title: x.company, subtitle: x.title, date: x.date, description: x.summary, tags: x.tags, points: x.points, art: x.art, genre: 'Engineering' }),
  project: (x) => ({ id: x.id, kind: 'F I L M', title: x.title, description: x.description, tags: x.tech, art: x.art, genre: x.genre, link: x.link, linkLabel: x.linkLabel || 'View on GitHub' }),
}

const STACK = ['React', 'Node.js', 'Python', 'FastAPI', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Docker', 'RabbitMQ', 'Redis', 'AWS', 'Next.js']

export default function App() {
  const stored = readStoredProfile()
  const [stage, setStage] = useState(stored ? 'browse' : 'intro')
  const [profile, setProfile] = useState(stored || profiles[0])
  const [detail, setDetail] = useState(null)
  const [storyAt, setStoryAt] = useState(null)
  const playing = storyAt !== null
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  // Smooth scrolling (skipped for reduced motion).
  useEffect(() => {
    if (stage !== 'browse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    window.__lenis = lenis
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [stage])

  useEffect(() => {
    const l = window.__lenis
    if (!l) return
    detail || playing ? l.stop() : l.start()
  }, [detail, playing])

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
  const closeStory = useCallback(() => setStoryAt(null), [])

  return (
    <>
      <PosterDefs />
      <AnimatePresence mode="wait">
        {stage === 'intro' && <Intro key="intro" onDone={finishIntro} />}
        {stage === 'profiles' && <ProfileGate key="gate" onPick={pick} />}
      </AnimatePresence>

      {stage === 'browse' && (
        <div className="site" key={profile.id}>
          <motion.div className="scroll-progress" style={{ scaleX: progress }} />
          <Navbar profile={profile} onSwitch={switchProfile} />
          <main>
            <TalkingHero profile={profile} onStory={setStoryAt} />
            <Marquee items={STACK} />
            <About />
            <SideScroll onOpen={open('experience')} />
            <PeriodicTable />
            <ProjectList onOpen={open('project')} />
            <Contact />
          </main>
          <Footer />
          <Buddy profile={profile} />
          <Cursor />
        </div>
      )}

      <AnimatePresence>
        {detail && <DetailModal key="detail" item={detail} onClose={closeDetail} />}
        {playing && <StoryMode key="story" profile={profile} start={storyAt} onClose={closeStory} />}
      </AnimatePresence>
      <span hidden>{person.name}</span>
    </>
  )
}
