import { post,get } from '@/utils/request';
const api = {
    //修改密码
    ChangePassword: '/user/pass',
    //修改用户名
    ChangeUserName:'/user/info',
    //获取所有用户列表
    getAlluser:'/user/all'
};

export function ChangePassword (parameter) {
    return post(api.ChangePassword, parameter)
}
export function ChangeUserName (parameter) {
    return post(api.ChangeUserName, parameter)
}

export function getAlluser (parameter) {
    return post(api.getAlluser, parameter)
}

