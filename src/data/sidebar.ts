export interface SidebarItem {
  title: string
  key: string
  children?: SidebarItem[]
}
import { article } from './article'

export const sidebar: SidebarItem[] = [
  {
    title: '默认分类',
    key: String(article.createAt - 1),
    children: [
      {
        title: '你好，超级Markdown！',
        key: String(article.createAt)
      }
    ]
  }
]
