//折叠面板
import Vue from 'vue'
import {Tree} from 'ant-design-vue';
Vue.use(Tree);
import { ACCESS_TOKEN,LOGIN_TIME } from '@/store/mutation-types';
import {refreshToken} from '@/api/login'

//自定义指令-禁止输入空格
Vue.directive(
    'blankSpace',{
        bind: function (el) {
            const input = el.getElementsByTagName('input')[0];
            input.onkeyup = function (e) {
                if (input.value.length === 1) {
                    input.value = input.value.replace(/\s+/g, '')
                } else {
                    input.value = input.value.replace(/\s+/g, '')
                }

            }
            input.onblur = function (e) {
                if (input.value.length === 1) {
                    input.value = input.value.replace(/\s+/g, '')
                } else {
                    input.value = input.value.replace(/\s+/g, '')
                }
            }
        }

}
)

//图片预加载
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('@/assets/img/other_created.png'),   //请求失败后显示的图片
    loading: require('@/assets/img/other_created.png'),   //加载的loading过渡图片
    attempt: 1     // 加载图片数量
})

//定时刷新token


global.timer= setInterval(()=>{
    const nowtime=new Date().getTime();
    const logintime= Vue.ls.get(LOGIN_TIME)
    if((nowtime-logintime)/3600000>1 && Vue.ls.get(ACCESS_TOKEN)){
        Vue.ls.set(LOGIN_TIME,new Date().getTime())
        refreshToken().then(res=>{
            const {code,data}=res;
             code==1001 && Vue.ls.set(ACCESS_TOKEN, data.token, 7 * 24 * 60 * 60 * 1000)

        }).catch(err=>{console.log(err)})
    }

},1000)

// !Vue.ls.get(ACCESS_TOKEN) && clearInterval(timer)

//token
Vue.prototype.$token= Vue.ls.get(ACCESS_TOKEN);
//多文件上传
const VueUploadComponent = require('vue-upload-component')
Vue.component('file-upload', VueUploadComponent)


