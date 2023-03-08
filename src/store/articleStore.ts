import { defineStore } from 'pinia'
import { setItem, getItem } from '@/utils'
import { IArticle } from '@/types'
import { article as defaultArticle } from '@/data/article'

interface IArticleExtend extends IArticle {
  isEmpty: boolean
}

export const useArticleStore = defineStore('ArticleStore', {
  state: () => {
    return {
      // 运行时标识
      isEmpty: true,

      // 保存到本地数据的内容
      id: '',
      title: '',
      code: '',
      lastSavedAt: 0,
      createAt: 0
    } as IArticleExtend
  },
  getters: {
    articleKey: (state) => {
      return 'note/' + state.id
    }
  },
  actions: {
    async loadArticle(id: string, title?: string) {
      // 初始化默认文章
      if (id === '') {
        this.$patch(defaultArticle)
        setItem('lastkey', defaultArticle.id)
        this.saveArticle()
      } else {
        // 从本地存储加载文章
        this.id = id // 先更新id 触发articleKey的更新
        const article = getItem(this.articleKey) // 根据articleKey取到文章

        // 取到文章 直接加载
        if (article) {
          this.$patch(article)
        } else {
          // 未取到文章 证明是新创建的
          this.$patch({
            id,
            code: '',
            title: title || '', // 新建文章标题在SideBar中确定
            createAt: parseInt(id),
            lastSavedAt: parseInt(id)
          })
          this.saveArticle()
        }
      }

      // 更新运行时标识
      this.isEmpty = false
    },
    async saveArticle(): Promise<boolean> {
      return new Promise((resolve) => {
        setItem(this.articleKey, {
          id: this.id,
          title: this.title,
          code: this.code,
          lastSavedAt: Date.now(),
          createAt: this.createAt
        })
        resolve(true)
      })
    }
  }
})
