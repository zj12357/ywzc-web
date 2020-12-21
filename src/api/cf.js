import { post } from '@/utils/request'
export function getCFList(page,psize,searchData){
    let data = {
        page,
        psize,
    }
    let parameter = Object.assign(data,searchData)
    return post('/cloud_flare/index',parameter)
}

export function delCF(parameter){
    return post('/cloud_flare/del', parameter)
}

export function passCF(parameter){
    return post('/cloud_flare/pass', parameter)
}

export function refuseCF(parameter){
    return post('/cloud_flare/refuse', parameter)
}
export function passBatchCF(parameter) {
    return post('/cloud_flare/pass_batch',parameter)
}
