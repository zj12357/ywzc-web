<template>
    <div id="components-layout-demo-basic">

            <a-layout-sider width="260">
                <ul class="person-title">
                    <li :class="{active:$route.path===item.path}" v-for="(item,index) in person" @click="changePersoniofo(item.path)">{{item.text}}</li>
                </ul>
            </a-layout-sider>


    </div>
</template>

<script>
    export default {
        name: "personCenter",
        data(){
            return{
                person:[
                    // {
                    //     id: 1,
                    //     text: '个人信息',
                    //     type:'',
                    //     path: '/personCenter/info'
                    // },
                    {
                        id:1,
                        text: '修改密码',
                        type:'',
                        path:'/personCenter/password'
                    },
                ]
            }
        },
        methods:{
            changePersoniofo(url){
                this.$router.push(url);
            },
        }

    }
</script>

<style scoped lang="less">
    #components-layout-demo-basic {
        text-align: center;
        min-height: 700px;
    }

    #components-layout-demo-basic .ant-layout-sider {
        background: #fff;
        color: #000;
        min-height: 700px;
        .person-title{
            padding: 0;
            margin: 60px 0;
            height: 85%;
            li{
                height: 40px;
                line-height: 40px;
                cursor: pointer;
                &.active{
                    color: #1890ff;;
                    background: #c1e4fd;
                    border-right: 2px solid  #1890ff;;
                }
            }
        }
    }

</style>
