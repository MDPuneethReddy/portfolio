import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiPause } from 'react-icons/fi'
import { FaPlay } from 'react-icons/fa'
import { trailer } from '../data'
import PosterArt from './PosterArt'

const SCENE_MS = 5000

// A Ken-Burns photo "trailer" with Netflix-style subtitles.
export default function Trailer({ onClose }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setElapsed((e) => e + 100), 100)
    return () => clearInterval(id)
  }, [paused])

  useEffect(() => {
    if (elapsed >= SCENE_MS) {
      if (i === trailer.length - 1) onClose()
      else {
        setI(i + 1)
        setElapsed(0)
      }
    }
  }, [elapsed, i, onClose])

  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p) }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', k)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', k)
    }
  }, [onClose])

  const scene = trailer[i]
  const total = ((i * SCENE_MS + elapsed) / (trailer.length * SCENE_MS)) * 100

  return (
    <motion.div className="trailer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPaused((p) => !p)}>
      <AnimatePresence>
        <motion.div key={i} className="trailer-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
          {scene.image ? (
            <img src={scene.image} alt="" className={'kenburns' + (paused ? ' paused' : '')} style={{ objectPosition: scene.pos }} />
          ) : (
            <div className={'kenburns' + (paused ? ' paused' : '')}>
              <PosterArt id={'trailer' + i} art={{ palette: ['#2a0306', '#E50914'], motif: scene.motif }} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="trailer-grade" />
      <button className="trailer-back" onClick={(e) => { e.stopPropagation(); onClose() }} aria-label="Back"><FiArrowLeft /> Back to browse</button>
      <AnimatePresence mode="wait">
        <motion.p key={i} className="subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.4 }}>
          {scene.line}
        </motion.p>
      </AnimatePresence>
      <div className="trailer-bar" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play' : 'Pause'}>{paused ? <FaPlay /> : <FiPause />}</button>
        <div className="trailer-progress"><i style={{ width: total + '%' }} /></div>
        <span>Puneeth Reddy: <b>S1:E1</b> “Hello, World”</span>
      </div>
    </motion.div>
  )
}
