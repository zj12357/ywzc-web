<template>
  <div >
    <div class="login-content">
      <div class="login-content-img">
           <h1>落地页支撑系统V2.1</h1>
      </div>
      <div class="login-content-from">
        <a-form
                id="formLogin"
                class="user-layout-login"
                ref="formLogin"
                :form="form"
                @submit="handleSubmit"
        >
          <div class="login-title">
            <h1 style="text-align: center">欢迎登陆</h1>
          </div>

          <a-form-item>
            <a-input
                    size="large"
                    type="text"
                    placeholder="账户"
                    v-decorator="[
                'username',
                {rules: [
                 { required: true, message: '请输入用户名' },
                 { max:16,message: '输入长度不可以超过16位' },
                 {whitespace:true, message: '不可以输入空格'}
                ], validateTrigger: 'blur'}
              ]"

            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
                    size="large"
                    type="password"
                    autocomplete="false"
                    placeholder="密码"
                    v-decorator="[
                'password',
                {rules: [
                 { required: true, message: '请输入密码' ,},
                 { max:16, message: '输入长度不可以超过16位' },
                  {whitespace:true, message: '不可以输入空格'}
                ], validateTrigger: 'blur',
               }
              ]"

            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-input

                    size="large"
                    type="text"
                    autocomplete="false"
                    placeholder="请输入验证码"
                    autoComplete="off"
                    v-decorator="[
                'captcha',
                {rules: [
                { required: true, message: '请输入验证码' },
                 { max:16, message: '输入长度不可以超过16位' },
                  {whitespace:true, message: '不可以输入空格'}
                ], validateTrigger: 'blur'}
              ]"

            >
              <a-icon slot="prefix" type="code" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
            <img :src="imgCode" alt="" @click="changeImgCode">
          </a-form-item>



          <a-form-item style="margin-top:24px">
            <a-button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    class="login-button"
                    :loading="state.loginBtn"
                    :disabled="state.loginBtn"
            >确定</a-button>
          </a-form-item>


        </a-form>
      </div>

    </div>


  </div>
</template>

<script>
import md5 from 'md5'

import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'


export default {
  components: {

  },
  data () {
    return {

      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,

      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      //图片验证码
      imgCode:'/api/Verify/index?id=',
       imgID:''
    }
  },
  created () {
    this.changeImgCode()

  },
  watch:{
    imgID: function (newValue, oldValue) {
      this.imgID=newValue
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout','GetInfo']),
    // 校验事件

    //获取验证码
    changeImgCode() {
      //生成一个随机数（防止缓存）
      const codes = []
      const chars =
              'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const charsArr = chars.split('')
      for (let i = 0; i < 6; i++) {
        const num = Math.floor(Math.random() * charsArr.length)
        codes.push(charsArr[num])
      }
      this.imgID=codes.join('');
      this.imgCode = '/api/Verify/index?id='+ this.imgID;
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login,
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['username', 'password','captcha','captchaId']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const loginParams = { ...values,captchaId:this.imgID }
          delete loginParams.username
          loginParams['username'] = values.username
          // loginParams.password = md5(values.password)

          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },



    loginSuccess (res) {

      this.GetInfo().then(res=>{
        const {code,data}=res;
        if(code==1001){
          this.$notification.success({
            message: '欢迎',
            description: `${data.username}，欢迎回来`
          })
        }
      });
      setTimeout(() => {
        window.location.reload()
      }, 1000)


    },
    requestFailed (err) {
      if(err.code==1003 || err.code==1000){
        this.changeImgCode()
      }
      this.$notification['error']({
        message: '错误',
        description: err.msg || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .login-content{
    width: 1140px;
    height: 620px;
    background: #fff;
    margin:  0 auto;
    display: flex;
    justify-content: space-between;
    border-radius: 8px;
    text-align: center;
    .login-content-img{
      background: url("../../assets/loginBackground.png") no-repeat;
      width: calc(100% - 360px);
      background-size: cover;
      border-radius: 8px 0 0 8px;
      h1{
        color: #fff;
        margin-top: 100px;
      }
    }
    .login-content-from{
      width: 360px;
      padding: 0 50px;
      .login-title{
        margin-top: 75px;
        margin-bottom: 100px;
      }
    }
  }
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
