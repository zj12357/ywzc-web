<template>
    <div>
        <a-card>
            <div class="log-search">
                <a-row  type="flex" justify="start">
                    <a-col :span="4" class="log-search-text">
                        <span>操作节点：</span>
                        <a-input type="text" v-model="queryParam.node" style="width: 80%"  @keyup.enter.native="searchBtn"/>
                    </a-col>
                    <a-col :span="4" class="log-search-text" offset="1">
                        <span>节点名称：</span>
                        <a-input type="text" v-model="queryParam.action" style="width: 80%"  @keyup.enter.native="searchBtn"/>
                    </a-col>

                    <a-col  :span="7" class="log-search-text" offset="1">
                        <span>创建时间：</span>
                        <div style="display: flex">
                            <a-date-picker
                                    :disabledDate="disabledStartDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    v-model="startValue"
                                    placeholder="开始时间"
                                    @openChange="handleStartOpenChange"
                                    @change="getStart"
                            />
                            <div style="margin-left: 20px"></div>
                            <a-date-picker
                                    :disabledDate="disabledEndDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="结束时间"
                                    v-model="endValue"
                                    :open="endOpen"
                                    @openChange="handleEndOpenChange"
                                    @change="getEnd"
                            />
                        </div>
                    </a-col>
                    <a-col :span="5" offset="1">
                        <a-button type="primary" @click="searchBtn" :loading="isload_btn">搜索</a-button>
                    </a-col>
                </a-row>

            </div>
            <a-table
                    :rowKey="logList => logList.id"
                    :columns="columns"
                    :dataSource="logList"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    :pagination='pagination'
                    :loading='loading'
                    :scroll="{ x: 1300 }"
            >

            </a-table>
        </a-card>
    </div>
</template>

<script>
    import {actionLog} from '@/api/permissions';
    import moment from 'moment'
    export default {
        name: "actionLog",
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
                        title: '操作者id',
                        dataIndex: 'uid',
                        key: 'uid',
                    },
                    {
                        title: '操作者名称',
                        dataIndex: 'username',
                        key: 'username',
                    },
                    {
                        title: '操作节点',
                        dataIndex: 'node',
                        key: 'node',
                    },
                    {
                        title: '操作节点名称',
                        dataIndex: 'action',
                        key: 'action',
                    },
                    {
                        title: '操作者ip',
                        dataIndex: 'geoip',
                        key:'geoip'
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'created_at',
                        key: 'created_at',
                    },
                    // {
                    //     title: '操作',
                    //     dataIndex: 'actionlog',
                    //     key: 'actionlog',
                    //     width:200,
                    //     fixed: 'right',
                    //     scopedSlots: {customRender: 'actionlog'},
                    // }
                ],
                logList:[],
                selectedRowKeys:[],
                //加载
                loading: true,
                isload_btn:false,
                queryParam: {
                    page:1,
                    psize:10,
                    node:'',
                    action:'',
                    created_at:[]
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
                startValue: null,
                endValue: null,
                endOpen: false,
            }
        },
        created(){
            this.getLoglist(this.queryParam)
        },
        methods:{

            searchBtn(){
                this.isload_btn=true;
                this.getLoglist(this.queryParam).then(()=> {
                        this.isload_btn = false
                    }
                );
            },
            async getLoglist(){
                const{code,msg,data} = await actionLog(this.queryParam)
                if(code==1001){
                    data.list.forEach((item,index)=>{
                        item.created_at = moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss')
                        item.index=index+1
                    });
                    this.logList=data.list;
                    this.loading=false;
                    this.pagination.total=data.total_pages*this.pagination.pageSize;
                }else {
                    this.$notification.error({message:msg})
                }
            },

            //分页
            onShowSizeChange(current,pageSize){
                this.pagination.pageSize = pageSize;
                this.pagination.current = current
                this.queryParam.psize=pageSize;
                this.queryParam.page=current;
                this.getLoglist(this.queryParam)
            },
            onChangePage(current){
                this.pagination.current = current;
                this.queryParam.page = current;
                this.getLoglist(this.queryParam);
            },
            onSelectChange(selectedRowKeys) {

                this.selectedRowKeys = selectedRowKeys;
            },

            disabledStartDate(startValue) {
                const endValue = this.endValue;
                if (!startValue || !endValue) {
                    return false;
                }
                return startValue.valueOf() > endValue.valueOf();
            },
            disabledEndDate(endValue) {
                const startValue = this.startValue;
                if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            },
            handleStartOpenChange(open) {
                if (!open) {
                    this.endOpen = true;
                }
            },
            handleEndOpenChange(open) {
                this.endOpen = open;
            },
            getStart(val,toString){
                console.log(val,toString)

                if(val){
                    this.queryParam.created_at[0]=toString
                }else {
                    this.queryParam.created_at=''
                }
            },
            getEnd(val,toString){
                console.log(val,toString)
               if(val){
                   this.queryParam.created_at[1]=toString
               }else {
                   this.queryParam.created_at=''
               }

            },
        }
    }
</script>

<style scoped lang="less">
    .log-search{
        margin: 20px 0;
        .log-search-text{
            display: flex;
            justify-content: center;
            align-items: center;
            span{
                white-space: nowrap;
            }
        }
    }
</style>
