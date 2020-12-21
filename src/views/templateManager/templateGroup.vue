<template>
    <div>
      <a-card>
        <a-row>
          <a-button type="primary" @click="showAddModal">新增分组</a-button>

          <a-modal v-model="isAdd" title="操作" onOk="handleOK" centered  :width="400" @cancel="newgroup={}" @ok="handleOK()">
            <div >
              <a-form :form="form">
                <a-form-item  label="分组名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 15 }">
                  <a-input
                          v-decorator="[
          'name',
          {
            initialValue: newgroup.name,
            rules: [{required: true, validator: (rule, value, callback)=> {
                if (value!= '') {
                    callback();
                }else {
                    callback('请输入分组名称');
                }

            } }],
          },
        ]">
                    ></a-input>
                </a-form-item>
              </a-form>

            </div>


          </a-modal>


        </a-row>

        <a-row style="margin-top: 30px">
          <a-table :columns="columns" :dataSource="TemplateGroupList" :rowKey="TemplateGroupList => TemplateGroupList.id"
                   :loading="loading"
                   :pagination='pagination'
                   :scroll="{ x: 1300 }"
          >

            <span slot="action" slot-scope="text, record">
              <a href="javascript:;" @click="showEditModal(record)">修改</a>
              <a-divider type="vertical"/>
              <a href="javascript:;" @click="delTemplate(record.id)">删除</a>

            </span>
          </a-table>
        </a-row>

      </a-card>
    </div>
</template>

<script>
  import {AddnewGroup,GetpersonGroup,EditGroup,DelGroup} from '@/api/template';
  import {mapActions,mapGetters} from 'vuex';

  const columns = [
    // {
    //   title: '#',
    //   dataIndex: 'index',
    //   fixed: 'left',
    //   width:100,
    //   key:'index'
    // },
    {
      title: '分组名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width:300,
    },

    {
      title: '创建时间',
      key: 'created_at',
      dataIndex: 'created_at',

    },
    {
      title: '创建者',
    },
    {
      title: '操作',
      key: 'action',
      width:200,
      fixed: 'right',
      dataIndex:'action',
      scopedSlots: { customRender: 'action' },
    },
  ];

    export default {
        name: "templateGroup",
      data(){
        return{

          columns,
          isAdd: false,
          isEdit:false,
          //新增模版分组name
          newgroup:{
            name:'',
            id:''
          },
          //加载
          loading: true,
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
          form: this.$form.createForm(this, {name: 'templateGroup'}),
          queryParam:{
            page:1,
            psize:10
          }
        }
      },
      created(){
          this.GetTemplateGroups(this.queryParam).then(res=>{
            this.loading=false;
            this.pagination.total=res.data.total_pages*this.pagination.pageSize;
          })
        //如果是admin添加一栏创建者
        this.GetInfo().then(res=>{
          const {code,msg,data} =res;
          if(code==1001 && data.is_admin==1){
            this.columns.splice(2,1, {
              title: '创建者',
              dataIndex: 'username',
            },)
          }else {
            this.columns.splice(2,1, {

            },)
          }
        })
      },
      computed:{
          ...mapGetters(['TemplateGroupList'])
      },
      mounted(){

      },
      methods:{

        //分页
        onShowSizeChange(current,pageSize){
          this.pagination.pageSize = pageSize;
          this.pagination.current = current
          this.queryParam.psize=pageSize;
          this.queryParam.page=current;
          this.GetTemplateGroups(this.queryParam)
        },
        onChangePage(current){
          this.pagination.current = current;
          this.queryParam.page = current;
          this.GetTemplateGroups(this.queryParam);
        },
          //添加模版
       async AddTempalteGroup(){
         this.form.validateFields((err, values)=>{

           if(!err){
             const{name}=values;
             console.log(values)
             this.newgroup.name=name;
             const {id,...parms}=this.newgroup;
             AddnewGroup(parms).then(res=>{
               const {code,msg} =res;
               if(code==1001){
                 this.$notification.success({message:msg})
                 this.isAdd = false;
                 this.form.resetFields();
                 Object.keys(this.newgroup).forEach(item=>this.newgroup[item]='');
                 this.GetTemplateGroups(this.queryParam);
               }else {
                 this.$notification.error({message:msg})
               }
             });

           }
         })

        },

        //获取我的模版分组列表
        ...mapActions(['GetTemplateGroups','GetInfo']),

        //编辑模版分组
        async EdittemplateGroup(){
          this.form.validateFields((err, values)=>{

            if(!err){
              const {name}=values;
              this.newgroup.name=name;
              EditGroup(this.newgroup).then(res=>{
                const {code,msg} =res;
                if(code==1001){
                  this.$notification.success({message:msg});
                  this.isAdd = false;
                  this.isEdit = false;
                  this.form.resetFields();
                  Object.keys(this.newgroup).forEach(item=>this.newgroup[item]='');
                  this.GetTemplateGroups(this.queryParam);
                }else {
                  this.$notification.error({message:msg});
                }
              });

            }
          })

        },
          //删除模版分组
        delTemplate(id){

         this.$confirm({
           title: '你确定要删除该分组吗?',
           okText: '确定',
           okType: 'danger',
           cancelText: '取消',
           onOk:()=> {
             DelGroup({id}).then(res=>{
               const {code,msg}=res
               if(code==1001){
                 this.$notification.success({message:msg});
                 this.GetTemplateGroups(this.queryParam);

               }else {
                 this.$notification.error({message:msg});
               }
             });

           },
           onCancel:()=> {
             console.log('Cancel');
           },
         });

        },
        showAddModal() {
          this.form.resetFields();
          this.isAdd = true;
        },
        showEditModal({name,id}) {
          this.form.resetFields();
         this.newgroup={name,id}
          this.isAdd = true;
          this.isEdit = true;
        },
        handleOK() {

          if(this.isEdit){
            this.EdittemplateGroup()
          }else {
            this.AddTempalteGroup()
          }

        },



      }

    }
</script>

<style scoped lang="less">
    .group-box{
      display:flex;
      justify-content:center;
      align-items:center;
      height: 100px;
      width: 350px;
    }
</style>
