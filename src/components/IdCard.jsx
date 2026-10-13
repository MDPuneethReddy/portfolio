import React, { useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionValueEvent } from 'framer-motion'
import { person, education, experiences, projects, skills } from '../data'

// A lanyard ID badge you can grab, swing and flip.

function Barcode({ seed }) {
  const bars = useMemo(() => {
    let h = 7
    return Array.from({ length: 46 }, (_, i) => {
      h = (h * 31 + seed.charCodeAt(i % seed.length)) % 97
      return 1 + (h % 4)
    })
  }, [seed])
  let x = 0
  return (
    <svg viewBox="0 0 160 30" className="barcode" aria-hidden="true" preserveAspectRatio="none">
      {bars.map((w, i) => {
        const r = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w * 0.9} height="30" fill="currentColor" /> : null
        x += w * 0.9 + 0.6
        return r
      })}
    </svg>
  )
}

function QrPattern() {
  // A decorative QR-style grid (not scannable).
  const cells = useMemo(() => {
    const out = []
    let s = 11
    for (let y = 0; y < 21; y++)
      for (let x = 0; x < 21; x++) {
        const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13)
        if (finder) continue
        s = (s * 1103515245 + 12345) & 0x7fffffff
        if (s % 3 === 0) out.push([x, y])
      }
    return out
  }, [])
  const finder = (x, y) => (
    <g key={x + '-' + y}>
      <rect x={x} y={y} width="7" height="7" fill="currentColor" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="var(--card)" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="currentColor" />
    </g>
  )
  return (
    <svg viewBox="0 0 21 21" className="qr" aria-hidden="true" shapeRendering="crispEdges">
      {cells.map(([x, y]) => <rect key={x + '.' + y} x={x} y={y} width="1" height="1" fill="currentColor" />)}
      {finder(0, 0)}{finder(14, 0)}{finder(0, 14)}
    </svg>
  )
}

export default function IdCard() {
  const [flipped, setFlipped] = useState(false)
  const dragged = useRef(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 120, damping: 9 })
  const rotate = useTransform(sx, [-220, 220], [22, -22])
  const [strap, setStrap] = useState('M0 0 L0 0')

  const updateStrap = () => {
    const cx = x.get()
    const cy = y.get()
    setStrap(`M0 -130 Q ${cx * 0.35} ${(cy - 130) / 2} ${cx} ${cy}`)
  }
  useMotionValueEvent(x, 'change', updateStrap)
  useMotionValueEvent(y, 'change', updateStrap)

  const uni = education[0]

  return (
    <div className="idc-stage">
      <svg className="idc-strap" viewBox="-200 -130 400 170" aria-hidden="true">
        <path d={strap === 'M0 0 L0 0' ? 'M0 -130 L0 0' : strap} />
      </svg>
      <motion.div
        className="idc-drag"
        data-cursor="Drag"
        drag
        dragSnapToOrigin
        dragElastic={0.35}
        dragTransition={{ bounceStiffness: 180, bounceDamping: 9 }}
        style={{ x, y, rotate }}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={() => setTimeout(() => (dragged.current = false), 50)}
        onClick={() => !dragged.current && setFlipped((f) => !f)}
        whileTap={{ cursor: 'grabbing' }}
      >
        <div className="idc-clip" />
        <motion.div className="idc" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
          {/* front */}
          <div className="idc-face idc-front">
            <div className="idc-hole" />
            <div className="idc-head">
              <span className="p-mark">P</span>
              <span>Access all areas</span>
            </div>
            <img src={person.idPhoto} alt="Puneeth Reddy" draggable="false" />
            <div className="idc-name">{person.name}</div>
            <div className="idc-role">{person.role}</div>
            <dl className="idc-fields">
              <div><dt>ID</dt><dd>{person.idNumber}</dd></div>
              <div><dt>Since</dt><dd>{person.since}</dd></div>
              <div><dt>Clearance</dt><dd>Full stack</dd></div>
            </dl>
            <Barcode seed={person.idNumber} />
          </div>
          {/* back */}
          <div className="idc-face idc-back">
            <div className="idc-hole" />
            <div className="idc-head"><span>Credentials</span><span className="mono">{person.idNumber}</span></div>
            <dl className="idc-list">
              <div><dt>Based in</dt><dd>{person.location}</dd></div>
              <div><dt>Education</dt><dd>{uni.title}, {uni.school}</dd></div>
              <div><dt>Experience</dt><dd>{person.idExperience} years · {experiences.length} roles</dd></div>
              <div><dt>Shipped</dt><dd>{projects.length} projects · {skills.length} tools</dd></div>
              <div><dt>Contact</dt><dd>{person.email}</dd></div>
              <div><dt>Status</dt><dd><span className="live" /> Open to opportunities</dd></div>
            </dl>
            <div className="idc-qr">
              <QrPattern />
              <span>If found, please hire.</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <p className="idc-hint">Drag to swing · Click to flip</p>
    </div>
  )
}
