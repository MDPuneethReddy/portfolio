import React from 'react'
import { FaPlay } from 'react-icons/fa'
import { FiPlus, FiThumbsUp, FiChevronDown, FiExternalLink } from 'react-icons/fi'
import PosterArt from './PosterArt'
import SkillIcon from './SkillIcon'

function HoverPanel({ meta, title, tags, onOpen, link, match }) {
  return (
    <div className="card-panel">
      <div className="card-buttons">
        <button className="cb cb-play" onClick={onOpen} aria-label="Open"><FaPlay /></button>
        {link ? (
          <a className="cb" href={link} target="_blank" rel="noreferrer" aria-label="Open link" onClick={(e) => e.stopPropagation()}><FiExternalLink /></a>
        ) : (
          <button className="cb" aria-label="Add to list"><FiPlus /></button>
        )}
        <button className="cb" aria-label="Like"><FiThumbsUp /></button>
        <button className="cb cb-more" onClick={onOpen} aria-label="More info"><FiChevronDown /></button>
      </div>
      <div className="card-meta">
        <span className="match">{match}% Match</span>
        <span className="rating">{meta}</span>
      </div>
      <div className="card-name">{title}</div>
      <div className="card-tags">
        {tags.slice(0, 3).map((t, i) => (
          <span key={t}>{i > 0 && <i>•</i>}{t}</span>
        ))}
      </div>
    </div>
  )
}

export function ExperienceCard({ item, onOpen }) {
  return (
    <div className="card" onClick={() => onOpen(item)}>
      <PosterArt id={item.id} art={item.art} title={item.company} kicker={item.date} />
      <div className="progress"><i style={{ width: item.progress + '%' }} /></div>
      <HoverPanel meta={item.date.split('–')[0].trim()} title={item.title} tags={item.tags} onOpen={() => onOpen(item)} match={item.progress === 85 ? 99 : 96} />
    </div>
  )
}

export function ProjectCard({ item, onOpen, rank }) {
  return (
    <div className={'card' + (rank ? ' ranked' : '')} onClick={() => onOpen(item)}>
      {rank && <span className="rank">{rank}</span>}
      <PosterArt id={item.id} art={item.art} title={item.title} kicker={item.genre} />
      <HoverPanel meta={item.genre} title={item.title} tags={item.tech} link={item.link} onOpen={() => onOpen(item)} match={98 - (rank || 3)} />
    </div>
  )
}

export function SimpleCard({ item, title, kicker, onOpen }) {
  return (
    <div className="card" onClick={() => onOpen(item)}>
      <PosterArt id={item.id} art={item.art} title={title} kicker={kicker} />
    </div>
  )
}

export function SkillCard({ skill, i }) {
  return (
    <div className="skill-card" style={{ '--d': i * 0.04 + 's' }}>
      <div className="skill-icon"><SkillIcon name={skill.icon} /></div>
      <div className="skill-name">{skill.name}</div>
      <div className="skill-bar"><i style={{ width: skill.level + '%' }} /></div>
      <div className="skill-match">{skill.level}% Match</div>
    </div>
  )
}
