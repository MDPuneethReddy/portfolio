// A synthesized "ta-dum" — no audio files needed. Only ever called from a click.
export function playTadum() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const master = ctx.createGain()
    master.gain.value = 0.55
    const comp = ctx.createDynamicsCompressor()
    master.connect(comp).connect(ctx.destination)
    const t = ctx.currentTime

    const hit = (time, freqs, dur, vol) => {
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        const lp = ctx.createBiquadFilter()
        o.type = i === 0 ? 'sine' : 'triangle'
        o.frequency.setValueAtTime(f * 1.5, time)
        o.frequency.exponentialRampToValueAtTime(f, time + 0.08)
        lp.type = 'lowpass'
        lp.frequency.setValueAtTime(900, time)
        lp.frequency.exponentialRampToValueAtTime(220, time + dur)
        g.gain.setValueAtTime(0.0001, time)
        g.gain.exponentialRampToValueAtTime(vol / (i + 1), time + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, time + dur)
        o.connect(lp).connect(g).connect(master)
        o.start(time)
        o.stop(time + dur + 0.05)
      })
    }
    hit(t, [73.4, 146.8], 0.35, 0.9) // "ta"
    hit(t + 0.42, [55, 110, 164.8, 220], 2.2, 1) // "dum"
    setTimeout(() => ctx.close(), 3200)
  } catch {
    /* sound is a nice-to-have */
  }
}
