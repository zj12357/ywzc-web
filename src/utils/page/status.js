import { resumeConsumer, forbidConsumer } from '@/api/consumer'
import { resumeDomain, forbidDomain } from '@/api/domain'
export default {
    methods: {
        async disable(r,target){
            switch(target){
                case 'consumer':{
                    switch(r.status){
                        case '开启' :{
                            this.loading = true
                            const forbidRes = await forbidConsumer({id:r.id})
                            this.forbid(forbidRes,r)
                            break;
                        }
                        case '禁用' :{
                            this.loading = true
                            const resumeRes = await resumeConsumer({id:r.id})
                            this.resume(resumeRes,r)
                            break;
                        }
                    }
                    break;
                }
                case 'domain':{
                    switch(r.status){
                        case '开启' :{
                            this.loading = true
                            const forbidRes = await forbidDomain({id:r.id})
                            this.forbid(forbidRes,r)
                            break;
                        }
                        case '禁用' :{
                            this.loading = true
                            const resumeRes = await resumeDomain({id:r.id})
                            this.resume(resumeRes,r)
                            break;
                        }
                    }
                    break;
                }
            }
        },
        forbid(res,r){
            const { code, msg } = res
              if(code ===1001){
                r.status = '禁用'
                this.loading = false
              }else  this.error(msg)
        },
        resume(res,r){
            const { code, msg } = res
              if(code ===1001){
                r.status = '开启'
                this.loading = false
              }else  this.error(msg)
        }
    },
}