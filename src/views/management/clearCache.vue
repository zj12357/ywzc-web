<template>

        <a-card>
            <div>
                <div class="clear-res" v-if="!isClear">
                    <my-icon type="icon-qinglihuancun" style="font-size: 72px"/>
                    <span>清除缓存</span>
                </div>
                <div class="clear-res" v-else>
                    <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style="font-size: 72px"/>
                    <span>清除成功</span>
                </div>
            </div>

            <div class="clear-btn">
                <a-button type="primary" @click="submitCahe">清除缓存</a-button>
            </div>

        </a-card>

</template>

<script>
    import {ClearCahe} from '@/api/permissions'
    import { Icon } from 'ant-design-vue';
    const MyIcon = Icon.createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/font_1592444_s5fkd7yamsj.js', // 在 iconfont.cn 上生成
    })
    export default {
        name: "clearCache",
        components: {
            'my-icon': MyIcon,
        },
        data(){
            return{
                isClear:false
            }
        },
        watch:{
            $route(val){
                if(val.path=='/management/clearCache'){
                    this.isClear=false
                }
            }
        },

        methods:{
            async submitCahe(){
              const {code,msg}=await ClearCahe()
                if(code==1001){
                    this.$notification.success({message:msg})
                    this.isClear=true;
                }else {
                    this.$notification.error({message:msg})
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .clear-res{
        margin: 20px auto 0;
        display: flex;
        justify-content: center;
        align-items: center;
        span{
            font-size: 30px;
            font-weight: bold;
        }
    }
    .clear-btn{
        margin: 30px auto 0;
        display: flex;
        justify-content: center;
    }

</style>
