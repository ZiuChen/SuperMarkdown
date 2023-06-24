const { resolve, basename, extname } = require('path')
const { readFileSync, statSync, writeFileSync, mkdirSync } = require('fs')
const { createHash } = require('crypto')
const { Buffer } = require('buffer')

window.preload = {
  resolve,
  basename,
  extname,
  readFileSync,
  statSync,
  writeFileSync,
  mkdirSync,
  createHash,
  Buffer
}
