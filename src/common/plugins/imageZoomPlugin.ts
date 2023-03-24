import type { BytemdPlugin, BytemdEditorContext, BytemdAction } from 'bytemd'

const IMAGE_ZOOM =
  '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"></rect><rect x="4" y="4" width="40" height="40" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"></rect><path d="M16 4V16H4" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M36 24V36H24" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M36 36L24 24" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 6V26" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 4L27 4" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>'

/**
 * 图片缩放插件
 */
export function imageZoomPlugin(): BytemdPlugin {
  function actionFactory(percent: number): BytemdAction {
    return {
      title: `${percent}%`,
      handler: {
        type: 'action',
        click: (ctx: BytemdEditorContext) => {
          ctx.wrapText(`<img src="" alt="" width="${percent}%" />`)
          ctx.editor.focus()
        }
      }
    }
  }

  return {
    actions: [
      {
        title: '图片缩放',
        icon: IMAGE_ZOOM,
        handler: {
          type: 'dropdown',
          actions: [actionFactory(30), actionFactory(50), actionFactory(70), actionFactory(100)]
        }
      }
    ]
  }
}
