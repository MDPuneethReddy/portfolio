import React, { useEffect, useRef, useState } from 'react'
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi'
import { person, profiles } from '../data'
import Avatar from './Avatar'

const links = [
  ['about', 'About'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['contact', 'Contact'],
]

export const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -60 })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' })
}

export default function Navbar({ profile, onSwitch }) {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const last = useRef(0)

  useEffect(() => {
    const on = () => {
      const y = window.scrollY
      setSolid(y > 40)
      setHidden(y > 300 && y > last.current + 4)
      if (y < last.current - 4) setHidden(false)
      last.current = y
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    links.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', on)
      io.disconnect()
    }
  }, [])

  const go = (id) => {
    setOpen(false)
    scrollTo(id)
  }

  return (
    <header className={'nav' + (solid ? ' solid' : '') + (hidden && !open ? ' up' : '')}>
      <button className="nav-logo" onClick={() => go('home')} aria-label="Back to top">PUNEETH</button>
      <nav className={'nav-links' + (open ? ' open' : '')}>
        {links.map(([id, label]) => (
          <button key={id} onClick={() => go(id)} className={active === id ? 'on' : ''}>{label}</button>
        ))}
        <a href={person.blog} target="_blank" rel="noreferrer">Blog ↗</a>
      </nav>
      <div className="nav-right">
        <div className="nav-profile" onMouseEnter={() => setMenu(true)} onMouseLeave={() => setMenu(false)}>
          <button className="nav-profile-btn" onClick={() => setMenu((m) => !m)} aria-label="Switch profile" aria-expanded={menu}>
            <Avatar profile={profile} size={30} />
            <FiChevronDown className={menu ? 'flip' : ''} />
          </button>
          {menu && (
            <div className="nav-menu">
              <p>Watching as {profile.label}</p>
              {profiles.filter((p) => p.id !== profile.id).map((p) => (
                <button key={p.id} onClick={() => { setMenu(false); onSwitch(p) }}>
                  <Avatar profile={p} size={26} /> {p.label}
                </button>
              ))}
              <hr />
              <button onClick={() => { setMenu(false); onSwitch(null) }}>Switch profiles</button>
            </div>
          )}
        </div>
        <button className="nav-icon burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  )
}
