import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// A dot + ring cursor that tells you what an element does ("Drag", "View").
// Desktop / fine pointers only.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 500, damping: 40 })
  const ry = useSpring(y, { stiffness: 500, damping: 40 })

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setEnabled(mq.matches)
    if (!mq.matches) return
    document.documentElement.classList.add('has-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = e.target.closest?.('[data-cursor], a, button, input, textarea')
      setActive(!!el)
      setLabel(el?.dataset?.cursor || '')
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [x, y])

  if (!enabled) return null
  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} />
      <motion.div className={'cursor-ring' + (active ? ' active' : '') + (label ? ' labeled' : '')} style={{ x: rx, y: ry }}>
        {label && <span>{label}</span>}
      </motion.div>
    </>
  )
}
