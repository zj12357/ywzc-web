import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN,LOGIN_TIME } from '@/store/mutation-types'
import router from '@/router'

const user = {
  state: {
    token: '',
    info: {},
    roles:[],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          console.log(response)
          if(response.code=='1001'){
            const result = response.data
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(LOGIN_TIME,new Date().getTime())
            commit('SET_TOKEN', result.token)
            resolve(response)
          }else {
            reject(response)
          }

        }).catch(error => {
          console.log(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data;
          if(response.code=='1001'){
            commit('SET_INFO', result)
            commit('SET_ROLES',result.menu)
            resolve(response)
          }else {
            reject()
          }


        }).catch(error => {
          console.log(error)
        })
      })
    },

    // 登出
    Logout ({commit}) {
      return new Promise((resolve,reject)=>{
        commit('SET_TOKEN', '');
        Vue.ls.remove(ACCESS_TOKEN);
        Vue.ls.remove(LOGIN_TIME);
        localStorage.removeItem('path')
        router.replace('/user/login');
        resolve()
      }).catch(error => {
          console.log(error)
      })

    }

  }
}

export default user
