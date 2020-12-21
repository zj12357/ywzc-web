import { get, post } from '@/utils/request'
export function getConsumenList(page,psize,seaechData){
    let data = {
        page,
        psize,
    }
    let parameter = Object.assign(data,seaechData)
    return post('/user/index',parameter)
}
export function resumeConsumer(parameter){
    return post('/user/resume', parameter)
}

export function forbidConsumer(parameter){
    return post('/user/forbid', parameter)
}

export function addConsumer(parameter){
    return post('/user/add', parameter)
}

export function consumerMorifyPwd(parameter){
    return post('/user/pass2', parameter)
}

export function consumerMorifyBsc(parameter){
    return post('/user/update', parameter)
}

export function grtConsumerGroup(){
    return get('/user/add')
}

//获取所有角色
export function getAlluser(parameter){
    return post('/auth/all', parameter)
}
