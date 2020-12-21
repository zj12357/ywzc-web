import { post } from '@/utils/request'
export function getDmainList(page,psize,seaechData){
    let data = {
        page,
        psize,
    }
    let parameter = Object.assign(data,seaechData)
    return post('/domain/index',parameter)
}

export function addDomain(parameter){
    return post('/domain/add',parameter)
}

export function editDomain(parameter){
    return post('/domain/edit', parameter)
}

export function delDomain(parameter){
    return post('/domain/del', parameter)
}

export function resumeDomain(parameter){
    return post('/domain/resume', parameter)
}

export function forbidDomain(parameter){
    return post('/domain/forbid', parameter)
}

//app域名管理
export function getAppDmainList(id,page,psize,seaechData){
    let data = {
        id,
        page,
        psize,
    }
    let parameter = Object.assign(data,seaechData)
    return post('/app/domain',parameter)
}

export function addAppDomain(parameter){
    return post('/app/domain_add',parameter)
}

export function editAppDomain(parameter){
    return post('/app/domain_edit',parameter)
}

export function delAppDomain(parameter){
    return post('/app/domain_del', parameter)
}

export function appCopy(parameter){
    return post('/app/copy', parameter)
}

export function getCname(){
    return post('/app/domain_cname')
}