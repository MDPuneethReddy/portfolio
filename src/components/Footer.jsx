import React from 'react'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import { person } from '../data'
import { scrollTo } from './Navbar'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-social">
        <a href={person.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
        <a href={person.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
      </div>
      <div className="footer-grid">
        <button onClick={() => scrollTo('experience')}>Experience</button>
        <button onClick={() => scrollTo('projects')}>Projects</button>
        <button onClick={() => scrollTo('skills')}>Skills</button>
        <button onClick={() => scrollTo('contact')}>Contact</button>
        <a href={person.resume} target="_blank" rel="noreferrer">Resume</a>
        <a href={person.blog} target="_blank" rel="noreferrer">Blog</a>
        <a href={`mailto:${person.email}`}>Email</a>
        <a href={person.github} target="_blank" rel="noreferrer">Source</a>
      </div>
      <p className="footer-note">© {new Date().getFullYear()} {person.fullName}. Inspired by a certain streaming service — not affiliated with it.</p>
    </footer>
  )
}
