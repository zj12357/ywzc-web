import { post,get } from '@/utils/request';
const api = {
    //官方模版列表
    Athority: '/template/official',
    //官方模版分组
    AthorityGroup:'/template/official_group',
    //复制模版
    CopyTemplate:'/template/copy',
    //我的模版列表
    Person:'/template/my',
    //我的模版分组列表
    PersonGroup:'/template/my_group',
    //模版分组列表
    TemplateGroup:'/template_group/index',
    //新增模版分组
    NewaddGroup:'/template_group/add',
    //编辑模版分组
    EditGroup:'/template_group/edit',
    //删除模版分组
    DelGroup:'/template_group/del',
    //新增模版
    AddTemplate:'/template/add',
    //修改模版
    ChangeTemplate:'/template/edit',
    //删除模版
    DelTemplate:'/template/del',
    //配置模版
    ConfigTemplate:'/template/ext_cfg',
    //搜索模版
    Temsearch:'/template/search',
    //模版下载
    Downtemplate:'/template/download',
    //转移模版
    transTemplate:'/template/trans',
};
//官方模版列表
export function Getauthority (parameter={}) {
    return post(api.Athority, parameter)
}
//我的模版列表
export function Getperson(parameter={}) {
    return post(api.Person, parameter)
}

//官方模版分组

export function GettemplateGroup(parameter) {
    return post(api.AthorityGroup, parameter)
}

//复制模版
export function CopyTemplate(parameter) {
    return post(api.CopyTemplate, parameter)
}
//我的模版分组
export function GetpersonGroup(parameter) {
    return post(api.PersonGroup, parameter)
}

//模版分组列表
export function GetTemplateGroup(parameter) {
    return post(api.TemplateGroup, parameter)
}

//新增模版分组
export function AddnewGroup(parameter) {
    return post(api.NewaddGroup, parameter)
}
//编辑模版分组
 export  function EditGroup(parameter) {
     return post(api.EditGroup, parameter)
 }
 //删除模版分组
export function DelGroup(parameter) {
    return post(api.DelGroup, parameter)
}
//新增模版
export function AddTemplate(parameter) {
    return post(api.AddTemplate, parameter)
}
//修改模版
export function ChangeTemplate(parameter) {
    return post(api.ChangeTemplate, parameter)
}
//删除模版
export function DelTemplate(parameter) {
    return post(api.DelTemplate, parameter)
}
//配置模版
export function ConfigTemplate(parameter) {
    return post(api.ConfigTemplate, parameter)
}
//搜索模版
export function Temsearch(parameter) {
    return post(api.Temsearch, parameter)
}
//模版下载
export function Downtemplate(parameter) {
    return post(api.Downtemplate, parameter)
}

//转移模版
export function transTemplate(parameter) {
    return post(api.transTemplate, parameter)
}

