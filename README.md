# Puneeth Reddy — Portfolio (v2)

A Netflix-inspired portfolio: animated logo intro with a synthesized "ta-dum",
a "Who's watching?" profile picker that adapts the page, a cinematic hero,
hover-to-preview rows, a Ken-Burns "trailer" with subtitles, and a walking
mini-me that introduces the site and reacts to each section.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → ./build
npm run preview  # serve the build
```

## Editing content

All text, jobs, projects, skills, education, certifications and trailer scenes
live in **`src/data.js`**. Card artwork is generated procedurally from each
item's `art: { palette, motif }` (motifs: `grid`, `waves`, `bars`, `chart`,
`circuit`, `rings`) — no screenshots needed.

Photos live in `public/media/` (`face.jpg` is the mini-me's head,
`hero-night.jpg` the billboard, `beach.jpg`/`sunset.jpg` the trailer).

## Contact form

Set `REACT_APP_FORMSPREE_ID` (or `VITE_FORMSPREE_ID`-style prefix `REACT_APP_`
is kept for compatibility) in your host's environment. Without it, the form
falls back to opening an email to you.
