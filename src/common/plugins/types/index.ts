interface IPosition {
  line: number
  column: number
  offset: number
}

interface IBlockPosition {
  start: IPosition
  end: IPosition
}

interface IBasicInfo {
  status: 0 | 1 | 2 // 0: 无 frontmatter 1: 有 frontmatter 无 theme 字段 2: 有 frontmatter 有 theme 字段
  position: IBlockPosition
}

export interface IThemeInfo extends IBasicInfo {
  theme: string
}

export interface IHighlightInfo extends IBasicInfo {
  highlight: string
}
