import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlay } from 'react-icons/fa'
import { FiX, FiPlus, FiThumbsUp } from 'react-icons/fi'
import PosterArt from './PosterArt'

// Netflix-style "More Info" modal. `item` is normalized in App.
export default function DetailModal({ item, onClose }) {
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
    <motion.div className="modal-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, scale: 0.92, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 40, scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close"><FiX /></button>
        <div className="modal-hero">
          <PosterArt id={item.id + '-modal'} art={item.art} />
          <div className="modal-hero-fade" />
          <div className="modal-hero-content">
            <div className="hero-series"><span className="p-mark">P</span> {item.kind}</div>
            <h2>{item.title}</h2>
            <div className="hero-actions">
              {item.link ? (
                <a className="btn btn-play" href={item.link} target="_blank" rel="noreferrer"><FaPlay /> {item.linkLabel || 'View'}</a>
              ) : (
                <span className="btn btn-play static"><FaPlay /> Now Streaming</span>
              )}
              <button className="cb" aria-label="Add"><FiPlus /></button>
              <button className="cb" aria-label="Like"><FiThumbsUp /></button>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-main">
            <div className="hero-meta">
              <span className="match">98% Match</span>
              {item.date && <span>{item.date}</span>}
              <span className="rating">{item.rating || 'TV-DEV'}</span>
              <span className="hd">HD</span>
            </div>
            {item.subtitle && <h3 className="modal-sub">{item.subtitle}</h3>}
            <p>{item.description}</p>
          </div>
          <div className="modal-side">
            {item.tags?.length > 0 && (
              <p><span className="dim">Cast: </span>{item.tags.join(', ')}</p>
            )}
            {item.genre && <p><span className="dim">Genres: </span>{item.genre}</p>}
          </div>
        </div>
        {item.points?.length > 0 && (
          <div className="episodes">
            <h3>Episodes <span className="dim">{item.subtitle}</span></h3>
            {item.points.map((p, i) => (
              <div className="episode" key={i}>
                <span className="ep-num">{i + 1}</span>
                <div className="ep-thumb">
                  <PosterArt id={item.id + '-ep' + i} art={item.art} />
                  <FaPlay className="ep-play" />
                </div>
                <p>{p}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
