import { isElectron } from '@/utils'
import { Message } from '@arco-design/web-vue'

type TPostAttachment = Parameters<typeof utools.db.postAttachment>
type TGetAttachment = Parameters<typeof utools.db.getAttachment>
export interface DbDoc {
  _id: string
  _rev?: string
  [key: string]: any
}

export function setItem(key: string, value: any) {
  const data = JSON.stringify(value)

  if (isElectron) {
    return utools.dbStorage.setItem(key, data)
  } else {
    localStorage.setItem(key, data)
  }
}

export function getItem(key: string) {
  if (isElectron) {
    const data = utools.dbStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } else {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
}

export function removeItem(key: string) {
  const dbStorage = isElectron ? utools.dbStorage : localStorage
  dbStorage.removeItem(key)
}

export function putDoc(doc: DbDoc) {
  if (!isElectron) {
    Message.error('当前环境暂不支持此功能')
    return
  }
  return utools.db.put(doc)
}

export function getDoc(docId: string) {
  if (!isElectron) {
    Message.error('当前环境暂不支持此功能')
    return
  }
  return utools.db.get(docId)
}

export function removeDoc(doc: DbDoc | string) {
  if (!isElectron) {
    Message.error('当前环境暂不支持此功能')
    return
  }
  return utools.db.remove(doc)
}

export function allDocs(key?: string) {
  if (!isElectron) {
    Message.error('当前环境暂不支持此功能')
    return
  }
  return utools.db.allDocs(key)
}

export function postAttachment(...args: TPostAttachment) {
  if (!isElectron) {
    Message.error('当前环境暂不支持此功能')
    return
  }
  return utools.db.postAttachment(...args)
}

export function getAttachment(...args: TGetAttachment) {
  if (!isElectron) {
    Message.error('当前环境暂不支持此功能')
    return
  }
  return utools.db.getAttachment(...args)
}
