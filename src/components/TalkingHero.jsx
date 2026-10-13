import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaPlay } from 'react-icons/fa'
import { FiVolume2, FiSquare, FiFilm } from 'react-icons/fi'
import { person } from '../data'

// The hero introduces me before you scroll: captions play word by word, and
// "Hear me say hi" reads them aloud with the browser's voice. If an intro
// video is configured in data.js it takes the portrait's place.

const WORD_MS = 300

export default function TalkingHero({ profile, onTrailer }) {
  const words = profile.intro.split(' ')
  const [shown, setShown] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const timer = useRef(null)
  const videoRef = useRef(null)
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

  const runCaptions = (from = 0, ms = WORD_MS) => {
    clearInterval(timer.current)
    let i = from
    setShown(i)
    timer.current = setInterval(() => {
      i++
      setShown(i)
      if (i >= words.length) clearInterval(timer.current)
    }, ms)
  }

  // Silent caption run on load.
  useEffect(() => {
    const t = setTimeout(() => runCaptions(0), 900)
    return () => {
      clearTimeout(t)
      clearInterval(timer.current)
      if (canSpeak) window.speechSynthesis.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id])

  const speak = () => {
    if (person.introVideo && videoRef.current) {
      const v = videoRef.current
      v.muted = false
      v.currentTime = 0
      v.play()
      return
    }
    if (!canSpeak) return runCaptions(0)
    const synth = window.speechSynthesis
    if (speaking) {
      synth.cancel()
      setSpeaking(false)
      return
    }
    synth.cancel()
    const u = new SpeechSynthesisUtterance(profile.intro)
    const voices = synth.getVoices()
    const pick = voices.find((v) => /en-(US|GB|IN)/.test(v.lang) && /male|daniel|alex|rishi|google uk english male/i.test(v.name)) || voices.find((v) => v.lang?.startsWith('en'))
    if (pick) u.voice = pick
    u.rate = 1.02
    u.pitch = 0.95
    let gotBoundary = false
    u.onboundary = (e) => {
      if (e.name && e.name !== 'word') return
      gotBoundary = true
      clearInterval(timer.current)
      const upto = profile.intro.slice(0, e.charIndex).split(' ').length
      setShown(upto)
    }
    u.onstart = () => {
      setSpeaking(true)
      runCaptions(0, 360)
      setTimeout(() => gotBoundary && clearInterval(timer.current), 400)
    }
    u.onend = () => {
      setSpeaking(false)
      setShown(words.length)
    }
    u.onerror = () => setSpeaking(false)
    synth.speak(u)
  }

  return (
    <section id="home" className="th">
      <div className="th-grid" aria-hidden="true" />
      <div className="th-left">
        <motion.p className="th-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <span className="p-mark">P</span> Now streaming · {person.location}
        </motion.p>
        <h1 className="th-title">
          <motion.span initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>Puneeth</motion.span>
          <motion.span className="outline" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}>Reddy</motion.span>
        </h1>
        <motion.p className="th-role" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          {person.role}
        </motion.p>
        <motion.div className="th-actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <button className="btn btn-play" onClick={speak}>
            {speaking ? <><FiSquare /> Stop</> : <><FiVolume2 /> Hear me say hi</>}
          </button>
          <button className="btn btn-ghost" onClick={onTrailer}><FiFilm /> Watch trailer</button>
        </motion.div>
      </div>

      <div className={'th-portrait' + (speaking ? ' talking' : '')}>
        <div className="th-halo" />
        {person.introVideo ? (
          <video ref={videoRef} src={person.introVideo} autoPlay muted loop playsInline className="th-video" />
        ) : (
          <motion.img
            src={person.heroCutout}
            alt="Puneeth Reddy"
            initial={{ opacity: 0, scale: 1.05, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2 }}
          />
        )}
        <div className={'th-eq' + (speaking ? ' on' : '')} aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => <i key={i} style={{ animationDelay: i * 0.12 + 's' }} />)}
        </div>
      </div>

      <div className="th-caption" aria-live="polite">
        <span className="th-cc">CC</span>
        <p>
          {words.map((w, i) => (
            <span key={i} className={i < shown ? 'on' : ''}>{w} </span>
          ))}
        </p>
        {!speaking && shown >= words.length && (
          <button className="th-replay" onClick={() => runCaptions(0)} aria-label="Replay captions"><FaPlay /></button>
        )}
      </div>

      <div className="th-scroll" aria-hidden="true"><span /></div>
    </section>
  )
}
