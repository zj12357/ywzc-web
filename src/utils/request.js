import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import QS from 'qs';
import router from '@/router'
// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 15000 ,// 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
})

const err = (error) => {
  console.log(error)
  if (error.response) {
    const data = error.response.data;
    const token = Vue.ls.get(ACCESS_TOKEN);
    const message=error.response.data.msg;
    const status=error.response.data.code;
    if (status === 403) {
      notification.error({
        message: 'Forbidden',
        description: message
      })
    }
    if (status === 1006 ) {
      notification.error({
        message: 'Unauthorized',
        description: message || '登陆失败，请重新登陆!'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          // router.replace('/user/login');
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
      }
    }
  }
  return Promise.reject(error)
}
// post请求头
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = 'Bearer '+token; // 让每个请求携带自定义 token 请根据实际情况自行修改
    config.headers['Cache-Control']='no-cache';  //http禁用缓存 304
    config.headers['Cache-Control']='must-revalidate';
    config.headers['Cache-Control']='no-store';
    config.headers['Pragma']='no-cache';
    config.headers['Expires']=0;
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {

 if(response.data.code==1006){
//toke过期
   notification.error({
     message: 'Unauthorized',
     description:'登陆失败，请重新登陆!'
   })
   const token = Vue.ls.get(ACCESS_TOKEN);
   if (token) {

     store.dispatch('Logout').then(() => {
       // router.replace('/user/login');
       setTimeout(() => {
         window.location.reload()
       }, 1000)
     })
   }
 }else {
   return response.data;
 }


}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params){
  return new Promise((resolve, reject) =>{
    service.get(url, {
      params: params
    })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    service.post(url, QS.stringify(params))
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
  });
}
