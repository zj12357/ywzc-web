import { post,get } from '@/utils/request';
const api={
    //上传压缩包
    UploadZip:'/upload/tpl_zip',
    //上传图片
    UploadImg:'/upload/image',
    //上传安卓安装包
    UpAndroidPage:'/upload/apk',
    //上传苹果安装包
    UpIosPage:'/upload/ipa',

}

export  function UploadZip(parameter){
    return post(api.UploadZip, parameter)
}

export  function UploadImg(parameter){
    return post(api.UploadImg, parameter)
}

export  function UpAndroidPage(parameter){
    return post(api.UpAndroidPage, parameter)
}

export  function UpIosPage(parameter){
    return post(api.UpIosPage, parameter)
}
