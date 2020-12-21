import { post,get } from '@/utils/request';
const api={
    //获取权限列表
    GetPermissList:'/auth/index',
    //获取权限
    GetPermiss:'/auth/apply',
    //更新权限
    UpPermiss:'/auth/apply',
    //开启权限
    OpenPermiss:'/auth/resume',
    //禁用权限
    ClosePermiss:'/auth/forbid',
    //编辑权限
    EditPermiss:'/auth/update',
    //新增权限
    AddPermiss:'/auth/add',
    //删除权限
    DelPermiss:'/auth/delete',
    //获取配置列表
    GetSystemlist:'/sys/index',
    //添加配置
    AddSystem:'/sys/add',
    //编辑配置
    EditSystem:'/sys/edit',
    //获取域名列表
    getDomain:'/sys/icp_domain_index',
    //操作日志
    actionLog:'/log/index',
    //清除缓存
    ClearCahe:'/sys/clear_cache',
    //获取菜单列表
    getMenulist:'/rule/index',
    //新增权限规则
    addMenulist:'/rule/add',
    //编辑权限规则
    editMenulist:'/rule/edit',
    //删除权限规则
    delMenulist:'/rule/del',
    //获取所有规则
    getAllrules:'/rule/all',
    //ICP域名列表
    getIcpDomain:'/icp_domain/index',
    //添加ICP域名
    addIcpDomain:'/icp_domain/add',
    //删除ICP域名
    delIcpDomain:'/icp_domain/del'


}
//获取权限列表
export function GetPermissList(parameter) {
    return post(api.GetPermissList, parameter)
}
//获取权限
export function GetPermiss(parameter) {
    return get(api.GetPermiss, parameter)
}
//更新权限
export function UpPermiss(parameter) {
    return post(api.UpPermiss, parameter)
}
//开启权限
export function OpenPermiss(parameter) {
    return post(api.OpenPermiss, parameter)
}
//禁用权限
export function ClosePermiss(parameter) {
    return post(api.ClosePermiss, parameter)
}
//编辑权限
export function EditPermiss(parameter) {
    return post(api.EditPermiss, parameter)
}
//新增权限
export function AddPermiss(parameter) {
    return post(api.AddPermiss, parameter)
}

//删除权限
export function DelPermiss(parameter) {
    return post(api.DelPermiss, parameter)
}

//获取配置列表
export function GetSystemlist(parameter) {
    return post(api.GetSystemlist, parameter)
}
//添加配置
export function AddSystem(parameter) {
    return post(api.AddSystem, parameter)
}
//编辑配置
export function EditSystem(parameter) {
    return post(api.EditSystem, parameter)
}
//获取域名列表
export function getDomain(parameter) {
    return post(api.getDomain, parameter)
}
//操作日志
export function actionLog(parameter) {
    return post(api.actionLog, parameter)
}
//清除缓存
export function ClearCahe(parameter) {
    return post(api.ClearCahe, parameter)
}


//获取权限列表
export function getMenulist(parameter) {
    return post(api.getMenulist, parameter)
}
//添加权限列表
export function addMenulist(parameter) {
    return post(api.addMenulist, parameter)
}
//编辑权限列表
export function editMenulist(parameter) {
    return post(api.editMenulist, parameter)
}
//删除权限列表
export function delMenulist(parameter) {
    return post(api.delMenulist, parameter)
}
//获取所有规则

export function getAllrules(parameter) {
    return post(api.getAllrules, parameter)
}
//ICP域名列表
export function getIcpDomain(parameter) {
    return post(api.getIcpDomain, parameter)
}
//添加ICP域名
export function addIcpDomain(parameter) {
    return post(api.addIcpDomain, parameter)
}
//删除ICP域名
export function delIcpDomain(parameter) {
    return post(api.delIcpDomain, parameter)
}
