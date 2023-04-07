import { isElectron } from '@/utils'
import { statSync } from '@/preload'

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

export function copyText(text: string) {
  try {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text) // use navigator.clipboard
    } else {
      var textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      // hide this input area
      textarea.style.position = 'fixed'
      textarea.style.clip = 'rect(0 0 0 0)'
      textarea.style.top = '10px'
      // execute
      textarea.value = text
      textarea.select()
      document.execCommand('copy', true)
      // remove the input area
      document.body.removeChild(textarea)
    }
    return true
  } catch (err) {
    return false
  }
}
