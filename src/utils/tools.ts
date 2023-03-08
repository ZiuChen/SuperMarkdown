import { MessageConfig, Message } from '@arco-design/web-vue'
import { isElectron } from '@/utils'

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
