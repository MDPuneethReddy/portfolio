import React, { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiPause, FiPlay, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { story } from '../data'
import { scrollTo } from './Navbar'

const SCENE_MS = 5200

function useTyped(text, run) {
  const [out, setOut] = useState('')
  useEffect(() => {
    if (!run) return
    setOut('')
    let i = 0
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 22)
    return () => clearInterval(id)
  }, [text, run])
  return out
}

// Instagram-style story: tap right/left to move, hold to pause.
export default function StoryMode({ profile, start = 0, onClose }) {
  const [i, setI] = useState(start)
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const done = i >= story.length
  const scene = story[Math.min(i, story.length - 1)]
  const line = scene.line || profile.storyHook
  const typed = useTyped(line, !done)

  const go = useCallback((d) => {
    setElapsed(0)
    setI((n) => Math.max(0, Math.min(story.length, n + d)))
  }, [])

  useEffect(() => {
    if (paused || done) return
    const id = setInterval(() => setElapsed((e) => e + 100), 100)
    return () => clearInterval(id)
  }, [paused, done])

  useEffect(() => {
    if (elapsed >= SCENE_MS + line.length * 12) go(1)
  }, [elapsed, go, line.length])

  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === ' ') {
        e.preventDefault()
        setPaused((p) => !p)
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', k)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', k)
    }
  }, [go, onClose])

  const leave = (id) => {
    onClose()
    setTimeout(() => scrollTo(id), 350)
  }

  const dur = SCENE_MS + line.length * 12

  return (
    <motion.div className="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Puneeth's story">
      <div className="story-frame">
        <div className="story-pips" aria-hidden="true">
          {story.map((_, n) => (
            <span key={n}>
              <i style={{ width: n < i ? '100%' : n === i && !done ? `${Math.min(100, (elapsed / dur) * 100)}%` : '0%' }} />
            </span>
          ))}
        </div>
        <div className="story-top">
          <img src="/media/face.jpg" alt="" className="story-avatar" />
          <b>puneeth</b>
          <span className="story-ep">{done ? 'Finale' : `${scene.ep} · ${scene.title}`}</span>
          <button onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play' : 'Pause'}>{paused ? <FiPlay /> : <FiPause />}</button>
          <button onClick={onClose} aria-label="Close story"><FiX /></button>
        </div>

        <AnimatePresence mode="popLayout">
          {!done ? (
            <motion.div key={i} className="story-scene" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              <img src={scene.image} alt="" className={'story-img' + (paused ? ' paused' : '')} style={{ objectPosition: scene.pos }} />
              <div className="story-shade" />
              <motion.div
                className={'story-bubble ' + scene.side}
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 20 }}
              >
                {typed}
                <span className="caret" />
              </motion.div>
              <motion.p className="story-title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <span>{scene.ep}</span>
                {scene.title}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="end" className="story-end" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="story-end-grid" aria-hidden="true">
                {story.map((s) => <img key={s.image} src={s.image} alt="" />)}
              </div>
              <div className="story-end-copy">
                <span className="p-mark">P</span>
                <h3>That's the trailer.<br />Want the full series?</h3>
                <div className="story-end-actions">
                  <button className="btn btn-play" onClick={() => leave('projects')}>See my work</button>
                  <button className="btn btn-light" onClick={() => leave('contact')}>Let's talk</button>
                  <button className="btn btn-ghost" onClick={() => { setI(0); setElapsed(0) }}>Replay</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!done && (
          <>
            <button className="story-tap left" onClick={() => go(-1)} aria-label="Previous episode"><FiChevronLeft /></button>
            <button
              className="story-tap right"
              onClick={() => go(1)}
              onPointerDown={() => setPaused(true)}
              onPointerUp={() => setPaused(false)}
              onPointerLeave={() => setPaused(false)}
              aria-label="Next episode"
            >
              <FiChevronRight />
            </button>
          </>
        )}
      </div>
      <button className="story-backdrop" onClick={onClose} aria-label="Close story" tabIndex={-1} />
    </motion.div>
  )
}
