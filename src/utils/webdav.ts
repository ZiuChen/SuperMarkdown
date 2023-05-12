import { useMainStore } from '@/store'
import { FileStat, createClient } from 'webdav'

export interface WebDavDbReturn {
  id: string
  rev?: string
  ok?: boolean
  error?: boolean
  name?: string
  message?: string
}

const BASE_DIRECTORY = '/SuperMarkdown'

export let client = null as null | ReturnType<typeof createClient>

/**
 * 初始化WebDav
 * 创建根目录
 */
export async function initWebDav() {
  const store = useMainStore()

  client = createClient(store.setting.webDav.url, {
    username: store.setting.webDav.username,
    password: store.setting.webDav.password
  })

  return Promise.allSettled([createDirectoryWithCheck(BASE_DIRECTORY)])
}

export function createDirectoryWithCheck(path: string) {
  return new Promise((resolve) =>
    client!
      .getDirectoryContents(path)
      .then(() => resolve(true))
      .catch((err) => {
        if (err.status === 404) {
          client!
            .createDirectory(path)
            .then(() => resolve(true))
            .catch(() => resolve(false))
        } else resolve(false)
      })
  )
}

/**
 * 心跳检测
 */
export async function heartBeat() {
  return new Promise((resolve) =>
    client!
      .getDirectoryContents('/')
      .then(() => resolve(true))
      .catch(() => resolve(false))
  )
}

/**
 * setItem
 */
export async function setItem(key: string, value: string) {
  return new Promise((resolve, reject) =>
    client!
      .putFileContents(`${BASE_DIRECTORY}/${replaceDocId(key)}`, value)
      .then(() => resolve(true))
      .catch((err) => resolve(err))
  )
}

/**
 * getItem
 */
export async function getItem(key: string) {
  return new Promise((resolve, reject) =>
    client!
      .getFileContents(`${BASE_DIRECTORY}/${replaceDocId(key)}`)
      .then((value) => resolve(value.toString()))
      .catch((err) => resolve(err))
  )
}

/**
 * removeItem
 */
export async function removeItem(key: string) {
  return new Promise((resolve) =>
    client!
      .deleteFile(`${BASE_DIRECTORY}/${replaceDocId(key)}`)
      .then(() => resolve(true))
      .catch((err) => resolve(err))
  )
}

/**
 * postAttachment
 */
export async function postAttachment(docId: string, attachment: Uint8Array, type: string) {
  return new Promise((resolve) => {
    client!
      .putFileContents(`${BASE_DIRECTORY}/${replaceDocId(docId)}`, attachment)
      .then(() =>
        resolve({
          ok: true
        })
      )
      .catch((err) =>
        resolve({
          ok: false,
          name: 'failed',
          error: err
        })
      )
  })
}

/**
 * getAttachment
 */
export async function getAttachment(docId: string) {
  return new Promise((resolve) =>
    client!
      .getFileContents(`${BASE_DIRECTORY}/${replaceDocId(docId)}`)
      .then((value) => resolve(value))
      .catch(() => resolve(null))
  )
}

export async function allDocs(key?: string) {
  return new Promise((resolve, reject) =>
    client!
      .getDirectoryContents(BASE_DIRECTORY)
      // @ts-expect-error
      .then((files: FileStat[]) => {
        const docs = files
          .filter((file) => file.basename.startsWith(replaceDocId(key || '')))
          .map((file) => ({
            _id: replaceDocIdReverse(file.basename),
            _rev: file.lastmod
          }))
        resolve(docs)
      })
      .catch((err) => resolve(err))
  )
}

function replaceDocId(docId: string) {
  return docId.replace('/', '_')
}

function replaceDocIdReverse(docId: string) {
  return docId.replace('_', '/')
}
