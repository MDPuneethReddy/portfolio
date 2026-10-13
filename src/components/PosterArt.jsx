import React, { useMemo } from 'react'

// Procedurally generated "key art" for cards — every card gets a unique,
// deterministic poster built from its id, palette and motif.

function seeded(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

function Motif({ motif, accent, rnd }) {
  switch (motif) {
    case 'grid': {
      const lines = []
      for (let i = 0; i <= 16; i++) {
        const x = (i / 16) * 400
        lines.push(<line key={'v' + i} x1={200 + (x - 200) * 0.15} y1="120" x2={200 + (x - 200) * 2.2} y2="225" />)
      }
      for (let j = 0; j < 8; j++) {
        const y = 120 + Math.pow(j / 7, 1.8) * 105
        lines.push(<line key={'h' + j} x1="-100" y1={y} x2="500" y2={y} />)
      }
      return (
        <g>
          <circle cx="200" cy="110" r={46 + rnd() * 20} fill={accent} opacity="0.85" />
          <g stroke={accent} strokeWidth="1.2" opacity="0.55">{lines}</g>
        </g>
      )
    }
    case 'waves': {
      const paths = []
      for (let k = 0; k < 9; k++) {
        const amp = 8 + rnd() * 18
        const off = rnd() * 6
        let d = ''
        for (let x = 0; x <= 400; x += 8) {
          const y = 70 + k * 18 + Math.sin(x / 40 + off + k * 0.5) * amp
          d += (x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(1)
        }
        paths.push(<path key={k} d={d} fill="none" stroke={accent} strokeWidth={1 + k * 0.25} opacity={0.15 + k * 0.08} />)
      }
      return <g>{paths}</g>
    }
    case 'bars': {
      const bars = []
      const n = 14
      for (let i = 0; i < n; i++) {
        const h = 30 + rnd() * 130
        bars.push(<rect key={i} x={20 + i * 26} y={225 - h} width="16" height={h} rx="3" fill={accent} opacity={0.25 + (i / n) * 0.6} />)
      }
      return <g>{bars}</g>
    }
    case 'chart': {
      let d = 'M0 120'
      let y = 120
      for (let x = 20; x <= 400; x += 20) {
        y = Math.max(30, Math.min(200, y + (rnd() - (x > 200 ? 0.35 : 0.65)) * 50))
        d += ` L${x} ${y.toFixed(0)}`
      }
      return (
        <g>
          <path d={d + ' L400 225 L0 225Z'} fill={accent} opacity="0.18" />
          <path d={d} fill="none" stroke={accent} strokeWidth="3" />
        </g>
      )
    }
    case 'circuit': {
      const els = []
      for (let i = 0; i < 18; i++) {
        const x = rnd() * 400
        const y = rnd() * 225
        const len = 30 + rnd() * 90
        const horiz = rnd() > 0.5
        const x2 = horiz ? x + len : x
        const y2 = horiz ? y : y + len * 0.6
        els.push(
          <g key={i} opacity={0.35 + rnd() * 0.5}>
            <path d={`M${x} ${y} L${x2} ${y2} L${x2 + 14} ${y2 + 14}`} fill="none" stroke={accent} strokeWidth="1.5" />
            <circle cx={x} cy={y} r="3" fill={accent} />
            <circle cx={x2 + 14} cy={y2 + 14} r="3.5" fill="none" stroke={accent} strokeWidth="1.5" />
          </g>
        )
      }
      return <g>{els}</g>
    }
    case 'rings':
    default: {
      const cx = 260 + rnd() * 80
      const cy = 80 + rnd() * 60
      const rings = []
      for (let i = 1; i <= 9; i++) rings.push(<circle key={i} cx={cx} cy={cy} r={i * 18} fill="none" stroke={accent} strokeWidth={i % 3 === 0 ? 2 : 1} opacity={1 - i * 0.09} />)
      return <g>{rings}<circle cx={cx} cy={cy} r="10" fill={accent} /></g>
    }
  }
}

export default function PosterArt({ id, art, title, kicker, className = '' }) {
  const [base, accent] = art.palette
  const gid = 'g-' + id
  const content = useMemo(() => {
    const rnd = seeded(id)
    return <Motif motif={art.motif} accent={accent} rnd={rnd} />
  }, [id, art.motif, accent])

  return (
    <div className={'poster ' + className}>
      <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id={gid} cx="70%" cy="20%" r="95%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
            <stop offset="45%" stopColor={base} />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>
        </defs>
        <rect width="400" height="225" fill={`url(#${gid})`} />
        {content}
        <rect width="400" height="225" fill="url(#poster-shade)" />
      </svg>
      <span className="poster-badge">P</span>
      {title && (
        <div className="poster-title">
          {kicker && <span className="poster-kicker">{kicker}</span>}
          <span>{title}</span>
        </div>
      )}
    </div>
  )
}

// Shared gradient defs, rendered once in App.
export function PosterDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="poster-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="40%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
        </linearGradient>
      </defs>
    </svg>
  )
}
