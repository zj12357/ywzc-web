<template>
    <div>
        <a-card class="permiss-top">
            <a-row  type="flex" justify="start" class="permiss-serach">
                <a-col  :span='6' class="permiss-search-top">
                    <span >角色名称:</span>
                    <a-input  style="width: 70%;" v-model="params.name" @keyup.enter.native="searchBtn"/>
                </a-col>
                <a-col  :span='6' class="permiss-search-top">
                    <span>角色描述:</span>
                    <a-input  style="width: 70%;" v-model="params.desc" @keyup.enter.native="searchBtn"/>
                </a-col>
                <a-col :span='8' class="permiss-search-top">
                    <span >创建时间:</span>   <a-range-picker @change="onChange" />
                </a-col>
                <a-col  class="permiss-search-top">
                    <a-button type="primary" @click="searchBtn" :loading="isload_btn">搜索</a-button>
                </a-col>
            </a-row>

        </a-card>

        <a-card class="permiss-center">
            <div class="permiss-center-btn">
                <a-button type="primary" @click="showAddModal">新增角色</a-button>
                <a-button type="primary" @click="DelAuthPermiss('')">批量删除</a-button>
            </div>
            <div>
                <a-table
                        :columns="columns"
                        :dataSource="permissslist"
                        :rowKey="permissslist => permissslist.id"
                        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                        :loading="islaoding"
                        :pagination='pagination'
                        :scroll="{ x: 1300 }"
                >

                    <span slot="status" slot-scope="record">
                         <a-tag  :color="record==1 ?  'green' : 'red'">
                          {{record ==1 ? '使用中': '禁用中'}}
                         </a-tag>
                    </span>
                    <span slot="action" slot-scope="text, record">
                        <a href="javascript:;" @click="showEditModal(record)">编辑</a>
                      <a-divider type="vertical"/>
                        <a href="javascript:;" @click="showPermissModal(record)">授权</a>

                      <a-divider type="vertical"/>
                        <a href="javascript:;" @click="DelAuthPermiss(record.id)">删除</a>


                     </span>
                </a-table>
            </div>
        </a-card>
        <!--获取角色-->
        <a-drawer
                title="菜单授权"
                placement="right"
                :closable="false"
                @close="()=>{showGetpermiss=false;selectedRowKeys=[];checkedKeys=[];showPermissList=[]}"
                :visible="showGetpermiss"
                :width="600"
        >
            <div style="width: 100%;">
                <a-button
                        type="primary" @click="UpAuthPermiss" style="position: fixed;
                        right:50px;bottom: 50px"
                        v-if="showPermissList.length!==0"
                >
                    确定
                </a-button>
                <a-tree
                        checkable
                        :treeData="showPermissList"
                        @select="this.onSelect"
                        @check="this.onCheck"
                        @expand="onExpand"
                        v-model="checkedKeys"
                        :defaultExpandedKeys="defaultExpandedKeys"
                >

                </a-tree>

            </div>
        </a-drawer>
        <!--获取角色-->


        <!--编辑角色-->

        <a-modal :title="isAdd?'添加角色' :'编辑角色'" v-model="showEditpermiss" @ok="isAddPermiss" centered @cancel="cloneTem">
           <div style="padding: 10px 30px">
               <a-form :form="form">
                   <a-form-item label="选择父级角色" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
                       <a-select style="width: 260px" @change="chooseUser"
                                 v-decorator="[
          'pid',
          {
            initialValue: permissDesc.pid,
            rules: [{required: true, validator: (rule, value, callback)=> {
                if (value!= '') {
                    callback();
                }else {
                    callback('请选择父级角色');
                }

            } }],
          },
        ]"
                       >
                           <a-select-option
                                   :key="item.id"
                                   v-for="(item,index) in userlist"
                                   :value="item.id"


                           >{{item.name}}</a-select-option>
                       </a-select>
                   </a-form-item>
                   <a-form-item label="角色名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
                       <a-input
                               v-decorator="[
          'name',
          {
            initialValue: permissDesc.name,
            rules: [{required: true, validator: (rule, value, callback)=> {
                if (value!= '') {
                    callback();
                }else {
                    callback('请输入角色名称');
                }

            } }],
          },
        ]">
                       ></a-input>
                   </a-form-item>
                   <a-form-item label="角色描述" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
                       <a-input
                               v-decorator="[
          'desc',
          {
            initialValue: permissDesc.desc,
            rules: [{required: true, validator: (rule, value, callback)=> {
                if (value!= '') {
                    callback();
                }else {
                    callback('请输入角色描述');
                }

            }, }],
          },
        ]"
                       ></a-input>
                   </a-form-item>
               </a-form>

           </div>
        </a-modal>
        <!--编辑角色-->
    </div>
</template>

<script>

        import {GetPermissList,GetPermiss,UpPermiss,ClosePermiss,OpenPermiss,EditPermiss,AddPermiss,DelPermiss,getAllrules} from '@/api/permissions';
        import {getAlluser} from '@/api/consumer'
        import {mixinonlyOne} from '@/utils/mixin';
        import moment from 'moment'
        const columns = [
        // {
        //     title:'#',
        //     dataIndex: 'index',
        //     fixed: 'left',
        //     width:100,
        //     key: 'index',

        // },
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width:200,
        },
        {
            title: '角色描述',
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title: '创建时间',
            key: 'created_at',
            dataIndex: 'created_at',

        },
        {
            title: '使用状态',
            key: 'status',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },

        },
        {
            title: '操作',
            key: 'action',
            width:200,
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
        },
    ];

        export default {
        name: "permissions",
        data(){
            return{
                form: this.$form.createForm(this, { name: 'permiss' }),
                //按钮搜索状态
                isload_btn:false,
                islaoding:true,
                columns,
                selectedRowKeys:[],
                showGetpermiss:false,
                showEditpermiss:false,
                permissslist:[],//角色列表
                params:{
                    page:1,
                    psize:10,
                    name:'',
                    desc:'',
                    create_at:''
                },
                perId:'',
                permissDesc:{
                    id:'',
                    pid:'',
                    name:'',
                    desc:''
                },
                showPermissList:[],//获取节点
                treeData:[],
                checkedNodelist:[],//选中节点
                checkedKeys: [],
                //是否添加角色
                isAdd:false,
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
                userlist:[],
                //默认展开
                defaultExpandedKeys:[]

            }
        },
        mixins: [mixinonlyOne],
        computed:{

        },
        created(){

            this.getAuthPermissList(this.params)
        },
        methods:{
            //搜索
            searchBtn(){
                this.isload_btn=true;
                this.getAuthPermissList(this.params).then(()=> {
                        this.isload_btn = false
                    }
                );
            },
            //分页
            onShowSizeChange(current,pageSize){
                this.pagination.pageSize = pageSize;
                this.pagination.current = current
                this.params.psize=pageSize;
                this.params.page=current;
                this.getAuthPermissList(this.params)
            },
            onChangePage(current){
                this.pagination.current = current;
                this.params.page = current;
                this.getAuthPermissList(this.params)
            },
            //获取角色列表
           async  getAuthPermissList(params){
             const {code,msg,data}=await GetPermissList(params);
                    if(code==1001){
                       data.list.forEach((item,index)=>{
                            item.index=index+1;
                            item.created_at = moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss')
                        });
                        this.permissslist=data.list
                        this.islaoding=false;
                        this.pagination.total=data.total_pages*this.pagination.pageSize;

                    }else {
                        this.$notification.error({message:msg})
                    }

           },
            onExpand(expandedKeys) {
                console.log( expandedKeys);

            },
            //树形控件
            onSelect(selectedKeys, info) {
                console.log('selected', selectedKeys, info);
            },
            onCheck(checkedKeys, info) {
                //拼接半选状态的父级id
                this.checkedNodelist=[...checkedKeys,...info.halfCheckedKeys];
                console.log(this.checkedNodelist)
                this.checkedKeys=checkedKeys;
                console.log('onCheck', checkedKeys, info.halfCheckedKeys);
            },

            mapTreeData(data) {
                return data.map((item, index) => {
                    if(item.checked==1){
                        //获取后台选中
                        this.checkedKeys.push(item.key)
                    }
                    return {
                        title: item.title,
                        key: item.key,
                        children:
                            item.children == null || item.children.length <= 0
                                ? []
                                :this. mapTreeData(item.children)
                    };
                });
            },

            //获取角色
            async getAuthPermiss(id){

                getAllrules({id}).then(res=>{
                            const {code,msg,data}=res;
                            if(code==1001){
                                this.showGetpermiss=true;
                                this.showPermissList=data;
                                this.showPermissList=this.mapTreeData(this.showPermissList)
                                console.log(this.showPermissList)
                                //默认展开
                                this.showPermissList.forEach((item)=>{
                                    this.defaultExpandedKeys.push(item.key)
                                })
                            }else {
                                 this.$notification.error({message:msg});
                                this.showGetpermiss=false;
                            }
                })
            },
            //删除角色

            async DelAuthPermiss(id){

                if(id==''){
                    if(this.selectedRowKeys.length ==0){
                        this.$notification.warning({message:'请勾选要删除的角色'})
                        return
                    }else {
                        id=this.selectedRowKeys.join(',');
                    }
                }else {
                    this.onlyOne(id);
                }

                this.$confirm({
                    title: '你确定要删除该角色吗?',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk:()=> {
                        DelPermiss({ids:id}).then(res=>{
                            const {code,msg} =res;
                            if(code==1001){
                                this.$notification.success({message:msg});
                                this.getAuthPermissList(this.params);
                                this.selectedRowKeys=[];
                            }else {
                                 this.$notification.error({message:msg})
                            }
                        })
                    },
                    onCancel:()=> {
                        this.selectedRowKeys=[];
                    },
                });
            },

            cloneTem(){
                this.isAdd=false;
                this.selectedRowKeys=[];
                Object.keys(this.permissDesc).forEach(item=>this.permissDesc[item]='');
            },
            //更新角色
            async UpAuthPermiss(){
                this.showGetpermiss=false;
                if(this.checkedNodelist.length==0){
                    return
                }
             const {code,msg}=await  UpPermiss({id: this.perId,rules:this.checkedNodelist.join(',')});
                if(code==1001){
                    this.$notification.success({message:msg});
                    this.getAuthPermissList(this.params);
                    this.selectedRowKeys=[];
                    this.showPermissList=[];
                    this.checkedKeys=[];

                }else {
                     this.$notification.error({message:msg});
                }
            },
            isAddPermiss(){
                if(this.isAdd){
                   this.AddAuthPermiss()
                }else {
                    this.EditAuthPermiss()
                }
            },
            //新增角色
            async AddAuthPermiss(){
                this.form.validateFields((err, values)=>{
                    if(!err){
                        console.log(values)
                        this.showEditpermiss=false;
                        this.isAdd=false;
                        this.permissDesc={...values}
                       AddPermiss(this.permissDesc).then(res=>{
                           const {code,msg}=res
                           if(code==1001){
                               this.$notification.success({message:msg});
                               this.form.resetFields();
                                Object.keys(this.permissDesc).forEach(item=>this.permissDesc[item]='');
                               this.getAuthPermissList(this.params);

                           }else {
                               this.$notification.error({message:msg});
                           }
                        })

                    }
                })

            },
            //编辑角色
            async EditAuthPermiss(){
                this.form.validateFields((err, values)=>{
                    if(!err){
                        this.showEditpermiss=false;
                        const {id}=this.permissDesc;
                        this.permissDesc={id,...values}
                        EditPermiss( this.permissDesc).then(
                            res=>{
                                const {code,msg}=res;
                                if(code==1001){
                                    this.$notification.success({message:msg});
                                    this.form.resetFields();
                                    Object.keys(this.permissDesc).forEach(item=>this.permissDesc[item]='')
                                    this.selectedRowKeys=[];
                                    this.getAuthPermissList(this.params);
                                }else {
                                    this.$notification.error({message:msg});
                                }
                            }
                        )

                    }
                })

            },


            showPermissModal(val){

                this.perId=val.id;
                this.onlyOne(val.id);
                this.getAuthPermiss(val.id);

            },
            showAddModal(){
                getAlluser().then(res=>{
                    const {code,msg,data}=res;
                    if(code==1001){
                        this.userlist=data;

                    }else {
                        this.$notification.error({message:msg})
                    }
                })
                this.form.resetFields();
                this.showEditpermiss=true;
                this.isAdd=true;
            },
            showEditModal({id,desc,name,pid}){
                this.form.resetFields();

                this.permissDesc={desc,name};
                this.permissDesc.id=id;
                this.onlyOne(id);
                getAlluser().then(res=>{
                    const {code,msg,data}=res;
                    if(code==1001){
                        this.showEditpermiss=true;
                        data.forEach((item)=>{
                            if(pid==item.id){
                                this.permissDesc.pid=pid
                            }
                        })
                        this.userlist=data;
                    }else {
                        this.$notification.error({message:msg})
                    }
                })
            },


            //下拉选择触发
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
            },

            //选择状态
            ChangeStatus(val){
              this.params.status=val
            },
            //时间处理
            onChange(date, dateString) {
                console.log(date, dateString);
                if(date.length){
                    dateString[0]= dateString[0]+' 00:00:00';
                    dateString[1]=dateString[1]+' 23:59:59';
                    console.log(dateString)
                    this.params.create_at=dateString;
                }else {
                    this.params.create_at='';
                }

            },
            chooseUser(val){
                this.permissDesc.pid=val;
                this.form.setFieldsValue({'pid':val})
            }



        }
    }
</script>

<style scoped lang="less">
   .permiss-top{
       .permiss-serach{
           margin-top: 25px;

           .permiss-search-top{
               display: flex;
               align-items: center;
               justify-content: flex-start;
               span{
                   white-space: nowrap;
                   display: inline-block;
                   margin-right: 20px;
               }
           }
       }
   }
    .permiss-center{
        margin-top: 20px;
        .permiss-center-btn{
            button{
                margin: 20px;
            }
        }
    }
</style>
