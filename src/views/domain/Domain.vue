<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false" class='costomTable'>

      <div class="gutter-example">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="7">
           <div class="gutter-box">
             <a-row>
              <a-col :span="5">
                <span>访问域名： </span>
              </a-col>
              <a-col :span="18">
                <a-input  placeholder="" v-model="searchData.call_domain" @keyup.enter.native="search"/>
              </a-col>
            </a-row>
           </div>
          </a-col>

          <a-col class="gutter-row" :span="7">
            <div class="gutter-box">
              <div class="gutter-box">
             <a-row>
              <a-col :span="5">
                <span>跳转域名： </span>
                </a-col>
                <a-col :span="18">
                  <a-input  placeholder="" v-model="searchData.jump_domain" @keyup.enter.native="search"/>
                </a-col>
              </a-row>
            </div>
            </div>
          </a-col>

          <a-col class="gutter-row" :span="10">
            <div class="gutter-box">
              <a-row>
                <a-col :span="9">
                  <span>状态： </span>
                  <a-select  placeholder="请选择状态" style="width: 120px" @change="handleChange">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="1">开启</a-select-option>
                    <a-select-option value="0">禁用</a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="10">
                  <a-row>
                    <a-col :span="5"><span>备注：</span></a-col>
                    <a-col :span="15">
                         <a-input  placeholder="" v-model="searchData.remark" @keyup.enter.native="search"/>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="5">
                  <a-button type="primary" @click="search" :loading="isload_btn">搜索</a-button>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>

      <div style="padding:20px 0">
        <a-button type="primary" @click="() => {addmodalVisible = true;form.resetFields();}">新增域名</a-button>
        <a-button type="primary" style="margin-left:30px" @click='deleSigApp'>批量删除</a-button>
      </div>

      <!-- table -->
        <a-table :dataSource="data" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :loading='loading' :pagination='pagination' :rowKey="record => record.id" :scroll="{ x: 1300 }">
          <!-- <a-table-column title="#" dataIndex="index" key="index" :width="100" fixed='left'/> -->
          <a-table-column title="访问域名" dataIndex="call_domain" key="call_domain" />
          <a-table-column title="跳转域名" dataIndex="jump_domain" key="jump_domain" />
          <a-table-column title="备注" dataIndex="remark" key="remark" />
          <a-table-column title="创建时间" dataIndex="created_at" key="created_at" />
          <a-table-column title="创建者" dataIndex="username" key="username" :width='100' v-if="userInfo.is_admin==1"/>
          <a-table-column title="状态" key="status" :width='100'>
          <template slot-scope="text, record">
            <a-tag :color="record.status=='开启' ? 'green' :'red'">
              {{record.status}}
            </a-tag>
          </template>
        </a-table-column>
          <a-table-column title="中转跳转" key="jump_status"  dataIndex="jump_status" :width='100'>
            <template slot-scope="text, record">
              <a-tag :color="record.jump_status==1 ? 'green' :'red'">
                {{record.jump_status==1 ? '开启' : '关闭'}}
              </a-tag>
            </template>
         </a-table-column>
          <a-table-column title="操作" key="action" :width='200' fixed='right'>
            <template slot-scope="record">
              <span>
                <a @click="rowModify(record)" href="javascript:void (0);"> 修改</a>
                  <a-divider type="vertical"/>
                <a @click="disable(record,target)" href="javascript:void (0);"> {{ record.status=='开启'?'禁用':'开启'}}</a>
                  <a-divider type="vertical"/>
                <a @click="rowDelete(record)" href="javascript:void (0);"> 删除 </a>
              </span>
            </template>
          </a-table-column>
        </a-table>
        <!-- dialog -->
        <!-- 新增 -->
          <a-modal
            :width='750'
            title="新增域名跳转"
            centered
            v-model="addmodalVisible"
            @ok="addSubmit(target)"
          >
          <a-form :form="form">
            <a-form-item label="访问域名" name="call_domain" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-textarea
               :rows="4"
                v-decorator="['call_domain', { rules: [{ required: true, message: '请输入访问域名' }] }]"
              />
            </a-form-item>
            <a-form-item label="跳转域名" name="jump_domain" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-textarea
                :rows="4"
                v-decorator="['jump_domain', { rules: [{ required: true, message: '请输入跳转域名' }] }]"
              />
            </a-form-item>
            <a-form-item label="备注" name="remark" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-input
                v-decorator="['remark', { rules: [{ required: true, message: '请输入备注' }] }]"
              />
            </a-form-item>

          </a-form>
          </a-modal>
        <!-- 删除 -->
        <a-modal :width='300'
          title="操作"
          centered
          v-model="deleteModalVisible"
          @ok="deleteDomain(target)"
        >
          <p>确定要删除选中的域名吗</p>
        </a-modal>
        <!-- 修改 -->
        <a-modal
            title="修改域名跳转"
            centered
            v-model="morifyModalVisible"
            @ok="morifySubmit(mtarget)"
            :width='750'
          >
          <a-form :form="form2">
            <a-form-item label="访问域名" name="call_domain" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-textarea
               :rows="4"
                v-decorator="['call_domain', { rules: [{ required: true, message: '请输入访问域名' },{
                pattern: /^[^\s]*$/,
                message: '域名禁止输入空格',
               }] }]"
              />
            </a-form-item>
            <a-form-item label="跳转域名" name="jump_domain" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-textarea
                :rows="4"
                v-decorator="['jump_domain', { rules: [{ required: true, message: '请输入跳转域名' },{
                pattern: /^[^\s]*$/,
                message: '域名禁止输入空格',
               }] }]"
              />
            </a-form-item>
            <a-form-item label="备注" name="remark" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-input
                v-decorator="['remark', { rules: [{ required: true, message: '请输入备注' }] }]"
              />
            </a-form-item>
            <a-form-item label="中转跳转" name="jump_status" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-switch   checkedChildren="启动" unCheckedChildren="关闭" :checked="isOpen" @change="changeJump"/>
            </a-form-item>
          </a-form>
          </a-modal>
    </a-card>
</template>

<script>
import pick from "lodash.pick"
import { getDmainList } from '@/api/domain'
import { mixinDevice } from '@/utils/mixin'
import listPage from '@/utils/page/list'
import resolve from '@/utils/page/resolve'
import verb from '@/utils/page/verb'
import tableShow from '@/utils/page/tableshow'
import statusVerb from '@/utils/page/status'
import submit from '@/utils/page/submit'
import morifySubmit from '@/utils/page/morifySbmit'
export default {
  name: 'Domain',
  mixins: [mixinDevice,listPage,resolve,verb,tableShow,statusVerb,submit,morifySubmit],
  data () {
    return {
      loading: true,
      target: 'domain',
      mtarget: 'domain',
      headers: {
        authorization: 'authorization-text',
      },
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'domain' }),
      form2: this.$form.createForm(this, { name: 'morifyDomain' }),
      searchData: {
        call_domain: '',
        jump_domain: '',
        status: '',
        remark: '',
      },
      isOpen:false,
      //按钮加载状态
      isload_btn:false
    }
  },
  methods: {
    handleChange(value) {
      this.searchData.status = value
    },
    async initData(page=1,psize=10,seaechData={}){
      const res = await getDmainList(page,psize,seaechData)
      res ? this.isload_btn=false : this.isload_btn=true
      this.init(res,page,psize)
    },
    deleSigApp(){
      if(this.selectedRowKeys.length==0){
        this.$notification.warning({message:'请勾选你要删除的域名'})
      }else {
        this.deleteModalVisible = true
      }

    },
    changeJump(checked){
      this.isOpen=checked
    }
  },
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
