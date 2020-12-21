import { addDomain, editDomain, delDomain, addAppDomain,editAppDomain,delAppDomain } from '@/api/domain'
import { addApp, deleteApplication, modifyBsc } from '@/api/application'
import { addCert, delCert } from '@/api/tool'
import { deleteSigApp } from '@/api/sigAppList'
import { addSigAppAnd, addSigAppIos,replaceSigApp } from '@/api/sigAppList'
import { addConsumer, consumerMorifyPwd, consumerMorifyBsc } from '@/api/consumer'
import { delCF } from '@/api/cf'
import { deepClone } from '@/utils/util'
export default {
    data(){
        return {
            addmodalVisible: false,
            deleteModalVisible: false,
            morifyModalVisible: false,
            recordData:{},
            newData:[]
        }
    },
    methods: {
        rowModify(r,target){
            this.morifyModalVisible = true
            this.newData = deepClone(this.data)
            this.recordData = this.newData.filter(iterm=>iterm.id===r.id)[0]
            this.isOpen=this.recordData.jump_status ? true : false;
            this.initMorifyModalData(this.mtarget)
            switch(target){
                case 'consumer' :{
                    this.callback('consumer_basic')
                    break;
                }
            }
        },
        rowDelete(r){
            this.deleteModalVisible = true
            this.recordData = r
            this.selectedRowKeys = []
            this.selectedRowKeys.push(r.id)
        },
        async add(target){
            this.addmodalVisible = false
            switch(target){
                case 'domain' :{
                    this.addData.created_at = new Date().getTime()
                    const res = await addDomain(this.addData)
                    this.resolve(res)
                    break;
                }
                case 'app' :{
                    const res = await addApp(this.addData)
                    this.resolve(res,'su_add','erruploadTip')
                    break;
                }
                case 'domainverb' :{
                    const res = await addAppDomain(this.addData)
                    this.resolve(res,'su_add','','domainverb')
                    break;
                }
                case 'tool' :{
                    const res = await addCert(this.addData)
                    this.resolve(res,'su_add','erruploadTip')
                    break;
                }
                case 'sigapp_and' :{
                    this.replaceVisible = false
                    const res=await addSigAppAnd(this.addData)
                    this.resolve(res,'su_add','erruploadTip')
                    break;
                }
                case 'sigapp_ios' :{
                    this.replaceVisible = false
                    const res=await addSigAppIos(this.addData)
                    this.resolve(res,'su_add','erruploadTip')
                    break;
                }
                case 'addConsumer' :{
                    const res = await addConsumer(this.addData)
                    this.resolve(res)
                    break;
                }
           }
        },
        async deleteDomain(target){
            let parameter = { id:this.selectedRowKeys.join(",") }
            switch(target){
                case 'domain' :{
                    this.deleteModalVisible = false
                    const res = await delDomain(parameter)
                    this.resolve(res,'su_del')
                    break;
                }
                case 'app' :{
                    const res = await deleteApplication(parameter)
                    this.resolve(res,'su_del')
                    break;
                }
                case 'domainverb' :{
                    this.deleteModalVisible = false
                     parameter.app_id=this.$route.params.id;
                    const res = await delAppDomain(parameter)
                    this.resolve(res,'su_del')
                    break;
                }
                case 'tool' :{
                    this.deleteModalVisible = false
                    const res = await delCert(parameter)
                    this.resolve(res,'su_del')
                    break;
                }
                case 'single_app' :{
                    this.deleteModalVisible = false
                    const res = await deleteSigApp(parameter)
                    this.resolve(res,'su_del')
                    break;
                }
                case 'cf' :{
                    this.deleteModalVisible = false
                    const res = await delCF(parameter)
                    this.resolve(res,'su_del')
                    break;
                }
            }
            this.selectedRowKeys = []
        },
        async modify(target){
            this.morifyModalVisible = false
            switch(target){
                case 'domain' :{

                    const res = await editDomain(this.morifyData)
                    this.resolve(res,'su_edit')
                    break;
                }
                case 'domainverb' :{
                    this.morifyData.app_id=this.$route.params.id;
                    const res = await editAppDomain(this.morifyData)
                    this.resolve(res,'su_edit','','domainverb')
                    break;
                }
                case 'appbasics' :{
                    const res = await modifyBsc(this.data)
                    const { msg, code } = res
                    if(code===1001){
                        this.success('保存成功')
                        this.$bus.$emit("updateData");
                    }else this.error(msg)
                    break;
                }
                case 'consumer_basic' :{
                    const res = await consumerMorifyBsc(this.morifyBasicData)
                    this.resolve(res,'su_edit')
                    break;
                }
                case 'consumer_passwd' :{
                    const res = await consumerMorifyPwd(this.morifyPwdData)
                    this.resolve(res,'su_edit')
                    break;
                }
            }
        },
    },
}
