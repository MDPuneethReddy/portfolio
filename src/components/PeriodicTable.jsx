import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { skills, skillCategories } from '../data'
import { RevealTitle } from './Reveal'

export default function PeriodicTable() {
  const [active, setActive] = useState(skills.find((s) => s.sym === 'Re'))
  const [cat, setCat] = useState(null)

  return (
    <section id="skills" className="pt">
      <div className="pt-head">
        <div>
          <p className="kicker">The elements</p>
          <RevealTitle>Periodic table of skills</RevealTitle>
        </div>
        <div className="pt-legend" role="group" aria-label="Filter by category">
          {Object.entries(skillCategories).map(([k, label]) => (
            <button key={k} className={'pt-cat c-' + k + (cat === k ? ' on' : '')} onClick={() => setCat(cat === k ? null : k)} aria-pressed={cat === k}>
              <i /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-body">
        <div className={'pt-key c-' + active.cat} aria-live="polite">
          <span className="pt-num">{skills.indexOf(active) + 1}</span>
          <span className="pt-sym">{active.sym}</span>
          <span className="pt-name">{active.name}</span>
          <span className="pt-mass">{active.level}.00</span>
          <span className="pt-catname">{skillCategories[active.cat]}</span>
          <div className="pt-meter"><i style={{ width: active.level + '%' }} /></div>
          <span className="pt-keylabel">Proficiency</span>
        </div>
        <div className="pt-grid">
          {skills.map((s, i) => (
            <motion.button
              key={s.sym}
              className={'pt-el c-' + s.cat + (active === s ? ' sel' : '') + (cat && cat !== s.cat ? ' dim' : '')}
              onMouseEnter={() => setActive(s)}
              onFocus={() => setActive(s)}
              onClick={() => setActive(s)}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 11) * 0.03 + Math.floor(i / 11) * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <span className="n">{i + 1}</span>
              <span className="s">{s.sym}</span>
              <span className="nm">{s.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
