import api from './index'
import { post,get } from '@/utils/request'


//登陆
export function login (parameter) {
  return post(api.Login, parameter)
}
//获取用户信息
export function getInfo () {
  return get(api.UserInfo,{})
}
//登出
export function logout () {
  return post('/login/index', {})
}

//刷新token
export function refreshToken (parameter) {
  return get('/user/refresh_token',parameter)
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */

