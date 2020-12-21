import { post } from '@/utils/request'
export function getCertList(page,psize,seaechData){
    let data = {
        page,
        psize,
    }
    let parameter = Object.assign(data,seaechData)
    return post('/cert/index',parameter)
}
export function addCert(parameter){
    return post('/cert/add',parameter)
}
export function delCert(parameter){
    return post('/cert/del', parameter)
}
export function transCert(parameter){
    return post('/cert/trans', parameter)
}


