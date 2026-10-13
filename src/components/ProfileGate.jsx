import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { profiles } from '../data'
import Avatar from './Avatar'
import { playTadum } from '../sound'

export default function ProfileGate({ onPick }) {
  const [picked, setPicked] = useState(null)

  const pick = (p) => {
    if (picked) return
    setPicked(p.id)
    playTadum()
    setTimeout(() => onPick(p), 900)
  }

  return (
    <motion.div className="gate" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <h1>Who's watching?</h1>
      <div className="gate-list">
        {profiles.map((p, i) => (
          <motion.button
            key={p.id}
            className={'gate-item' + (picked === p.id ? ' picked' : '') + (picked && picked !== p.id ? ' faded' : '')}
            onClick={() => pick(p)}
            initial={{ opacity: 0, y: 30 }}
            animate={picked === p.id ? { scale: 1.25, opacity: 1, y: 0 } : { opacity: picked ? 0 : 1, y: 0 }}
            transition={{ delay: picked ? 0 : 0.15 + i * 0.1, duration: 0.5 }}
          >
            <Avatar profile={p} size={140} />
            <span>{p.label}</span>
          </motion.button>
        ))}
      </div>
      <p className="gate-hint">Pick a profile — the show adapts to you.</p>
    </motion.div>
  )
}
