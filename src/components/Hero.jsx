import React from 'react'
import { motion } from 'framer-motion'
import { FaPlay } from 'react-icons/fa'
import { FiInfo } from 'react-icons/fi'
import { person } from '../data'

export default function Hero({ profile, onPlay, onInfo }) {
  return (
    <section id="home" className="hero">
      <div className="hero-bg">
        <img src={person.heroPhoto} alt="Puneeth Reddy" />
      </div>
      <div className="hero-vignette" />
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        <div className="hero-series"><span className="p-mark">P</span> S E R I E S</div>
        <h1 className="hero-title">Puneeth<br />Reddy</h1>
        <div className="hero-top10">
          <span className="top10-badge">TOP<b>10</b></span>
          #1 Full Stack Engineer in your feed today
        </div>
        <div className="hero-meta">
          <span className="match">98% Match</span>
          <span>2026</span>
          <span className="rating">TV-DEV</span>
          <span>{person.yearsExperience} Seasons</span>
          <span className="hd">HD</span>
        </div>
        <p className="hero-desc">
          {person.role} who builds fast, scalable products end-to-end — from pixel-perfect React UIs to
          Python &amp; Node services, message queues and GPU deployments. {profile.tagline}
        </p>
        <div className="hero-actions">
          <button className="btn btn-play" onClick={onPlay}><FaPlay /> Play</button>
          <button className="btn btn-info" onClick={onInfo}><FiInfo /> More Info</button>
        </div>
      </motion.div>
      <div className="hero-age">
        <span>{person.location}</span>
      </div>
    </section>
  )
}
