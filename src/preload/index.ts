import type { resolve as _resolve } from 'path'
import type { readFileSync as _readFileSync, statSync as _statSync } from 'fs'
import type { createHash as _createHash } from 'crypto'
import type { Buffer as _Buffer } from 'buffer'

declare global {
  interface Window {
    preload: {
      __dirname: string
      resolve: typeof _resolve
      readFileSync: typeof _readFileSync
      statSync: typeof _statSync
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

export const __dirname = window.preload?.__dirname || 'https://unpkg.com/vditor'

export const resolve = window.preload?.resolve || (emptyFuncFactory() as typeof _resolve)

export const readFileSync =
  window.preload?.readFileSync || (emptyFuncFactory() as typeof _readFileSync)

export const statSync = window.preload?.statSync || (emptyFuncFactory() as typeof _statSync)

export const createHash = window.preload?.createHash || (emptyFuncFactory() as typeof _createHash)

export const Buffer = window.preload?.Buffer || (emptyFuncFactory() as typeof _Buffer)
