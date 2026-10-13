import React from 'react'
import { motion } from 'framer-motion'

// Headline that rises word by word when it scrolls into view.
export function RevealTitle({ children, as = 'h2', className = '' }) {
  const Tag = motion[as]
  const words = String(children).split(' ')
  return (
    <Tag className={'reveal ' + className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }} transition={{ staggerChildren: 0.06 }}>
      {words.map((w, i) => (
        <span className="reveal-mask" key={i}>
          <motion.span
            className="reveal-word"
            variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } } }}
          >
            {w}
          </motion.span>{' '}
        </span>
      ))}
    </Tag>
  )
}
