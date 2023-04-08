import { defineStore } from 'pinia'

export const useMainStore = defineStore('MainStore', {
  state: () => ({
    isReady: false // 编辑器是否初始化完成
  })
})
