import { RouterView, createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { defineComponent, h } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // component: defineComponent(() => () => h(RouterView)),
      redirect: '/files',
      children: [
        {
          path: 'files/:id?',
          name: 'home',
          props: true,
          component: HomeView
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        }
      ]
    }
  ]
})

export default router
