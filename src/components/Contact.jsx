import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronRight, FiCheck } from 'react-icons/fi'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import { person } from '../data'

const FORMSPREE = import.meta.env.REACT_APP_FORMSPREE_ID

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [step, setStep] = useState(0) // 0 email, 1 details, 2 sent
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const start = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Please enter a valid email address.')
    setError('')
    setStep(1)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return setError('Name and message are required.')
    setError('')
    if (!FORMSPREE) {
      window.location.href = `mailto:${person.email}?subject=${encodeURIComponent('Hello from ' + form.name)}&body=${encodeURIComponent(form.message)}`
      return setStep(2)
    }
    setSending(true)
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStep(2)
      setForm({ name: '', email: '', message: '' })
    } catch {
      setError(`Something went wrong. Email me directly at ${person.email}.`)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-bg" />
      <motion.div className="contact-inner" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <h2>Unlimited ideas, apps, and more.</h2>
        <p className="contact-lead">Hiring? Collaborating? Just saying hi? Starts with one message. Cancel anytime.</p>

        {step === 0 && (
          <>
            <p>Ready to work together? Enter your email to start the conversation.</p>
            <form className="contact-start" onSubmit={start}>
              <input name="email" type="email" placeholder="Email address" value={form.email} onChange={change} aria-label="Email address" />
              <button className="btn-red" type="submit">Get Started <FiChevronRight /></button>
            </form>
          </>
        )}

        {step === 1 && (
          <motion.form className="contact-form" onSubmit={submit} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <span className="step">STEP 2 OF 2</span>
            <h3>Tell me a bit more</h3>
            <input name="name" placeholder="Your name" value={form.name} onChange={change} aria-label="Your name" autoFocus />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} aria-label="Email" />
            <textarea name="message" rows={4} placeholder="What should we build?" value={form.message} onChange={change} aria-label="Message" />
            <button className="btn-red" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.div className="contact-done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <FiCheck /> Message sent. Next episode starts soon — I’ll get back to you!
          </motion.div>
        )}
        {error && <p className="contact-error">{error}</p>}

        <div className="contact-links">
          <a href={person.linkedin} target="_blank" rel="noreferrer"><FaLinkedin /> LinkedIn</a>
          <a href={person.github} target="_blank" rel="noreferrer"><FaGithub /> GitHub</a>
          <a href={`mailto:${person.email}`}>{person.email}</a>
        </div>
      </motion.div>
    </section>
  )
}
