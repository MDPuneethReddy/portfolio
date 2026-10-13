import React, { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion'

// Infinite strip whose speed and direction follow your scrolling.
export default function Marquee({ items, base = 40 }) {
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 })
  const factor = useTransform(vel, [-2000, 0, 2000], [-4, 1, 4], { clamp: false })
  const dir = useRef(1)
  const ref = useRef(null)

  useAnimationFrame((_, delta) => {
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    const w = ref.current ? ref.current.scrollWidth / 2 : 1000
    let next = x.get() - dir.current * base * (delta / 1000) * Math.max(1, Math.abs(f))
    if (next <= -w) next += w
    if (next > 0) next -= w
    x.set(next)
  })

  const row = items.map((t, i) => (
    <span key={i} className="mq-item">{t}<i aria-hidden="true">✦</i></span>
  ))
  return (
    <div className="mq" aria-label={items.join(', ')}>
      <motion.div className="mq-track" ref={ref} style={{ x }} aria-hidden="true">
        {row}{row}
      </motion.div>
    </div>
  )
}
