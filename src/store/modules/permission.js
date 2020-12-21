import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission (permission, route) {
  if (route.meta && route.meta.permission) {
    let flag = false
    for (let i = 0, len = permission.length; i < len; i++) {
      //动态路由默认跳转，必须返回index和父级路由，permission[1]为默认跳转路由,没有页面跳转404
      if(route.meta.permission.includes(permission[1].node) ){
        localStorage.setItem('path',route.path)
      }else if(permission[1].node==404){
        localStorage.setItem('path','/404')
      }

      flag = route.meta.permission.includes(permission[i].node)
      if (flag) {
        route.meta.title=permission[i].title
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line

function filterAsyncRouter (routerMap, roles) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(roles.permissionList, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit },data) {
      console.log('data',data)
      data.permissionList = data.menu
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRouter(asyncRouterMap, data)
        console.log('accessedRouters',accessedRouters)
        accessedRouters.map(item=>{
          if(item.name=='index'){
            item.redirect=localStorage.getItem('path')
          }
        })
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
