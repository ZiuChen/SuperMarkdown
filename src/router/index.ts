import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/editor'
    },
    {
      path: '/home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/editor',
      component: () => import('@/views/Editor.vue')
    }
  ]
})
