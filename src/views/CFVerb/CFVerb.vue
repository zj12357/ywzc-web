<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false" class='costomTable'>
    <div style="margin: 30px 0 50px">
      <a-row type="flex" align="middle">
        <a-col :span="4"  class="search-top">
          <span>应用名称：</span>
          <a-input style="max-width: 80%" v-model="searchData.name" @keyup.enter.native="search"></a-input>
        </a-col>
        <a-col :span="6" class="search-top" :offset="1">
          <span>域名：</span>
          <a-input style="max-width: 80%" v-model="searchData.domain" @keyup.enter.native="search"></a-input>
        </a-col>
        <a-col :span="4" class="search-top" :offset="1">
          <span>创建者：</span>
          <a-input style="max-width: 80%" v-model="searchData.username" @keyup.enter.native="search"></a-input>
        </a-col>
        <a-col :offset="1" :span="2">
          <a-select  style="width: 120px"  placeholder="请选择状态" @change="ChangeStatus">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">待审核</a-select-option>
            <a-select-option value="1">通过</a-select-option>
            <a-select-option value="2">拒绝</a-select-option>
          </a-select>
        </a-col>

        <a-col :span="2" :offset="1">
          <a-button type="primary" @click="search" :loading="isload_btn">搜索</a-button>
        </a-col>
      </a-row>
    </div>
      <div style="margin-bottom: 30px">
        <a-button type="primary" @click="delpassBatchCF">批量审核</a-button>
      </div>
      <!-- table -->
        <a-table :dataSource="data" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :loading='loading' :pagination='pagination' :rowKey="record => record.id" :scroll="{ x: 1300 }">
          <!-- <a-table-column title="#" dataIndex="index" key="index" :width="100" fixed='left'/> -->
          <a-table-column title="应用名称" dataIndex="app_name" key="app_name" :width="200" fixed='left'/>
          <a-table-column title="域名" dataIndex="domain" key="domain" />
          <a-table-column title="创建时间" dataIndex="created_at" key="created_at" />
          <a-table-column title="创建者" dataIndex="username" key="username" v-if="userInfo.is_admin==1"  :width='100'/>
          <a-table-column title="状态" key="status" :width='100'>
          <template slot-scope="text, record">
            <a-tag :color="record.status=='通过' ? 'green' :'red'">
              {{record.status}}
            </a-tag>
          </template>
        </a-table-column>
          <a-table-column title="操作" key="action" :width="200" fixed='right'>
            <template slot-scope="record">
              <span>
                <a @click="check(record)"  href="javascript:void (0);"> 通过</a>
                  <a-divider type="vertical"/>
                <a href="javascript:void (0);" @click="handleRefuse(record)" >拒绝 </a>
                  <a-divider type="vertical"/>
                <a @click="rowDelete(record)" href="javascript:void (0);"> 删除 </a>
              </span>
            </template>
          </a-table-column>
        </a-table>
        <!-- 删除 -->
        <a-modal :width='300'
          title="操作"
          centered
          v-model="deleteModalVisible"
          @ok="deleteDomain(target)"
        >
          <p>确定要删除选中的域名吗</p>
        </a-modal>
      <!--拒绝-->
    <a-modal title="拒绝原因" v-model="refuseVisible" @ok="refuse" centered>
      <div >
        <p style="margin-bottom: 10px">拒绝原因：</p>  <a-textarea  :rows="4" v-model="refuseParam.reason"/>
      </div>

    </a-modal>
    <!--审核-->
    <a-modal title="通过" v-model="isPass" @ok="forceOk" centered @cancel="isForce=false">
      <div >
        <a-checkbox @change="onChangePass" :checked="isForce">强制通过</a-checkbox>
      </div>

    </a-modal>
    </a-card>
</template>

<script>
import { getCFList, passCF,refuseCF,passBatchCF } from '@/api/cf'
import { mixinDevice } from '@/utils/mixin'
import listPage from '@/utils/page/list'
import resolve from '@/utils/page/resolve'
import verb from '@/utils/page/verb'
import tableShow from '@/utils/page/tableshow'
export default {
  name: 'cfVerb',
  mixins: [mixinDevice,listPage,resolve,verb,tableShow],
  data () {
    return {
      loading: true,
      target: 'cf',
      refuseVisible:false,
      refuseParam:{
        id:'',
        reason:''
      },
      searchData:{
        name:'',
        domain:'',
        username:''
      },
      //按钮搜索状态
      isload_btn:false,
      //审核
      isPass:false,
      isForce:false,
      forceParam: {
        id:'',
        force:''
      },


    }
  },
  methods: {
    async initData(page=1,psize=10,searchData={}){
      const res = await getCFList(page,psize,searchData)
      res ? this.isload_btn=false : this.isload_btn=true
      this.init(res,page,psize,'cf')
    },
    async check(r){
      if(r.status=='通过'){
        this.error('该记录已处理,请勿重复操作')
      }else {
        this.isPass=true;
        this.forceParam.id=r.id;
      }

    },
    onChangePass(e){
      this.isForce=e.target.checked

    },

    ChangeStatus(val){
      if(val==''){
       const {status,...rest}=this.searchData;
        this.searchData=rest;
      }else {
        this.searchData.status = val
      }

    },
    async forceOk(){

      this.forceParam.force=this.isForce ? 1: 0;
      this.isForce=false;
      this.isPass=false;
      const res = await passCF(this.forceParam)
      const {code}=res;
      code==1000 ? this.$notification.error({message:'审核失败'}) :this.resolve(res,'su_check')
    },
    //审核拒绝
    async refuse(){
      if(this.refuseParam.reason==''){
         this.$notification.warning({message:'请填写拒绝原因'})
        return
      }
      this.refuseVisible=false;
      const {code,msg}=await refuseCF(this.refuseParam);
      if(code==1001){
        this.$notification.success({message:msg})
        Object.keys(this.refuseParam).forEach((item)=>{
          this.refuseParam[item]=''
        })
        this.initData(this.pagination.current,this.pagination.pageSize,this.searchData)
      }else {
        this.$notification.error({message:msg})
      }
    },
    handleRefuse(r){
      if(r.status=='通过'){
        this.error('该记录已处理,请勿重复操作')
      }else {
        this.refuseVisible=true;
        this.refuseParam.id=r.id;
      }

    },

    async delpassBatchCF(){
      if(this.selectedRowKeys.length==0){
        this.$notification.warning({message:'请勾选你要审核的域名'})
      }else {
        this.$confirm({
          title: '你确定要批量审核勾选的域名吗？',
          onOk:()=> {
            const id=this.selectedRowKeys.join(",")
            passBatchCF({id}).then(res=>{
              const {code,msg}=res
              if(code==1001){
                this.$notification.success({message:msg})
                this.selectedRowKeys=[]
                this.initData(this.pagination.current,this.pagination.pageSize,this.searchData)
              }else {
                this.$notification.error({message:msg})
              }
            })
          },
          onCancel:()=> {
            console.log('Cancel');
          },
        });


      }

    }
  },
  created(){
    this.$bus.$on('updateCFList', ()=> {
      this.initData(this.pagination.current,this.pagination.pageSize)
    })
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
</style>
