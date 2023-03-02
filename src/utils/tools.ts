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

export function classof(o: any) {
  if (o === null) return 'Null'
  if (o === undefined) return 'Undefined'
  return Object.prototype.toString.call(o).slice(8, -1)
}
