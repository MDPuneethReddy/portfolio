import React, { useEffect, useRef } from 'react'

// Renders a portrait as a field of dots sampled from a transparent cutout.
// Dots fly in to assemble the face, scatter away from the cursor, and pulse
// gently while the intro is "talking".

export default function ParticlePortrait({ src, talking = false, className = '' }) {
  const canvasRef = useRef(null)
  const talkRef = useRef(talking)
  talkRef.current = talking

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let particles = []
    let raf
    let W = 0
    let H = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: -9999, y: -9999 }
    let t0 = performance.now()

    const img = new Image()
    img.src = src

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // fit image into canvas (contain, bottom aligned)
      const s = Math.min(W / img.width, H / img.height)
      const iw = Math.round(img.width * s)
      const ih = Math.round(img.height * s)
      const ox = Math.round((W - iw) / 2)
      const oy = Math.round(H - ih)

      const off = document.createElement('canvas')
      off.width = iw
      off.height = ih
      const octx = off.getContext('2d', { willReadFrequently: true })
      octx.drawImage(img, 0, 0, iw, ih)
      let data
      try {
        data = octx.getImageData(0, 0, iw, ih).data
      } catch {
        particles = null // tainted canvas: fall back to plain image
        return
      }

      const step = W < 500 ? 4 : 6
      particles = []
      for (let y = 0; y < ih; y += step) {
        for (let x = 0; x < iw; x += step) {
          const i = (y * iw + x) * 4
          const a = data[i + 3]
          if (a < 40) continue
          const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255
          const r = Math.max(0.55, Math.pow(lum, 0.9) * step * 0.62) * (a / 255)
          const tx = ox + x
          const ty = oy + y
          particles.push({
            tx, ty, r,
            x: reduce ? tx : tx + (Math.random() - 0.5) * W * 1.4,
            y: reduce ? ty : ty + (Math.random() - 0.5) * H * 1.4,
            vx: 0, vy: 0,
            red: Math.random() < 0.035,
            delay: Math.random() * 600,
          })
        }
      }
      t0 = performance.now()
    }

    const draw = (now) => {
      ctx.clearRect(0, 0, W, H)
      if (!particles) {
        const s = Math.min(W / img.width, H / img.height)
        ctx.drawImage(img, (W - img.width * s) / 2, H - img.height * s, img.width * s, img.height * s)
        return
      }
      const elapsed = now - t0
      const talk = talkRef.current
      const pulse = talk ? 1 + Math.sin(now / 90) * 0.12 : 1
      const R = 90
      for (const p of particles) {
        if (elapsed > p.delay) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1
            const f = (1 - d / R) * 3.2
            p.vx += (dx / d) * f
            p.vy += (dy / d) * f
          }
          p.vx += (p.tx - p.x) * 0.045
          p.vy += (p.ty - p.y) * 0.045
          p.vx *= 0.82
          p.vy *= 0.82
          p.x += p.vx
          p.y += p.vy
        }
        ctx.fillStyle = p.red ? '#e50914' : '#f2f2f2'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduce || elapsed < 50) raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const onResize = () => {
      cancelAnimationFrame(raf)
      build()
      raf = requestAnimationFrame(draw)
    }

    img.onload = () => {
      build()
      raf = requestAnimationFrame(draw)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    canvas.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)

    // pause when off-screen
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf)
      if (e.isIntersecting && particles !== undefined) raf = requestAnimationFrame(draw)
    })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [src])

  return <canvas ref={canvasRef} className={'particles ' + className} aria-label="Portrait of Puneeth Reddy made of dots" role="img" />
}
