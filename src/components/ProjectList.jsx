import React, { useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { projects } from '../data'
import PosterArt from './PosterArt'

// Big type list; the poster follows your cursor on hover.
export default function ProjectList({ onOpen }) {
  const [hover, setHover] = useState(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 300, damping: 30 })
  const y = useSpring(my, { stiffness: 300, damping: 30 })

  const move = (e) => {
    mx.set(e.clientX)
    my.set(e.clientY)
  }

  return (
    <section id="projects" className="pl" onMouseMove={move}>
      <p className="kicker">Now streaming</p>
      <h2>Projects</h2>
      <ol className="pl-list">
        {projects.map((p, i) => (
          <li key={p.id}>
            <button onClick={() => onOpen(p)} onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(null)}>
              <span className="pl-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="pl-thumb"><PosterArt id={p.id + '-t'} art={p.art} /></span>
              <span className="pl-title">{p.title}</span>
              <span className="pl-genre">{p.genre}</span>
              <span className="pl-arrow" aria-hidden="true">→</span>
            </button>
          </li>
        ))}
      </ol>
      <AnimatePresence>
        {hover && (
          <motion.div
            key="float"
            className="pl-float"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <PosterArt id={hover.id + '-f'} art={hover.art} title={hover.title} kicker={hover.genre} />
            <div className="pl-float-tech">{hover.tech.slice(0, 4).join(' · ')}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
