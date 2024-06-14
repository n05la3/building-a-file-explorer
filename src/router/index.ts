import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'home' },
      children: [
        {
          path: 'files/:id?',
          name: 'home',
          props: true,
          component: () => import('../views/file-explorer.vue')
        }
      ]
    }
  ]
})

export default router
