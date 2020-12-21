import { getAPPlist,getAppintegrate,getPackageList } from '@/api/application'
import moment from 'moment'

const application={
    state: {
        applist:[],
        Appintegrate:[],
        packageInfo:{
            data:{}
        },
        packageList:[
            {
                package:{
                    data:{}
                }
            }
        ]
    },
    mutations:{
          SET_APP_LIST:(state,app)=>{
              state.applist=app
          },
        SET_APP_INTEGRATE:(state,integrate)=>{
              state.Appintegrate=integrate
        },
        SET_PACKAGE_INFO:(state,info)=>{
              state.packageInfo={...info}
        },
        SET_APP_PACKAGELIST:(state,packages)=>{
              state.packageList=[...packages]
        },

    },
    actions:{
        //获取应用列表
        GetAPPlist({state,commit},app){
            return new Promise((resolve, reject)=>{
                    getAPPlist(app).then((res)=>{
                        const {code,msg}=res;
                        if (code==1001){
                            commit('SET_APP_LIST',res.data.list)
                            resolve(res)
                        }else {
                             this.$notification.error({message:msg})
                            reject()
                        }
                    })

                }

            ).catch(error=>{
                 console.log(error)
            })

        },
        //获取应用集成信息
        GetAppintegrate({state,commit},appIntegrate){
             return new Promise((resolve, reject)=>{
                 getAppintegrate(appIntegrate).then((res)=>{
                     if(res.code==1001){
                         res.data.package.created_at= moment.unix(res.data.package.created_at).format('YYYY-MM-DD')
                         commit('SET_APP_INTEGRATE',res.data);
                         commit('SET_PACKAGE_INFO',res.data.package);
                         resolve(res)
                     }else {
                         this.$message.err(res.msg);
                         reject(res)
                     }
                 })
             }).catch((err)=>{
                 console.log(err)
             })
        },
        //应用集成包上传列表
        GetPackageList({state,commit},packagelist){
            return new Promise((resolve, reject)=>{
                getPackageList(packagelist).then((res)=>{
                    if(res.code==1001){
                        res.data.list.forEach((item)=>{
                            item.created_at = moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss')
                        })
                        commit('SET_APP_PACKAGELIST',res.data.list);
                        resolve(res)
                    }else {
                        this.$message.err(res.msg);
                        reject(res)
                    }
                })
            }).catch((err)=>{
                console.log(err)
            })
        },

    }
}
export default application;
