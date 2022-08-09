import router from './router'
import store from './store'

import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const NouFound = '/404'
const loginPath = '/login'
const whiteList = [NouFound, loginPath]

// 前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const token = store.getters.token
  if (token) {
    if (!store.getters.userId) {
      const res = await store.dispatch('user/getUserInfo')
      // console.log(res.roles.menus)
      const routes = await store.dispatch('permission/filterRoutes', res.roles.menus)
      // console.log(routes)
      router.addRoutes(
        [...routes,
        { path: '*', redirect: '/404', hidden: true }
        ]
      )
      next(to.path)
    }
    if (to.path === loginPath) {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(loginPath)
    }
  }
})

// 后置守卫
router.afterEach(function () {
  // setTimeout(() => {
  // NProgress.done() // 关闭进度条
  // }, 1000)
  NProgress.done() // 关闭进度条
})

