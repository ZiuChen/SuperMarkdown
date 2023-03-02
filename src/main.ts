import { createApp } from 'vue'
import '@/style/index.less'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')
