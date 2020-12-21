<template>
    <div>
        <a-card>
            <!--<div class="menu-add">-->
                <!--<a-button type="primary" @click="showAddMenu">添加菜单</a-button>-->
            <!--</div>-->
            <a-table
                    :rowKey="menuList => menuList.id"
                    :columns="columns"
                    :dataSource="menuList"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    :loading='loading'
                    :scroll="{ x: 1400 }"
                    :pagination="false"
                    :defaultExpandedRowKeys="expandedRowKeys"
            >

                 <span slot="icon" slot-scope="text, record">
                    <a-icon :type="record.icon" :style="{ fontSize: '24px' }" v-if="record.icon"></a-icon>
                </span>
                <span slot="ismenu" slot-scope="text, record">
                    <a-tag  :color="record.ismenu ?  'green' : 'red'">
                      {{record.ismenu  ? '显示' : '隐藏'}}
                    </a-tag>
                 </span>
                <span slot="status" slot-scope="text, record">
                    <a-tag  :color="record.status ?  'green' : 'red'">
                      {{record.status  ? '启用' : '关闭'}}
                    </a-tag>
                </span>
                <span slot="action" slot-scope="text, record">
                      <a href="javascript:;" @click="showAddMenu(record)">添加</a>
                      <a-divider type="vertical"/>
                      <a href="javascript:;" @click="showEditModal(record)">编辑</a>
                      <a-divider type="vertical"/>
                       <a href="javascript:;" @click="deleteMenu(record)">删除</a>
                </span>
            </a-table>
        </a-card>

        <!--编辑菜单-->
        <a-modal :title="isAdd ? '添加菜单' :'编辑菜单'" v-model="showEditmenu" @ok="EditMenu" centered @cancel="selectedRowKeys=[]">
                <div>
                    <a-form :form="form">


                        <a-form-item label="菜单" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                            <a-switch   checkedChildren="显示" unCheckedChildren="隐藏" :checked="isOpen" @change="changeJump"  v-decorator="['ismenu',  {
            initialValue:editParams.ismenu,}]"/>
                        </a-form-item>
                        <a-form-item label="状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                            <a-switch   checkedChildren="启用" unCheckedChildren="关闭" :checked="isMenu" @change="changeMenu"  v-decorator="['status',  {
            initialValue:editParams.status,}]"/>
                        </a-form-item>

                        <a-form-item label="规则名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                            <a-input
                                    v-decorator="[
          'name',
          {
            initialValue:editParams.name,
            rules: [{required: true,message:'请输入规则名称' }],
          },
        ]"
                            >

                            </a-input>
                        </a-form-item>

                        <a-form-item label="路由名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                            <a-input
                                    v-decorator="[
          'node',
          {
            initialValue:editParams.node,

          },
        ]"
                            >

                            </a-input>
                        </a-form-item>


                        <a-form-item label="菜单名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                            <a-input
                                    v-decorator="[
          'title',
          {
            initialValue:editParams.title,
            rules: [{required: true, message:'请输入菜单名称'}],
          },
        ]"
                            >

                            </a-input>
                        </a-form-item>
                        <a-form-item label="菜单图标" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                            <div style="display: flex">
                                <a-input
                                        v-decorator="[
          'icon',
          {
            initialValue:editParams.icon,

          },
        ]"
                                >

                                </a-input>
                                <a-icon :type="editParams.icon" :style="{ fontSize: '24px',margin:' 0 20px',display:'block' }" v-if="editParams.icon"></a-icon>
                                <a-button type="primary" @click="()=>{showEditicon=true}">选择图标</a-button>
                            </div>

                        </a-form-item>
                        <a-form-item label="权重" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                            <a-input-number
                                    v-decorator="[
          'weigh',
          {
            initialValue:editParams.weigh,
            rules: [{required: true,message:'请输入权重' }],
          },
        ]"
                            >

                            </a-input-number>
                        </a-form-item>

                        <a-form-item label="备注" name="remark" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                            <a-textarea
                                    v-decorator="['remark', {
            initialValue:editParams.remark,}]"
                            />
                        </a-form-item>


                    </a-form>
                </div>

        </a-modal>
        <a-modal v-model="showEditicon" @ok="()=>showEditicon=false" centered :width="800" title="选择图标">
            <div class="menu-content">
                <div v-for="v in icons"  :key="v.key" class="menu-icon">
                    <span>{{v.title}}:</span>
                    <ul class="icon-list">
                        <li v-for="(icon, key) in v.icons" :key="key"   @click="chooseIcon(icon)">
                            <a-icon :type="icon" :style="{ fontSize: '36px' }" />
                            <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" v-show="icon==editParams.icon" class="choose"/>

                        </li>
                    </ul>
                </div>
            </div>

        </a-modal>

    </div>
</template>

<script>
    import {getMenulist,addMenulist,editMenulist,delMenulist} from '@/api/permissions';
    import icons from '@/components/IconSelector/icons.js'
    import {mixinonlyOne} from '@/utils/mixin';
    export default {
        name: "menuConfig",
        mixins: [mixinonlyOne],
        data(){
            return{
                columns: [
                    // {
                    //     title: '#',
                    //     dataIndex: 'index',
                    //     fixed: 'left',
                    //     width:100,
                    //     key:'index'
                    // },
                    {
                        title: '菜单名称',
                        dataIndex: 'title',
                        key: 'title',
                        fixed: 'left',
                        width:300,
                    },
                    {
                        title: '菜单图标',
                        dataIndex: 'icon',
                        key: 'icon',
                        scopedSlots: {customRender: 'icon'},
                    },
                    {
                        title: '路由名称',
                        dataIndex: 'node',
                        key: 'node',
                    },
                    {
                        title: '规则名称',
                        dataIndex: 'name',
                        key: 'name',
                    },


                    // {
                    //     title: '规则备注',
                    //     dataIndex: 'remark',
                    //     key: 'remark',
                    //     width:200,
                    // },
                    {
                        title: '创建时间',
                        dataIndex: 'created_at',
                        key: 'created_at',
                    },
                    {
                        title: '菜单显示',
                        dataIndex: 'ismenu',
                        key: 'ismenu',
                        scopedSlots: {customRender: 'ismenu'},
                    },
                    {
                        title: '权重',
                        dataIndex: 'weigh',
                        key:'weigh'
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        key:'status',
                        scopedSlots: {customRender: 'status'},
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
                selectedRowKeys:[],
                loading:true,
                showEditmenu:false,
                showEditicon:false,
                isOpen:true,
                isMenu:true,
                icons,
                form: this.$form.createForm(this, { name: 'menuconfig' }),
                //权限列表
                menuParams:{
                    name:'',
                    title:'',
                    remark:'',
                },
                menuList:[],
                isAdd:false,
                editParams:{
                    pid:'',
                    name:'',
                    node:'',
                    title:'',
                    icon:'',
                    weigh:'',
                    ismenu:'',
                    status:'',
                    remark:''
                },
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
                //默认展开
                expandedRowKeys:[]
            }
        },
        created(){
            //获取初始化数据
            this.GetMenulist()
        },
        methods:{
            //分页
            onShowSizeChange(current,pageSize){
                this.pagination.pageSize = pageSize;
                this.pagination.current = current
                this.menuParams.psize=pageSize;
                this.menuParams.page=current;
                this.GetMenulist()
            },
            onChangePage(current){
                this.pagination.current = current;
                this.menuParams.page = current;
                this.GetMenulist()
            },
            onSelectChange(selectedRowKeys) {

                this.selectedRowKeys = selectedRowKeys;
            },
          async  GetMenulist(){
              const {code,msg,data}=await getMenulist(this.menuParams);
              if(code==1001){
                  this.menuList=data;
                  this.menuList.forEach((item)=>{
                      if(item.node=='index'){
                          this.expandedRowKeys.push(item.id)
                      }
                  })
                  this.loading=false
              }else {
                  this.$notification.error({message:msg})
              }
          },
            showEditModal(val){
                this.onlyOne(val.id)
                 this.isAdd=false;
                this.showEditmenu=true;
                this.editParams=val
                console.log( this.editParams)
                this.isOpen=this.editParams.ismenu ? true :false;
                this.isMenu=this.editParams.status ? true : false;
                this.form.resetFields();
            },
            EditMenu(){
                this.form.validateFields((err, values)=>{
                    if(!err){
                        this.showEditmenu=false;
                        const {id,pid,...rest} =this.editParams;

                        if(this.isAdd){
                            this.editParams={pid,...values};
                            this.editParams.ismenu= this.editParams.ismenu ? 1 : 0
                            this.editParams.status= this.editParams.status ? 1 : 0
                            console.log(this.editParams)

                            addMenulist (this.editParams).then(res=>{
                                const {code,msg}=res;
                                if(code==1001){
                                    this.$notification.success({message:msg})
                                    this.GetMenulist()
                                }else {
                                    this.$notification.error({message:msg})
                                }
                            })
                        }else {

                            this.editParams={id,pid,...values};
                            this.editParams.ismenu= this.editParams.ismenu ? 1 : 0
                            this.editParams.status= this.editParams.status ? 1 : 0
                            console.log(this.editParams)
                            editMenulist(this.editParams).then(res=>{
                                const {code,msg}=res;
                                if(code==1001){
                                    this.$notification.success({message:msg})
                                    this.selectedRowKeys=[]
                                    this.GetMenulist()
                                }else {
                                    this.$notification.error({message:msg})
                                }
                            })
                        }

                    }
                })
            },
            chooseIcon(val){
                this.editParams.icon=val;
                this.form.setFieldsValue({'icon':val})
            },
            changeJump(checked){
                this.isOpen=checked
              this.editParams.ismenu=checked
            },
            changeMenu(checked){
                this.isMenu=checked
                this.editParams.status=checked
            },
            //添加菜单
            showAddMenu(val){
                this.form.resetFields();
                Object.keys(this.editParams).forEach(item=>this.editParams[item]='' )
                this.showEditmenu=true;
                this.isAdd=true;
                this.isOpen=true;
                this.isMenu=true;
                this.editParams.ismenu=true;
                this.editParams.status=true;
                this.editParams.weigh=0
                this.editParams.pid=val.id;
                console.log(this.editParams)
            },
            //删除菜单
          async deleteMenu({id}){
              this.onlyOne(id)
              this.$confirm({
                  title: '你确定要删除该菜单吗?',
                  okText: '确定',
                  okType: 'danger',
                  cancelText: '取消',
                  onOk: () => {
                      console.log('OK');
                      delMenulist({id}).then(res => {
                          const {code,msg}=res;
                          if (code == 1001) {
                              this.$notification.success({message:msg});
                              this.GetMenulist()
                          } else {
                              this.$notification.error({message:msg});
                          }
                      })
                  },
                  onCancel: () => {
                    this.selectedRowKeys=[]
                  },
              });
            }
        }
    }
</script>

<style scoped lang="less">
.menu-add{
    margin: 20px 0;
}
    .menu-content{
        height: 300px;
        overflow-y:scroll ;
        .menu-icon{
           display: flex;
            justify-content: center;
            flex-wrap: wrap;
            .icon-list{
                display: flex;
                width: 80%;
                flex-wrap: wrap;
                cursor: pointer;
                li{
                    margin: 4px;
                    position: relative
                }
                .choose{
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
        }


        }
    }
</style>
