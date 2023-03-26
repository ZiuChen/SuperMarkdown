import type { BytemdPlugin } from 'bytemd'
import { useImageUpload } from '@/hooks/useImageUpload'

/**
 * 图片上传插件
 */
export function imageUploadPlugin(): BytemdPlugin {
  return {
    actions: [
      {
        title: '上传图片',
        icon: '📷',
        handler: {
          type: 'action',
          click: () => {
            useImageUpload()
          }
        }
      }
    ]
  }
}
