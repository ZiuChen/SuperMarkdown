import type { BytemdPlugin, BytemdEditorContext } from 'bytemd'
import { useImageUpload } from '@/hooks/useImageUpload'

export function pasteImagePlugin(): BytemdPlugin {
  const handleImages = async (
    ctx: BytemdEditorContext,
    e: Event,
    itemList: DataTransferItemList | undefined
  ) => {
    const files = Array.from(itemList ?? [])
      .map((item) => {
        if (item.type.startsWith('image/')) {
          return item.getAsFile()
        }
      })
      .filter((f): f is File => f != null)

    if (files.length) {
      e.preventDefault() // important
      for (const file of files) {
        // 使用 FileReader 读取图片为 base64 并上传
        const reader = new FileReader()
        reader.onload = async (e) => {
          const imageData = e.target?.result as string
          if (imageData) {
            const hash = await useImageUpload(imageData)
            if (hash) {
              // 未聚焦 则聚焦到最后一行
              if (!ctx.editor.hasFocus()) {
                ctx.editor.focus()
                ctx.editor.setCursor({ line: ctx.editor.lineCount(), ch: 0 })
                ctx.appendBlock('')
              }
              ctx.wrapText('![', `](attachment:${hash})`)
            }
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }
  return {
    editorEffect(ctx) {
      ctx.editor.on('drop', async (_, e) => {
        handleImages(ctx, e, e.dataTransfer?.items)
      })
      // @ts-ignore
      ctx.editor.on('paste', async (_, e) => {
        handleImages(ctx, e, e.clipboardData?.items)
      })
    }
  }
}
