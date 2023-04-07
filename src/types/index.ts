export interface IArticle {
  id: string
  title: string
  code: string
  lastSavedAt: number
  createAt: number
}

// 运行时接口定义
export interface IArticleRuntimeExtend extends IArticle {
  isEmpty: boolean
  isSource: boolean
  isFeature: boolean
  isReadonly: boolean
}

// 保存在本地的接口定义
export interface IArticleSaveExtend extends IArticle {
  isFeature?: boolean
  isReadonly?: boolean
}
