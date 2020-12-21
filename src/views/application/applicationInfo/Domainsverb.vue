<template>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false" class='costomTable'>
        <div class="gutter-example">
            <a-row :gutter="16">
                <a-col col class="gutter-row" :span="10">
                    <div class="gutter-box">
                        <a-row>
                        <a-col :span="3">
                            <span style="white-space: nowrap">域名： </span>
                        </a-col>
                        <a-col :span="18">
                            <a-input  placeholder="" v-model="searchData.domain" @keyup.enter.native="search"/>
                        </a-col>
                        </a-row>
                    </div>
            </a-col>

          <a-col class="gutter-row" :span="10">
            <div class="gutter-box">
              <div class="gutter-box">
             <a-row>
              <a-col :span="4">
                <span style="white-space: nowrap">渠道号： </span>
                </a-col>
                <a-col :span="18">
                  <a-input  placeholder="" v-model="searchData.channel_code" @keyup.enter.native="search"/>
                </a-col>
              </a-row>
            </div>
            </div>
          </a-col>

          <a-col class="gutter-row" :span="4">
            <a-button type="primary" @click="search" :loading="isload_btn">搜索</a-button>
          </a-col>
        </a-row>
      </div>

      <div style="padding:20px 0;display:flex">
        <a-button type="primary" @click="() => {addmodalVisible = true;form.resetFields();}">批量添加</a-button>
        <a-button type="primary" style="margin-left:30px" @click='deleSigApp'>批量删除</a-button>
        <span style="color:red;padding-left:60px">*</span>
        <span style="white-space: nowrap">请将所有使用域名用CNAME方式解析到: <b style="color: red">{{this.cName}}</b> </span>
      </div>

        <!-- table -->
        <a-table :dataSource="data" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :loading='loading' :pagination='pagination' :rowKey="record => record.id" :scroll="{ x: 1200 }">
            <!-- <a-table-column title="#" dataIndex="index" key="index" :width="100" fixed="left"/> -->
          <a-table-column title="域名" dataIndex="domain" key="domain" :width="300" fixed="left"/>
            <a-table-column title="渠道号" dataIndex="channel_code" key="channel_code" />
          <a-table-column title="统计代码" dataIndex="statistics_code" key="statistics_code" :width='180'/>
            <a-table-column title="状态" dataIndex="status" key="status" :width="100">
                <template slot-scope="record">
                    <a-tag :color="record=='通过' ? 'green' :'red'">
                       {{record}}
                    </a-tag>
                </template>
            </a-table-column>
            <a-table-column title="拒绝原因" dataIndex="reason" key="reason" :width='180'/>
          <a-table-column title="操作" key="action" :width='140' fixed="right">
            <template slot-scope="record">
              <span>
                <a @click="rowModify(record)"> 修改</a>
                   <a-divider type="vertical"/>
                <a @click="rowDelete(record)"> 删除 </a>
              </span>
            </template>
          </a-table-column>
        </a-table>

        <!-- dialog -->
        <!-- 新增 -->
          <a-modal
            :width='750'
            title="批量添加域名"
            centered
            v-model="addmodalVisible"
            @ok="addSubmit(target)"
          >
          <a-form :form="form">
            <a-form-item label="域名" name="domains" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-textarea
               :rows="5"
               placeholder="域名、渠道号可以多行添加，域名和渠道号使用‘空格’隔开，每条域名渠道号使用回车隔开"
               v-decorator="['domains', { rules: [{ required: true, message: '请输入域名' }] }]"
              />
            </a-form-item>
            <a-form-item label="统计代码" name="statistics_code" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-textarea
                :rows="5"
                placeholder="多个域名使用同一个‘统计代码’，修改统计代码请到域名管理处单独修改"
                v-decorator="['statistics_code']"
              />
            </a-form-item>
          </a-form>
          </a-modal>
        <!-- dialog -->
        <!-- 删除 -->
        <a-modal :width='300'
            title="操作"
            centered
            v-model="deleteModalVisible"
            @ok="deleteDomain('domainverb')"
          >
            <p>确定要删除选中的域名吗</p>
          </a-modal>
        <!-- dialog -->
        <!-- 修改 -->
        <a-modal
            title="修改域名跳转"
            centered
            v-model="morifyModalVisible"
            @ok="morifySubmit(mtarget)"
            :width='750'
          >
          <a-form :form="form2">
            <a-form-item label="访问域名" name="domain" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-input
                v-decorator="['domain', { rules: [{ required: true, message: '请输入访问域名' },{
                pattern: /^[^\s]*$/,
                message: '域名禁止输入空格',
               }] }]"
              :disabled="recordData.status=='通过'"/>
            </a-form-item>
            <a-form-item label="渠道号" name="channel_code" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-input
                v-decorator="['channel_code']"
              />
            </a-form-item>
            <a-form-item label="统计代码" name="statistics_code" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-textarea
                v-decorator="['statistics_code']"
                :rows="5"
              />
            </a-form-item>
          </a-form>
          </a-modal>
    </a-card>
</template>

<script>
    import { mixinDevice } from '@/utils/mixin'
    import { deepClone } from '@/utils/util'
    import listPage from '@/utils/page/list'
    import resolve from '@/utils/page/resolve'
    import { getAppDmainList,getCname } from '@/api/domain'
    import verb from '@/utils/page/verb'
    import submit from '@/utils/page/submit'
    import morifySubmit from '@/utils/page/morifySbmit'
    export default {
        name: "Domainsverb",
        mixins: [mixinDevice,listPage,verb,resolve,submit,morifySubmit],
        data(){
            return{
              target: 'domainverb',
              mtarget: 'domainverb',
              loading: true,
              formLayout: 'horizontal',
              form: this.$form.createForm(this, { name: 'domainsverb' }),
              form2: this.$form.createForm(this, { name: 'morifyDomainVerb' }),
              searchData: {
                  domain:'',
                  channel_code:''
              },
              cName:'',
                //按钮搜索状态
                isload_btn:false,
            }
        },
        methods:{
            async initData(page=1,psize=10,seaechData={}){
                const id=this.$route.params.id
                const res = await getAppDmainList(id,page,psize,seaechData)
                res ? this.isload_btn=false : this.isload_btn=true
                this.init(res,page,psize,'cf')
            },
            async getCname(){
                const res = await getCname()
                const { data } = res
                this.cName = data.cname
            },
            deleSigApp(){
                if(this.selectedRowKeys.length==0){
                    this.$notification.warning({message:'请勾选你要删除的域名'})
                }else {
                    this.deleteModalVisible = true
                }

            },
        },
        created(){
          this.getCname()
        }
    }
</script>

<style scoped lang="less">
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
