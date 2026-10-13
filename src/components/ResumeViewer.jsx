import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiDownload, FiExternalLink } from 'react-icons/fi'
import { person } from '../data'

// Shows the résumé pages inline, with download / open-in-new-tab actions.
export const openResume = () => window.dispatchEvent(new Event('open-resume'))

export default function ResumeViewer({ onClose }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', k)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', k)
    }
  }, [onClose])

  return (
    <motion.div className="rv" data-lenis-prevent onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Résumé">
      <div className="rv-bar" onClick={(e) => e.stopPropagation()}>
        <div className="rv-title">
          <span className="p-mark">P</span>
          <div>
            <b>{person.fullName}</b>
            <span>Résumé · PDF</span>
          </div>
        </div>
        <div className="rv-actions">
          <a className="btn btn-play" href={person.resume} download="Puneeth_Reddy_Resume.pdf"><FiDownload /> Download</a>
          <a className="btn btn-ghost hide-xs" href={person.resume} target="_blank" rel="noreferrer"><FiExternalLink /> Open</a>
          <button className="rv-close" onClick={onClose} aria-label="Close résumé"><FiX /></button>
        </div>
      </div>
      <motion.div
        className="rv-pages"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      >
        {person.resumePages.map((src, i) => (
          <img key={src} src={src} alt={`Résumé page ${i + 1}`} className="rv-page" />
        ))}
      </motion.div>
    </motion.div>
  )
}
