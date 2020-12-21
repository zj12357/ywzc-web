import { get, post } from '@/utils/request';
// 请求菜单
export function getMenu (parameter) {
    return get('/user/menu', parameter)
}
