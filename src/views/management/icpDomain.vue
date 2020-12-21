<template>
    <div>
        <a-card>
            <div class="domain-top">
                <a-row type="flex">
                    <a-col :span="6" class="domain-search">
                        <span>域名:</span>
                        <a-input v-model="params.domain"></a-input>
                    </a-col>
                    <a-col :offset="1">
                        <a-button type="primary" @click="searchDomain" :loading="isload_btn">搜索</a-button>
                    </a-col>
                </a-row>

            </div>
            <div class="addDamin">
                <a-button type="primary" @click="showAddDomainModal">添加域名</a-button>
            </div>
            <a-table
                    :rowKey="domainList => domainList.id"
                    :columns="columns"
                    :dataSource="domainList"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    :pagination='pagination'
                    :loading='loading'
                    :scroll="{ x: 1300 }"
            >
            <span slot="action" slot-scope="text, record">
                 <a href="javascript:;" @click="deleteDomain(record.id)">删除</a>

            </span>
            </a-table>
        </a-card>
        <a-modal title="添加ICP域名" v-model="showAddDomain" @ok="AddICPdomain" centered>
            <div>
               <a-form :form="form">
                   <a-form-item label="域名" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                       <a-input  v-decorator="[
          'domain',
          {
            rules: [{required: true,message:'请输入域名'}],
          },
        ]"></a-input>
                   </a-form-item>
               </a-form>
            </div>
        </a-modal>

    </div>
</template>

<script>
    import {getIcpDomain,addIcpDomain,delIcpDomain} from '@/api/permissions';
    import {mixinonlyOne} from '@/utils/mixin';
    import moment from 'moment'
    export default {
        name: "icpDomain",
        data(){
            return{
                loading:true,
                columns:[
                    // {
                    //     title: '#',
                    //     dataIndex: 'index',
                    //     fixed: 'left',
                    //     width:100,
                    //     key:'index'
                    // },
                    {
                        title: 'ICP域名',
                        dataIndex: 'domain',
                        key: 'domain',
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
                domainList:[],
                selectedRowKeys:[],
                params:{
                    page:1,
                    psize:10,
                    domain:''
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
                isload_btn:false,
                showAddDomain:false,
                form: this.$form.createForm(this, { name: 'icpdomain' }),
                addParam:{
                    domain:''
                }
            }
        },
        mixins: [mixinonlyOne],
        created(){
        //获取初始化数据
            this.GetICPdomainlist()
        },
        methods:{
            onShowSizeChange(current,pageSize){
                this.pagination.pageSize = pageSize;
                this.pagination.current = current
                this.params.psize=pageSize;
                this.params.page=current;
                this.GetICPdomainlist()
            },
            onChangePage(current){
                this.pagination.current = current;
                this.params.page = current;
                this.GetICPdomainlist();
            },
            onSelectChange(selectedRowKeys) {

                this.selectedRowKeys = selectedRowKeys;
            },
            async GetICPdomainlist(){
                const {code,msg,data}=await getIcpDomain(this.params)
                if(code==1001){
                    data.list.forEach((item,index)=>{
                        item.index=index+1;
                        item.created_at = moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.domainList=data.list;
                    this.loading=false;
                    this.pagination.total=data.total_pages*this.pagination.pageSize;
                }else {
                    this.$notification.error({message:msg})
                }
            },
            searchDomain(){
                this.isload_btn=true;
                this.GetICPdomainlist().then(()=>{
                    this.isload_btn=false;
                })
            },
            //添加域名
            showAddDomainModal(){
                this.showAddDomain=true;
                this.form.resetFields();
            },
            async  AddICPdomain(){
                this.form.validateFields((err, values)=>{
                    if(!err){
                        this.showAddDomain=false;
                       this.addParam={...values}
                        addIcpDomain(this.addParam).then((res)=>{
                           const {code,msg}=res;
                            if(code==1001){
                                this.$notification.success({message:msg})
                                this.GetICPdomainlist()
                            }else {
                                this.$notification.error({message:msg})
                            }
                        })

                    }
                })

            },
            //删除域名
            deleteDomain(id){
                this.onlyOne(id);
                this.$confirm({
                    title: '你确定要删除该域名吗?',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk:()=> {
                        delIcpDomain({id}).then(res=>{
                            const {code,msg} =res;
                            if(code==1001){
                                this.$notification.success({message:msg});
                                this.GetICPdomainlist();
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
            }
        }
    }
</script>

<style scoped lang="less">
    .domain-top{
        margin: 20px 0;
        .domain-search{
            display: flex;
            justify-content: center;
            align-items: center;
            span{
                white-space: nowrap;
                display: inline-block;
                margin-right: 20px;
            }
        }
    }
    .addDamin{
        margin: 30px 0;
    }

</style>
