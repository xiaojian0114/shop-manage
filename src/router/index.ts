import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      redirect: '/dashboard',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { title: '数据统计' }
        },
        {
          path: 'users',
          name: 'Users',
          component: () => import('@/views/Users.vue'),
          meta: { title: '用户管理' }
        },
        {
          path: 'shops',
          name: 'Shops',
          component: () => import('@/views/Shops.vue'),
          meta: { title: '店铺管理' }
        },
        {
          path: 'products',
          name: 'Products',
          component: () => import('@/views/Products.vue'),
          meta: { title: '商品管理' }
        },
        {
          path: 'orders',
          name: 'Orders',
          component: () => import('@/views/Orders.vue'),
          meta: { title: '订单管理' }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth === false) {
    // 登录页，如果已登录则跳转到首页
    if (token) {
      next('/')
    } else {
      next()
    }
  } else {
    // 需要认证的页面
    if (token) {
      if (!userStore.userInfo) {
        userStore.initUserInfo()
      }
      next()
    } else {
      next('/login')
    }
  }
})

export default router
