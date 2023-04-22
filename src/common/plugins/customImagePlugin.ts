import type { BytemdPlugin } from 'bytemd'
import { loadImage } from '@/utils'
import { visit } from 'unist-util-visit'

/**
 * 自定义解析图片链接插件
 */
export function customImagePlugin(): BytemdPlugin {
  const markdownImages: any[] = []
  const imageCache: Record<string, string> = {}
  return {
    remark: (processor) => {
      // @ts-ignore
      return processor.use(() => (tree, file) => {
        // 递归遍历所有节点 筛选出图片节点
        // 先清空 再重新添加
        markdownImages.length = 0
        visit(tree, (node) => {
          if (node.type === 'image') {
            markdownImages.push(node)
          }
        })
      })
    },
    rehype(processor) {
      // @ts-ignore
      return processor.use(() => (tree, file) => {
        // 将 MD AST 中的图片与 HTML AST 中的图片节点一一对应
        // 通过 attachmentId 获取图片数据 并替换 img 节点的 src
        let count = 0
        visit(tree, (node) => {
          if (node.type === 'element' && node.tagName === 'img') {
            const image = markdownImages[count]
            // 处理自定义图片
            if (image && image.url.startsWith('attachment:')) {
              const attachmentId = image.url.split(':')[1]
              const imageData = imageCache[attachmentId] || loadImage(attachmentId)
              imageCache[attachmentId] = imageData
              node.properties.src = imageData
            }
            // 处理Base64图片
            if (image && image.url.startsWith('data:image')) {
              node.properties.src = image.url
            }
            count++
          }
        })
      })
    }
  }
}
