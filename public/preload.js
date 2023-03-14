const process = require('process')
const { resolve } = require('path')
const { readFileSync, statSync } = require('fs')
const { createHash } = require('crypto')
const { Buffer } = require('buffer')

window.preload = {
  __dirname: process.env.NODE_ENV === 'development' ? 'https://unpkg.com/vditor' : __dirname,
  resolve,
  readFileSync,
  statSync,
  createHash,
  Buffer
}
