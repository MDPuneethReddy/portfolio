import React, { useEffect } from 'react'

const STRIPES = ['#E50914', '#B20710', '#FF3D5A', '#7B1FA2', '#2E7DF6', '#F5C518', '#E50914', '#1DB954', '#FF6B35', '#E50914', '#B20710', '#F72585']

export default function Intro({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3600)
    const skip = (e) => (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') && onDone()
    window.addEventListener('keydown', skip)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', skip)
    }
  }, [onDone])

  return (
    <div className="intro" onClick={onDone} role="button" aria-label="Skip intro" tabIndex={0}>
      <div className="intro-logo">
        {'PUNEETH'.split('').map((ch, i) => (
          <span key={i} style={{ '--i': i }}>{ch}</span>
        ))}
      </div>
      <div className="intro-stripes" aria-hidden="true">
        {STRIPES.map((c, i) => (
          <i key={i} style={{ background: c, animationDelay: `${1.55 + (i % 6) * 0.05}s`, left: `${i * 8.3}%` }} />
        ))}
      </div>
      <span className="intro-skip">Click to skip</span>
    </div>
  )
}
