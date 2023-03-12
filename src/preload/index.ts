import process from 'process'
import { resolve } from 'path'
import { readFileSync, statSync } from 'fs'
import { createHash } from 'crypto'

// @ts-ignore
window.preload.__dirname =
  process.env.NODE_ENV === 'development' ? 'https://unpkg.com/vditor' : __dirname

export { resolve, readFileSync, statSync, createHash }
