export default {
    methods: {
        handleChange(info) {
          if (info.file.status === 'uploading') {
            this.fileloading = true;
              this.isuping=true;
            return;
          }
          if (info.file.status === 'done') {


            const res = info.file.response
            const { code, data,msg} = res
            if(code==1001){
              this.success('上传成功')
              this.fileloading = false;
              if(this.addData){
                  this.imgurl=`/${data.path}`
                  this.addData.path = data.path
                  this.addData.pkg_info = data
                  this.isuping=false;
              }else{
                  this.data.img = data.path
              }
            }else this.error(msg)
          }
        },
        beforeUpload(file) {
          const isJPG = file.type === 'image/jpeg'||file.type === "image/png"||file.type === "image/gif"||file.type === "image/jpg"||file.type === "image/icon"
          if (!isJPG) {
            this.$message.error('请上传图片格式!');
          }
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
            this.$message.error('图标必须小于2MB！');
          }
          return isJPG && isLt2M;
        },
        beforeFileUpload(file){
          const isIos = /\.ipa$/.test(file.name)
          const isAnd = /\.apk$/.test(file.name)
            this.addData.filename=file.name
            if(isIos){
                this.api = this.iosApi
                this.target='sigapp_ios'
            }
            else if(isAnd) {
                this.api = this.andApi
                this.target='sigapp_and'
            }

            if(this.checkUptype=='苹果' && this.isNewAdd==false && isIos){
                return true
            }
            else if(this.checkUptype=='安卓' && this.isNewAdd==false && isAnd){
                return true
            } else if(this.isNewAdd==true && (isIos || isAnd)){
                return true
            } else{

                this.checkUptype=='苹果' && this.$notification.warning({message:'请上传以.ipa结尾的文件'});
                this.checkUptype=='安卓' && this.$notification.warning({message:'请上传以.apk结尾的文件'});
                this.checkUptype=='' &&  this.$notification.warning({message:'请上传以.apk结尾或者.ipa结尾的文件'})

                return false
            }


        }
    },
}
