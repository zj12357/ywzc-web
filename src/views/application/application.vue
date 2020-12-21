<template>
  <div>
    <a-card>
      <div style="margin: 30px 0">
        <a-row type="flex" align="middle">
          <a-col :span="4"  class="search-top">
            <span>应该名称：</span>
            <a-input style="max-width: 80%" v-model="searchData.name" @keyup.enter.native="search"></a-input>
          </a-col>
          <a-col :span="6" class="search-top" :offset="1">
            <span>域名：</span>
            <a-input style="max-width: 80%" v-model="searchData.domain" @keyup.enter.native="search"></a-input>
          </a-col>
          <a-col :span="4" class="search-top" :offset="1">
            <span>AppKey：</span>
            <a-input style="max-width: 80%" v-model="searchData.app_key" @keyup.enter.native="search"></a-input>
          </a-col>
          <a-col :span="4" class="search-top" :offset="1">
            <span>创建者：</span>
            <a-input style="max-width: 80%" v-model="searchData.username" @keyup.enter.native="search"></a-input>
          </a-col>
          <a-col :span="2" :offset="1">
            <a-button type="primary" @click="search"  :loading="isload_btn">搜索</a-button>
          </a-col>
        </a-row>
      </div>
      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="() => {addmodalVisible = true;form.resetFields();}" >
          新增站点
        </a-button>
        <a-button type="primary" @click="copy" style="margin-left: 30px">
          复制站点
        </a-button>
        <a-button type="primary" @click="trans" style="margin-left: 30px">
          转移站点
        </a-button>
        <a-button type="primary" @click="deleteAll" style="margin-left: 30px">
          批量删除
        </a-button>

      </div>

      <div>
        <a-table
          :rowKey="applist => applist.id"
          :columns="columns"
          :dataSource="data"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :pagination='pagination'
          :loading='loading'
          :scroll="{ x: 1300 }"
        >
        <span slot="img" slot-scope="record">
          <img v-lazy="'/'+record" alt="" style="width: 40px;height: 40px" >

        </span>
        <span slot="action" slot-scope="text, record">
          <a herf='javascript:' @click="$router.push({
              name:'appBasics',params:{id:record.id}
            })">详情</a>
          <a-divider type="vertical"/>
          <a href="javascript:void (0);" @click="iStemplate_cfg(record)">预览</a>

          <a-divider type="vertical"/>
          <a  href="javascript:;" @click="showDeleteConfirm(record)" >删除</a>

        </span>
        </a-table>
       <!-- 新增应用-->
        <a-modal title="新增应用" v-model="addmodalVisible" @ok="addSubmit(target)" centered :width="650"  :maskClosable="false">
            <a-form :form="form">
              <a-form-item label="应用名称" name="name" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="['name', { rules: [{ required: true, message: '请输入应用名称' }] }]"
                />
              </a-form-item>
              <a-form-item label="应用图标" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                <a-upload
                  name="file"
                  listType="picture-card"
                  class="avatar-uploader"
                  :showUploadList="false"
                  :beforeUpload="beforeUpload"
                  :action="api"
                  @change="handleChange"
                  :headers="headers"
                >
                <img  v-lazy="imgurl" alt="avatar" style="width: 80px;height: 80px"/>

                </a-upload>
              </a-form-item>
            </a-form>
        </a-modal>
      </div>
        <a-modal title="转移站点" centered v-model="isTransApp" @ok="transAPPlist" @cancel="selectedRowKeys=[];">
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
  </div>
</template>
<script>
  import { getAPPlist,transAPP } from '@/api/application'
  import { getAlluser } from '@/api/user'
  import { appCopy } from '@/api/domain'
  import { mixinDevice } from '@/utils/mixin'
  import listPage from '@/utils/page/list'
  import resolve from '@/utils/page/resolve'
  import verb from '@/utils/page/verb'
  import upload from '@/utils/page/upload'
  import tableShow from '@/utils/page/tableshow'
  import submit from '@/utils/page/submit'
  import _ from 'lodash';
  export default {
    name:'applicationList',
    mixins: [mixinDevice,listPage,resolve,verb,upload,tableShow,submit],
    data() {
      return {
        columns: [
          // {
          //   title: '#',
          //   fixed: 'left',
          //   width:100,
          //   dataIndex: 'index'
          // },
          {
            title: 'App名称',
            dataIndex: 'name',
            fixed: 'left',
            width:200
          },
          {
            title: '备注',
            dataIndex: 'remark'
          },

          {
            title: '图标',
            dataIndex: 'img',
            scopedSlots: {customRender: 'img'},
          },
          {
            title: '应用key',
            dataIndex: 'app_key',
          },
          {
            title: '创建时间',
            dataIndex: 'created_at',
          },
          {
            title: '操作',
            dataIndex: 'action',
            width:200,
            fixed: 'right',
            scopedSlots: {customRender: 'action'},
          }
        ],
        target: 'app',
        loading: true,
        formLayout: 'horizontal',
        form: this.$form.createForm(this, { name: 'application' }),
        formtrans: this.$form.createForm(this, { name: 'trans' }),
        //按钮搜索状态
        isload_btn:false,
        fileloading: false,
        api:'/api/upload/image',
        imgurl:'',
        searchData:{
          name:'',
          domain:'',
          app_key:'',
          username:''
        },
        headers: {
          Authorization:'Bearer '+this.$token
        },
        //转移应用
        isTransApp:false,
        transList:[],
        transParams:{
          id:'',
          uid:''
        }
      };
    },
    watch:{
      $route(val){
       if(val.path=='/application/application'){
         this.search()
       }
      },
    },
    methods: {
      async copy(){
        if(this.selectedRowKeys.length==0){
          this.$notification.warning({message:'请勾选你要复制的App名称'})
        }else {
          const res = await appCopy({id:this.selectedRowKeys.join(",")})
          this.resolve(res,'su_copy','err_copy')
        }

      },
      async initData(page=1,psize=10,seaechData={}){
        const res = await getAPPlist(page,psize,seaechData)
          res ? this.isload_btn=false : this.isload_btn=true
        this.init(res,page,psize)
       },
      //删除应用
      showDeleteConfirm(record) {
        this.selectedRowKeys = []
        this.selectedRowKeys.push(record.id)
        this.$confirm({
          title: '确定要删除该APP吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk:()=> {
            this.deleteDomain(this.target)
          },
        });
      },
      deleteAll(){
        if(this.selectedRowKeys.length==0){
          this.$notification.warning({message:'请勾选你要删除的App名称'})
        }else {
          this.$confirm({
            title: '确定要删除选中的APP吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=> {
              this.deleteDomain(this.target)
            },
          });
        }

      },
      //转移应用
      //搜索防抖
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
      chooseTrans(val){
        this.transParams.uid=val
      },
      trans(){

        if(this.selectedRowKeys.length==0){
          this.$notification.warning({message:'请选择站点名称'})
        }else {
          this.isTransApp=true;
          this.transParams.uid='';
          this.formtrans.resetFields();
          this.transParams.id=this.selectedRowKeys.join(',')
        }

      },
      async transAPPlist(){
        this.formtrans.validateFields((err, values)=>{
          if(!err){
            this.isTransApp=false;
            this.selectedRowKeys=[]
            const {uid}=values;
            this.transParams.uid=uid;
             transAPP(this.transParams).then(res=>{
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
      //是否配置模版
      iStemplate_cfg(value){
        if(value.template_cfg==1){
          window.open(value.preview,'_blank')
        }else {
          this.$notification.warning({message:'请先配置模版'})
          setTimeout(()=>{
            this.$router.push({path:`/application/applicationInfo/config/${value.id}`})
          },1000)
        }
      }
    },
    created(){
      if(this.userInfo.is_admin==1){
        this.columns.splice(5,0,{
          title: '创建者',
          dataIndex: 'username',
          scopedSlots: {customRender: 'username'},
        })
      }
      this.$bus.$on('updateData', ()=> {
        this.initData(this.pagination.current,this.pagination.pageSize)
      })
    }
  };
</script>
<style lang="less" scoped>
  .search-top{
    display: flex;
    align-items: center;
    span{
      white-space: nowrap;
    }
  }
</style>
