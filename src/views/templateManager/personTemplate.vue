<template>
  <div>
    <a-card :bordered="false" class="ant-pro-components-tag-select">

      <a-row class="template-row group">
        <a-col :span="3">模版分组:</a-col>
        <a-col :span="18">
          <ul class="template-group"  :style="advanced ? {    minHeight: '30px',
    overflow: 'initial'} : {  height: '30px',overflow :'hidden'} ">
            <li @click="GetAllGroup" :class="{active:allshow}">全部分组</li>
            <li v-for="(item,index) in PersonGroupList" :class="{active:currentIndex===index && !allshow}" @click="changeTemplate(index,item.id)" :key="index">{{item.name}}</li>

          </ul>
        </a-col>
        <a-col :span="3">
          <a class="tel-keywords" @click="toggleAdvanced" ref="isAdvanced">{{advanced ? "收起" : "展开"}}
            <a-icon :type="advanced ? 'up' : 'down'"/>
          </a>
        </a-col>
      </a-row>

      <a-row class="template-row">
        <a-col :span="3">
          搜索模版:
        </a-col>
        <a-col :span="21">
          <span class="tel-keywords" >关键词:</span>
          <a-input style="max-width: 268px; width: 100%;" @keydown.enter="searchBtn" v-model="queryParam.name">
          </a-input>
          <a-button type="primary" @click="searchBtn" style="margin-left: 30px" :loading="isload_btn">搜索</a-button>
        </a-col>


      </a-row>

      <a-row class="template-row">
        <a-col :span="3">
          其他选项:
        </a-col>
        <a-col :span="21">

          <a href="javascript:void(0);" class="my-copy" @click="showModal('新增模版')">新增模版</a>

          <router-link to="/templateManager/personTemplate/group" class="my-copy">模版分组</router-link>
        </a-col>

      </a-row>

    </a-card>
      <a-card>
        <div>
          <a-button type="primary" style="margin-bottom:30px" @click="transTemplate">转移模版</a-button>
        </div>
        <a-table
                :rowKey="PersonList => PersonList.id"
                :columns="columns"
                :dataSource="PersonList"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                :pagination='pagination'
                :loading='loading'
                :scroll="{ x: 1300 }"
        >
            <span slot="preview" slot-scope="record">
                  <a :href="record" target="_blank">预览</a>
            </span>
          <span slot="is_config" slot-scope="record">
                <a-tag  :color="record==1 ?  'green' : 'red'">
                  {{record ==1 ? '已配置' : '未配置'}}
                </a-tag>
            </span>
          <span slot="action" slot-scope="text, record">
            <a href="javascript:;" @click="showChangeModal(record,'修改模版')">修改</a>
            <a-divider type="vertical"/>
            <a href="javascript:;" @click="downTemplate(record)">下载</a>
            <a-divider type="vertical"/>
            <a href="javascript:;" @click="setAllocate(record,record.id)">配置</a>
            <a-divider type="vertical"/>

            <a href="javascript:;" @click="delTemplate(record.id)">删除</a>

          </span>
        </a-table>
      </a-card>


    <!-- 新增或者修改模态框-->
    <a-modal :title="temtitle" v-model="visible" @ok="handleOk" centered :width="700" @cancel="()=>{selectedRowKeys=[];selectValue=''}"  :maskClosable="false">
      <div >
        <a-form :form="formtem">
          <a-form-item  label="模版名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
            <a-input
                    v-decorator="[
          'name',
          {
            initialValue: TelParam.name,
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
          <a-form-item   label="模版分组" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">

            <a-select  style="width: 120px;" @change="chooseGroup" @select="chooseGroup" :getPopupContainer='triggerNode => triggerNode.parentNode'
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
              <a-select-option  v-for="(item,index) in PersonGroupList" :key="index" :value="item.id" >{{item.name}}</a-select-option>

              </a-select>

          </a-form-item>


          <a-form-item   label="模版压缩包" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
            <a-upload
            name="file"
            :headers="headers"
            :multiple="true"
            :action="filepath"
            @change="upTemplate"
            v-decorator="[
          'path',
          {
            initialValue: TelParam.path,
            rules: [{required: true, validator: (rule, value, callback)=> {
                if (value!= '') {
                    callback();
                }else {
                    callback('请上传模版压缩包');
                }

            } }],
          },
        ]"
            >
            <a-button type="primary"> <a-icon type="upload" /> 新增 </a-button>
            </a-upload>
          </a-form-item>
        </a-form>

      </div>

    </a-modal>
    <!-- 新增或者修改模态框-->


    <!-- 配置模态框-->
    <a-modal title="参数配置" v-model="configuration" @ok="handleAllocate" centered  :width="850"
             @cancel="selectedRowKeys=[]"
             :maskClosable="false"
    >
      <div style="width: 800px;height: 380px;overflow-y:scroll " >
        <a-form :form="form" >
          <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  :label="item[1].title"
                  v-for="(item,index) in notimgList"
          >
            <div  v-if="item[0].indexOf('tool')>-1" @click="getConfigPath(item[0])">
              <a-upload
                      name="file"
                      :action="configPath"
                      @change="Upconfig"
                      :headers="headers"
              >
                <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style="margin-left: 10px" v-if="item[1].val!==''" />
              </a-upload>
            </div>
            <a-input
                    v-else
                    v-model="configParam[item[0]].val"
            />

          </a-form-item>
          <a-form-item
                  :label-col="formImgLayout.labelCol"
                  :wrapper-col="formImgLayout.wrapperCol"
                  :label="item[1].title"
                  v-for="(item,index) in imgList"
          >
            <div  @click="getIndex(index,item[0])">
              <a-upload
                      name="file"
                      :action="imgPath"
                      listType="picture-card"
                      @change="upImage"
                      class="avatar-uploader"
                      :showUploadList="false"
                      :headers="headers"
              >
                <div >
                  <img   v-lazy="item[1].val" alt="" style="width: 200px;height: auto" ref="upimgurl" >

                </div>
              </a-upload>
              <span  class="preview"  @click="showimgModal(item[1].val)">预览</span>
              <span class="descimg-text">{{item[1].desc}}</span>
            </div>


          </a-form-item>




        </a-form>
      </div>
    </a-modal>
    <!-- 配置模态框-->

    <!-- 预览图片模态框-->
    <a-modal title="预览图片" v-model="visibleimg"  :width="600" centered @cancel="handleimg" :footer="null">
      <div style="width: 500px;display: flex;justify-content: center;margin: 0 auto">
        <img  v-lazy="previewImg" alt="" style="display: block;width: 100%">
      </div>

    </a-modal>
    <!-- 预览图片模态框-->
    <!--转移模版-->
    <a-modal title="转移模版" centered v-model="isTransTemplate" @ok="transTemplateList" @cancel="selectedRowKeys=[];">
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
  </div>

</template>

<script>

  import {Getperson, GetpersonGroup, AddTemplate, ChangeTemplate, DelTemplate,ConfigTemplate,Downtemplate,transTemplate} from '@/api/template';

  import { getAlluser } from '@/api/user'
  import {mixinonlyOne,mixinBase64} from '@/utils/mixin';
  import {mapGetters, mapActions} from 'vuex'
  import _ from 'lodash';
  const formItemLayout = {
    labelCol: {span: 8, offset: 2},
    wrapperCol: {span: 8},
  };
  const formTailLayout = {
    labelCol: {span: 8, offset: 2},
    wrapperCol: {span: 8,},
  };
  const formImgLayout = {
    labelCol: {span: 8, offset: 2},
    wrapperCol: {span: 12,},
  };


  export default {
    name: 'personTemplate',
    components: {},
    mixins: [mixinonlyOne,mixinBase64],
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
            key:'name',
            fixed: 'left',
            width:200,
          },
          {
            title: '展示效果',
            dataIndex: 'preview',
            key:'preview',
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
            key:'created_at'
          },


          {
            title: '状态',
            dataIndex: 'is_config',
            key:'is_config',
            scopedSlots: {customRender: 'is_config'},
          },
          {
            title: '操作',
            dataIndex: 'action',
            width:200,
            fixed: 'right',
            key:'action',
            scopedSlots: {customRender: 'action'},
          }
        ],
        formtem: this.$form.createForm(this, { name: 'personTemplate' }),
        //按钮搜索状态
        isload_btn:false,
        //下拉默认选择
        selectValue:'',
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
        currentIndex: 0,
        selectedRowKeys: [], // Check here to configure the default column
        //模版title
        temtitle:'',
        // 查询条件参数
        queryParam: {
          page: 1,
          psize: 10,
          name: '',
          group_id: ''
        },
        //添加或者修改模版
        TelParam: {
          id: '',
          name: '',
          group_id: '',
          path: ''
        },
        //删除模版
        delParam: {
          id: ''
        },

        //全部分组状态
        allshow: false,
        // 加载数据方法 必须为 Promise 对象
        //是否修改
        isChange: false,
        loadData: [],
        //展开状态
        advanced: false,
        //复制模版模态框
        visible: false,
        //上传模版
        filepath: '/api/upload/tpl_zip',
        imgPath:'/api/upload/image',
        configPath:'/api/upload/mobile_config',
        //配置状态
        configuration: false,
        //配置数据

        configParam:{
          id:'',
          web_title:{},
          kefu_url:{}
        },
        //模版id
        temid:'',
        //当前要修改的img
        imgIndex:0,
        //上传图片
        imgkey:'',
        //上传文件
        configkey:'',
        imgList:[],
        notimgList:[],
        upimageloading:false,
        //预览图片
        visibleimg:false,

        previewImg:'',
        //配置
        checkNick: false,
        formItemLayout,
        formTailLayout,
        formImgLayout,
        form: this.$form.createForm(this, {name: 'dynamic_rule'}),
        formtrans: this.$form.createForm(this, { name: 'trans' }),
        //加载
        loading: true,
        imageUrl: '',
        headers: {
          Authorization:'Bearer '+this.$token
        },
        //转移模版
        isTransTemplate:false,
        transList:[],
        transParams:{
          id:'',
          uid:''
        }
      }
    },
    created() {
      this.Getpersons(this.queryParam).then((res) => {
        this.allshow = true;
        this.loading=false;
        this.pagination.total=res.data.total_pages*this.pagination.pageSize;
      });
      this.GetPersonGroups();
      //如果是admin添加一栏创建者
      this.GetInfo().then(res=>{
        const {code,msg,data} =res;
        if(code==1001 && data.is_admin==1){
           this.columns.splice(5,0, {
                    title: '创建者',
                    dataIndex: 'username',
          },)
        }
      })
    },
    mounted() {

    },
    watch:{
      $route(val){
        if(val.path=='/templateManager/personTemplate'){
          this.GetPersonGroups();
        }
      }
    },

    computed: {
      ...mapGetters(['PersonList','PersonGroupList',]),

    },
    methods: {
      //分页
      onShowSizeChange(current,pageSize){
        this.pagination.pageSize = pageSize;
        this.pagination.current = current
        this.queryParam.psize=pageSize;
        this.queryParam.page=current;
        this.Getpersons(this.queryParam)
      },
      onChangePage(current){

        this.pagination.current = current;
        this.queryParam.page = current;
        this.Getpersons(this.queryParam);
      },

      //获取个人模版分组列表,获取我的模版分组列表
      ...mapActions(['Getpersons','GetPersonGroups','GetInfo']),


      GetAllGroup() {
        this.allshow = true;
        this.queryParam.group_id=''
        this.queryParam.name='';
        this.Getpersons(this.queryParam).then((res) => {
          this.pagination.total=res.data.total_pages*this.pagination.pageSize;
        });;
      },

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
      //转移模版
      chooseTrans(val){
        this.transParams.uid=val
      },
      //转移模版
      transTemplate(){
        if(this.selectedRowKeys.length==0){
          this.$notification.warning({message:'请选择模版名称'})
        }else {
          this.isTransTemplate=true;
          this.transParams.uid='';
          this.formtrans.resetFields();
          this.transParams.id=this.selectedRowKeys.join(',')

        }
      },
      async transTemplateList(){
        this.formtrans.validateFields((err, values)=>{
          if(!err){
            this.isTransTemplate=false;
            this.selectedRowKeys=[]
            const {uid}=values;
            this.transParams.uid=uid;
            transTemplate(this.transParams).then(res=>{
                      const {code,msg}=res
                      if(code==1001){
                        this.formtrans.resetFields();
                        this.$notification.success({message:msg})
                        this.Getpersons(this.queryParam);
                      }else {
                        this.$notification.error({message:msg})
                      }
                    }
            )

          }
        })

      },

      //新增模版
      async addTemplate() {
        this.formtem.validateFields((err, values)=>{
          if(!err){
            const {name}=values;
            this.TelParam.name=name;
            this.visible = false;
            const {id, ...param} = this.TelParam;
           AddTemplate(param).then(res=>{
             const {code,msg} =res;
             if (code == 1001) {
               this.$notification.success({message:msg});
               Object.keys(this.TelParam).forEach(item=>this.TelParam[item]='');
               this.formtem.resetFields();
               this.selectedRowKeys=[];
               this.selectValue=''
               this.Getpersons(this.queryParam)
             } else {
               this.$notification.error({message:msg})
             }

           });

          }
        })

      },
      //修改模版
      async cgTemplate() {
        this.formtem.validateFields((err, values)=>{
          if(!err){
           const {name}=values;
            this.TelParam.name=name;
             ChangeTemplate(this.TelParam).then(res=>{
               const {code,msg} =res;
               if (code == 1001) {

                   this.$notification.success({message:msg});
                   Object.keys(this.TelParam).forEach(item=>this.TelParam[item]='');
                   this.formtem.resetFields();
                   this.selectedRowKeys=[];
                   this.selectValue=''
                   this.Getpersons(this.queryParam)

               } else {
                 this.$notification.error({message:msg})
                 this.visible = false;
               }
               this.visible = false;
            });

          }
        })

      },

      //删除模版
      async delTemplate(id) {
        this.onlyOne(id)
        this.selectedRowKeys.push(id)
        this.delParam.id = id;
        this.$confirm({
          title: '你确定要删除该模版吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            console.log('OK');
            DelTemplate(this.delParam).then(res => {
              const {code,msg}=res;
              if (code == 1001) {
                this.$notification.success({message:msg});
                this.Getpersons(this.queryParam);
              } else {
                this.$notification.error({message:msg});
              }
            })
          },
          onCancel: () => {
            console.log('Cancel');
          },
        });


      },
      //配置模版
      async configTemplate(){

        const params={
          id:this.temid,
        };
        Object.entries(this.configParam).forEach((item,index)=>{
          const map =new Map()
          map.set(item[0],item[1].val);
          const mapChangeObj = (map) => {
            let obj = {};
            for(let [k,v] of map) {
              obj[k] = v;
            }
            return obj;
          }
          Object.assign(params,mapChangeObj(map))
        })

        const {code,msg} =await ConfigTemplate(params)
        if(code==1001){
          this.$notification.success({message:msg});
          this.selectedRowKeys=[];
          this.Getpersons(this.queryParam);

        }else {
           this.$notification.error({message:msg});
        }
        this.configuration = false;

      },
      //搜索
      searchBtn(){
        this.isload_btn=true;
        this.Getpersons(this.queryParam).then((res)=> {
          this.isload_btn = false;
          this.pagination.total=res.data.total_pages*this.pagination.pageSize;
                }
        );
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
      //选择分组
      chooseGroup(value) {
        this.TelParam.group_id = value
        this.selectValue=value
      },

      //展开和收起
      toggleAdvanced() {
        this.advanced = !this.advanced;

      },
      //显示
      showModal(val) {
        this.formtem.resetFields();
        Object.keys(this.TelParam).forEach(item=>this.TelParam[item]='');
        this.selectValue='';
        this.temtitle=val;
        this.visible = true;
        this.selectedRowKeys = [];
        this.isChange=false;
      },
      //显示修改modal
      showChangeModal({id, name,group_id},tname) {
        this.formtem.resetFields();
        this.temtitle=tname;
        this.visible = true;
        this.isChange = true;
        this.TelParam.id=id;
        this.TelParam.name=name;
        this.onlyOne(id);
        this.PersonGroupList.forEach((item)=>{
          if(item.id==group_id){
            this.selectValue=item.name;
            this.TelParam.group_id=item.id;
          }
        })
      },
      handleOk() {

        if (this.isChange) {
          this.cgTemplate()
        } else {
          this.addTemplate();
        }

      },
      //配置
      setAllocate(list, id) {
        try {

          this.configParam=list.ext_json;
          list.ext_json!==null &&  Object.keys( list.ext_json).forEach((item)=>{
            if(/^img_/.test(item)){
              console.log(/^\.\/config/.test(list.ext_json[item].val))
              let value=list.ext_json[item].val;
              if(/^upload\//.test(value)){
                list.ext_json[item].val =`/${value}`
              } else if (/^\.\/config/.test(value)) {

                list.ext_json[item].val=`/${list.package}/${value}`
              }else if(/^\.\.\/config/.test(value)){
                list.ext_json[item].val=`/${list.package_m}${value}`
              }
            }

          })
          console.log(list.ext_json)
          this.imgList=Object.entries(list.ext_json).filter((item)=>{
            return  item[0].indexOf('img_')>-1
          });
          this.notimgList=Object.entries(list.ext_json).filter((item)=>{
            return  item[0].indexOf('img_')==-1
          });
          this.temid=id;
          this.onlyOne(id)
          this.configuration = true;
        }catch (e) {
           console.log(e)
        }

      },
      getConfigPath(val){
        this.configkey=val;
      },
      getIndex(index,keyVal){
        this.imgIndex=index;
        this.imgkey=keyVal;
      },
      Upconfig(info){
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          const {code,msg,data}=info.file.response;
          if (code==1001){
            this.$notification.success({message:msg});
            this.configParam.ext_json[this.configkey].val=data.path;
          } else {
            this.$notification.error({message:msg})
          }

        } else if (info.file.status === 'error') {
          this.$notification.error({message:'上传失败'})
        }
      },
      upImage({ file }) {

        if (file.status === 'uploading') {
          this.upimageloading = true;
        }
        if (file.status === 'done') {

          const {code,msg,data}=file.response;
          if(code==1001){
            this.$notification.success({message:msg});
            this.$refs.upimgurl[this.imgIndex].src=`/${data.path}`;
            this.configParam[this.imgkey].val=`/${data.path}`;
            this.upimageloading = false;
          }else {
             this.$notification.error({message:msg})
          }

        } else if (file.status === 'error') {
          this.$notification.error({message:file.response.msg})
        }

      },

      handleAllocate() {

        this.configTemplate()

      },
      //修改模版
      changeTemplate(index, id) {
        this.currentIndex = index;
        this.queryParam.group_id = id;
        this.queryParam.name='';
        this.Getpersons(this.queryParam).then((res) => {
          this.pagination.total=res.data.total_pages*this.pagination.pageSize;
        });
        this.allshow = false;
      },
      //下拉选择触发
      onSelectChange(selectedRowKeys) {

        this.selectedRowKeys = selectedRowKeys;
      },

      upTemplate(info) {

        if (info.file.status !== 'uploading') {

        }
        if (info.file.status === 'done') {
          const {code,msg,data} =info.file.response;
          if(code==1001){
            this.TelParam.path=data.path;
            this.$notification.success({message:'上传成功'})
          }else {
             this.$notification.error({message:msg})
          }

        } else if (info.file.status === 'error') {
          this.$notification.error({message:info.file.response.msg})
        }
      },
      handleimg(){
        this.previewImg='';
        this.visibleimg = false;

      },
      showimgModal(url){
        this.previewImg=url;
        this.visibleimg = true;


      }



    },


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
      text-align: center;
      line-height: 30px;
      margin-bottom: 5px;
      margin-right: 20px;
      cursor: pointer;
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


  a{
    text-decoration: none;
  }
  .tel-keywords{
    margin-right: 20px;
    display: inline-block;
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .my-copy{
    display: inline-block;
    text-align: center;
    width: 80px;
    margin-right: 20px;
  }
  .descimg-text{
    color: #999;
    display: block;
  }
  .preview{
    margin-left: 30px;
    color: #1890ff;
    cursor: pointer;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
  .avatar-uploader{
    display: flex;
  }
  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  /deep/.ant-upload-list-picture-card .ant-upload-list-item{
    width: 70px;
    height: 70px;
  }
  /deep/.ant-upload.ant-upload-select-picture-card{
    width: 80px;
    height: 60px;
  }

  /deep/.ant-upload-list-picture-card .ant-upload-list-item-thumbnail{
    font-size: 14px;
  }

</style>

