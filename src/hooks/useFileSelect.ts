import { showOpenDialog } from '@/utils'
import { calcFileSize } from '@/utils'
import { resolve } from '@/preload'
import { Message } from '@arco-design/web-vue'

export async function useFileSelect(): Promise<string> {
  return showOpenDialog({
    filters: [{ name: '', extensions: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg', 'ico'] }]
  })
    .then((files) => {
      // 文件选择完毕 预检查
      if (!files) return ''
      if (files.length > 1) throw new Error('每次只能选择一张图片')

      const filePath = resolve(files[0] as string)
      const [size] = calcFileSize(filePath)

      // 读取文件 计算文件哈希 将hash作为docId
      const MAX_SIZE = 10 * 1024 * 1024 // 10M
      if (size > MAX_SIZE) throw new Error(`图片大小不能超过10M`)

      return filePath
    })
    .catch((err) => {
      Message.error('文件选择出错' + err)
      return ''
    })
}
