<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-layout-sider width="270">
                 <div >
                     <div>
                         <img v-lazy="'/'+data.img" alt="" class="app-header-img" >

                         <p class="app-header-title">{{data.name}}</p>
                         <p>应用key: <span>{{data.app_key}}</span></p>
                     </div>
                     <div>
                         <p class="app-infocard-title">应用信息</p>
                         <ul class="app-infocard">
                             <li :class="{active: $route.name===item.name}" v-for="(item) in appInfo" :key="item.id"  @click="changeInfo(item.name)">
                                 <span> <a-icon :type="item.type" style="margin-right: 8px"/>{{item.text}}</span>

                             </li>

                         </ul>
                     </div>

                     <div>
                         <p class="app-infocard-title">应用集成</p>
                         <ul class="app-infocard">
                             <li :class="{active:$route.name===item.name}" v-for="(item) in appIntegration" :key="item.id" @click="changeIntegration(item.name)">
                                 <span ><a-icon :type="item.type" style="margin-right: 8px"/>{{item.text}}</span>
                             </li>


                         </ul>
                     </div>
                 </div>
            </a-layout-sider>
            <a-layout>

            <router-view></router-view>
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
    import { appInfo } from '@/api/application'
    import application from '@/views/application/application'
    export default {
        name: "applicationInfo",
        mixins:[application],
        data() {
            return {
                appInfo:[
                    {
                        id: 1,
                        text: '基础信息',
                        type:'setting',
                        name: 'appBasics'
                    },
                    {
                        id:2,
                        text: '域名管理',
                        type:'bar-chart',
                        name:'Domainsverb'
                    },
                    {
                        id:3,
                        text: '模版配置',
                        type:'align-right',
                        name:'temConfig'
                    }
                ],
                appIntegration:[
                    {
                        id:1,
                        text: '安卓集成',
                        type:'android',
                        name:'android'
                    },
                    {
                        id:2,
                        text: 'IOS集成',
                        type:'apple',
                        name:'ios'
                    },

                ],
            }
        },
        methods: {
            changeInfo(name){
                this.$router.push({
                    name,
                });
            },
            changeIntegration(name){
                this.$router.push({
                    name,
                });
            },
        },
        watch:{
            $route(to,from){
                this.initData(to.params.id)
            }
        },
        created(){
            this.$bus.$on('updateData', ()=> {
                this.initData(this.$route.params.id)
            })
        }
    }
</script>

<style scoped lang="less">
    #components-layout-demo-basic .ant-layout-footer {
        line-height: 1.5;
    }
    #components-layout-demo-basic .ant-layout-sider {
        text-align: center;
        background: #fff;
        color: #000;
        min-height: 700px;
        margin-right: 30px;
        .app-header-img{
            width: 80px;
            height: 80px;
            display: block;
            margin: 40px auto 0;
        }
        .app-header-title{
            font-weight: bold;
            font-size: 16px;
            margin-top: 10px;
            margin-bottom: 0;
        }
        .app-infocard-title{
            font-size: 16px;
            font-weight: bold;
            text-align: left;
            margin-left: 50px;
            margin-top: 40px;
        }
        .app-infocard{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: wrap;
            padding: 0;
            li{
                width: 100%;
                height: 38px;
                line-height: 38px;
                cursor: pointer;
                &.active{
                    background: #c1e4fd;
                    border-right: 2px solid  #1890ff;;
                    span{
                        color: #1890ff;;
                    }

                }

                a{
                    color: #000;
                    font-size: 16px;
                }
            }
        }
    }
    #components-layout-demo-basic .ant-layout-content {
        background: #fff;
        color: #000;
        min-height: 120px;
        line-height: 120px;
        .appinfo-content{
            margin-top: 50px;
        }
    }
    #components-layout-demo-basic > .ant-layout {
        margin-bottom: 48px;
    }
    #components-layout-demo-basic > .ant-layout:last-child {
        margin: 0;
    }
</style>
