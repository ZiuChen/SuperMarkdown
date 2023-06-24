import type { resolve as _resolve, basename as _basename, extname as _extname } from 'path'
import type {
  readFileSync as _readFileSync,
  statSync as _statSync,
  mkdirSync as _mkdirSync,
  writeFileSync as _writeFileSync
} from 'fs'
import type { createHash as _createHash } from 'crypto'
import type { Buffer as _Buffer } from 'buffer'

declare global {
  interface Window {
    preload: {
      resolve: typeof _resolve
      basename: typeof _basename
      extname: typeof _extname
      readFileSync: typeof _readFileSync
      statSync: typeof _statSync
      mkdirSync: typeof _mkdirSync
      writeFileSync: typeof _writeFileSync
      createHash: typeof _createHash
      Buffer: typeof _Buffer
    }
  }
}

function emptyFuncFactory() {
  return new Function()
}

// 导出以供类型静态分析 实际取值是在运行时进行的
// 需要自己对isElectron进行判断

export const resolve = window.preload?.resolve || (emptyFuncFactory() as typeof _resolve)

export const basename = window.preload?.basename || (emptyFuncFactory() as typeof _basename)

export const extname = window.preload?.extname || (emptyFuncFactory() as typeof _extname)

export const readFileSync =
  window.preload?.readFileSync || (emptyFuncFactory() as typeof _readFileSync)

export const statSync = window.preload?.statSync || (emptyFuncFactory() as typeof _statSync)

export const mkdirSync = window.preload?.mkdirSync || (emptyFuncFactory() as typeof _mkdirSync)

export const writeFileSync =
  window.preload?.writeFileSync || (emptyFuncFactory() as typeof _writeFileSync)

export const createHash = window.preload?.createHash || (emptyFuncFactory() as typeof _createHash)

export const Buffer = window.preload?.Buffer || (emptyFuncFactory() as typeof _Buffer)
