<template>
    <div class="config">
        <a-card>
            <p class="title">修改模版</p>
            <a-row>
                <a-col :offset="2">
                    <div class="config-header">

                        <div class="config-serach">
                            <span>搜索模版:</span>
                            <a-select
                                      style="width: 320px"
                                      @search="onUpdateNote"
                                      showSearch
                                      @change="handleChange"
                                      :showArrow="false"
                                      :filterOption="false"
                                      @focus="focusGetTempalte"
                                      :notFoundContent="fetching ? undefined : null"
                            >
                                <!--<a-icon slot="suffixIcon" type="search" />-->
                                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                                <a-select-option :key="item.id"
                                                 v-for="(item,index) in searchResult"


                                >{{item.name}}</a-select-option>

                            </a-select>
                            <!--<a-button type="primary">确认</a-button>-->
                        </div>
                    </div>
                </a-col>
            </a-row>

        </a-card>

        <a-card>
            <a-spin :spinning="isloading">
            <div class="config-content" v-if="configInfo.ext_json!=null">

                    <p class="title">参数配置</p>
                    <div>
                        <a-form :form="form" @submit="handleSubmit">
                            <a-form-item label="模版名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                                <a-input
                                        :value="configInfo.template_name"
                                        disabled
                                        style="width: 320px"
                                />
                                <span class="desc-text">模版名称</span>
                            </a-form-item>
                            <a-form-item :label="item[1].title" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" v-for="(item,index) in notimgList">
                                <div  v-if="item[0].indexOf('tool')>-1" @click="getConfigPath(item[0])">
                                    <a-upload
                                            name="file"
                                            :action="configPath"
                                            @change="Upconfig"
                                            :headers="headers"
                                    >

                                        <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                                        <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style="margin-left: 10px" v-if="item[1].val!==''" />
                                    </a-upload>
                                </div>


                                <a-input
                                        v-else
                                        v-model="configInfo.ext_json[item[0]].val"
                                        style="width: 320px"
                                />

                                <span class="desc-text">{{item[1].desc}}</span>
                            </a-form-item>


                            <a-form-item :label="item[1].title" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" v-for="(item,index) in imgList">
                                <div @click="getIndex(index,item[0])">
                                    <a-upload
                                            name="file"
                                            listType="picture-card"
                                            class="avatar-uploader"
                                            :showUploadList="false"
                                            :action="imgPath"
                                            @change="upChangeImage"
                                            :headers="headers"
                                    >

                                        <div>
                                            <img   v-lazy="item[1].val"  alt="" style="width: 200px;height: auto" ref="upimgurl" >

                                        </div>

                                    </a-upload>
                                    <span class="preview"  @click="showModal(item[1].val)">预览</span>
                                    <span class="descimg-text">{{item[1].desc}}</span>
                                </div>

                            </a-form-item>



                            <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                                <a-button type="primary" html-type="submit">
                                    保存数据
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </div>

            </div>
            </a-spin>
            <div v-if="configInfo.ext_json==null" class="loadlist">
                    <span>暂无数据</span>
            </div>
            <a-modal title="预览图片" v-model="visible"  :width="600" centered @cancel="handleOk" :footer="null">
                <div style="width: 500px;display: flex;justify-content: center;margin: 0 auto">
                    <img  v-lazy="previewImg" alt="" style="display: block;width: 100%">
                </div>

            </a-modal>
        </a-card>

        <!-- 预览模版模态框-->
        <div>
            <a-modal title="预览模版" v-model="isShowTem"  :footer="null" style="position: fixed;right: 0" :maskClosable="false" :mask="false" :width="430"  wrapClassName="showtel" >
                <div style="min-height: 600px;width: 400px; ">
                    <iframe :src="showTemUrl" frameborder="0" style="min-height: 600px;width: 100%">

                    </iframe>
                </div>

            </a-modal>
        </div>

        <!-- 预览模版模态框-->
    </div>
</template>

<script>


    import _ from 'lodash';
    import {Temsearch} from '@/api/template';
    import {saveExtInfo,appInfo} from '@/api/application'

    export default {
        name: "temConfig",

        data(){
            return{

                formLayout: 'horizontal',
                form: this.$form.createForm(this, { name: 'coordinated' }),
                //应用信息
                appData:{},
                searchResult:[],
                configInfo:{
                    id:'',
                    name:'',
                    template_id:'',
                    template_name:'',
                    ext_json:{
                        web_title:{
                        },
                        kefu_url:{
                        },

                    },
                    package:''
                },
                imgList:[],
                notimgList:[],
                imgPath:'/api/upload/image',
                configPath:'/api/upload/mobile_config',
                visible: false,
                //预览模态框
                isShowTem:false,
                showTemUrl:'',
                //预览图片
                previewImg:'',
                upimageloading:false,
                //当前要修改的img
                imgIndex:0,
                //上传图片
                imgkey:'',
                //上传config文件
                configkey:'',
                //加载
                isloading:true,
                fetching:false,
                headers: {
                    Authorization:'Bearer '+this.$token
                },

            }
        },
        created(){
            this.getAppinfo()
        },
        mounted(){

        },

        methods:{
            //获取焦点
            focusGetTempalte(){
                Temsearch({app_id:this.$route.params.id,name:''}).then(res=>{
                    const {code,msg,data} =res
                    if(code==1001){
                        this.searchResult=data;
                    }else {
                        this.$notification.error({message:msg});
                    }
                })
            },

            //获取应用信息
            async getAppinfo(){
                const {code,msg,data} =await appInfo(this.$route.params.id)
                if(code==1001){
                    this.appData=data;
                    this.configInfo.ext_json=data.ext_json;
                    this.isloading=false;
                    this.configInfo.ext_json!==null &&  Object.keys( this.configInfo.ext_json).forEach((item)=>{

                        if(/^img_/.test(item)){
                            let value=this.configInfo.ext_json[item].val;
                            if(/^upload\//.test(value)){
                                this.configInfo.ext_json[item].val =`/${value}`
                            } else if (/^\.\/config/.test(value)) {

                                this.configInfo.ext_json[item].val=`/${this.appData.package}/${value}`
                            }else if(/^\.\.\/config/.test(value)){
                                this.configInfo.ext_json[item].val=`/${this.appData.package_m}${value}`
                            }
                        }

                    })

                    this.configInfo.template_id=data.template_id;
                    this.configInfo.template_name=data.template_name;
                    this.imgList= this.configInfo.ext_json!==null && Object.entries(this.configInfo.ext_json).filter((item)=>{
                        return  item[0].indexOf('img_')>-1
                    });
                    this.notimgList=this.configInfo.ext_json!==null && Object.entries(this.configInfo.ext_json).filter((item)=>{
                        return  item[0].indexOf('img_')==-1
                    });

                }else {
                    this.$notification.error({message:msg});
                }
                console.log( this.configInfo)

            },
            //搜索防抖
            onUpdateNote: _.debounce(function(val) {
                this.fetching=true;
                Temsearch({app_id:this.$route.params.id,name:val}).then(res=>{
                    const {code,msg,data}=res;
                    if(code==1001){
                        this.searchResult=data;
                        this.isloading=false;
                        this.fetching=false;
                    }else {
                        this.$notification.error({message:msg});
                    }
                })
            }, 500),

            handleChange(value) {
                this.isShowTem=true;
                this.configInfo.template_id=value;
                this.searchResult.forEach((item)=>{

                    if(item.id==value){
                        this.showTemUrl=item.preview;
                        this.configInfo.template_name=item.name;
                        Object.assign(this.configInfo,{...item});
                        this.configInfo.ext_json!==null &&  Object.keys( this.configInfo.ext_json).forEach((item)=>{
                            if(/^img_/.test(item)){
                                console.log(/^\.\/config/.test(this.configInfo.ext_json[item].val))
                                let value=this.configInfo.ext_json[item].val;
                                if(/^upload\//.test(value)){
                                    this.configInfo.ext_json[item].val =`/${value}`
                                } else if (/^\.\/config/.test(value)) {

                                    this.configInfo.ext_json[item].val=`/${this.configInfo.package}/${value}`
                                }else if(/^\.\.\/config/.test(value)){
                                    this.configInfo.ext_json[item].val=`/${this.configInfo.package_m}${value}`
                                }
                            }

                        })
                        this.imgList=item.ext_json!==null && Object.entries(item.ext_json).filter((item)=>{
                          return  item[0].indexOf('img_')>-1
                        });
                        this.notimgList=this.configInfo.ext_json!==null && Object.entries(item.ext_json).filter((item)=>{
                            return  item[0].indexOf('img_')==-1
                        });
                        console.log( this.notimgList)

                    }
                })


            },
            handleSubmit(e) {
                e.preventDefault();
                this.configInfo.id= this.$route.params.id;

                const {ext_json,id,template_id,name} =this.configInfo;
                console.log(ext_json)
                const params={
                    id,
                    name,
                    template_id,
                };
                Object.entries(ext_json).forEach((item,index)=>{
                    const map =new Map()
                    map.set(item[0],item[1].val);
                    const mapChangeObj = (map) => {
                        let obj = {};
                        for(let [k,v] of map) {
                            obj[k] = v;
                        }
                        return obj;
                    }
                    Object.assign(params,mapChangeObj(map))
                })
                console.log(params)

                saveExtInfo(params).then(res=>{
                    const {code,msg} =res;
                    if(code==1001){
                        this.$notification.success({message:msg});
                        this.getAppinfo();
                    }else {
                         this.$notification.error({message:msg});
                    }
                })

            },
            Upconfig(info){
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    const {code,msg,data}=info.file.response;
                    if (code==1001){
                        this.$notification.success({message:msg});
                        this.configInfo.ext_json[this.configkey].val=data.path;
                    } else {
                        this.$notification.error({message:msg})
                    }

                } else if (info.file.status === 'error') {
                    this.$notification.error({message:'上传失败'})
                }
            },

            upChangeImage(info){

                console.log(info)
                if (info.file.status === 'uploading') {
                    this.upimageloading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    // Get this url from response in real world.
                    const {code,msg,data}=info.file.response;
                    if(code==1001){
                        this.$refs.upimgurl[this.imgIndex].src=`/${data.path}`;
                        this.configInfo.ext_json[this.imgkey].val=`/${data.path}`;
                        this.$notification.success({message:msg});
                        this.upimageloading = false;
                    }else {
                         this.$notification.error({message:msg})
                    }

                }
            },
            getConfigPath(val){
                this.configkey=val;
            },
            getIndex(index,keyval){
               this.imgIndex=index;
               console.log(keyval)
                this.imgkey=keyval;
            },

            showModal(url) {
                this.previewImg=url;
                this.visible = true;
            },
            handleOk() {
                this.previewImg='';
                this.visible = false;

            },

        }
    }
</script>

<style scoped lang="less">

    .config{
        min-height: 700px;
        .title{
            font-weight: bold;
            font-size: 15px;
        }
        .desc-text{
            color: #999;
            margin-left: 30px;
        }
        .preview{
            margin-left: 30px;
            color: #1890ff;
            cursor: pointer;
        }
        .descimg-text{
            color: #999;
            display: block;
        }


        .config-header{
            .config-serach{
                span{
                    display: inline-block;
                    margin: 30px 20px 30px 60px;
                }
                .ant-btn{
                    margin-left: 30px;
                }
            }

        }
        /deep/.avatar-uploader{
            max-width: 500px;
            /*max-height: 171px;*/
        }
        /deep/.ant-upload.ant-upload-select-picture-card > .ant-upload>img{
            max-width: 500px;
            /*max-height: 171px;*/
        }
        .loadlist{
            text-align: center;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 4px;
            margin-bottom: 20px;
            padding: 30px 50px;
            margin: 20px 0;
        }

    }


</style>
