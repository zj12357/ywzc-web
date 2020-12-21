const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  userInfo: state => state.user.info,
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  lang: state => state.i18n.lang,

  applist: state => state.application.applist,
  //官方模版
  AthorityList:state =>state.template.AthorityList,
  AthorityGroupList:state =>state.template.AthorityGroupList,
  //个人模版
  PersonList: state => state.template.PersonList,
  PersonGroupList:state => state.template.PersonGroupList,
  //模版分组
  TemplateGroupList:state =>state.template.TemplateGroupList,
  //应用集成信息
  Appintegrate:state=>state.application.Appintegrate,
  packageInfo:state=>state.application.packageInfo,
  //应用集成包上传列表
  packageList:state=>state.application.packageList,
  //获取权限列表
  permissslist:state=>state.permissions.permissslist,
  //获取后端路由菜单
  routerlist:state=>state.routerMenu.routerlist,

}

export default getters
