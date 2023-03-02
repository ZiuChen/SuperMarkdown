import { defineStore } from 'pinia'
import { setItem, getItem } from '@/utils'

export const useArticleStore = defineStore('ArticleStore', {
  state: () => ({
    title: '',
    code: '',
    lastSaved: 0
  }),
  actions: {
    async saveArticle() {}
  }
})
