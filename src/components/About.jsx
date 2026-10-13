import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import IdCard from './IdCard'
import { RevealTitle } from './Reveal'
import { person, projects, skills } from '../data'

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
  const years = new Date().getFullYear() - 2019
  return (
    <section id="about" className="about">
      <IdCard />
      <motion.div className="about-copy" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
        <p className="kicker">Who's this?</p>
        <RevealTitle>I build the whole thing, from the button you click to the queue behind it.</RevealTitle>
        <p>
          I'm a full-stack engineer who started shipping in 2019. At Novartis I built GraphQL APIs, RabbitMQ
          microservices and secure data tools, and led a tooling change that cut spend by 20%. At Florida State
          University I build React and FastAPI apps that run on NVIDIA GPUs, with Prometheus and Grafana watching them.
        </p>
        <p>
          I care about fast interfaces, boring reliable backends, and tests that catch things before users do.
        </p>
        <dl className="stats">
          <div><dt>Years shipping</dt><dd><Count to={years} suffix="+" /></dd></div>
          <div><dt>Projects</dt><dd><Count to={projects.length} /></dd></div>
          <div><dt>Tools in the kit</dt><dd><Count to={skills.length} /></dd></div>
          <div><dt>Spend cut at Novartis</dt><dd><Count to={20} prefix="−" suffix="%" /></dd></div>
        </dl>
        <a className="btn btn-light" href={person.resume} target="_blank" rel="noreferrer">Download résumé</a>
      </motion.div>
    </section>
  )
}
