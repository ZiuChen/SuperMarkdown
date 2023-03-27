const { resolve } = require('path')
const { readFileSync, statSync } = require('fs')
const { createHash } = require('crypto')
const { Buffer } = require('buffer')

window.preload = {
  resolve,
  readFileSync,
  statSync,
  createHash,
  Buffer
}
