import { MessageConfig, Message } from '@arco-design/web-vue'
import { isElectron, getAttachment } from '@/utils'
import { statSync, Buffer } from '@/preload'

// 修改MessageConfig.content为string
export interface ICustomMessageConfig extends MessageConfig {
  content: string
}

export function notification(options: string | ICustomMessageConfig) {
  let _options

  if (typeof options === 'string') {
    _options = {
      id: new Date().getTime() + '',
      content: options
    }
  } else {
    _options = {
      id: new Date().getTime() + '',
      ...options
    }
  }

  if (isElectron) {
    Message.error(_options)
    utools.showNotification(_options.content)
  } else {
    Message.error(_options)
  }
}

export function openLink(url: string) {
  if (isElectron) {
    utools.shellOpenExternal(url)
  } else {
    window.open(url)
  }
}

export function classof(o: any) {
  if (o === null) return 'Null'
  if (o === undefined) return 'Undefined'
  return Object.prototype.toString.call(o).slice(8, -1)
}

export function formatTime(timeStamp: number) {
  // example: 2021年8月12日 08:08:08
  const date = new Date(timeStamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const formatNumber = (n: number) => {
    const sn = n.toString()
    return sn[1] ? sn : '0' + sn
  }

  return `${year}年${formatNumber(month)}月${formatNumber(day)}日 ${formatNumber(
    hour
  )}:${formatNumber(minute)}:${formatNumber(second)}`
}

/**
 * [Electron Only] 计算文件大小
 * @param path 文件路径
 * @returns [size, sizeWithUnit] 代表文件原始大小(Byte)和带单位的文件大小
 */
export function calcFileSize(path: string) {
  if (!isElectron) return [0, '0B']

  const originSize = statSync(path).size
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = originSize
  let unitIndex = 0
  while (size > 1024) {
    size /= 1024
    unitIndex++
  }
  return [originSize, size.toFixed(2) + units[unitIndex]]
}

export function loadImage(docId: string) {
  if (!isElectron) return ''

  const res = getAttachment('attachment/' + docId)
  if (res) return 'data:image/png;base64,' + Buffer.from(res).toString('base64')
  return ''
}
