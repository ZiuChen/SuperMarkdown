import { Message } from '@arco-design/web-vue'
import { isElectron, postAttachment } from '@/utils'
import { resolve, createHash, Buffer } from '@/preload'

export async function useImageUpload(imageData: string | Uint8Array) {
  if (!isElectron) {
    Message.warning('当前环境暂不支持上传图片 可以引用外站图片')
    return Promise.resolve('')
  }

  return new Promise<Uint8Array>((resolve) => {
    if (typeof imageData === 'string') {
      // 将base64转为buffer
      const base64 = imageData.split(',')[1]
      resolve(Buffer.from(base64, 'base64'))
    }
    resolve(Buffer.from(imageData))
  })
    .then((buffer) => {
      // 计算文件哈希
      const hash = createHash('md5').update(buffer).digest('hex')

      const res = postAttachment(`attachment/${hash}`, buffer, 'image/png')

      if (!res) throw new Error('上传图片出错')

      // 重复图片 直接读取并返回
      if (res.error && res.name === 'conflict') {
        return hash
      }

      // 上传成功 读取图片
      if (res.ok) return hash
      else {
        resolve('')
        throw new Error(res.name || '')
      }
    })
    .catch((err) => {
      Message.error('上传图片出错' + err)
    })
}
