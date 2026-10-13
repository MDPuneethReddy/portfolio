import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Row({ id, title, subtitle, children, variant = '' }) {
  const ref = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = () => {
    const el = ref.current
    if (!el) return
    setEdges({ start: el.scrollLeft < 10, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 10 })
  }
  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const slide = (dir) => {
    const el = ref.current
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <motion.section
      id={id}
      className={'row ' + variant}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="row-title">
        {title} <span className="row-explore">Explore all <FiChevronRight /></span>
      </h2>
      {subtitle && <p className="row-sub">{subtitle}</p>}
      <div className="row-wrap">
        {!edges.start && (
          <button className="row-arrow left" onClick={() => slide(-1)} aria-label="Scroll left"><FiChevronLeft /></button>
        )}
        <div className="row-track" ref={ref} onScroll={update}>
          {children}
        </div>
        {!edges.end && (
          <button className="row-arrow right" onClick={() => slide(1)} aria-label="Scroll right"><FiChevronRight /></button>
        )}
      </div>
    </motion.section>
  )
}
