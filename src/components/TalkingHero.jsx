import React from 'react'
import { motion } from 'framer-motion'
import { FaPlay } from 'react-icons/fa'
import { FiArrowDown } from 'react-icons/fi'
import { person, story } from '../data'
import ParticlePortrait from './ParticlePortrait'
import { scrollTo } from './Navbar'

// The portrait assembles from dots, then resolves into the illustration.
// Hovering it drops back into the dot field you can push around.
export default function TalkingHero({ profile, onStory }) {
  return (
    <section id="home" className="th">
      <div className="th-grid" aria-hidden="true" />
      <div className="th-ghost" aria-hidden="true">PR</div>
      <div className="th-left">
        <motion.p className="th-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <span className="p-mark">P</span> Now streaming · {person.location}
        </motion.p>
        <h1 className="th-title">
          <motion.span initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>Puneeth</motion.span>
          <motion.span className="outline" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}>Reddy</motion.span>
        </h1>
        <motion.p className="th-role" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          {person.role} · {person.focus}. {profile.tagline}
        </motion.p>
        <motion.div className="th-actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <button className="btn btn-play" onClick={() => onStory(0)}><FaPlay /> Watch my story</button>
          <button className="btn btn-ghost" onClick={() => scrollTo('projects')}>See my work <FiArrowDown /></button>
        </motion.div>
      </div>

      <div className="th-portrait" data-cursor="Play" onClick={() => onStory(0)}>
        <div className="th-halo" />
        <ParticlePortrait src={person.heroCutout} />
        <img className="th-illus" src={person.heroCutout} alt="Illustration of Puneeth Reddy" />
        <span className="th-hint">Hover me</span>
      </div>

      <motion.div className="th-stories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
        <div className="th-stories-label">
          <b>My story</b>
          <span>{story.length} episodes · 30 sec</span>
        </div>
        <div className="th-stories-row">
          {story.map((s, n) => (
            <button key={s.image} className="th-story" onClick={() => onStory(n)} aria-label={`Watch ${s.ep}: ${s.title}`}>
              <span className="ring"><img src={s.image} alt="" style={{ objectPosition: s.pos }} /></span>
              <span className="lbl">{s.title}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
