import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', '404'] // no redirect whitelist
const defaultRoutePath = localStorage.getItem('path')
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login' &&  defaultRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      if (store.getters.roles.length===0) {

        store
            .dispatch('GetInfo')
            .then(res => {
              const { data } = res
              store.dispatch('GenerateRoutes',data).then(() => {
                const routers = store.getters.addRouters
                router.addRoutes(routers)
                console.log('defaultRoutePath',defaultRoutePath)
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                if (to.path === redirect) {
                  if(defaultRoutePath){
                    next({ ...to, replace: true })
                  }else {
                    //默认跳转第一个
                    next({ path: routers[0].redirect })
                  }


                  // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record

                } else {
                  // 跳转到目的路由
                  next({ path: redirect })

                }
              })
            })
            .catch(() => {
              notification.error({
                message: '错误',
                description: '请求用户信息失败，请重试'
              })
              store.dispatch('Logout').then(() => {
                next({ path: '/user/login', query: { redirect: to.fullPath } })
              })
            })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
