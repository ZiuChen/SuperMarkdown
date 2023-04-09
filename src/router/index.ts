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
    },
    {
      path: '/user',
      component: () => import('@/views/User.vue')
    },
    {
      path: '/about',
      component: () => import('@/views/About.vue')
    }
  ]
})
