<template>
    <div class="example-drag">
        <div class="upload">
            <ul v-if="files.length" class="upload-info">
                <li v-for="(file, index) in files" :key="file.id">
                    <div class="upload-info-title">
                        <span class="title">{{file.name}}</span>
                        <span v-if="file.error"  class="error">上传失败</span>
                        <span v-else-if="file.success" :class="file.response.code!=1001 ? 'error' : 'success'">{{file.response.code!=1001 ?file.response.msg : "上传成功"}}</span>
                        <span v-else-if="file.active" class="active">上传中</span>

                        <a-button type="primary" size="small"  style="margin-left: 30px" v-if="file.error && file.error !== 'compressing' && $refs.upload.features.html5" @click.prevent="$refs.upload.update(file, {active: true, error: '', progress: '0.00'})">重传</a-button>
                        <a-button type="primary" @click.prevent="remove(file)" size="small" style="margin-left: 15px">移除</a-button>

                    </div>

                    <a-progress :percent="Number(file.progress)" />


                </li>
            </ul>
            <ul v-else class="upload-file">
                <td colspan="7">
                    <div class="text-center">
                        <h4 style="margin-bottom: 20px">选择文件后，请将文件拖动到屏幕任意位置</h4>
                        <h6 class="info-circle"><a-icon type="info-circle" />支持批量上传, 只支持.ipa结尾的苹果安装包和.apk结尾的安卓安装包</h6>
                        <!--<label for="file" class="choose-file">选择文件</label>-->
                    </div>
                </td>
            </ul>

            <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
                <h3>拖动文件上传</h3>
            </div>

            <div class="example-btn">
                <file-upload
                        class="file-upload"
                        :post-action="path"
                        :multiple="true"
                        :drop="true"
                        :drop-directory="true"
                        v-model="files"
                        :headers="headers"
                        ref="upload"
                        @input-file="inputFile"
                        @input-filter="inputFilter"
                        :maximum="10"
                        :thread="3"

                >
                    <a-icon type="plus" style="font-size: 20px;position: relative;top: 2px;"/>
                   选择文件
                </file-upload>
                <a-button type="primary" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
                    <a-icon type="check"  style="font-size: 20px;"/>
                    开始上传
                </a-button>
                <a-button type="danger" class="btn btn-danger"  v-else @click.prevent="$refs.upload.active = false">
                    <a-icon type="stop"  style="font-size: 20px;"/>
                    停止上传
                </a-button>
            </div>
        </div>

    </div>
</template>

<script>


    export default {
        data() {
            return {
                files: [],
                path:'',
                headers:{
                    Authorization:'Bearer '+this.$token
                },

            }

        },
        props:['isShow'],
        watch:{
            isShow(val){
                if(val){
                    this.files=[]
                }
            },

            path(val){
                this.path=val
            },

        },
        mounted(){

        },
        methods:{

            /**
             * Has changed
             * @param  Object|undefined   newFile   只读
             * @param  Object|undefined   oldFile   只读
             * @return undefined
             */

            inputFile(newFile, oldFile) {

                if (newFile && !oldFile) {
                    // 添加文件
                }

                if (newFile && oldFile) {
                    // 更新文件

                    // 开始上传
                    if (newFile.active !== oldFile.active) {
                        console.log('Start upload', newFile.active, newFile)

                        // 限定最小字节
                        if (newFile.size >= 0 && newFile.size < 100 * 1024) {
                            newFile = this.$refs.upload.update(newFile, {error: 'size'})
                        }
                    }

                    // 上传进度
                    if (newFile.progress !== oldFile.progress) {
                        console.log('progress', newFile.progress, newFile)
                    }

                    // 上传错误
                    if (newFile.error !== oldFile.error) {
                        console.log('error', newFile.error, newFile)
                    }

                    // 上传成功
                    if (newFile.success !== oldFile.success) {
                        console.log('success', newFile.success, newFile)

                        const {code,msg,data}=newFile.response
                        console.log(this.files)
                        if(code==1001){
                            this.$emit('upload',data,newFile.file.name)
                        }else {
                            this.$notification.error({message:msg})
                        }



                    }
                }

                if (!newFile && oldFile) {
                    // 删除文件

                    // 自动删除 服务器上的文件
                    if (oldFile.success && oldFile.response.id) {
                        // $.ajax({
                        //   type: 'DELETE',
                        //   url: '/file/delete?id=' + oldFile.response.id,
                        // });
                    }
                }

                // 自动上传
                // if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
                //     if (!this.$refs.upload.active) {
                //         this.$refs.upload.active = true
                //     }
                // }
            },

            /**
             * Pretreatment
             * @param  Object|undefined   newFile   读写
             * @param  Object|undefined   oldFile   只读
             * @param  Function           prevent   阻止回调
             * @return undefined
             */
            inputFilter: function (newFile, oldFile, prevent) {

                if (newFile && !oldFile) {

                    if(/\.(apk)$/i.test(newFile.name)){
                        newFile.postAction='/api/upload/apk'
                        this.path='/api/upload/apk'
                    }else if(/\.(ipa)$/i.test(newFile.name)){
                        newFile.postAction='/api/upload/ipa'
                        this.path='/api/upload/apk'
                    }


                    if (!/\.(apk|ipa)$/i.test(newFile.name)) {
                        return prevent()
                    }
                    // 过滤不是图片后缀的文件


                }

            },
            remove(file) {
                this.$refs.upload.remove(file)
            },
            clear() {
                this.$refs.upload.clear()
            }
        }
    }
</script>

<style lang="less" scoped>
    .example-drag label.btn {
        margin-bottom: 0;
        margin-right: 1rem;
    }
    .example-drag .drop-active {
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        position: fixed;
        z-index: 9999;
        opacity: .6;
        text-align: center;
        background: #000;
    }
    .example-drag .drop-active h3 {
        margin: -.5em 0 0;
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        font-size: 40px;
        color: #fff;
        padding: 0;
    }
    .example-btn{

        display: flex;
        justify-content: flex-end;
        button{
            margin-left: 30px;
        }
        .file-upload{
            background: #1890ff;
            color: #fff;
            cursor: pointer;
            text-align: center;
            border-radius: 4px;
            padding: 0 14px;
            line-height: 32px;

        }
    }
    .upload{
        .upload-info{
            .title{
                display: inline-block;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                width: 300px;
            }
            li{
                margin: 10px 0;
                .upload-info-title{
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    justify-content: space-between;
                    padding-right: 120px;
                }
                .error{
                    color: red;
                    display: inline-block;
                    margin: 0px 8px;
                }
                .success{
                    color: green;
                    display: inline-block;
                    margin: 0px 8px;
                }
                .active{
                    color: #1890ff;
                    display: inline-block;
                    margin: 0px 8px;
                }
            }

        }
        .upload-file{
            display: flex;
            justify-content: center;
            padding-left: 0;
            .text-center{
                text-align: center;
                .choose-file{
                    background: #1890ff;
                    color: #fff;
                    height: 36px;
                    line-height: 36px;
                    border-radius: 4px;
                    width: 80px;
                    display: block;
                    text-align: center;
                    cursor: pointer;
                }
                h4{
                    font-size: 26px;
                    width: 100%;
                }
                h6{
                    font-size: 14px;
                    width: 100%;
                }
                .info-circle{
                    color: #909399;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 10px;
                }
            }

        }
    }

</style>
