import type { BytemdPlugin, BytemdEditorContext, BytemdAction } from 'bytemd'
import { IThemeInfo } from './types'
import { getDOM, setStyle } from './utils'
import themes from '@/data/themes.json'

type TThemeKey = keyof typeof themes

/**
 * 切换 Markdown 主题插件
 */
export function themePlugin(): BytemdPlugin {
  const themeList = Object.keys(themes) as TThemeKey[]
  const STYLE_ID = 'markdown-theme'
  const DEFAULT_THEME = themeList[0] // 默认主题

  const themeInfo: IThemeInfo = {
    theme: '' as TThemeKey,
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

  const setThemeStyle = (id: string) => setStyle.bind(null, getDOM(id))

  function themeActionFactory(theme: TThemeKey): BytemdAction {
    return {
      title: theme,
      handler: {
        type: 'action',
        click: ({ editor }: BytemdEditorContext) => {
          const v = editor.getValue()
          const { start, end } = themeInfo.position
          const frontmatter = v.slice(start.offset, end.offset)

          // 无 frontmatter
          if (themeInfo.status === 0) {
            const newFrontmatter = `---\ntheme: ${theme}\n---\n`
            editor.setValue(newFrontmatter + v)
          }

          // 有 frontmatter 但是没有 theme 字段
          if (themeInfo.status === 1) {
            const newFrontmatter = frontmatter.replace('---', `---\ntheme: ${theme}`)
            editor.setValue(v.replace(frontmatter, newFrontmatter))
          }

          // 有 frontmatter 有 theme 字段
          if (themeInfo.status === 2) {
            const newFrontmatter = frontmatter.replace(themeInfo.theme, theme)
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
        title: 'Markdown主题',
        icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2H2.66667C2.29848 2 2 2.29848 2 2.66667V6C2 6.36819 2.29848 6.66667 2.66667 6.66667H6C6.36819 6.66667 6.66667 6.36819 6.66667 6V2.66667C6.66667 2.29848 6.36819 2 6 2Z" stroke="#1D2129" stroke-width="1.33" stroke-linejoin="round"></path><path d="M6 9.3335H2.66667C2.29848 9.3335 2 9.63197 2 10.0002V13.3335C2 13.7017 2.29848 14.0002 2.66667 14.0002H6C6.36819 14.0002 6.66667 13.7017 6.66667 13.3335V10.0002C6.66667 9.63197 6.36819 9.3335 6 9.3335Z" stroke="#1D2129" stroke-width="1.33" stroke-linejoin="round"></path><path d="M13.3334 2H10C9.63185 2 9.33337 2.29848 9.33337 2.66667V6C9.33337 6.36819 9.63185 6.66667 10 6.66667H13.3334C13.7016 6.66667 14 6.36819 14 6V2.66667C14 2.29848 13.7016 2 13.3334 2Z" stroke="#1D2129" stroke-width="1.33" stroke-linejoin="round"></path><path d="M13.3334 9.3335H10C9.63185 9.3335 9.33337 9.63197 9.33337 10.0002V13.3335C9.33337 13.7017 9.63185 14.0002 10 14.0002H13.3334C13.7016 14.0002 14 13.7017 14 13.3335V10.0002C14 9.63197 13.7016 9.3335 13.3334 9.3335Z" stroke="#1D2129" stroke-width="1.33" stroke-linejoin="round"></path></svg>',
        handler: {
          type: 'dropdown',
          actions: [...themeList.map((theme) => themeActionFactory(theme))]
        }
      }
    ],
    remark(processor) {
      // 由 frontmatter 插件解析 frontmatter
      // @ts-ignore
      return processor.use(() => (tree, file) => {
        // 当前未添加 frontmatter 块 则直接返回 使用默认主题
        if (!file.frontmatter) {
          setThemeStyle(STYLE_ID)(themes[DEFAULT_THEME].style)
          themeInfo.status = 0
          return
        }

        // 获取 frontmatter 块的位置并保存到全局变量中
        const { start, end } = tree.children[0].position
        themeInfo.position = { start, end }

        const { theme } = file.frontmatter as {
          theme?: TThemeKey
        }

        // 有 frontmatter 块但是没有 theme 字段 则使用默认主题
        if (!theme) {
          setThemeStyle(STYLE_ID)(themes[DEFAULT_THEME].style)
          themeInfo.status = 1
          return
        }

        // 有 theme 字段 则设置主题样式
        if (themeList.includes(theme)) {
          setThemeStyle(STYLE_ID)(themes[theme].style)
          themeInfo.theme = theme
          themeInfo.status = 2
        }
      })
    }
  }
}
