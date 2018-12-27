import Vue from 'vue'
import VueRouter from 'vue-router'
// 进度条
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

import util from '../libs/util.js'
// 路由数据
import routes from './routes'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_API,
  // 布局问题，滚动条应用在div层，这段代码无效
  // scrollBehavior (to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     if (from.meta.keepAlive) {
  //       from.meta.savedPosition = document.body.scrollTop;
  //     }
  //     return { x: 0, y: to.meta.savedPosition || 0 }
  //   }
  // },
  routes
})

// router.beforeEach((to, from, next) => {
//   next()
// })

router.afterEach(to => {
  // 进度条
  // NProgress.done()
  // 更改标题，可以用 vue-meta 来实现
  util.title(to.meta.title)
})

export default router
