import React, { useEffect, useState } from 'react'
import { FiSearch, FiBell, FiChevronDown, FiMenu, FiX } from 'react-icons/fi'
import { person, profiles } from '../data'
import Avatar from './Avatar'

const links = [
  ['home', 'Home'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
]

export const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' })
}

export default function Navbar({ profile, onSwitch }) {
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (id) => {
    setOpen(false)
    scrollTo(id)
  }

  return (
    <header className={'nav' + (solid ? ' solid' : '')}>
      <button className="nav-logo" onClick={() => go('home')} aria-label="Back to top">PUNEETH</button>
      <nav className={'nav-links' + (open ? ' open' : '')}>
        {links.map(([id, label]) => (
          <button key={id} onClick={() => go(id)}>{label}</button>
        ))}
        <a href={person.blog} target="_blank" rel="noreferrer">Blog</a>
        <a href={person.resume} target="_blank" rel="noreferrer">Resume</a>
      </nav>
      <div className="nav-right">
        <button className="nav-icon hide-sm" onClick={() => go('projects')} aria-label="Browse projects"><FiSearch /></button>
        <button className="nav-icon hide-sm bell" onClick={() => go('contact')} aria-label="Contact">
          <FiBell /><span className="dot">1</span>
        </button>
        <div className="nav-profile" onMouseEnter={() => setMenu(true)} onMouseLeave={() => setMenu(false)}>
          <button className="nav-profile-btn" onClick={() => setMenu((m) => !m)} aria-label="Switch profile">
            <Avatar profile={profile} size={32} />
            <FiChevronDown className={menu ? 'flip' : ''} />
          </button>
          {menu && (
            <div className="nav-menu">
              {profiles.filter((p) => p.id !== profile.id).map((p) => (
                <button key={p.id} onClick={() => { setMenu(false); onSwitch(p) }}>
                  <Avatar profile={p} size={28} /> {p.label}
                </button>
              ))}
              <hr />
              <button onClick={() => { setMenu(false); onSwitch(null) }}>Manage profiles</button>
            </div>
          )}
        </div>
        <button className="nav-icon burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  )
}
