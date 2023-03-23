import { defineStore } from 'pinia'

export const useMainStore = defineStore('MainStore', {
  state: () => ({
    editor: null,
    attachments: [] as string[]
  })
})
