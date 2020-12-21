<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false" class='costomTable'>
    <div style="margin: 30px 0 10px">
      <a-row type="flex" align="middle">
        <a-col :span="3"  class="search-top">
          <span>应用名称：</span>
          <a-input style="max-width: 80%" v-model="searchData.app_name" @keyup.enter.native="search"></a-input>
        </a-col>
        <a-col :span="3" class="search-top" :offset="1">
          <span>备注：</span>
          <a-input style="max-width: 80%" v-model="searchData.remark" @keyup.enter.native="search"></a-input>
        </a-col>
        <a-col :span="3" class="search-top" :offset="1">
          <span>包名：</span>
          <a-input style="max-width: 80%" v-model="searchData.package_name" @keyup.enter.native="search"></a-input>
        </a-col>
        <a-col :span="3" class="search-top" :offset="1">
          <span>创建者：</span>
          <a-input style="max-width: 80%" v-model="searchData.username" @keyup.enter.native="search"></a-input>
        </a-col>
        <a-col :span="3" class="search-top" :offset="1">
          <span>类型：</span>
          <a-select  style="width: 120px"  placeholder="请选择状态" @change="ChangeStatus">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="1">安卓</a-select-option>
            <a-select-option value="2">苹果</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="2" :offset="1">
          <a-button type="primary" @click="search" :loading="isload_btn">搜索</a-button>
        </a-col>
      </a-row>
    </div>

      <div style="padding:20px 0">
        <a-button type="primary" @click="addModalShow">新增安装包</a-button>
        <a-button type="primary" style="margin-left:30px" @click="transSigApp">转移应用</a-button>
        <a-button type="primary" style="margin-left:30px" @click="deleSigApp">批量删除</a-button>

      </div>

      <!-- table -->
        <a-table :dataSource="data" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :loading='loading' :pagination='pagination' :rowKey="record => record.id" :scroll="{ x: 1750 }">
          <!-- <a-table-column title="#" dataIndex="index" key="index" :width="100" fixed='left'/> -->
          <a-table-column title="应用名称" dataIndex="app_name" key="app_name" :width="200" fixed='left'>

          </a-table-column>
          <a-table-column title="文件名称" dataIndex="name" key="name" :width="220">
            <template slot-scope="record">
              <a-popover :title="record">
                <span>{{record}}</span>
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column title="备注" dataIndex="remark" key="remark" />
          <a-table-column title="版本号" dataIndex="data.versionName" key="data.versionName" />
          <a-table-column title="内部版本号" dataIndex="data.versionCode" key="data.versionCode" />
          <a-table-column title="包名" dataIndex="data.package" key="data.package" :width="200">
            <template slot-scope="record">
              <a-popover :title="record">
                <span>{{record}}</span>
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column title="大小" dataIndex="size" key="size" :width="90"/>
          <a-table-column title="类型" dataIndex="type" key="type" :width="90">
            <template slot-scope="record">
              <span>
                <a-icon :type="record =='苹果' ? 'apple' : 'android'"  theme="filled" style="font-size: 24px"></a-icon>
              </span>

            </template>
          </a-table-column>
          <a-table-column title="创建时间" dataIndex="created_at" key="created_at" :width="200"/>
          <a-table-column title="创建者" dataIndex="username" key="username" v-if="userInfo.is_admin==1" :width="130"/>
          <a-table-column title="操作" key="action" :width='200' fixed='right'>
            <template slot-scope="record">
              <span>
                 <a @click="showEditSigApp(record)" href="javascript:void (0);"> 编辑</a>
                  <a-divider type="vertical"/>
                <a @click="qrcode(record)" href="javascript:void (0);"> 预览 </a>
                  <a-divider type="vertical"/>
                <a @click="copyLink(record)" href="javascript:void (0);"> 复制地址 </a>
                  <a-divider type="vertical"/>
                <a @click="replace(record)" href="javascript:void (0);"> 替换 </a>
              </span>
            </template>
          </a-table-column>
        </a-table>
        <!-- dialog -->
            <!--替换-->
          <a-modal
            :width='750'
            :title="modalTittle"
            centered
            v-model="replaceVisible"
            :maskClosable="false"
          >
            <template slot="footer">
              <a-button   @click="()=>{replaceVisible=false}">取消</a-button>
              <a-button type="primary" @click="addSubmit(target)" :loading="isuping">{{isuping ? '上传中' : '确定'}}</a-button>
            </template>
            <div>
             <a-upload-dragger
                name="file"
                :action="api"
                @change="handleChange"
                :beforeUpload = 'beforeFileUpload'
                :headers="headers"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">点击或拖动文件至区域内上传</p>
                <p class="ant-upload-hint">
                  只支持.ipa结尾的苹果安装包和.apk结尾的安卓安装包
                </p>
              </a-upload-dragger>
            </div>
          </a-modal>

          <!--新增-->
        <a-modal
            :width='750'
            :title="modalTittle"
            centered
            v-model="addmodalVisible"
            :footer="null"
            :maskClosable="false"
    >

      <div>
        <uploadApp @upload="uploadList" :isShow="addmodalVisible" ></uploadApp>
      </div>
    </a-modal>
        <!-- dialog -->
        <!-- 删除 -->
        <a-modal :width='300'
          title="操作"
          centered
          v-model="deleteModalVisible"
          @ok="deleteDomain('single_app')"
        >
          <p>确定要删除选中的安装包吗</p>
        </a-modal>
        <!-- dialog -->
        <!-- 修改 -->
        <a-modal
            title="预览"
            centered
            v-model="morifyModalVisible"
            :footer="null"
            @cancel="cancel"
          >
          <p style="color: #1890ff;text-align: center">请扫描二维码</p>
          <div id="qrCode" ref="qrCodeDiv"></div>
        </a-modal>
         <!--编辑-->
        <a-modal
            title="编辑名称和备注"
            centered
            v-model="editModalVisible"
            @ok="editSigApp"
    >
      <div>
        <a-form :form="form_edit">
            <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
              <a-input

                      v-decorator="[
          'name',
          {
            initialValue: editSigParams.name,
            rules: [{required: true, validator: checkName }],
          },
        ]">
              </a-input>

            </a-form-item>
          <a-form-item label="备注" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
            <a-textarea
                    v-decorator="[
          'remark',
          {
            initialValue: editSigParams.remark,

          },
        ]">
            ></a-textarea>
          </a-form-item>
        </a-form>

      </div>
    </a-modal>
        <!--苹果复制-->
       <a-modal  title="苹果下载链接"
              centered
              :footer="null"
              v-model="IosDownurl"
    >
      <div>
        <ul class="ios-copy">
          <li>
            <p>plist地址:</p>
            <a-input :value="iosCopylink.plist" :disabled="!iosCopylink.plist"></a-input>
             <a-button type="primary" @click="copyiosLink(iosCopylink.plist)">复制</a-button>
          </li>
          <li>
            <p>ipa地址:</p>
            <a-input :value="iosCopylink.ipa" :disabled="!iosCopylink.ipa"></a-input>
            <a-button type="primary" @click="copyiosLink(iosCopylink.ipa)">复制</a-button>
          </li>
        </ul>


      </div>
    </a-modal>

    <!--转移应用-->
    <a-modal title="转移应用" centered v-model="isTransTemplate" @ok="transSigAPPlist" @cancel="selectedRowKeys=[];">
      <div>
        <a-form :form="formtrans">
          <a-form-item label="用户" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
            <a-select @change="chooseTrans"
                      v-decorator="[
                        'uid',
                        {
                          initialValue:transParams.uid,
                          rules: [{required: true, validator: (rule, value, callback)=> {
                              if (value!= '') {
                                  callback();
                              }else {
                                  callback('请选择用户');
                              }

                          } }],
                        },
                      ]" placeholder="请选择用户"
                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                      @search="onUpdateNote"
                      showSearch
                      :showArrow="false"
                      :filterOption="false"
                      :notFoundContent="null"
                      @focus="focusGetTempalte"
            >
              <a-select-option v-for="(item,index) in transList" :key="index" :value="item.id">
                {{item.username}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    </a-card>
</template>

<script>
import QRCode from 'qrcodejs2'
import { getSigAPPlist,editSigAppIos,addSigAppAnd, addSigAppIos,transSigAPP } from '@/api/sigAppList'
import { getAlluser } from '@/api/user'
import { mixinDevice } from '@/utils/mixin'
import listPage from '@/utils/page/list'
import resolve from '@/utils/page/resolve'
import verb from '@/utils/page/verb'
import tableShow from '@/utils/page/tableshow'
import statusVerb from '@/utils/page/status'
import upload from '@/utils/page/upload'
import submit from '@/utils/page/submit'
import uploadApp from '@/components/tools/upload/uploadApp.vue'
import _ from 'lodash';
export default {
  name: 'sigAppList',
  mixins: [mixinDevice,listPage,resolve,verb,tableShow,statusVerb,upload,submit],
  data () {
    return {
      loading: true,
      modalTittle:'新增安装包',
      target:'sigapp_and',
      headers: {
        authorization: 'authorization-text',
      },
      formLayout: 'horizontal',
      form_edit: this.$form.createForm(this, { name: 'sigApp_edit' }),
      form: this.$form.createForm(this, { name: 'sigApp' }),
      formtrans: this.$form.createForm(this, { name: 'trans' }),
      //按钮搜索状态
      isload_btn:false,
      api:'',
      andApi:'/api/upload/apk',
      iosApi:'/api/upload/ipa',
      relpaceData:{},
    editModalVisible:false,
      editSigParams:{
        id:'',
        name:'',
        remark:'',
        username:''
      },
      //替换文件类型判断
      checkUptype:'',
      //是否新增
      isNewAdd:false,
      searchData:{
        app_name:'',
        remark:'',
        package_name:''
      },
      //安装包上传状态
      isuping:false,
      //上传文件
      headers:{
        Authorization:'Bearer '+this.$token
      },
      //苹果地址复制
      IosDownurl:false,
      iosCopylink:{
        plist:'',
        ipa:''
      },
      replaceVisible:false,
      //转移应用
      isTransTemplate:false,
      transList:[],
      transParams:{
        id:'',
        uid:''
      }

    }
  },
  components:{
    uploadApp
  },
  methods: {

    async initData(page=1,psize=10,searchData={}){
      const res = await getSigAPPlist(page,psize,searchData)
      res ? this.isload_btn=false : this.isload_btn=true
      this.init(res,page,psize,'sigApp')
    },
    addModalShow(){
      this.addmodalVisible = true
      this.modalTittle = '新增安装包'
      this.relpaceData = {}
      this.addData = {}
      this.isNewAdd=true;
      this.checkUptype=''
    },

    ChangeStatus(val){

      if(val==''){
        const {type,...rest}=this.searchData;
        this.searchData={...rest}
      }else {
        this.searchData.type = val
      }
    },
    showEditSigApp({id,name,remark}){
      this.form_edit.resetFields();
      this.editModalVisible=true;
      this.editSigParams.id=id;
      this.editSigParams.name=name;
      this.editSigParams.remark=remark
    },
    deleSigApp(){
      if(this.selectedRowKeys.length==0){
        this.$notification.warning({message:'请勾选要删除的安装包名称'})
      }else {
        this.deleteModalVisible = true
      }

    },
    async editSigApp(){

      this.form_edit.validateFields((err, values)=>{
        if(!err){
          this.editModalVisible=false;
          const {name,remark}=values;
          this.editSigParams.name=name;
          this.editSigParams.remark=remark;
          editSigAppIos(this.editSigParams).then(res=>{
            const {code,msg}=res
            if(code==1001){
              this.$notification.success({message:msg});
              this.form_edit.resetFields();
              this.initData(this.pagination.current,this.pagination.pageSize,this.searchData)
            }else {
              this.$notification.error({message:msg})
            }
          })

        }
      })

    },
    onUpdateNote: _.debounce(function(val) {
      getAlluser({username:val}).then(res=>{
        const {code,msg,data}=res;
        if(code==1001){
          this.transList=data;
        }else {
          this.$notification.error({message:msg})
        }
      })
    }, 500),
    focusGetTempalte(){
      getAlluser({username:''}).then(res=>{
        const {code,msg,data}=res;
        if(code==1001){
          this.transList=data;
        }else {
          this.$notification.error({message:msg})
        }
      })
    },
    //转移应用
    chooseTrans(val){
      this.transParams.uid=val
    },
    //转移应用
    transSigApp(){
      if(this.selectedRowKeys.length==0){
        this.$notification.warning({message:'请选择应用名称'})
      }else {
        this.isTransTemplate=true;
        this.transParams.uid='';
        this.formtrans.resetFields();
        this.transParams.id=this.selectedRowKeys.join(',')

      }
    },

    async transSigAPPlist(){
      this.formtrans.validateFields((err, values)=>{
        if(!err){
          this.isTransTemplate=false;
          this.selectedRowKeys=[]
          const {uid}=values;
          this.transParams.uid=uid;
          transSigAPP(this.transParams).then(res=>{
                    const {code,msg}=res
                    if(code==1001){
                      this.formtrans.resetFields();
                      this.$notification.success({message:msg})
                      this.initData(this.pagination.current,this.pagination.pageSize,this.searchData)
                    }else {
                      this.$notification.error({message:msg})
                    }
                  }
          )

        }
      })

    },
    checkName(rule, value, callback) {
      if (value!= '') {
        callback();
      }else {
        callback('请输入名称');
      }

    },
    copyLink(r){
     if(r.type=='安卓'){
       if(r.test_domain==''){
         this.$notification.error({message:'下载地址为空'})
       }else {
         this.$copyText(r.test_domain).then(
                 (e)=>{
                   this.success('复制成功')
                 },
                 (e)=>{
                   this.error('复制失败')
                 }
         )
       }
     }else {
       console.log(r)
       this.IosDownurl=true
       this.iosCopylink.plist=r.test_domain;
       this.iosCopylink.ipa=r.package_url;

     }


    },
    copyiosLink(url){
      if(!url){this.$notification.error({message:'下载地址为空'})}else {
        this.$copyText(url).then(
                (e)=>{
                  this.success('复制成功')
                },
                (e)=>{
                  this.error('复制失败')
                }
        )
      }

    },
    qrcode(r){
      if(r.test_url==''){
        this.$notification.error({message:'下载地址为空'})
      }else {
        this.morifyModalVisible = true
        this.$nextTick(
                ()=>{
                  new QRCode(this.$refs.qrCodeDiv, {
                    text: r.test_url,
                    width: 200,
                    height: 200,
                    colorDark: "#333333",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.L
                  })
                }
        )
      }

    },
    cancel(){
      this.$nextTick (()=> {
        this.$refs.qrCodeDiv.innerHTML = "";
      })
    },
    replace(r){
      this.addData.id=r.id
      this.modalTittle = '替换安装包'
      this.replaceVisible = true
      this.relpaceData = r;
      this.checkUptype=r.type;
      this.isNewAdd=false;
    },
    uploadList(val,name){
        this.addData.filename=name;
        this.addData.pkg_info=val;
        if(/\.(apk)$/i.test(name)){
          addSigAppAnd(this.addData).then(res=>{
            this.resolve(res,'su_add','erruploadTip')
          })
        }else if(/\.(ipa)$/i.test(name)){
          addSigAppIos(this.addData).then(res=>{
            this.resolve(res,'su_add','erruploadTip')
          })
        }

    },
  }
}
</script>

<style scoped lang="less">
  .search-top{
    display: flex;
    align-items: center;
    span{
      white-space: nowrap;
    }
  }
  /deep/.anticon-android svg {
    color: #a4c53a;
  }
  .ios-copy {
    display: flex;
    justify-content: center;
    flex-wrap:wrap ;
    padding:  0 20px;
    li{
      display: flex;
      justify-content: space-between;
      margin: 10px auto;
      width: 100%;
      align-items: center;
      /deep/.ant-input{
        width: 90%;
        margin-left: 10px;
      }
      p{
        font-size: 16px;
        margin: 0;
        white-space: nowrap;
        text-align: left;
        width: 100px;

      }
    }


  }

  #qrCode{
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
</style>
