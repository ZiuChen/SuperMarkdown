const { resolve, basename, extname } = require('path')
const { readFileSync, statSync } = require('fs')
const { createHash } = require('crypto')
const { Buffer } = require('buffer')

window.preload = {
  resolve,
  basename,
  extname,
  readFileSync,
  statSync,
  createHash,
  Buffer
}
