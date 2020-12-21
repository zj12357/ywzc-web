<template>
  <div>
    <a-card :bordered="false" class="ant-pro-components-tag-select">

      <a-row class="template-row group">
        <a-col :span="3">模版分组:</a-col>
        <a-col :span="18">
          <ul class="template-group"  :style="advanced ? {  minHeight: '30px',
    overflow: 'initial'} : {  height: '30px',overflow :'hidden'} ">
            <li @click="GetAllGroup" :class="{active:allshow}">全部分组</li>
            <li :class="{active:currentIndex===index && !allshow}" v-for="(item,index) in AthorityGroupList" @click="changeTemplate(index,item.id)" :key="index">{{item.name}}</li>

          </ul>
        </a-col>
        <a-col :span="3">
          <a class="tel-keywords" @click="toggleAdvanced" ref="isAdvanced">{{advanced ? "收起" : "展开"}}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </a-col>
      </a-row>

      <a-row class="template-row">
        <a-col :span="3">
          搜索模版:
        </a-col>
        <a-col :span="21">
          <span class="tel-keywords" >关键词:</span>
          <a-input style="max-width: 268px; width: 100%;"  @keydown.enter="searchBtn" v-model="queryParam.name">
          </a-input>
          <a-button type="primary" style="margin-left: 30px" @click="searchBtn" :loading="isload_btn">搜索</a-button>
        </a-col>


      </a-row>

      <a-row class="template-row">
        <a-col :span="3">
          其他选项:
        </a-col>
        <a-col :span="21">
          <a href="javascript:void (0);" @click="showMoreModal" class="my-copy">复制到我的模版</a>
          <a-modal title="模版复制" v-model="visible" @ok="handleOk" centered :width="700" @cancel="()=>{selectedRowKeys=[];selectValue='';copyParam={}}" >
            <div >
              <a-form :form="form">
                <a-form-item label="模版名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                  <a-input
                          v-decorator="[
          'name',
          {
            initialValue: copyParam.name,
            rules: [{required: true, validator: (rule, value, callback)=> {
                if (value!= '') {
                    callback();
                }else {
                    callback('请输入模版名称');
                }

            } }],
          },
        ]">
                    ></a-input>
                </a-form-item>
                <a-form-item label="模版分组" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                  <a-select  style="width: 120px;" @change="chooseMygroup"  :getPopupContainer="triggerNode => triggerNode.parentNode"
                             showArrow
                             v-decorator="[
          'group_id',
          {
            initialValue: selectValue,
            rules: [{required: true, validator: (rule, value, callback)=> {
                if (value!= '') {
                    callback();
                }else {
                    callback('请选择模版分组');
                }

            } }],
          },
        ]"
                  >
                  <a-select-option v-for="(item,index) in myGrouplist" :key="index"  :value="item.id">{{item.name}}</a-select-option>

                  </a-select>
                </a-form-item>
              </a-form>

            </div>

          </a-modal>
        </a-col>

      </a-row>

    </a-card>
    <a-card>
      <a-table
              :rowKey="AthorityList => AthorityList.id"
              :columns="columns"
              :dataSource="AthorityList"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              :pagination='pagination'
              :loading='loading'
              :scroll="{ x: 1300 }"
      >
        <span slot="preview"  slot-scope="text, record">
           <a :href="record.preview" target="_blank">预览</a>
        </span>
        <span slot="action" slot-scope="text, record">
        <a href="javascript:void (0);" @click="showModal(record)">复制到我的模版</a>
            <a-divider type="vertical"/>
        <a href="javascript:void (0);" @click="downTemplate(record)">下载</a>
      </span>
      </a-table>
    </a-card>

  </div>

</template>

<script>


import {Getauthority,GettemplateGroup,CopyTemplate,GetpersonGroup,Downtemplate} from '@/api/template';

import { mixinonlyOne,mixinBase64 } from '@/utils/mixin';
import {mapActions,mapGetters} from 'vuex';
  export default {
    name:'authorityTemplate',
    components: {

    },
    mixins:[mixinonlyOne,mixinBase64],
    data() {
      return {
        columns: [
          // {
          //   title: '#',
          //   dataIndex: 'index',
          //   fixed: 'left',
          //   width:100,
          //   key:'index'
          // },
          {
            title: '模版名称',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width:200
          },
          {
            title: '展示效果',
            dataIndex: 'preview',
            key: 'preview',
            scopedSlots: {customRender: 'preview'},
          },
          {
            title: '模版分组',
            dataIndex: 'group_name',
            key:'group_name'
          },
          {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
          },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:200,
            fixed: 'right',
            scopedSlots: {customRender: 'action'},
          }
        ],
        //下拉默认选择
        selectValue:'',
        allshow:true,

        //样式激活
        currentIndex:0,
        selectedRowKeys: [], // Check here to configure the default column
        // 模版分组和模版搜索查询条件参数
        queryParam: {
          page:1,
          psize:10,
          name:'',
          group_id:''
        },
        form: this.$form.createForm(this, {name: 'authorityTemlate'}),
        //按钮搜索状态
        isload_btn:false,
        //分页
        pagination:{
          pageSize:10,
          total:10,
          defaultCurrent: 1,
          current:1,
          showSizeChanger:true,
         pageSizeOptions: ['10', '20', '50', '100'],
          onShowSizeChange:this.onShowSizeChange,
          onChange:this.onChangePage
        },
      //复制模版
        copyParam:{
          id:'',
          name:'',
          group_id:''
        },
    //我的模版分组列表
        myGrouplist:[],
        // 加载数据方法 必须为 Promise 对象

        //展开状态
        advanced:false,
        //复制模版模态框
        visible: false,
        //加载
        loading: true,

      }
    },
    created(){
      //获取官方模版列表
      this.Getathority(this.queryParam).then((res)=>{
        this.allshow=true;
        this.loading=false;
        this.pagination.total=res.data.total_pages*this.pagination.pageSize;
      });
      //获取官方模版分组列表
      this.GetathorityGroup();
    },
    mounted(){

    },
    watch:{
      $route(val){
        if(val.path=='/templateManager/authorityTemplate'){
          this.GetathorityGroup();
        }
      }
    },
    computed:{
      ...mapGetters(['AthorityList','AthorityGroupList']),
    },
    methods: {
      //分页
      onShowSizeChange(current,pageSize){
        this.pagination.pageSize = pageSize;
        this.pagination.current = current
        this.queryParam.psize=pageSize;
        this.queryParam.page=current;
        this.Getathority(this.queryParam)
      },
      onChangePage(current){
        this.pagination.current = current;
        this.queryParam.page = current;
        this.Getathority(this.queryParam);
      },

      //获取官方模版,获取官方模版分组
      ...mapActions(['Getathority','GetathorityGroup']),

        //获取全部
      GetAllGroup(){
        this.allshow = true;
        this.queryParam.group_id='';
        this.queryParam.name='';
        this.Getathority(this.queryParam).then((res)=>{
          this.pagination.total=res.data.total_pages*this.pagination.pageSize;
        });;
      },
      //复制模版
      async copyTemplate(){
        this.form.validateFields((err, values)=>{
          if(!err){
            const {name,group_id}=values
            this.copyParam.name=name;
            this.copyParam.group_id=group_id;
            CopyTemplate(this.copyParam).then(res=>{
              const {code,msg}=res;
              if(code==1001){
                this.$notification.success({message:msg});
                this.selectedRowKeys=[];
                this.visible = false;
                this.selectValue=''
                Object.keys(this.copyParam).forEach(item=>this.copyParam[item]='');
                this.form.resetFields();
                this.Getathority(this.queryParam);

              }else {
                this.$notification.error({message:msg})
              }
            });

          }
        })


      },
      //搜索
      searchBtn(){
        this.isload_btn=true;
        this.Getathority(this.queryParam).then((res)=> {
                  this.isload_btn = false
             this.pagination.total=res.data.total_pages*this.pagination.pageSize;
                }
        );
      },

      //展开和收起
      toggleAdvanced () {
        this.advanced = !this.advanced

      },
      //复制模版
      showModal({id,name}) {
        this.copyParam={id,name};
        this.selectValue='';
        this.form.resetFields();
        this.onlyOne(id);
        this.getPersonGroup();
      },
      //多个模版模态框
      showMoreModal(){
        this.copyParam.name='';
        this.form.resetFields();
        if(this.selectedRowKeys.length==0){
          this.$notification.warning({message:'请勾选你要复制的模版！'})

        }else {
          this.visible=true;
          this.getPersonGroup();
          var str='';
          this.selectedRowKeys.forEach((item)=>{
            str +=item+',';
            this.AthorityList.map((val)=>{
              if(val.id===item){
                this.copyParam.name+=val.name+','
              }
            })
          })

          this.copyParam.id=str.slice(0,-1);
          this.copyParam.name=this.copyParam.name.slice(0,-1);
        }

      },
      handleOk() {
          this.copyTemplate();
      },
      //获取我的模版分组
     async getPersonGroup(){
        const {code,data,msg}=await GetpersonGroup();
       if(code==1001){

         if(data.length!=0){
           this.visible = true;
           this.myGrouplist=data;
         }else {
           this.$notification.warning({message:'暂无我的分组,请新增分组'})
           setTimeout( ()=> {
             this.$router.push('/templateManager/personTemplate/group')
           },1500)
         }
       }else {
          this.$notification.error({message:msg})
       }
      },

      //模版下载
     async downTemplate(val){
       var tempwindow =window.open("","_blank");
       tempwindow.document.title='模版下载';
       tempwindow.document.body.style.backgroundColor='#2b2c30';
       tempwindow.document.body.innerHTML=" <div style='color:#fff;font-size: 20px;text-align: center' id='textInit'>正在加载中....</div><img src='' style='display: block;margin: 0 auto' id='imgInit'/> "
       tempwindow.document.getElementById('imgInit').setAttribute("src",this.base64Tem);
       const res=await Downtemplate({id:val.id})
       const {code,msg,data}=res;
       if(code==1001){
         tempwindow.location.href=`/${data.url}`;
         tempwindow.document.getElementById('textInit').innerText="正在下载...";
       }else {
         this.$notification.error({message:msg});
          tempwindow.close()
       }
      },
      //选择我的模版
      chooseMygroup(val){

        this.copyParam.group_id=val;
        this.selectValue=val
      },
      //样式激活
      changeTemplate(index,id){
        this.currentIndex=index;
        this.queryParam.group_id=id;
        this.queryParam.name='';
       this.Getathority(this.queryParam).then((res)=>{
         this.pagination.total=res.data.total_pages*this.pagination.pageSize;
       });

        this.allshow=false;
      },
      //提交验证
      onSelectChange(selectedRowKeys) {

        this.selectedRowKeys = selectedRowKeys;
      },

    }
  }
</script>
<style lang="less" scoped>
  .ant-pro-components-tag-select {
    margin-bottom: 30px;
    /deep/ .ant-pro-tag-select .ant-tag {
      margin-right: 24px;
      padding: 0 8px;
      font-size: 14px;
    }
  }

  .list-articles-trigger {
    margin-left: 12px;
  }
  .template-row {
    border-bottom: 1px dashed hsv(0, 0, 91%);
    min-height: 50px;
    display: flex;
    align-items: center;

  }
 .group{
    align-items: flex-start;
  }
  .template-group{
    display: flex;
    justify-content: flex-start;
    padding-left: 0;
    list-style: none;
    flex-flow: wrap;
    li{
      max-width: 120px;
      height: 30px;
      line-height: 30px;
      margin-bottom: 5px;
      margin-right: 20px;
      cursor: pointer;
      text-align: center;
      border-radius: 3px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      padding: 0 8px;
      &.active{
        color:#fff;
        background: #1890ff;

      }
    }

  }

  .tel-keywords{
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin-right: 20px;
    display: inline-block;

  }
  a{
    text-decoration: none;
  }
  .my-copy{
    display: inline-block;
    text-align: center;
    line-height: 50px;

  }
</style>
