<template>
    <div class="android">

        <a-card style="min-height: 700px">
            <a-tabs defaultActiveKey="1" @change="callback">
                <a-tab-pane tab="Apk包" key="1">
                    <div class="android-header" v-if="packageList.length!=0">
                        <div class="android-header-img">
                            <img v-lazy="'/'+Appintegrate.package.data.iconimage" alt="" >

                            <p>{{Appintegrate.name}}</p>
                        </div>
                        <div>
                            <ul class="android-header-appinfo">
                                <li>
                                    <p>序号</p>
                                    <p>{{Appintegrate.package.id}}</p>
                                </li>
                                <li>
                                    <p>文件大小</p>
                                    <p>{{Appintegrate.package.size}}</p>
                                </li>
                                <li>
                                    <p>应用名称</p>
                                    <p>{{Appintegrate.package.data.appname}}</p>
                                </li>
                                <li>
                                    <p>上传时间</p>
                                    <p>{{Appintegrate.package.created_at}}</p>
                                </li>
                                <li>
                                    <p>版本号(versionName)</p>
                                    <p>{{Appintegrate.package.data.versionName}}</p>
                                </li>
                                <li>
                                    <p>包名(applicationID)</p>
                                    <p>{{Appintegrate.package.data.package}}</p>
                                </li>
                                <li>
                                    <p>内部版本号(versionCode)</p>
                                    <p>{{Appintegrate.package.data.versionCode}}</p>
                                </li>
                                <li>
                                    <p>appKey</p>
                                    <p>{{Appintegrate.app_key}}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="loadlist" v-else>
                        <a-skeleton>
                        </a-skeleton>

                    </div>
                    <div class="android-upload">
                        <a-upload
                                name="file"
                                :multiple="true"
                                :action="appPath"
                                :headers="headers"
                                @change="upApkPage"

                        >
                            <a-button type="primary"> <a-icon type="upload" /> 上传新apk包 </a-button>
                        </a-upload>
                    </div>

                    <div>
                        <div>
                            <a-table
                                    :rowKey="packageList => packageList.id"
                                    :columns="columns"
                                    :dataSource="packageList"

                            >


                                    <span slot="action" slot-scope="text, record">

                                           <a href="javascript:;" @click="showQRcode(record.test_url)">测试</a>
                                          <a-divider type="vertical" />
                                          <a href="javascript:;" @click="showDeleteConfirm(record.id)">删除</a>
                                </span>
                            </a-table>
                        </div>
                    </div>
                </a-tab-pane>


                <a-tab-pane tab="安卓下载设置" key="2" forceRender>

                    <div class="android-download">
                        <a-row>
                            <a-col :span="3" :offset="2">
                                <span >选择安装方式:</span>
                            </a-col>
                            <a-col :span="15">
                                <a-radio-group v-model="saveParams.ad_config_install_type">
                                    <a-radio :value="1">托管APK</a-radio>
                                    <a-radio :value="2">外部APK</a-radio>
                                </a-radio-group>

                            </a-col>
                        </a-row>
                        <a-row v-if="saveParams.ad_config_install_type==1">
                            <a-col :span="3" :offset="2">
                                <span >选择托管的APK包:</span>

                            </a-col>
                            <a-col :span="15">
                                <a-select  style="width: 300px"
                                           defaultValue="请选择"
                                           :value="saveParams.ad_config_install_data.apk_id"
                                           v-model="saveParams.ad_config_install_data.apk_id"
                                >
                                    <a-select-option   v-for="(item,index) in downConfig" :key="index" :value="item.id">{{'序号：'+item.id+' '+'时间：'+ item.created_at}}</a-select-option>

                                </a-select>
                            </a-col>
                        </a-row>
                        <a-row v-else="saveParams.ad_config_install_type==2">
                            <a-col :span="3" :offset="2">
                                <span >APK文件的下载地址:</span>

                            </a-col>
                            <a-col :span="15">
                                <a-input style="width: 600px" v-model="saveParams.ad_config_install_data.download_url"></a-input>
                            </a-col>
                        </a-row>

                        <a-row>
                            <a-col :span="3" :offset="5">
                                <a-button type="primary" class="android-submit" @click="saveConfig">确认提交</a-button>
                            </a-col>

                        </a-row>
                    </div>

                </a-tab-pane>

            </a-tabs>
        </a-card>
        <a-modal title="二维码" v-model="visible" @ok="handleOk" @cancel="handleOk" :footer="null" centered>
            <p style="color: #1890ff;text-align: center">请扫描二维码</p>
            <div id="qrCode" ref="qrCodeDiv"></div>
        </a-modal>
    </div>
</template>

<script>

    import {UpAndroidPage} from '@/api/other';
    import {getAppintegrate,getPackageList,addApk,delPackage,downloadCfg,configSave} from '@/api/application';
    import moment from 'moment';
    import QRCode from 'qrcodejs2';
    const columns = [
        {
            title:'#',
            dataIndex: 'index',
            key: 'index',

        },
        {
            title:'应用名称',
            dataIndex:'data.appname',
            key:'data.appname'
        },
        {
            title:'版本号',
            dataIndex: 'data.versionName',
            key: 'data.versionName',

        },
        {
            title: '内部版本号',
            dataIndex: 'data.versionCode',
            key: 'data.versionCode',
        },
        {
            title: '文件大小',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: '上传日期',
            key: 'created_at',
            dataIndex: 'created_at',
        },
        {
            title: '操作',
            key: 'action',
            dataIndex:'action',
            scopedSlots: { customRender: 'action' },
        },
    ];

    export default {
        name: "android",
        data(){
            return{
                columns,
                headers: {
                    Authorization:'Bearer '+this.$token
                },
                appParams:{
                    id:this.$route.params.id,
                    type:1
                },
                packageParams:{
                    id:this.$route.params.id,
                    type:1,
                    page:1,
                    psize:10
                },
                appPath:'/api/upload/apk',
                //上传包信息
                upAPKpageResult:{},
                //下载设置信息
                downConfig:[],

                //应用包信息
                Appintegrate:{
                    package:{
                        data:{

                        }
                    }
                },
                //应用包列表
                packageList:[],
                //保存下载数据
                saveParams:{
                    id:'',
                    type:1,
                    ad_config_install_type:1,
                    ad_config_install_data:{
                        apk_id:'',
                        download_url:'',
                    }
                },
                visible: false,



            }

        },
        created(){
            //初始化数据
            this.GetAppintegrate();
            this.GetPackageList();
        },
        mounted(){
            console.log(this.Appintegrate)
        },
        watch:{
            $route(to,from){

            }
        },
        computed:{

        },
        methods:{
            //获取应用集成信息,获取应用集成包上传列表
            async GetAppintegrate(){
                const {code,msg,data}=await getAppintegrate(this.appParams);
                if(code==1001){
                    data.package.created_at= moment.unix(data.package.created_at).format('YYYY-MM-DD HH:mm:ss')
                    data.package.length!==0 ?  this.Appintegrate=data : ''
                }else {
                   this.$notification.error({message:msg});

                }
            },
            async GetPackageList(){
                const {code,msg,data}= await  getPackageList(this.packageParams);
                if(code==1001){
                    data.list.forEach((item,index)=>{
                        item.created_at = moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss');
                        item.index=index+1
                    })
                    this.packageList=data.list
                }else {
                   this.$notification.error({message:msg});

                }

            },
            callback(key) {
                console.log(key);
                this.getAppConfig()
            },
            //上传APK包
            upApkPage(info) {

                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done' ) {
                    if(info.file.response.code==1001){
                        this.$notification.success({message:'上传成功'})
                        this.upAPKpageResult=info.file.response.data;
                        this.addAPKpage();
                        this.GetAppintegrate();
                        this.GetPackageList();
                    }else {
                        this.$notification.error({message:info.file.response.msg})
                    }

                } else if (info.file.status === 'error') {
                    this.$notification.error(`${info.file.name} file upload failed.`);
                }
            },
            //保存APK信息
            async addAPKpage(){
                const res=await addApk({app_id:this.$route.params.id,pkg_info:{...this.upAPKpageResult}});
                const {code,msg}=res;
                if(code==1001){
                    this.$notification.success({message:msg});
                    this.upAPKpageResult={};
                    this.GetAppintegrate();
                    this.GetPackageList();
                }else {
                     this.$notification.error({message:msg});
                }

            },
            //删除APK包
            async delAPKpage(id){
                const res= await delPackage({id,app_id:this.$route.params.id});
                const {code,msg}=res;
                if(code==1001){
                    this.$notification.success({message:msg});
                    this.GetAppintegrate();
                    this.GetPackageList();
                }else {
                     this.$notification.error({message:msg});
                }
            },
            //获取下载设置
            async getAppConfig(){
                const {code,msg,data} = await  downloadCfg(this.appParams)
                if(code==1001){
                    data.package_list.forEach((item)=>{
                        item.created_at = moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss');
                    })
                    this.downConfig=data.package_list;
                    if(data.ad_config_install_data!==null){
                        this.saveParams.ad_config_install_data={...data.ad_config_install_data}
                    }
                    //默认选中
                    if(data.ad_config_install_type!==null){
                        this.saveParams.ad_config_install_type=data.ad_config_install_type
                    }
                }else {
                    this.$notification.error({message:msg})
                }
            },
            //保存下载设置
            async saveConfig(){


                this.saveParams.id=this.$route.params.id
                this.saveParams.ad_config_install_data= JSON.stringify(this.saveParams.ad_config_install_data);
                const {code,msg}= await configSave(this.saveParams);
                if(code==1001){
                    this.$notification.success({message:msg});
                    this.saveParams.ad_config_install_data=JSON.parse(this.saveParams.ad_config_install_data);
                    Object.keys(this.saveParams.ad_config_install_data).forEach((item)=>this.saveParams.ad_config_install_data[item]='')
                    this.getAppConfig()

                }else {
                    this.$notification.error(msg);
                }

            },

            showDeleteConfirm(id) {
                this.$confirm({
                    title: '你确定要删除该APK包吗',
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk:()=> {
                        this.delAPKpage(id)
                        console.log('OK');
                    },
                    onCancel:()=> {
                        console.log('Cancel');
                    },
                });
            },
            showQRcode(url){
                if(url==''){
                    this.$notification.error({message:'下载地址为空'})
                }else {
                    this.visible=true;
                    this.$nextTick (()=> {
                        this.bindQRCode(url);
                    })
                }

            },
            bindQRCode: function (url) {
                new QRCode(this.$refs.qrCodeDiv, {
                    text: url,
                    width: 200,
                    height: 200,
                    colorDark: "#333333", //二维码颜色
                    colorLight: "#ffffff", //二维码背景色
                    correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
                })
            },
            //测试生成二维码
            handleOk(e) {

                this.visible = false;
                this.$nextTick (()=> {
                    this.$refs.qrCodeDiv.innerHTML = "";
                })

            },
        }

    }
</script>

<style scoped lang="less">
    .android{
        .android-header{
            display: flex;
            align-items: center;
            .android-header-img{
                margin-left: 60px;
                margin-right: 30px;
                p{
                    margin-top: 10px;
                    text-align: center;
                }
                img {
                    width: 75px;
                    height: 75px;
                    display: block;
                    margin: 0 auto
                }
            }
            .android-header-appinfo{

                display: flex;
                justify-content: space-around;
                text-align: left;
                flex-flow: wrap;
                li{

                    width: 25%;
                    p:nth-child(2n){
                        font-weight: bold;
                        font-size: 15px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
        .android-upload{
            margin: 20px 0;
        }
        .android-download{

            .ant-row{
                margin: 30px 0;
            }
            .android-submit{
                margin-top: 50px;
            }

        }
        .loadlist {
            text-align: center;
            background: #fff;
            border-radius: 4px;
            margin-bottom: 20px;
            padding: 30px 50px;
            margin: 20px 0;
        }

    }
    #qrCode{
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

</style>
