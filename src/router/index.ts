import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/editor'
    },
    {
      path: '/editor',
      component: () => import('@/views/Editor.vue')
    },
    {
      path: '/setting',
      component: () => import('@/views/Setting.vue')
    }
  ]
})
