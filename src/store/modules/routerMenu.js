import {getMenu} from '@/api/routerMenu';
const routerMenu={
    state: {
        routerlist:[]
    },
    mutations:{
        SET_ROUTERLIST:(state,routes)=>{
            state.routerlist=routes;
        }
    },
    actions:{
        GetRouterlist({commit},params){
            return new Promise((resolve, reject)=>{
                getMenu().then((res)=>{
                    const {code,msg,data} =res;
                    if(code==1001){
                        commit('SET_ROUTERLIST',data.list);
                        resolve(res)
                    }else {
                        this.$notification.error({message:msg})
                        reject(res)
                    }
                })
            }).catch(err=>{console.log(err)})
        },
    }
}
export default routerMenu;
