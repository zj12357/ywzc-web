import { post } from '@/utils/request'
export function getSigAPPlist(page,psize,searchData) {
    let data = {
        page,
        psize,
    }
    let parameter = Object.assign(data,searchData)
    return post('/single_app/index', parameter)
}
export function deleteSigApp(parameter) {
    return post('/single_app/del', parameter)
}

export function addSigAppAnd(parameter) {
    return post('/single_app/add_apk', parameter)
}

export function addSigAppIos(parameter) {
    return post('/single_app/add_ipa', parameter)
}

export function editSigAppIos(parameter) {
    return post('/single_app/edit', parameter)
}

export function replaceSigApp(parameter) {
    return post('/single_app/add_apk', parameter)
}
//转移应用
export function transSigAPP(parameter) {
    return post('/single_app/trans', parameter)
}

