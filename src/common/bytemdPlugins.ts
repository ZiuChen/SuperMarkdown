import type { BytemdPlugin, BytemdEditorContext, BytemdAction } from 'bytemd'

const ALIGN_CENTER =
  '<svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g><rect width="48" height="48" fill="white" fill-opacity="0.01" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" stroke="none" fill-rule="evenodd"></rect><g transform="translate(6.000000, 8.000000)"><path d="M30,11 L6,11" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" stroke="#333" fill="none" fill-rule="evenodd"></path><path d="M36,1 L0,1" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" stroke="#333" fill="none" fill-rule="evenodd"></path><path d="M36,21 L0,21" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" stroke="#333" fill="none" fill-rule="evenodd"></path><path d="M30,31 L6,31" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" stroke="#333" fill="none" fill-rule="evenodd"></path></g></g></svg>'
const ALIGN_LEFT =
  '<svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g><rect width="48" height="48" fill="white" fill-opacity="0.01" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" stroke="none" fill-rule="evenodd"></rect><g transform="translate(6.000000, 8.000000)"><path d="M36,1 L3.55271368e-15,1" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" stroke="#333" fill="none" fill-rule="evenodd"></path><path d="M28,11 L5.32907052e-15,11" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" stroke="#333" fill="none" fill-rule="evenodd"></path><path d="M36,21 L0,21" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" stroke="#333" fill="none" fill-rule="evenodd"></path><path d="M28,31 L5.32907052e-15,31" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" stroke="#333" fill="none" fill-rule="evenodd"></path></g></g></svg>'
const ALIGN_RIGHT =
  '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"></rect><path d="M42 9H6" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M42 19H14" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M42 29H6" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M42 39H14" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>'

/**
 * 对齐方式插件
 */
export function alignPlugin(): BytemdPlugin {
  return {
    actions: [
      {
        title: '对齐方式',
        icon: ALIGN_CENTER,
        handler: {
          type: 'dropdown',
          actions: [
            {
              title: '左对齐',
              icon: ALIGN_LEFT,
              handler: {
                type: 'action',
                click: (ctx) => {
                  ctx.wrapText('<p align="left">', '</p>')
                  ctx.editor.focus()
                }
              }
            },
            {
              title: '居中对齐',
              icon: ALIGN_CENTER,
              handler: {
                type: 'action',
                click: (ctx) => {
                  ctx.wrapText('<p align="center">', '</p>')
                  ctx.editor.focus()
                }
              }
            },
            {
              title: '右对齐',
              icon: ALIGN_RIGHT,
              handler: {
                type: 'action',
                click: (ctx) => {
                  ctx.wrapText('<p align="right">', '</p>')
                  ctx.editor.focus()
                }
              }
            }
          ]
        }
      }
    ]
  }
}

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
