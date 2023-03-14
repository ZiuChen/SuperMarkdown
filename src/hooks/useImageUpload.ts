import { useMainStore } from '@/store'
import { showOpenDialog } from '@/utils'
import { Message } from '@arco-design/web-vue'
import { isElectron, calcFileSize, postAttachment, getAttachment } from '@/utils'
import { resolve, readFileSync, createHash, Buffer } from '@/preload'

export function useImageUpload() {
  if (!isElectron) return Message.warning('当前环境暂不支持上传图片 可以引用外站图片')

  const store = useMainStore()

  return showOpenDialog({
    filters: [{ name: '', extensions: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg', 'ico'] }]
  })
    .then((files) => {
      // 文件选择完毕 预检查
      if (!files) throw new Error('未选择图片')
      if (files.length > 1) throw new Error('每次只能选择一张图片')

      const filePath = resolve(files[0] as string)
      const [size] = calcFileSize(filePath)

      // 读取文件 计算文件哈希 将hash作为docId
      const MAX_SIZE = 10 * 1024 * 1024 // 10M
      if (size > MAX_SIZE) throw new Error(`图片大小不能超过10M`)

      return filePath
    })
    .then((filePath) => {
      // 读取、上传图片
      const imgBuffer = readFileSync(filePath)
      const hash = createHash('md5').update(imgBuffer).digest('hex')

      const res = postAttachment(`attachment/${hash}`, imgBuffer, 'image/png')

      if (!res) throw new Error('图片上传出错')

      // 重复图片 直接读取并返回
      if (res.error && res.name === 'conflict') {
        return hash
      }

      // 上传成功 读取图片
      if (res.ok) return hash

      // 上传失败
      if (!res.ok) throw new Error('图片上传出错: ' + res.name || '')
    })
    .then((hash) => {
      // 插入图片 预览渲染由自定义渲染器完成
      store.editor!.focus()
      store.editor!.insertValue(`![](attachment/${hash})`, false)

      // Uint8Array => base64
      const data = getAttachment(`attachment/${hash}`)
      if (!data) throw new Error('图片读取失败')

      const imgData = `data:image/png;base64,${Buffer.from(data).toString('base64')}`

      return imgData
    })
    .catch((err) => {
      Message.error(err)
    })
}
