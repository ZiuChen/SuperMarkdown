import { defineStore } from 'pinia'

export interface State {
  isReady: boolean
  setting: Setting
}

export interface Setting {
  /**
   * 图片数据请求来源
   * 浏览器环境: 仅支持 webdav
   * electron环境: utools | webdav
   */
  imageSource: 'utools' | 'webdav'
  /**
   * WebDav配置
   */
  webDav: {
    enable: boolean
    url: string
    username?: string
    password?: string
  }
}

export const useMainStore = defineStore('MainStore', {
  state: () =>
    ({
      isReady: false, // 编辑器是否初始化完成
      setting: {
        imageSource: 'utools',
        webDav: {
          enable: true,
          url: '', // TODO: debugging
          username: '',
          password: ''
        }
      }
    } as State)
})
