import { defineStore } from 'pinia'
import Vditor from 'vditor'

export const useMainStore = defineStore('MainStore', {
  state: () => ({
    editor: null as Vditor | null,
    attachments: [] as string[]
  })
})
