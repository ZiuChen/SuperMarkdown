import { createApp } from 'vue'
import '@/style/index.less'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { registerIcon } from '@/common/registerIcon'
import { registerCallback } from '@/common/registerCallback'
import { isElectron } from './utils'

try {
  createApp(App).use(router).use(createPinia()).use(registerIcon).mount('#app')
  registerCallback()
} catch (error) {
  if (isElectron) utools.showNotification('初始化失败: ' + error)
}
