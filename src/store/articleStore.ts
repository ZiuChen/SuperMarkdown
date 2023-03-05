import { defineStore } from 'pinia'
import { unref } from 'vue'
import { setItem, getItem } from '@/utils'
import { IArticle } from '@/types'
import { article as defaultArticle } from '@/data/article'

export const useArticleStore = defineStore('ArticleStore', {
  state: () => {
    return {
      id: '',
      title: '',
      code: '',
      lastSavedAt: 0,
      createAt: 0
    } as IArticle
  },
  getters: {
    articleKey: (state) => {
      return 'note/' + state.id
    }
  },
  actions: {
    async loadArticle(id: string, title?: string) {
      console.log('loadArticle', id)
      // 初始化默认文章
      if (id === '') {
        this.$state = defaultArticle
        setItem('lastkey', defaultArticle.id)
        this.saveArticle()
      } else {
        // 从本地存储加载文章
        const article = getItem(this.articleKey)

        // 取到文章 直接加载
        if (article) {
          this.$state = article
        } else {
          // 未取到文章 证明是新创建的
          this.$state = {
            code: '',
            title: title || '', // 新建文章标题在SideBar中确定
            id: id,
            createAt: parseInt(id),
            lastSavedAt: parseInt(id)
          }
          this.saveArticle()
        }
      }
    },
    async saveArticle(): Promise<boolean> {
      return new Promise((resolve) => {
        setItem(this.articleKey, unref(this.$state))
        resolve(true)
        console.log('saveArticle', this.articleKey, unref(this.$state))
      })
    }
  }
})
