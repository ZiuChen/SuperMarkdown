import type { BytemdPlugin } from 'bytemd'
import { useFileSelect } from '@/hooks/useFileSelect'
import { useImageUpload } from '@/hooks/useImageUpload'
import { readFileSync } from '@/preload'

/**
 * 图片上传插件
 */
export function imageUploadPlugin(): BytemdPlugin {
  return {
    actions: [
      {
        title: '上传图片',
        icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-file-image" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" filter="" data-v-249840b0="" style="font-size: 32px;"><path d="m26 33 5-6v6h-5Zm0 0-3-4-4 4h7Zm11 9H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h21l7 7v27a2 2 0 0 1-2 2ZM17 19h1v1h-1v-1Z"></path></svg>',
        handler: {
          type: 'action',
          click: (ctx) => {
            // 触发文件选择框
            useFileSelect()
              .then((filePath) => {
                // 从本地读取文件为 Buffer 执行上传
                const imgBuffer = readFileSync(filePath)
                return useImageUpload(imgBuffer)
              })
              .then((hash) => {
                if (hash) {
                  // 未聚焦 则聚焦到最后一行
                  if (!ctx.editor.hasFocus()) {
                    ctx.editor.focus()
                    ctx.editor.setCursor({ line: ctx.editor.lineCount(), ch: 0 })
                    ctx.appendBlock('')
                  }

                  ctx.wrapText('![', `](attachment:${hash})`)
                }
              })
          }
        }
      }
    ]
  }
}
