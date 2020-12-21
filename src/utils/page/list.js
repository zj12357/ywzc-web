import moment from 'moment'
export default {
    data(){
        return {
          data: [],
          selectedRowKeys: [],
          pagination:{
            pageSize:10,
            total:10,
            defaultCurrent: 1,
            current:1,
            // showTotal: total => `共 ${total} 条数据`,
            showSizeChanger:true,
           pageSizeOptions: ['10', '20', '50', '100'],
            onShowSizeChange:this.onShowSizeChange,
            onChange:this.onChange
          },
        }
    },
    methods: {
      search(){
        //按钮搜索状态
        this.isload_btn=true
        this.initData(this.pagination.current,this.pagination.pageSize,this.searchData)
      },
      onShowSizeChange(current, pageSize) {
        this.pagination.pageSize = pageSize;
        this.pagination.current = current
        this.initData(current,pageSize,this.searchData)
      },
      onChange(current) {
        this.pagination.current = current
        this.initData(current,this.pagination.pageSize,this.searchData)
      },
      init(res,page,psize,target='domain'){
        const { data } = res
        const { list, total_pages } = data
        this.pagination.total = psize*total_pages
        if(list && list.length>0 &&target=='domain'){
          this.formatData(list)
        }
        if(list && list.length>0){
          list.forEach((iterm,index)=>{
            iterm['index'] = (page-1)*psize+index+1
          })
        }
        if(list && list.length>0 &&target=='sigApp'){
          list.forEach(iterm=>{
            iterm.type==1?iterm.type='安卓':iterm.type='苹果'
            iterm.created_at = moment.unix(iterm.created_at).format('YYYY-MM-DD HH:mm:ss')
          })
        }
        if(list && list.length>0 &&target=='cf'){
          list.forEach(iterm=>{
            if(iterm.status==1){iterm.status='通过'}
            else if(iterm.status==0){iterm.status='待审核'}
            else iterm.status='拒绝'
            iterm.created_at = moment.unix(iterm.created_at).format('YYYY-MM-DD HH:mm:ss')
          })
        }
        this.data = list
        this.loading = false
        if(list&&list.length==0 && page>1){
          page--
          this.onChange(page)
          this.pagination.current=page
        }
      },
      formatData(data){
        data.forEach(iterm=>{
          iterm.status==1?iterm.status='开启':iterm.status='禁用'
          iterm.created_at = moment.unix(iterm.created_at).format('YYYY-MM-DD HH:mm:ss')
        })
      },
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
    },
    created() {
      this.initData()
    },
    computed: {
      hasSelected() {
        return this.selectedRowKeys.length > 0;
      },
    },
}
