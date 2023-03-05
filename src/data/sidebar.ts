export interface SidebarItem {
  title: string
  key: string
  children?: SidebarItem[]
}

export const sidebar: SidebarItem[] = [
  {
    title: '默认分类',
    key: '1677900764968',
    children: [
      {
        title: '你好，超级Markdown！',
        key: '1677900764969'
      }
    ]
  }
]
