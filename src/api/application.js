import { post,get } from '@/utils/request'
const api={
        //获取应用列表
        getAPPlist:'/app/index',
        //获取应用集成信息
        getAppintegrate:'/app/integrate',
        //应用集成包上传列表
        getPackageList:'/app/package_list',
        //应用集成下载设置
        downloadCfg:'/app/download_cfg',
        //保存安卓包信息
        addApk:'/app/add_apk',
        //保存苹果包信息
        addIpa:'/app/add_ipa',
        //删除安装包
        delPackage:'/app/package_del',
        //下载设置的保存操作
        configSave:'/app/download_cfg_save',
        //修改应用配置信息
        saveExtInfo:'/app/save_ext',
        //转移站点
        transAPP:'/app/trans'
};
export function getAPPlist(page,psize,seaechData) {
    let data = {
        page,
        psize,
    }
    let parameter = Object.assign(data,seaechData)
    return post(api.getAPPlist, parameter)
}

export function addApp(parameter) {
    return post('/app/add', parameter)
}

export function deleteApplication(parameter) {
    return post('/app/del', parameter)
}

export function appInfo(id) {
    return post('/app/info', {id})
}

export function modifyBsc(parameter) {
    return post('/app/save_base', parameter)
}

export function gitCode(id) {
    return post('/app/info', {id})
}
//获取应用集成信息

export function getAppintegrate(parameter) {
    return post(api.getAppintegrate, parameter)
}
//应用集成包上传列表
export function getPackageList(parameter) {
    return post(api.getPackageList, parameter)
}

//保存安卓包信息
export function addApk(parameter) {
    return post(api.addApk, parameter)
}

//保存苹果包信息
export function addIpa(parameter) {
    return post(api.addIpa, parameter)
}
//删除安装包
export function delPackage(parameter) {
    return post(api.delPackage, parameter)
}
//应用集成下载设置
export function downloadCfg(parameter) {
    return post(api.downloadCfg, parameter)
}

//下载设置的保存操作
export function configSave(parameter) {
    return post(api.configSave, parameter)
}
//修改应用配置信息
export function saveExtInfo(parameter) {
    return post(api.saveExtInfo, parameter)
}

//转移站点
export function transAPP(parameter) {
    return post(api.transAPP, parameter)
}
