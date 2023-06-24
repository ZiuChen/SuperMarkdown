import type { BytemdPlugin } from 'bytemd'
import { Message } from '@arco-design/web-vue'
import { useArticleStore } from '@/store'
import { markdownImages, imageCache } from './instance'
import { Buffer, resolve, mkdirSync, writeFileSync } from '@/preload'
import { isElectron } from '@/utils'

export function exportPlugin(): BytemdPlugin {
  const store = useArticleStore()
  return {
    actions: [
      {
        title: '导出',
        icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-export" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" filter="" data-v-249840b0="" style="font-size: 32px;"><path d="M31.928 33.072 41 24.002l-9.072-9.072M16.858 24h24M31 41H7V7h24"></path></svg>',
        position: 'right',
        handler: {
          type: 'dropdown',
          actions: [
            {
              title: '导出为 Markdown',
              icon: '',
              handler: {
                type: 'action',
                click: ({ editor }) => {
                  const title = store.title
                  const data = editor.getValue()

                  // 浏览器环境的图片为链接/base64 直接内联即可
                  // Electron则为attachment开头的哈希索引 需要从缓存中保存到本地
                  if (!isElectron) {
                    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `${title}.md`
                    link.click()
                    return
                  }

                  // 为文章创建新的文件夹
                  const folder = resolve(utools.getPath('downloads'), title)
                  const file = resolve(folder, `${title}.md`)
                  try {
                    mkdirSync(folder)
                  } catch (error) {
                    Message.error('导出失败: ' + error)
                    utools.shellShowItemInFolder(file)
                  }

                  // 将内联的图片保存到本地
                  for (const { url } of markdownImages) {
                    const hash = url.split(':').pop()
                    const base64 = imageCache[hash] || ''
                    if (base64) {
                      const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
                      const fileType = (matches && matches[1]) || '' // 文件类型，例如 "image/png"
                      const fileData = (matches && matches[2]) || '' // 文件数据部分
                      const buffer = Buffer.from(fileData, 'base64')
                      writeFileSync(resolve(folder, `${hash}.${fileType.split('/').pop()}`), buffer)
                    }
                  }

                  // 替换MD文档中的图片路径为相对路径
                  const dataWithRelativePath = data.replace(
                    /\!\[(.*?)\]\(attachment:(.*?)\)/g,
                    '![$1]($2.png)'
                  )

                  // 保存到本地
                  writeFileSync(file, dataWithRelativePath)

                  // 定位到目标文件
                  utools.shellShowItemInFolder(file)
                }
              }
            }
          ]
        }
      }
    ]
  }
}
