import type { BytemdPlugin, BytemdEditorContext, BytemdAction } from 'bytemd'
import { IHighlightInfo } from './types'
import { getDOM, setStyle } from './utils'
import highlights from '@/data/highlights.json'

type THighlightKey = keyof typeof highlights

/**
 * 切换代码高亮主题插件
 */
export function highlightThemePlugin(): BytemdPlugin {
  const highlightList = Object.keys(highlights) as THighlightKey[]
  const STYLE_ID = 'highlight-theme'
  const DEFAULT_HIGHLIGHT = highlightList[0]

  const highlightInfo: IHighlightInfo = {
    highlight: '' as THighlightKey,
    status: 0,
    position: {
      start: {
        line: 0,
        column: 0,
        offset: 0
      },
      end: {
        line: 0,
        column: 0,
        offset: 0
      }
    }
  }

  const setHighlightStyle = (id: string) => setStyle.bind(null, getDOM(id))

  function highlightActionFactory(highlight: THighlightKey): BytemdAction {
    return {
      title: highlight,
      handler: {
        type: 'action',
        click: ({ editor }: BytemdEditorContext) => {
          const v = editor.getValue()
          const { start, end } = highlightInfo.position
          const frontmatter = v.slice(start.offset, end.offset)

          // 无 frontmatter
          if (highlightInfo.status === 0) {
            const newFrontmatter = `---\nhighlight: ${highlight}\n---\n`
            editor.setValue(newFrontmatter + v)
          }

          // 有 frontmatter 但是没有 highlight 字段
          if (highlightInfo.status === 1) {
            const newFrontmatter = frontmatter.replace('---', `---\nhighlight: ${highlight}`)
            editor.setValue(v.replace(frontmatter, newFrontmatter))
          }

          // 有 frontmatter 有 highlight 字段
          if (highlightInfo.status === 2) {
            const newFrontmatter = frontmatter.replace(highlightInfo.highlight, highlight)
            editor.setValue(v.replace(frontmatter, newFrontmatter))
          }

          editor.focus()
        }
      }
    }
  }

  return {
    actions: [
      {
        title: '代码高亮主题',
        icon: '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"></rect><path d="M6 44L6 25H12V17H36V25H42V44H6Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"></path><path d="M17 17V8L31 4V17" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        handler: {
          type: 'dropdown',
          actions: [...highlightList.map((highlight) => highlightActionFactory(highlight))]
        }
      }
    ],
    remark(processor) {
      // 由 frontmatter 插件解析 frontmatter
      // @ts-ignore
      return processor.use(() => (tree, file) => {
        // 当前未添加 frontmatter 块 则直接返回 使用默认主题
        if (!file.frontmatter) {
          setHighlightStyle(STYLE_ID)(highlights[DEFAULT_HIGHLIGHT])
          highlightInfo.status = 0
          return
        }

        // 获取 frontmatter 块的位置并保存到全局变量中
        const { start, end } = tree.children[0].position
        highlightInfo.position = { start, end }

        const { highlight } = file.frontmatter as {
          highlight?: THighlightKey
        }

        // 有 frontmatter 块但是没有 theme 字段 则使用默认主题
        if (!highlight) {
          setHighlightStyle(STYLE_ID)(highlights[DEFAULT_HIGHLIGHT])
          highlightInfo.status = 1
          return
        }

        // 有 theme 字段 则设置主题样式
        if (highlightList.includes(highlight)) {
          setHighlightStyle(STYLE_ID)(highlights[highlight])
          highlightInfo.highlight = highlight
          highlightInfo.status = 2
        }
      })
    }
  }
}
