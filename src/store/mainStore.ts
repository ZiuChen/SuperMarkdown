import { defineStore } from 'pinia'
import { Editor } from 'bytemd'

export const useMainStore = defineStore('MainStore', {
  state: () => ({
    editor: null as Editor | null,
    attachments: [] as string[]
  })
})
