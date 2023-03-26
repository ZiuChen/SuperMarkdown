import type { BytemdPlugin } from 'bytemd'
import { screenCapture } from '@/utils'
import { useImageUpload } from '@/hooks/useImageUpload'

/**
 * 屏幕截图插件
 */
export function screenShotPlugin(): BytemdPlugin {
  return {
    actions: [
      {
        title: '截取屏幕',
        icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-scissor" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" filter="" data-v-249840b0="" style="font-size: 32px;"><path d="m40.293 7.707-23.05 23.05m0 0a6 6 0 1 0-8.485 8.485 6 6 0 0 0 8.485-8.485Zm13.514 0a6 6 0 1 0 8.485 8.485 6 6 0 0 0-8.485-8.485Zm0 0L7.707 7.707"></path></svg>',
        handler: {
          type: 'action',
          click: (ctx) => {
            screenCapture()
              .then((base64Str) => {
                if (base64Str) return useImageUpload(base64Str)
                return Promise.resolve('')
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
