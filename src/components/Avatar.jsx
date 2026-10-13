import React from 'react'

// Netflix-style profile avatars, drawn in SVG.
const faces = {
  recruiter: (
    <>
      <circle cx="35" cy="42" r="5" fill="#fff" />
      <circle cx="65" cy="42" r="5" fill="#fff" />
      <rect x="24" y="35" width="22" height="14" rx="5" fill="none" stroke="#fff" strokeWidth="3" />
      <rect x="54" y="35" width="22" height="14" rx="5" fill="none" stroke="#fff" strokeWidth="3" />
      <line x1="46" y1="42" x2="54" y2="42" stroke="#fff" strokeWidth="3" />
      <path d="M32 66 Q50 80 68 66" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  developer: (
    <>
      <path d="M26 40 l8 -6 l8 6" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 40 l8 -6 l8 6" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="50" y="76" textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff" fontFamily="monospace">{'</>'}</text>
    </>
  ),
  stalker: (
    <>
      <ellipse cx="34" cy="44" rx="10" ry="7" fill="#fff" />
      <ellipse cx="66" cy="44" rx="10" ry="7" fill="#fff" />
      <circle cx="39" cy="44" r="4" fill="#111" />
      <circle cx="71" cy="44" r="4" fill="#111" />
      <path d="M38 70 h24" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  adventurer: (
    <>
      <circle cx="34" cy="42" r="5" fill="#fff" />
      <circle cx="66" cy="42" r="5" fill="#fff" />
      <path d="M28 60 Q50 88 72 60 Z" fill="#fff" />
      <path d="M14 24 L30 12 L42 22 L54 8 L72 22 L86 14" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" opacity=".7" />
    </>
  ),
}

export default function Avatar({ profile, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="avatar" aria-hidden="true">
      <defs>
        <linearGradient id={'av-' + profile.id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={profile.color} />
          <stop offset="1" stopColor={profile.color} stopOpacity=".6" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="6" fill={`url(#av-${profile.id})`} />
      {faces[profile.id]}
    </svg>
  )
}
