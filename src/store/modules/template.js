import { Getauthority,GettemplateGroup,Getperson,GetpersonGroup,GetTemplateGroup } from '@/api/template'
import moment from 'moment'
const template={
    state:{
        AthorityList:[],
        AthorityGroupList:[],
        PersonList:[],
        PersonGroupList:[],
        TemplateGroupList:[],
    },
    mutations:{
        SET_ATHORITY_LIST:(state,athority)=>{
            state.AthorityList=athority
        },
        SET_ATHORITYGROUP_LIST:(state,athorityGroup)=>{
            state.AthorityGroupList=athorityGroup
        },
        SET_PERSON_LIST:(state,person)=>{
            state.PersonList=person
        },
        SET_PERSONGROUP_LIST:(state,persongroup)=>{
            state.PersonGroupList=persongroup
        },
        SET_TEMPALTEGROUP_LIST:(state,templategroup)=>{
            state.TemplateGroupList=templategroup
        }
    },
    actions:{
        //获取官方模版列表
           Getathority({state,commit},athData){
               return new Promise((resolve, reject)=>{

                   Getauthority(athData).then(res=>{
                           if(res.code==1001){
                               res.data.list.forEach((item,index)=>{
                                   item.created_at = moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss')
                                   item.index=index+1
                               })
                               commit("SET_ATHORITY_LIST",res.data.list)
                               resolve(res)

                           }else {
                               reject(res)
                               this.$message.error(res.msg)
                           }
                       })


               }).catch(err=>{console.log(err)})
           },
        //获取官方模版分组
        GetathorityGroup({state,commit},athGroupData){
            return new Promise((resolve, reject)=>{

                GettemplateGroup(athGroupData).then(res=>{
                        if(res.code==1001){
                            commit("SET_ATHORITYGROUP_LIST",res.data)
                            resolve(res)
                        }else {
                            this.$message.error(res.msg)
                            reject(res)
                        }
                    })


            }).catch(err=>{console.log(err)})
        },
        //获取我的模版列表
        Getpersons({state,commit},perData){

            return new Promise((resolve, reject)=>{

                    Getperson(perData).then(res=>{
                        if(res.code==1001){
                            res.data.list.forEach((item,index)=>{
                                item.created_at = moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss');
                                item.index=index+1
                            })
                            commit("SET_PERSON_LIST",res.data.list)
                            resolve(res)
                        }else {
                            reject(res)
                            this.$message.error(res.msg)
                        }
                    })


            }).catch(err=>{console.log(err)})
        },
        //获取我的模版分组列表
        GetPersonGroups({state,commit},perGroupData){
            return new Promise((resolve, reject)=>{

                    GetpersonGroup(perGroupData).then(res=>{
                        if(res.code==1001){
                            commit("SET_PERSONGROUP_LIST",res.data)
                            resolve(res)
                        }else {
                            reject(res)
                            this.$message.error(res.msg)
                        }
                    })


            }).catch(err=>{console.log(err)})
        },
        //获取模版分组列表
        GetTemplateGroups({state,commit},temGroupData){
               return  new Promise((resolve, reject)=>{
                   GetTemplateGroup(temGroupData).then(res=>{
                       if(res.code==1001){
                           res.data.list.forEach((item,index)=>{
                               item.created_at = moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss')
                               item.index=index+1
                           })
                           commit('SET_TEMPALTEGROUP_LIST',res.data.list)
                           resolve(res)
                       }else {

                           reject(res)
                           this.$message.error(res.msg)
                       }
                   })
               }).catch((err)=>{
                   console.log(err)
               })

           }
    }

}
export default template
