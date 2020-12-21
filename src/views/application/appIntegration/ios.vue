<template>

    <div class="ios">

        <a-card style="min-height: 700px">
            <a-tabs defaultActiveKey="1" @change="callback">
                <a-tab-pane tab="IPA包" key="1">
                    <div class="ios-header" v-if="packageList.length!=0">
                        <div class="ios-header-img">
                            <img v-lazy="'/'+Appintegrate.package.data.iconimage" alt=""  >

                            <p>{{Appintegrate.name}}</p>
                        </div>
                        <div>
                            <ul class="ios-header-appinfo">
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
                    <div class="loadlist" v-else >
                        <a-skeleton>
                        </a-skeleton>

                    </div>
                    <div class="ios-upload">
                        <a-upload
                                name="file"
                                :multiple="true"
                                :action="appPath"
                                @change="upIpaPage"
                                :headers="headers"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 上传新ipa包 </a-button>
                        </a-upload>
                    </div>

                    <div>
                        <div>
                            <a-table
                                    :columns="columns" :dataSource="packageList"
                                    :rowKey="packageList => packageList.id"
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


                <a-tab-pane tab="苹果下载设置" key="2" forceRender>

                    <div class="ios-download">
                        <a-row>
                            <a-col :span="3" :offset="2">
                                <span >集成应用宝:</span>
                            </a-col>
                            <a-col :span="15">
                                <a-switch checkedChildren="启动" unCheckedChildren="关闭"  @change="isOpenCheck" :checked="isOpen"/>

                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="3" :offset="2">
                                <span >应用宝地址:</span>
                            </a-col>
                            <a-col :span="15">
                                <a-input placeholder="请输入地址" style="width: 400px" :disabled="isOpen==true ? false : true" v-model="saveParams.pg_config_myapp_url"/>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="3" :offset="2">
                                <span >选择安装方式:</span>
                            </a-col>
                            <a-col :span="15">
                                <a-radio-group v-model="saveParams.pg_config_install_type" >
                                    <a-radio :value="1">托管IPA</a-radio>
                                    <a-radio :value="2">超级签</a-radio>
                                    <a-radio :value="3">App Store</a-radio>
                                    <a-radio :value="4">外部plist</a-radio>
                                    <a-radio :value="5">其他</a-radio>
                                </a-radio-group>

                            </a-col>
                        </a-row>
                        <a-row v-if="saveParams.pg_config_install_type==1">
                            <a-col :span="3" :offset="2">
                                <span >选择托管的IPA包:</span>

                            </a-col>
                            <a-col :span="15">
                                <a-select defaultValue="请选择"
                                          style="width: 300px"
                                          :value="saveParams.pg_config_install_data.ipa_id"
                                          v-model="saveParams.pg_config_install_data.ipa_id"
                                >
                                    <a-select-option v-for="(item,index) in downConfig" :key="index" :value="item.id">{{'序号：'+item.id+' '+'时间：'+ item.created_at}}</a-select-option>

                                </a-select>
                            </a-col>
                        </a-row>

                        <a-row v-else-if="saveParams.pg_config_install_type==2">
                            <a-col :span="3" :offset="2">
                                <span>超级签下载地址:</span>
                            </a-col>
                            <a-col :span="15">
                                <a-input style="width: 400px" v-model="saveParams.pg_config_install_data.download_url"></a-input>
                            </a-col>
                            <a-col :span="3" :offset="2" style="margin-top: 30px">
                                <span>是否配置唤醒文件:</span>
                            </a-col>
                            <a-col :span="15" style="margin-top: 30px">
                                <a-switch checkedChildren="配置" unCheckedChildren="关闭" @change="onChangeBsicFile" :checked="isShowbsicFile"/>
                            </a-col>
                            <!-- <a-col :span="3" :offset="2" v-if="saveParams.pg_config_install_data.isShowbsicFile" style="margin-top: 30px">
                                <span>唤醒文件地址:</span>
                            </a-col>
                            <a-col :span="15" v-if="saveParams.pg_config_install_data.isShowbsicFile" style="margin-top: 30px">
                                <a-input style="width: 400px" v-model="saveParams.pg_config_install_data.jumpfile_url"></a-input>
                            </a-col> -->
                            
                        </a-row>

                        <a-row v-else-if="saveParams.pg_config_install_type==3">
                            <a-col :span="10"  :offset="5">
                                <div style="margin-bottom: 10px">
                                    <a-checkbox @change="onChange" :checked="saveParams.pg_config_install_data.iSvest_pack">马甲包</a-checkbox>

                                </div>
                            </a-col>
                            <a-col :span="10"  :offset="5" v-if="saveParams.pg_config_install_data.iSvest_pack==true">

                                <div style="margin-top: 10px">
                                    <a-upload
                                            name="file"
                                            listType="picture-card"
                                            class="avatar-uploader"
                                            :showUploadList="false"
                                            :action="imgPath"
                                            @change="handleChange"
                                            :headers="headers"
                                    >

                                        <img v-lazy="saveParams.pg_config_install_data.app_icon_img" alt="avatar"  style="width: 80px;height: 80px"/>

                                    </a-upload>
                                </div>

                                <div>
                                    <p>名称:</p>
                                    <a-input style="width: 400px" v-model="saveParams.pg_config_install_data.app_icon_name"></a-input>
                                </div>

                                <div>
                                    <p>跳转地址:</p>
                                    <a-input style="width: 600px" v-model="saveParams.pg_config_install_data.vest_pack_url"></a-input>
                                </div>

                            </a-col>

                            <a-col :span="15" :offset="5" v-else="saveParams.pg_config_install_data.iSvest_pack==false">
                                <p>AppStore下载地址:</p>
                                <a-input style="width: 600px" v-model="saveParams.pg_config_install_data.app_store_url"></a-input>
                            </a-col>
                        </a-row>

                        <a-row v-else-if="saveParams.pg_config_install_type==4">
                            <a-col :span="3" :offset="2">
                                <span>外部plist下载地址:</span>
                            </a-col>
                            <a-col :span="15">
                                <a-input style="width: 600px" v-model="saveParams.pg_config_install_data.plist"></a-input>
                            </a-col>
                        </a-row>


                        <a-row v-else-if="saveParams.pg_config_install_type==5">

                            <a-col :span="3" :offset="2">
                                <span>下载地址:</span>
                            </a-col>

                            <a-col :span="10" >

                                <div>
                                    <a-input style="width: 600px" v-model="saveParams.pg_config_install_data.other_vest_pack_url"></a-input>
                                </div>

                            </a-col>
                        </a-row>

                        <a-row>
                            <a-col :span="3" :offset="5">
                                <a-button type="primary" class="ios-submit" @click="saveConfig">确认提交</a-button>
                            </a-col>

                        </a-row>
                    </div>

                </a-tab-pane>

            </a-tabs>
        </a-card>

        <a-modal title="测试" v-model="visible" @ok="handleOk" @cancel="handleOk" :footer="null" centered>
            <p style="color: #1890ff;text-align: center">请扫描二维码</p>
            <div id="qrCode" ref="qrCodeDiv"></div>
        </a-modal>
    </div>

</template>

<script>

    import {UpAndroidPage} from '@/api/other';
    import {getAppintegrate,getPackageList,addIpa,delPackage,downloadCfg,configSave} from '@/api/application';
    import moment from 'moment'
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
        name: "ios",
        data(){
            return{

                columns,
                isShowbsicFile:false,
                appParams:{
                    id:this.$route.params.id,
                    type:2
                },
                packageParams:{
                    id:this.$route.params.id,
                    type:2,
                    page:1,
                    psize:10
                },
                appPath:'/api/upload/ipa',
                imgPath:'/api/upload/image',
                //上传包信息
                upAPKpageResult:{},
                //应用包信息
                Appintegrate:{
                    package:{
                        data:{

                        }
                    }
                },
                //下载设置信息
                downConfig:[],
                //应用包列表
                packageList:[],
                //是否开启集成应用
                isOpen:true,
                isOpenUrl:'',
                //保存下载数据
                saveParams:{
                    id:'',
                    type:2,
                    pg_config_is_myapp:'',
                    pg_config_myapp_url:'',
                    pg_config_install_type:1,
                    is_show_bsicfile:0,
                    pg_config_install_data:{
                        ipa_id:'',
                        download_url:'',
                        app_store_url:'',
                        plist:'',
                        iSvest_pack:false,
                        app_icon_img:'',
                        app_icon_name:'',
                        vest_pack_url:'',
                        other_vest_pack_url:''
                    }
                },

                visible: false,
                //上传文件
                headers:{
                    Authorization:'Bearer '+this.$token
                }

            }
        },
        created(){
            this.GetAppintegrate()
            this.GetPackageList()
        },
        computed:{

        },
        watch:{
            isOpen(newVal,Val){
                if (newVal==false){
                    this.saveParams.pg_config_myapp_url=''
                }else {
                    this.saveParams.pg_config_myapp_url=this.isOpenUrl
                }
            }
        },
        methods:{
            onChangeBsicFile(checked){
                this.isShowbsicFile = checked
                if(checked){
                    this.saveParams.is_show_bsicfile = 1
                }else this.saveParams.is_show_bsicfile = 0
                // this.saveParams.pg_config_install_data.isShowbsicFile = checked
            },
            isOpenCheck(checked){
                this.isOpen=checked
            },

            onChange(e){
                console.log(`checked = ${e.target.checked}`);
                this.saveParams.pg_config_install_data.iSvest_pack=e.target.checked
            },

            handleChange(info){
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    // Get this url from response in real world.
                    const {code,msg,data}=info.file.response;
                    if(code==1001){
                        this.$notification.success({message:msg});
                       this.saveParams.pg_config_install_data.app_icon_img=`/${data.path}`;


                    }else {
                        this.$notification.error({message:msg})
                    }
                }
            },

            //获取应用集成信息,获取应用集成包上传列表

            async GetAppintegrate(){
                const {code,msg,data}=await getAppintegrate(this.appParams);
                if(code==1001){
                    data.package.created_at= moment.unix(data.package.created_at).format('YYYY-MM-DD HH:mm:ss');
                     data.package.length!==0 ? this.Appintegrate=data : ''
                }else {
                   this.$notification.error({message:msg});

                }
            },
            async GetPackageList(){
                const {code,msg,data}= await  getPackageList(this.packageParams);
                if(code==1001){
                    data.list.forEach((item,index)=>{
                        item.created_at = moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss')
                        item.index=index+1
                    })
                    this.packageList=data.list
                }else {
                   this.$notification.error({message:msg});

                }

            },
            callback(key) {
                console.log(key);
                this.getAppConfig();
            },
            //上传IPA包
            upIpaPage(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done' ) {
                    if(info.file.response.code==1001){
                        this.$notification.success({message:'上传成功'})
                        this.upAPKpageResult=info.file.response.data;
                        this.addIPApage();
                        this.GetAppintegrate()
                        this.GetPackageList()
                    }else {
                        this.$notification.error({message:info.file.response.msg})
                    }

                } else if (info.file.status === 'error') {
                    this.$notification.error(`${info.file.name} file upload failed.`);
                }
            },
            //保存IPA信息
            async addIPApage(){
                const res=await addIpa({app_id:this.$route.params.id,pkg_info:{...this.upAPKpageResult}});
                const {code,msg}=res;
                if(code==1001){
                    this.$notification.success({message:msg});
                    this.GetAppintegrate();
                    this.GetPackageList();
                    this.upAPKpageResult={}
                }else {
                     this.$notification.error({message:msg});
                }

            },

            //删除IPA包
            async delIPApage(id){
                const {code,msg}= await delPackage({id,app_id:this.$route.params.id})
                if(code==1001){
                    this.$notification.success({message:msg});
                    this.GetAppintegrate()
                    this.GetPackageList();
                }else {
                     this.$notification.error({message:msg});
                }
            },

            //获取下载设置
            async getAppConfig(){
                const {code,msg,data} = await  downloadCfg(this.appParams)
                if(code==1001){
                    console.log('data',data)
                    data.package_list.forEach((item)=>{
                        item.created_at = moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss')
                    })
                    if(data.is_show_bsicfile){
                        this.isShowbsicFile = true
                    }else this.isShowbsicFile = false
                    this.downConfig=data.package_list;
                    this.saveParams.pg_config_myapp_url=data.pg_config_myapp_url;
                    this.isOpenUrl=data.pg_config_myapp_url;
                    if(data.pg_config_install_data!==null){
                        this.saveParams.pg_config_install_data={...data.pg_config_install_data}
                    }
                    //默认选中
                    if(data.pg_config_install_type!==null){
                        this.saveParams.pg_config_install_type=data.pg_config_install_type
                    }
                }else {
                    this.$notification.error({message:msg})
                }
            },

            //保存下载设置
            async saveConfig(){
                if(this.isOpen==true){
                    this.saveParams.pg_config_is_myapp=1

                }else {
                    this.saveParams.pg_config_is_myapp=0
                }


                this.saveParams.id=this.$route.params.id
                this.saveParams.pg_config_install_data= JSON.stringify(this.saveParams.pg_config_install_data);
                console.log(this.saveParams)
                const {code,msg}= await configSave(this.saveParams);
                if(code==1001){
                    this.$notification.success({message:msg});
                    this.saveParams.pg_config_install_data=JSON.parse(this.saveParams.pg_config_install_data);

                    Object.keys(this.saveParams.pg_config_install_data).forEach(item=>this.saveParams.pg_config_install_data[item]='' )
                    this.getAppConfig()

                }else {
                    this.$notification.error({message:msg});
                }

            },

            showDeleteConfirm(id) {
                this.$confirm({
                    title: '你确定要删除该IPA包吗',
                    // content: 'Some descriptions',
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk:()=> {

                        this.delIPApage(id)
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
    .ios{
        .ios-header{
            display: flex;
            align-items: center;
            .ios-header-img{
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
            .ios-header-appinfo{

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
        .ios-upload{
            margin: 20px 0;
        }
        .ios-download{

            .ant-row{
                margin: 30px 0;
            }
            .ios-submit{
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
        p{
            margin-top: 1rem;
        }

    }
    #qrCode{
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

</style>
