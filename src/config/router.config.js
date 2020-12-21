// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' ,permission: [ 'index' ]},
    // redirect: '/',
    children: [
      // dashboard
      //应用列表
      {
        path: '/application',
        name: 'application',
        component: RouteView,
        meta: { title: '站点管理', icon: 'appstore', permission: [ 'application' ]},
        redirect: '/application/application',
        children: [
          {
            path: '/application/application',
            name: 'applicationList',
            component: () => import('@/views/application/application.vue'),
            meta: { title: '站点列表',  keepAlive: true, hiddenHeaderContent: true, permission: [ 'applicationList' ]}
          },
          {
            path: '/application/sigapplist',
            name: 'sigAppList',
            component: () => import('@/views/application/SigAppList'),
            meta: { title: 'APP列表',  keepAlive: true, hiddenHeaderContent: true, permission: [ 'sigAppList' ]}
          },
          {
            path: '/application/cf',
            name: 'cfVerb',
            component: () => import('@/views/CFVerb/CFVerb'),
            meta: { title: '域名审核', permission: [ 'cfVerb' ]},
          },
        ]
      },
      //模版管理
      {
        path: '/templateManager',
        name: 'templateManager',
        component: RouteView,
        meta: { title: '模版管理', icon: 'bars', hiddenHeaderContent: true,permission: [ 'templateManager' ] },
        redirect: '/templateManager/authorityTemplate',
        children: [
          {
            path: '/templateManager/authorityTemplate',
            name: 'authorityTemplate',
            component: () => import('@/views/templateManager/authorityTemplate'),
            meta: { title: '官方模版',  keepAlive: true,hiddenHeaderContent: true,permission: [ 'authorityTemplate' ] }
          },
          {
            path: '/templateManager/personTemplate',
            name:'personTemplate',
            component: () => import('@/views/templateManager/personTemplate'),
            meta: { title: '我的模版',  keepAlive: true, hiddenHeaderContent: true,permission: [ 'personTemplate' ] },
          },
        ]
      },
      {
        path: '/derect',
        name: 'derect',
        redirect: '/derect/domain',
        component: RouteView,
        meta: { title: '域名跳转', icon: 'global' ,permission: [ 'derect' ]},
        children: [
          {
            path: '/derect/domain',
            name: 'domain',
            component: () => import('@/views/domain/Domain'),
            meta: { title: '域名跳转', keepAlive: true ,permission: [ 'domain' ]}
          }
        ]
      },
      {
        path: '/tool',
        name: 'tool',
        redirect: '/tool/certificate',
        component: RouteView,
        meta: { title: '工具', icon: 'tool',permission: [ 'tool' ] },
        children: [
          {
            path: '/tool/certificate',
            name: 'certificate',
            component: () => import('@/views/tool/Certificate'),
            meta: { title: '修复工具', keepAlive: true ,permission: [ 'certificate' ]}
          }
        ]
      },

        //权限管理
      {
        path:'/management',
        name:'management',
        redirect:'/management/permissions',
        component: RouteView,
        meta: { title: '系统设置', icon: 'setting' ,permission: [ 'management' ]},
        children:[
          {
            path:'/management/permissions',
            name:'permissions',
            component:()=>import('@/views/management/permissions'),
            meta:{title:'角色管理',keepAlive:true,permission: [ 'permissions' ]}
          },

          {
            path: '/management/consumer',
            name: 'consumer',
            component: () => import('@/views/management/Consumer'),
            meta: { title: '用户管理', keepAlive:true,permission: [ 'consumer' ]},
          },
          {
            path: '/management/systemConfig',
            name: 'systemConfig',
            component: () => import('@/views/management/systemConfig'),
            meta: { title: '字典配置',keepAlive:true, permission: [ 'systemConfig' ]},
          },
          {
            path: '/management/menuConfig',
            name: 'menuConfig',
            component: () => import('@/views/management/menuConfig'),
            meta: { title: '菜单管理',keepAlive:true, permission: [ 'menuConfig' ]},
          },
          {
            path: '/management/icpDomain',
            name: 'icpDomain',
            component: () => import('@/views/management/icpDomain'),
            meta: { title: 'ICP域名',keepAlive:true, permission: [ 'icpDomain' ]},
          },

          {
            path: '/management/actionLog',
            name: 'actionLog',
            component: () => import('@/views/management/actionLog'),
            meta: { title: '操作日志',keepAlive:true, permission: [ 'actionLog' ]},
          },
          {
            path: '/management/clearCache',
            name: 'clearCache',
            component: () => import('@/views/management/clearCache'),
            meta: { title: '清除缓存',keepAlive:true, permission: [ 'clearCache' ]},
          },
        ]
      }



    ]
  },

  //应用详情
  {
    path: '/application/applicationInfo',
    component:BasicLayout,
    redirect:'/application/applicationInfo/basics',
    children:[
      {
        path: '/application/applicationInfo/:id',
        component: () => import('@/views/application/applicationInfo'),
        meta: { title: '应用信息',  keepAlive: true, hiddenHeaderContent: true,permission: [ 'application' ] },
        redirect:'/application/applicationInfo/basics',
        children:[
          {
            path:'/application/applicationInfo/basics/:id',
            name:'appBasics',
            component:()=>import('@/views/application/applicationInfo/appBasics'),
            meta: { title: '基础信息',  keepAlive: true, hiddenHeaderContent: true, permission: [ 'application' ]},
          },
          {
            path:'/application/applicationInfo/code/:id',
            name:'Domainsverb',
            component:()=>import('@/views/application/applicationInfo/Domainsverb'),
            meta: { title: '统计代码',  keepAlive: true, hiddenHeaderContent: true, permission: [ 'application' ]},
          },
          {
            path:'/application/applicationInfo/config/:id',
            name:'temConfig',
            component:()=>import('@/views/application/applicationInfo/temConfig'),
            meta: { title: '模版配置',  keepAlive: true, hiddenHeaderContent: true, permission: [ 'application' ]},
          },
        ]
      },
      {
        path: '/application/appIntegration/:id',
        component:() => import('@/views/application/applicationInfo'),
        meta: { title: '应用集成',  keepAlive: true, hiddenHeaderContent: true, permission: [ 'application' ]},
        redirect:'/application/appIntegration/android',
        children:[
          {
            path:'/application/appIntegration/android/:id',
            name:'android',
            component:()=>import('@/views/application/appIntegration/android'),
            meta: { title: '安卓集成',  keepAlive: true, hiddenHeaderContent: true, permission: [ 'application' ]},
          },
          {
            path:'/application/appIntegration/ios/:id',
            name:'ios',
            component:()=>import('@/views/application/appIntegration/ios'),
            meta: { title: 'IOS集成',  keepAlive: true, hiddenHeaderContent: true, permission: [ 'application' ]},
          },

        ]
      },

    ]
  },

  //个人中心
  {
    path: '/personCenter',
    component: BasicLayout,
    redirect:'/personCenter/info',
    meta: { title: '个人中心', icon: 'user', },
    children:[
      {
        path:'/personCenter/info',
        name:'personInfo',
        component: () => import('@/views/personCenter/personInfo'),
        meta: { title: '个人信息',  keepAlive: true, hiddenHeaderContent: true,},
      },
      {
        path:'/personCenter/password',
        name:'personPassword',
        component: () => import('@/views/personCenter/personPassword'),
        meta: { title: '修改密码',  keepAlive: true, hiddenHeaderContent: true,},
      }
    ]
  },
  //模版分组
  {
    path: '/templateManager/personTemplate/group',
    component: BasicLayout,
    redirect:'/templateManager/personTemplate/group',
    children:[
      {
        path:'/templateManager/personTemplate/group',
        name:'templateGroup',
        component: () => import('@/views/templateManager/templateGroup'),
        meta: { title: '模版分组',  keepAlive: true,  hiddenHeaderContent: true,},
      }

    ]


  },
  {
    path: '*', redirect: '/404', hidden: true
  },

]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
      // {
      //   path: 'register',
      //   name: 'register',
      //   component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      // },
      // {
      //   path: 'register-result',
      //   name: 'registerResult',
      //   component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      // },

    ]
  },

  {
    path: '/test',
    component: BasicLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },



  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
