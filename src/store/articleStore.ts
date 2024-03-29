import { defineStore } from 'pinia'
import { setItem, getItem } from '@/utils'
import { IArticleRuntimeExtend, IArticleSaveExtend } from '@/types'
import { article as defaultArticle } from '@/data/article'

export const useArticleStore = defineStore('ArticleStore', {
  state: () => {
    return {
      // 运行时标识
      isEmpty: true,
      isSource: false, // 是否为源码模式 与isReadonly互斥 不同为true

      // 保存到本地数据的内容
      // 特殊属性标识符
      isFeature: false,
      isReadonly: false,

      // 文章内容相关
      id: '',
      title: '',
      code: '',
      lastSavedAt: 0,
      createAt: 0
    } as IArticleRuntimeExtend
  },
  getters: {
    articleKey: (state) => {
      return 'note/' + state.id
    }
  },
  actions: {
    /**
     * 初始化默认文章
     */
    initArticle() {
      this.$patch(defaultArticle)
      setItem('lastkey', defaultArticle.id)
      this.saveArticle()

      // 更新运行时标识
      this.isEmpty = false
    },
    /**
     * 加载文章或新建文章
     */
    loadArticle(id: string, title?: string) {
      // 从本地存储加载文章
      this.id = id // 先更新id 触发articleKey的更新
      const article = getItem(this.articleKey) // 根据articleKey取到文章

      // 取到文章 直接加载
      if (article) {
        this.$patch(article)
        // 更新运行时标识
        this.isEmpty = false
      } else {
        // 根据id未取到文章
        // 如果传入了title 则为新建的文章 侧栏已经建好了
        if (title) {
          this.$patch({
            id,
            code: '',
            title: title || '', // 新建文章标题在SideBar中确定
            createAt: parseInt(id),
            lastSavedAt: parseInt(id)
          })

          this.saveArticle()

          // 更新运行时标识
          this.isEmpty = false
        } else {
          // 文章被删除后没有选择新的文章，lastKey没有更新
          // 文章不存在 不做任何操作
        }
      }
    },
    async saveArticle(): Promise<boolean> {
      return new Promise((resolve) => {
        const data: IArticleSaveExtend = {
          id: this.id,
          title: this.title,
          code: this.code,
          lastSavedAt: Date.now(),
          createAt: this.createAt
        }

        // 仅在为true时才有键 否则键都不应该存在
        if (this.isFeature) {
          data.isFeature = true
        }
        if (this.isReadonly) {
          data.isReadonly = true
        }

        setItem(this.articleKey, data)
        resolve(true)
      })
    }
  }
})
