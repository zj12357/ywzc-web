<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false" class='costomTable'>

      <div class="gutter-example">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">
           <div class="gutter-box">
             <a-row>
              <a-col :span="4">
                <span>用户名： </span>
              </a-col>
              <a-col :span="18">
                <a-input  placeholder="" v-model="searchData.username" @keyup.enter.native="search"/>
              </a-col>
            </a-row>
           </div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box">
              <a-row>
                <a-col :span="5">
                  <a-button type="primary" @click="search" :loading="isload_btn">搜索</a-button>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>

      <div style="padding:20px 0">
        <a-button type="primary" @click="() => addmodalVisible = true">新增用户</a-button>
      </div>

      <!-- table -->
        <a-table :dataSource="data" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :loading='loading' :pagination='pagination' :rowKey="record => record.id" :scroll="{ x: 1300 }">
          <!-- <a-table-column title="#" dataIndex="index" key="index" :width="100" fixed='left'/> -->
          <a-table-column title="用户名" dataIndex="username" key="username" :width="200" fixed='left'/>
          <a-table-column title="cname" dataIndex="cname" key="cname" />
          <a-table-column title="角色" dataIndex="authorizeName" key="authorizeName" />
          <a-table-column title="创建时间" dataIndex="created_at" key="created_at" />
          <a-table-column title="状态" key="status" :width='100'>
          <template slot-scope="text, record">
            <a-tag :color="record.status=='开启' ? 'green' :'red'">
              {{record.status}}
            </a-tag>
          </template>
        </a-table-column>
          <a-table-column title="操作" key="action" :width='220' fixed='right'>
            <template slot-scope="record">
              <span>
                <a @click="rowModify(record,'consumer')" href="javascript:void (0);"> 修改  </a>
                  <a-divider type="vertical"/>
                <a @click="disable(record,'consumer')"> {{ record.status=='开启'?'禁用':'开启'}}  </a>
              </span>
            </template>
          </a-table-column>
        </a-table>
        <!-- dialog -->
        <!-- 新增 -->
          <a-modal
            :width='750'
            title="新增用户"
            centered
            v-model="addmodalVisible"
            @ok="addSubmit(target)"
          >
            <a-form :form="form">
              <a-form-item label="用户名" name="username" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="['username', { rules: [{ required: true, message: '请输入用户名' }] }]"
                />
              </a-form-item>
              <a-form-item label="cname" name="cname" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="['cname']"
                />
              </a-form-item>
              <!-- <a-form-item label="邮箱" name="mail" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="['mail', { rules: [{ required: true, message: '请输入邮箱' },{
                  pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                  message: '邮箱格式不正确',
                  }] }]"
                />
              </a-form-item> -->
              <a-form-item label="角色" name="authorize" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                <a-checkbox-group
                v-decorator="['authorize']"
                :options="authData"/>
              </a-form-item>
              <a-form-item label="简介" name="desc" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="['desc', { rules: [{ required: true, message: '请输入简介' }] }]"
                />
              </a-form-item>
            </a-form>
          </a-modal>
        <!-- 修改 -->
        <a-modal
            title="修改用户信息"
            centered
            v-model="morifyModalVisible"
            @ok="morifySubmit"
            :width='750'
          >
            <div>
              <a-tabs :activeKey="mtarget" @change="callback">
                <a-tab-pane tab="修改基础信息" key="consumer_basic">
                  <a-form :form="form2">
                    <a-form-item label="用户名" name="username" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                      <a-input
                        v-decorator="['username']"
                        disabled
                      />
                    </a-form-item>
                    <a-form-item label="cname" name="cname" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                      <a-input
                        v-decorator="['cname']"
                      />
                    </a-form-item>
                    <a-form-item label="角色" name="authorize" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                      <a-checkbox-group
                        v-decorator="['authorize']"
                        :options="authData"/>
                    </a-form-item>
                    <a-form-item label="简介" name="desc" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                      <a-input
                        v-decorator="['desc', { rules: [{ required: true, message: '请输入简介' }] }]"
                      />
                    </a-form-item>
                  </a-form>
                </a-tab-pane>
                <a-tab-pane tab="修改密码" key="consumer_passwd" forceRender>
                  <a-form :form="form3">
                    <a-form-item label="密码" name="password" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                      <a-input-password
                        v-decorator="['password', { rules: [{ required: true, message: '请输入密码' },
                        { min:6,message: '密码不能少于6个字符'}] }]"

                      />
                    </a-form-item>
                    <a-form-item label="重复密码" name="rPassword" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                      <a-input-password
                        v-decorator="['rPassword', { rules:
                        [{ required: true, message: '请重复输入密码' },
                        { validator(rule, value, callback){
                          if(!value){
                              callback()
                          }
                          if(value == form3.getFieldValue('password')){
                              callback()
                          }
                          else{
                              callback('两次密码不一致')
                          }
                          }}] }]"
                      />
                    </a-form-item>
                  </a-form>
                </a-tab-pane>
              </a-tabs>
            </div>
          </a-modal>
    </a-card>
</template>

<script>
import pick from "lodash.pick"
import { getConsumenList, grtConsumerGroup,getAlluser } from '@/api/consumer'
import { mixinDevice } from '@/utils/mixin'
import listPage from '@/utils/page/list'
import resolve from '@/utils/page/resolve'
import verb from '@/utils/page/verb'
import statusVerb from '@/utils/page/status'
import submit from '@/utils/page/submit'
import morifySubmit from '@/utils/page/morifySbmit'
export default {
  name: 'consumer',
  mixins: [mixinDevice,listPage,resolve,verb,statusVerb,submit,morifySubmit],
  data () {
    return {
      loading: true,
      target: 'addConsumer',
      mtarget: 'consumer_basic',
      headers: {
        authorization: 'authorization-text',
      },
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'consumer-add' }),
      form2: this.$form.createForm(this, { name: 'consumer-morify-bsic' }),
      form3: this.$form.createForm(this, { name: 'consumer-morify-pwd' }),
      searchData: {
        username: '',
        phone: '',
      },
      morifyBasicData: {},
      morifyPwdData: {},
      authData: [],
      isload_btn:false
    }
  },
  methods: {
    async initData(page=1,psize=10,seaechData={}){
      const res = await getConsumenList(page,psize,seaechData);
      res ? this.isload_btn=false : this.isload_btn=true
      this.init(res,page,psize)
    },
    morifySubmit(){
      switch(this.mtarget){
        case 'consumer_basic' :{
          this.form2.validateFields((err, values) => {
            if (!err) {
              this.morifyBasicData = values
              this.morifyBasicData.id = this.recordData.id
              this.modify(this.mtarget)
            }
           });
           break;
        }
        case 'consumer_passwd':{
          this.form3.validateFields((err, values) => {
            if (!err) {
              this.morifyPwdData = values
              this.morifyPwdData.id = this.recordData.id
              this.modify(this.mtarget)
            }
          });
          break;
        }
      }
    },
    callback(key) {
      this.mtarget = key
      this.form3.resetFields()
    },

  },
  created(){
    getAlluser().then(
      res =>{
        const { data } = res
        data.forEach(iterm =>{
          iterm.label = iterm.name
          iterm.value = iterm.id
        })
        this.authData = data
      }
    )
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
    span{
      white-space: nowrap;
    }
  }
  .gutter-box span{
    height: 32px;
    line-height: 32px
  }
</style>
