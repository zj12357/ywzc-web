<template>
    <a-card>
        <!--<div style="margin: 20px 0 30px">-->
            <!--<a-button type="primary">添加配置</a-button>-->
        <!--</div>-->
        <a-table
                :columns="columns"
                :dataSource="systemList"
                :rowKey="systemList=>systemList.id"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                :loading="islaoding"
                :scroll="{ x: 1300 }"
        >

            <span slot="action" slot-scope="text, record">
                <a href="javascript:;" @click="showEdit(record)">编辑</a>
                <!--<a-divider type="vertical" />-->
                <!--<a href="javascript:;">删除</a>-->

             </span>
        </a-table>

        <a-modal title="编辑配置" centered v-model="showEditSystem" @ok="editSystem" @cancel="selectedRowKeys=[]">
            <div>
                <a-form :form="form">
                    <a-form-item label="配置名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                         <a-input
                                 v-decorator="[
          'name',
          {
            initialValue:editParams.name,
            rules: [{required: true, validator: (rule, value, callback)=> {
                if (value!= '') {
                    callback();
                }else {
                    callback('请输入配置名称');
                }

            } }],
          },
        ]"
                         disabled>

                         </a-input>
                    </a-form-item>
                    <a-form-item label="配置值" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">

                        <a-select @change="chooseConfig"
                                  v-decorator="[
          'value-d',
          {
            initialValue:chooseValue,
            rules: [{required: true, validator: (rule, value, callback)=> {
                if (value!= '') {
                    callback();
                }else {
                    callback('请选择配置值');
                }

            } }],
          },
        ]" placeholder="请选择配置值"
             v-if="isDomain"
        :getPopupContainer="triggerNode => triggerNode.parentNode"
                        >
                            <a-select-option v-for="(item,index) in editParams.value" :key="item.id" :value="item.id">
                                {{item.domain}}
                            </a-select-option>
                        </a-select>

                        <a-input
                                v-else
                                v-decorator="[
          'value',
          {
            initialValue:editParams.value,
            rules: [{required: true, validator: (rule, value, callback)=> {
                if (value!= '') {
                    callback();
                }else {
                    callback('请输入配置值');
                }

            } }],
          },
        ]"

                        >

                        </a-input>


                    </a-form-item>
                    <a-form-item label="配置说明" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                        <a-input
                                v-decorator="[
          'remark',
          {
            initialValue:editParams.remark,
         }
        ]"

                        >

                        </a-input>
                    </a-form-item>
                </a-form>

            </div>
        </a-modal>
    </a-card>

</template>
<script>
    import {GetSystemlist,AddSystem,EditSystem,getDomain} from '@/api/permissions';
     import {mixinonlyOne} from '@/utils/mixin';
    const columns = [
        // {
        //     title:'#',
        //     dataIndex: 'index',
        //     key: 'index',
        //     fixed: 'left',
        //     width:100,

        // },
        {
            title: '配置名称',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width:300,
        },
        {
            title: '配置值',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: '配置说明',
            key: 'remark',
            dataIndex: 'remark',

        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width:200,
            dataIndex:'action',
            scopedSlots: { customRender: 'action' },
        },
    ];

    export default {
        name:'systemConfig',
        data() {
            return {
                systemList:[],
                columns,
                selectedRowKeys:[],
                islaoding:true,
                params:{
                    page:'',
                    psize:''
                },
                editParams:{
                    name:'',
                    value:'',
                    remark:''
                },
                showEditSystem:false,
                chooseValue:'',
                isDomain:false,
                form: this.$form.createForm(this, { name: 'system' }),
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
            };
        },
        mixins: [mixinonlyOne],
        created(){
            this.getSystemlist()
        },
        methods:{
            //获取配置列表
            async getSystemlist(){
                const {code,msg,data}= await GetSystemlist()
                if(code==1001){
                    data.forEach((item,index)=>{
                        item.index=index+1
                    })
                    this.systemList=data;
                    this.islaoding=false
                }else {
                    this.$notification.error({message:msg})
                }
            },
            showEdit({name,value,remark,id}){
                this.chooseValue=''
                this.form.resetFields();
                this.showEditSystem=true;
                this.onlyOne(id);
                this.editParams={name,value,remark}
                if(name=='storage_oss_dl_domain'){
                    this.isDomain=true
                    this.getDomainlist()
                }else {
                    this.isDomain=false
                }

            },
            //获取域名列表
            async getDomainlist(){
                const {code,msg,data}=await  getDomain();
                if(code==1001){
                    this.editParams.value=data;
                }else {
                    this.$notification.error({message:msg})
                }
            },
            chooseConfig(val){
                this.editParams.value.forEach((item)=>{
                    if(item.id==val){
                        this.chooseValue=item.domain;
                    }
                })

            },
            //编辑配置
              async  editSystem(){
                  this.form.validateFields((err, values)=>{
                      if(!err){
                          this.showEditSystem=false;
                        if(this.isDomain){
                            const {name,remark}=values;
                            this.editParams.name=name;
                            this.editParams.remark=remark;
                            this.editParams.value=this.chooseValue
                        }else {
                            this.editParams={...values};
                        }

                           EditSystem(this.editParams).then(res=>{
                               const {code,msg}=res;
                               if(code==1001){
                                   this.$notification.success({message:msg})
                                   this.form.resetFields();
                                   Object.keys(this.editParams).forEach(item=>this.editParams[item]='');
                                   this.getSystemlist()
                               }else {
                                   this.$notification.error({message:msg})
                               }

                          });

                      }
                  })

            },
            //分页
            onShowSizeChange(current,pageSize){
                this.pagination.pageSize = pageSize;
                this.pagination.current = current
                this.params.psize=pageSize;
                this.params.page=current;
                this.getSystemlist()
            },
            onChangePage(current){
                this.pagination.current = current;
                this.params.page = current;
                this.getSystemlist()
            },
            onSelectChange(selectedRowKeys) {
                this.selectedRowKeys = selectedRowKeys;
            },
        }
    };
</script>
<style lang="less" scoped>

</style>
