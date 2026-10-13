import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { person } from '../data'

// A tiny walking version of me that introduces the site and reacts to
// whichever section you're looking at.

const sectionLines = {
  about: ['That ID card is real. Well, the info is. Give it a swing!', 'Flip it over for the fine print.'],
  experience: ['These are my seasons. Novartis and FSU were binge-worthy. 🍿', 'Click a card to see every episode of that job.'],
  projects: ['Hover a title for a preview, click for the full episode!', 'Everything here is real, shipped code. Go peek on GitHub.'],
  skills: ['My toolkit. Yes, I genuinely enjoy RabbitMQ.', 'Full stack means full stack — UI to infra.'],
  education: ['Two degrees, zero regrets. Mostly.', 'Florida State and VIT shaped how I build.'],
  certifications: ['Certified — and certifiably curious.'],
  contact: ["Don't leave on a cliffhanger — say hi! 👋", 'I reply faster than a Netflix autoplay countdown.'],
}

function useTyped(text) {
  const [out, setOut] = useState('')
  useEffect(() => {
    setOut('')
    let i = 0
    const id = setInterval(() => {
      i++
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 24)
    return () => clearInterval(id)
  }, [text])
  return out
}

export default function Buddy({ profile }) {
  const [arrived, setArrived] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [line, setLine] = useState('')
  const [bubble, setBubble] = useState(false)
  const [waving, setWaving] = useState(false)
  const section = useRef('home')
  const idx = useRef(0)
  const typed = useTyped(line)

  const say = (text) => {
    setLine(text)
    setBubble(true)
    setWaving(true)
    setTimeout(() => setWaving(false), 1600)
  }

  // Wait until the hero (which already introduces me) is scrolled away,
  // then walk in and say hi.
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const check = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        setEntered(true)
        window.removeEventListener('scroll', check)
      }
    }
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])
  useEffect(() => {
    if (!entered) return
    const a = setTimeout(() => setArrived(true), 2200)
    const b = setTimeout(() => say(`Hey, mini me here 👋 ${profile.greeting}`), 2400)
    return () => [a, b].forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered, profile.id])

  // React to sections as they scroll into view.
  useEffect(() => {
    const els = Object.keys(sectionLines).map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && section.current !== e.target.id && window.scrollY > window.innerHeight * 0.6) {
            section.current = e.target.id
            idx.current = 0
            say(sectionLines[e.target.id][0])
          }
        })
      },
      { threshold: 0.45 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Auto-hide the bubble after a while.
  useEffect(() => {
    if (!bubble) return
    const t = setTimeout(() => setBubble(false), 7000 + line.length * 30)
    return () => clearTimeout(t)
  }, [bubble, line])

  const poke = () => {
    if (hidden) return setHidden(false)
    const lines = sectionLines[section.current] || ['Psst — the contact form is at the bottom. Just saying.', 'Try switching profiles from the top-right avatar!']
    idx.current = (idx.current + 1) % lines.length
    say(lines[idx.current])
  }

  if (!entered) return null
  return (
    <div className={'buddy' + (hidden ? ' tucked' : '')}>
      <AnimatePresence>
        {bubble && !hidden && arrived && (
          <motion.div
            className="buddy-bubble"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
          >
            {typed}
            <span className="caret" />
            <button className="buddy-close" onClick={() => setHidden(true)} aria-label="Hide buddy">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ x: 260 }} animate={{ x: 0 }} transition={{ duration: 2.2, ease: 'linear', delay: 0.1 }}>
      <button
        className={'buddy-body' + (arrived ? '' : ' walking') + (waving ? ' waving' : '')}
        onClick={poke}
        aria-label="Talk to mini Puneeth"
        title="Click me!"
      >
        <div className="buddy-head">
          <img src={person.photo} alt="" />
        </div>
        <svg viewBox="0 0 80 96" className="buddy-svg" aria-hidden="true">
          {/* legs */}
          <g className="leg leg-l">
            <rect x="27" y="52" width="11" height="34" rx="5" fill="#26324a" />
            <rect x="23" y="82" width="17" height="8" rx="4" fill="#f4f4f4" />
          </g>
          <g className="leg leg-r">
            <rect x="42" y="52" width="11" height="34" rx="5" fill="#2c3a55" />
            <rect x="40" y="82" width="17" height="8" rx="4" fill="#f4f4f4" />
          </g>
          {/* arms */}
          <g className="arm arm-l">
            <rect x="9" y="12" width="10" height="32" rx="5" fill="#9a6a4b" />
            <rect x="8" y="10" width="12" height="13" rx="5" fill="#141c33" />
          </g>
          <g className="arm arm-r">
            <rect x="61" y="12" width="10" height="32" rx="5" fill="#9a6a4b" />
            <rect x="60" y="10" width="12" height="13" rx="5" fill="#141c33" />
          </g>
          {/* torso — navy tee */}
          <path d="M18 10 Q40 2 62 10 L60 58 Q40 62 20 58 Z" fill="#18213d" />
          <path d="M33 6 Q40 12 47 6" fill="none" stroke="#0e1428" strokeWidth="3" />
          {/* little red P on the tee */}
          <text x="40" y="38" textAnchor="middle" fontFamily="Bebas Neue, Impact, sans-serif" fontSize="16" fill="#E50914">P</text>
        </svg>
        <div className="buddy-shadow" />
      </button>
      </motion.div>
    </div>
  )
}
