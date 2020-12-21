import {GetPermissList} from '@/api/permissions';
import moment from 'moment'
const permissions={
    state: {
        permissslist:[]
    },
    mutations:{
        SET_PERMISSLIST:(state,permiss)=>{
            state.permissslist=permiss
        }
    },
    actions:{
           getPermisslist({commit},permissparam){
               return new Promise((resolve, reject)=>{

                   GetPermissList(permissparam).then(res=>{
                       const {code,data,msg} = res;
                       if(code==1001){
                           res.data.list.forEach((item,index)=>{
                               item.created_at = moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss');
                                item.index=index+1
                           })
                           commit('SET_PERMISSLIST',data.list)
                           resolve(res)
                       }else {
                            this.$notification.error({message:msg})
                           reject(res)
                       }
                   })
               }).catch(err=>{
                   console.log(err)
               })
           }
    }
}

export default permissions
