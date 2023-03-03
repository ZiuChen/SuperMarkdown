import { defineStore } from 'pinia'
import { unref } from 'vue'
import { setItem, getItem } from '@/utils'
import { IArticle } from '@/types'

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
    async loadArticle() {
      const article = getItem(this.articleKey)
      if (article) {
        this.$state = article
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
