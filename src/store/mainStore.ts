import { defineStore } from 'pinia'

export const useMainStore = defineStore('MainStore', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})
