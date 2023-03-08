import process from 'process'

// @ts-ignore
window.preload.__dirname =
  process.env.NODE_ENV === 'development' ? 'https://unpkg.com/vditor' : __dirname
