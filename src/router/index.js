import { createRouter, createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    redirect: '/argument'
  },
  {
    path: '/argument',
    name: 'argument',
    component: () => import('../views/argumentView.vue')
  },
  {
    path: '/info',
    name: 'info',
    component: () => import('../views/argument/infoView.vue')
  },
  {
    path: '/noopsyche',
    name: 'noopsyche',
    component: () => import('../views/noopsycheView.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
