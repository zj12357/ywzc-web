<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false" class='costomTable'>
      <div style="padding:5px 0 20px">
        <a-button type="primary" @click="() => {addmodalVisible = true;form.resetFields();}">新增证书</a-button>
        <a-button type="primary" style="margin-left:30px" @click='() => devModalVisible = true'>生成证书</a-button>
        <a-button type="primary" style="margin-left:30px" @click="transConfig">转移证书</a-button>
        <a-button type="primary" style="margin-left:30px" @click="deleConfig">批量删除</a-button>

      </div>

      <!-- table -->
        <a-table :dataSource="data" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :loading='loading' :pagination='pagination' :rowKey="record => record.id" :scroll="{ x: 1300 }">
          <!-- <a-table-column title="#" dataIndex="index" key="index" :width="100" fixed='left'/> -->
          <a-table-column title="文件名" dataIndex="file_name" key="file_name" :width="200" fixed='left'/>
          <a-table-column title="签名文件名称" dataIndex="sign_file_name" key="sign_file_name" />
          <a-table-column title="上传日期" dataIndex="created_at" key="created_at" />
          <a-table-column title="创建者" dataIndex="username" key="username" :width='150' v-if="userInfo.is_admin==1"/>
          <a-table-column title="操作" key="action" fixed='right' :width="200">
            <template slot-scope="record" >
              <span>
                <a :href="record.download_url" target="_blank">下载</a>
                  <a-divider type="vertical"/>
                  <a @click="showQRcode(record.download_url)" href="javascript:void (0);"> 预览 </a>
                  <a-divider type="vertical"/>
                   <a @click="copyLink(record)" href="javascript:void (0);"> 复制链接</a>
                  <a-divider type="vertical"/>
                <a @click="rowDelete(record)" href="javascript:void (0);"> 删除 </a>
              </span>
            </template>
          </a-table-column>
        </a-table>
        <!-- dialog -->
        <!-- 新增 -->
          <a-modal
            :width='750'
            title="新增证书"
            centered
            v-model="addmodalVisible"
            @ok="addSubmit(target)"
            :maskClosable="false"
          >
            <a-form :form="form">
              <a-form-item label="文件名" name="name" :label-col="{ span: 3,offset:3 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="['name', { rules: [{ required: true, message: '请输入文件名' }] }]"
                />
              </a-form-item>


              <a-form-item label="签名文件" :label-col="{ span: 3,offset:3}" :wrapper-col="{ span: 12 }">
                <a-upload
                  name="file"
                  :multiple="true"
                  :action="api"
                  :headers="headers"
                  @change="handleChange"
                  v-decorator="[
                      'upload',
                  {
                  rules: [{ required: true, message: '请上传文件' }]
                  },
                   ]"
                >
                  <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                </a-upload>
              </a-form-item>

            </a-form>
          </a-modal>
        <!-- dialog -->
        <!-- 删除 -->
        <a-modal :width='300'
          title="操作"
          centered
          v-model="deleteModalVisible"
          @ok="deleteDomain(target)"
        >
          <p>确定要删除选中的域名吗</p>
        </a-modal>

        <!--生成证书-->
    <a-modal
            :width='750'
            title="生成证书"
            centered
            v-model="devModalVisible"
            @ok="devSubmit"
            :maskClosable="false"
    >
      <a-form :form="formcfg">
        <a-form-item label="文件名" name="name" :label-col="{ span: 3,offset:3 }" :wrapper-col="{ span: 12 }">
          <a-input
                  v-decorator="['name', { rules: [{ required: true, message: '请输入文件名' }] }]"

          />
        </a-form-item>
        <a-form-item label="标题" :label-col="{ span: 3,offset:3}" :wrapper-col="{ span: 12 }">
          <a-input
                  v-decorator="['title', { rules: [{ required: true, message: '请输入标题' }] }]"

          />

        </a-form-item>
        <a-form-item label="地址" :label-col="{ span: 3,offset:3 }" :wrapper-col="{ span: 12 }">
          <a-input
                  v-decorator="['url', { rules: [{ required: true, message: '请输入地址' }] }]"

          />

        </a-form-item>
        <a-form-item label="icon图片" :label-col="{ span: 3,offset:3}" :wrapper-col="{ span: 12 }">
          <a-upload
                  name="file"
                  listType="picture-card"
                  class="avatar-uploader"
                  :showUploadList="false"
                  :action="imgPath"
                  :headers="headers"
                  @change="handleChangeimg"
                  v-decorator="[
                      'upload',
                  {
                  rules: [{ required: true, message: '请上传图片' }]
                  },
                   ]"
          >
            <img  v-lazy="devData.imagePath" alt="avatar" style="width: 80px;height: 80px"/>

          </a-upload>
        </a-form-item>

      </a-form>
    </a-modal>
    <!--预览二维码-->
    <a-modal title="预览" v-model="visibleQR" @ok="handleQR" @cancel="handleQR" :footer="null" centered>
      <p style="color: #1890ff;text-align: center">请扫描二维码</p>
      <div id="qrCode" ref="qrCodeDiv"></div>
    </a-modal>

    <!--转移证书-->
    <a-modal title="转移证书" centered v-model="isTransConfig" @ok="transSigAPPlist" @cancel="selectedRowKeys=[];">
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
import { getCertList,addCert ,transCert} from '@/api/tool'
import { getAlluser } from '@/api/user'
import { mixinDevice } from '@/utils/mixin'
import listPage from '@/utils/page/list'
import resolve from '@/utils/page/resolve'
import verb from '@/utils/page/verb'
import upload from '@/utils/page/upload'
import tableShow from '@/utils/page/tableshow'
import submit from '@/utils/page/submit'
import QRCode from 'qrcodejs2';
import _ from 'lodash';
export default {
  name: 'certificate',
  mixins: [mixinDevice,listPage,resolve,verb,upload,tableShow,submit],
  data () {
    return {
      target: 'tool',
      headers: {
        Authorization:'Bearer '+this.$token
      },
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'formfile' }),
      formcfg: this.$form.createForm(this, { name: 'formcfg' }),
      formtrans: this.$form.createForm(this, { name: 'trans' }),
      loading: true,
      searchData: {
        file_name: '',
        sign_file_name: '',
      },
      api:'/api/upload/mobile_config',
      imgPath:'/api/upload/image',
      devModalVisible:false,
      devData:{
        name:'',
        title:'',
        url:'',
        imagePath:'',
        type:'1'

      },
      visibleQR:false,
      //转移证书
      isTransConfig:false,
      transList:[],
      transParams:{
        id:'',
        uid:''
      }
    }
  },
  methods: {
    async initData(page=1,psize=10,seaechData={}){
      const res = await getCertList(page,psize,seaechData)
      this.init(res,page,psize)
    },
    handleChangeimg(info){
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        const {code,msg,data}=info.file.response;
        if(code==1001){
          this.$notification.success({message:msg});
          this.devData.imagePath=`/${data.path}`;
        }else {
          this.$notification.error({message:msg})
        }
      }
    },
    deleConfig(){
      if(this.selectedRowKeys.length==0){
        this.$notification.warning({message:'请勾选你要删除的文件名称'})
      }else {
        this.deleteModalVisible = true
      }

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
    //转移证书

    transConfig(){
      if(this.selectedRowKeys.length==0){
        this.$notification.warning({message:'请选择证书名称'})
      }else {
        this.isTransConfig=true;
        this.transParams.uid='';
        this.formtrans.resetFields();
        this.transParams.id=this.selectedRowKeys.join(',')
      }
    },

    async transSigAPPlist(){
      this.formtrans.validateFields((err, values)=>{
        if(!err){
          this.isTransConfig=false;
          this.selectedRowKeys=[]
          const {uid}=values;
          this.transParams.uid=uid;
          transCert(this.transParams).then(res=>{
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
     devSubmit(e){
       e.preventDefault();
      this.formcfg.validateFields((err, values) => {

        if(!err){

          this.devModalVisible=false;
          const {name,title,url}=values
          this.devData.name=name;
          this.devData.title=title;
          this.devData.url=url;
           addCert(this.devData).then((res)=>{
            const {code,msg}=res
             if(code==1001){

               this.formcfg.resetFields();
               this.devData.imagePath=''
               this.initData(this.pagination.current,this.pagination.pageSize,this.searchData)

             }else {
               this.$notification.error({message:msg})
             }
          });

        }
      })

    },

    copyLink(r){
      if(r.download_url==''){
        thi.$notification.error({message:'下载地址为空'})
      }else {
        this.$copyText(r.download_url).then(
                (e)=>{
                  this.success('复制成功')
                },
                (e)=>{
                  this.error('复制失败')
                },
        )
      }

    },
    showQRcode(url){
      if(url==''){
        this.$notification.error({message:'下载地址为空'})
      }else {
        this.visibleQR=true;
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
    handleQR(e) {

      this.visible = false;
      this.$nextTick (()=> {
        this.$refs.qrCodeDiv.innerHTML = "";
      })

    },
  },
}
</script>
<style scoped lang="less">
  .gutter-example > .ant-row > div {
    background: transparent;
    border: 0;
  }
  .gutter-box {
    padding: 2px 0;
  }
  .gutter-box span{
    height: 32px;
    line-height: 32px
  }
  #qrCode{
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
</style>
