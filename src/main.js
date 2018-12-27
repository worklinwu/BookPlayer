import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import filters from './filters'
import api from './api'
// LeanCloud
import AV from 'leancloud-storage'
// 组件
import {
  Actionsheet,
  DatetimePicker,
  Icon,
  List,
  Loading,
  NavBar,
  Tabbar,
  TabbarItem,
  Popup,
  PullRefresh,
  Search,
  Toast,
  Lazyload,
} from 'vant'
import PhotoPreview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import './registerServiceWorker'
import 'lib-flexible'
import commonMixin from './mixins/common.mixin'
import db from '@/libs/db'

import Navigation from 'vue-navigation'

// 功能插件
// import pluginValidate from './plugin/vee-validate'

AV.init(process.env.VUE_APP_LEANCLOUD_APP_ID, process.env.VUE_APP_LEANCLOUD_APP_KEY)

Vue.config.productionTip = false

Vue.use(filters)
// 组件
Vue.use(Actionsheet)
Vue.use(DatetimePicker)
Vue.use(Icon)
Vue.use(List)
Vue.use(Loading)
Vue.use(NavBar)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Popup)
Vue.use(PullRefresh)
Vue.use(Search)
Vue.use(Toast)
Vue.use(Lazyload, {
  // 1px 灰色图片
  loading:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=',
  // 1px 透明图片
  error:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2N49+7dfwAJYgPK+tLRowAAAABJRU5ErkJggg=='
})
// 其他组件
// 图片预览组件
Vue.use(PhotoPreview, {
  fullscreenEl: false
})
// 插件
// Vue.use(pluginValidate)
Vue.use(Navigation, { router, store })

// 当前环境
Vue.prototype.$env = process.env.NODE_ENV // development/production
Vue.prototype.$baseUrl = process.env.BASE_URL
Vue.prototype.$bucketsBooks = process.env.VUE_APP_BUCKETS_BOOKS
Vue.prototype.$bucketsCourse = process.env.VUE_APP_BUCKETS_COURSE
Vue.prototype.$ua = navigator.userAgent.toLowerCase()
Vue.prototype.$isWeixin = Vue.prototype.$ua.indexOf('micromessenger') !== -1
Vue.prototype.$db = db
Vue.prototype.$api = api
Vue.prototype.$isShowTabBar = false

Vue.mixin(commonMixin)

new Vue({
  router,
  store,
  render: h => h(App),
  mounted: function () {
    // 初始化vuex数据

    let vuexLocalState = db.get('vuex').value() // 从 localStorage 中读取数据
    if(vuexLocalState){
      // 通过 replaceState 完成 vuex 赋值
      this.$store.replaceState(Object.assign(this.$store.state, vuexLocalState))
    }
  }
}).$mount('#app')
