import notification from 'ant-design-vue/es/notification'
import tip from './tip'
export default {
    methods: {
      resolve(res,suTip='su_add',errTip='errdelete',emit=''){
        this.loading = true
        let { code, msg } = res
        if(code === 1001) {
          this.initData(this.pagination.current,this.pagination.pageSize,this.searchData)
          switch(suTip){
            case 'su_add' :{
              msg = tip.successAddMsg
              break;
            }
            case 'su_del' :{
              msg = tip.successDelMsg
              break;
            }
            case 'su_edit' :{
              msg = tip.successEditMsg
              break;
            }
            case 'su_check' :{
              msg = tip.successCheck
              break;
            }
            case 'su_copy' :{
              msg = tip.successCopy
              break;
            }
          }
          this.success(msg)
          if(emit=='domainverb') {
            this.$bus.$emit("updateCFList")
          }
        }else this.error(msg,errTip)
      },
      error(message,errTip){
        if(message=='参数不能为空'){
          switch(errTip){
            case 'errdelete' :{
              message = tip.errdelMsg
              break;
            }
            case 'err_copy' :{
              message = tip.errcopyMsg
              break;
            }
            case 'erruploadTip' :{
              message = tip.erruploadMsg
              break;
            }
          }
        }
        notification.error({
          message:'操作失败',
          description: message
        })
        this.loading = false
      },
      success(message){
        notification.success({
          message: '操作成功',
          description: message
        })
      },
    },
}
