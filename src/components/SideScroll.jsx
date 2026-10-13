import React, { useRef, useState, useLayoutEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { experiences, certifications } from '../data'
import { RevealTitle } from './Reveal'

// Vertical scroll drives a sideways journey through each role.
export default function SideScroll({ onOpen }) {
  const wrap = useRef(null)
  const track = useRef(null)
  const [dist, setDist] = useState(0)

  useLayoutEffect(() => {
    const measure = () => track.current && setDist(track.current.scrollWidth - window.innerWidth)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const x = useSpring(xRaw, { stiffness: 140, damping: 30, mass: 0.4 })
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const ordered = [...experiences].reverse() // oldest → newest, left to right

  return (
    <section id="experience" className="ss" ref={wrap} style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="ss-sticky">
        <div className="ss-head">
          <p className="kicker">The series so far</p>
          <RevealTitle>Experience</RevealTitle>
        </div>
        <motion.div className="ss-track" ref={track} style={{ x }}>
          {ordered.map((e, i) => (
            <article key={e.id} className="ss-panel" onClick={() => onOpen(e)} data-cursor="Open">
              <span className="ss-year" aria-hidden="true">{e.date.match(/\d{4}/)[0]}</span>
              <p className="ss-ep">S{i + 1} · {e.date}</p>
              <h3>{e.company}</h3>
              <p className="ss-role">{e.title}</p>
              <p className="ss-highlight">{e.highlight}</p>
              <ul>
                {e.points.slice(0, 3).map((p) => <li key={p}>{p}</li>)}
              </ul>
              <div className="ss-tags">{e.tags.slice(0, 6).map((t) => <span key={t}>{t}</span>)}</div>
              <span className="ss-more">All episodes →</span>
            </article>
          ))}
          <article className="ss-panel ss-certs">
            <p className="ss-ep">Bonus features</p>
            <h3>Certifications</h3>
            <ul className="ss-certlist">
              {certifications.map((c) => (
                <li key={c.id}><a href={c.link} target="_blank" rel="noreferrer">{c.title}<span>{c.issuer} ↗</span></a></li>
              ))}
            </ul>
          </article>
        </motion.div>
        <div className="ss-progress"><motion.i style={{ width: bar }} /></div>
      </div>
    </section>
  )
}
