import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import IdCard from './IdCard'
import { RevealTitle } from './Reveal'
import { openResume } from './ResumeViewer'
import { person, skills } from '../data'

function Count({ to, suffix = '', prefix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1200)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return <span ref={ref}>{prefix}{n}{suffix}</span>
}

export default function About() {
  const years = new Date().getFullYear() - person.since
  return (
    <section id="about" className="about">
      <IdCard />
      <motion.div className="about-copy" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
        <p className="kicker">Who's this?</p>
        <RevealTitle>I build the whole thing, from the button you click to the queue behind it.</RevealTitle>
        <p>
          I'm a full-stack engineer and a core contributor to Magellon, an open-source scientific data platform used
          by research teams in 3 countries. I've shipped systems that process millions of records a day, and LLM
          features now used by 5+ research institutions.
        </p>
        <p>
          Before that I spent over two years at Novartis building data platforms: Git-style versioning for
          relational data, APIs 35% faster, and 75% fewer production bugs. These days Claude Code is my daily pair
          programmer. I direct, review and own the architecture, and ship faster because of it.
        </p>
        <dl className="stats">
          <div><dt>Years shipping</dt><dd><Count to={years} suffix="+" /></dd></div>
          <div><dt>Countries using my work</dt><dd><Count to={3} /></dd></div>
          <div><dt>Tools in the kit</dt><dd><Count to={skills.length} /></dd></div>
          <div><dt>Pipeline throughput</dt><dd><Count to={3} suffix="×" /></dd></div>
        </dl>
        <button className="btn btn-light" onClick={openResume}>View résumé</button>
      </motion.div>
    </section>
  )
}
