import type { BytemdPlugin, BytemdEditorContext, BytemdAction } from 'bytemd'

import themes from '@/data/themes.json'

const THEME_STYLE_ID = 'markdown-theme' // 主题 style 标签的 id
const themeList = Object.keys(themes) // 可用的所有主题列表
const DEFAULT_THEME = themeList[0] // 默认主题
const THEME =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2H2.66667C2.29848 2 2 2.29848 2 2.66667V6C2 6.36819 2.29848 6.66667 2.66667 6.66667H6C6.36819 6.66667 6.66667 6.36819 6.66667 6V2.66667C6.66667 2.29848 6.36819 2 6 2Z" stroke="#1D2129" stroke-width="1.33" stroke-linejoin="round"></path><path d="M6 9.3335H2.66667C2.29848 9.3335 2 9.63197 2 10.0002V13.3335C2 13.7017 2.29848 14.0002 2.66667 14.0002H6C6.36819 14.0002 6.66667 13.7017 6.66667 13.3335V10.0002C6.66667 9.63197 6.36819 9.3335 6 9.3335Z" stroke="#1D2129" stroke-width="1.33" stroke-linejoin="round"></path><path d="M13.3334 2H10C9.63185 2 9.33337 2.29848 9.33337 2.66667V6C9.33337 6.36819 9.63185 6.66667 10 6.66667H13.3334C13.7016 6.66667 14 6.36819 14 6V2.66667C14 2.29848 13.7016 2 13.3334 2Z" stroke="#1D2129" stroke-width="1.33" stroke-linejoin="round"></path><path d="M13.3334 9.3335H10C9.63185 9.3335 9.33337 9.63197 9.33337 10.0002V13.3335C9.33337 13.7017 9.63185 14.0002 10 14.0002H13.3334C13.7016 14.0002 14 13.7017 14 13.3335V10.0002C14 9.63197 13.7016 9.3335 13.3334 9.3335Z" stroke="#1D2129" stroke-width="1.33" stroke-linejoin="round"></path></svg>'

/**
 * 切换 Markdown 主题插件
 */
export function themePlugin(): BytemdPlugin {
  interface IPosition {
    line: number
    column: number
    offset: number
  }

  interface IBlockPosition {
    start: IPosition
    end: IPosition
  }

  interface IThemeInfo {
    theme: string
    position: IBlockPosition
  }

  const themeInfo: IThemeInfo = {
    theme: '',
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

  /**
   * 设置主题样式
   */
  function setThemeStyle(theme: string) {
    // @ts-ignore
    const style = themes[theme]?.style || null
    if (!style) return

    const d = document.querySelector(`#${THEME_STYLE_ID}`)
    if (d) d.remove()

    const s = document.createElement('style')
    s.id = THEME_STYLE_ID
    s.innerHTML = style
    document.head.appendChild(s)
  }

  function themeActionFactory(theme: string): BytemdAction {
    return {
      title: theme,
      handler: {
        type: 'action',
        click: ({ editor }: BytemdEditorContext) => {
          if (!themeInfo.theme) {
            // 当前主题为空 证明没有 frontmatter.theme
            // 插入 frontmatter.theme
            const v = editor.getValue()
            const { start, end } = themeInfo.position
            const frontmatter = v.slice(start.offset, end.offset)
            const newFrontmatter = frontmatter.replace('---', `---\ntheme: ${theme}`)
            editor.setValue(v.replace(frontmatter, newFrontmatter))
          } else {
            // 当前主题不为空 证明有 frontmatter
            // 修改 frontmatter 中的 theme 字段
            const v = editor.getValue()
            const { start, end } = themeInfo.position
            const frontmatter = v.slice(start.offset, end.offset)
            const newFrontmatter = frontmatter.replace(themeInfo.theme, theme)
            editor.setValue(v.replace(frontmatter, newFrontmatter))
          }

          themeInfo.theme = theme
          setThemeStyle(theme)
          editor.focus()
        }
      }
    }
  }

  return {
    actions: [
      {
        title: 'Markdown主题',
        icon: THEME,
        handler: {
          type: 'dropdown',
          actions: [...themeList.map((theme) => themeActionFactory(theme))]
        }
      }
    ],
    /**
     * 从 frontmatter 中获取主题信息 并设置主题样式
     */
    remark(processor) {
      // 由 frontmatter 插件解析 frontmatter
      // 读取 theme 字段并设置主题样式
      // @ts-ignore
      return processor.use(() => (tree, file) => {
        if (!file) return
        // 获取 frontmatter 块的位置并保存到全局变量中
        const { start, end } = tree.children[0].position
        themeInfo.position = { start, end }

        // 获取 frontmatter 中的 theme 字段
        // 没获取到 则使用默认主题
        if (!file?.frontmatter?.theme) return setThemeStyle(DEFAULT_THEME)

        const { theme } = file.frontmatter

        setThemeStyle(theme)
        themeInfo.theme = theme
      })
    }
  }
}
