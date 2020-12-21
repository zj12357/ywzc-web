<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-layout-content>
                <div class="appinfo-content">
                    <a-form :form="form">
                        <a-form-item label="应用名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                            <a-input
                                v-model="data.name"
                                style="width: 320px;"
                            />
                        </a-form-item>
                        <a-form-item label="创建时间" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                            <a-input
                                    disabled
                                    style="width: 320px;"
                                    v-model="data.created_at"
                            />
                        </a-form-item>
                        <a-form-item label="应用key" :wrapper-col="{ span: 12 }" :label-col="{ span: 5 }" >
                            <a-input
                                    disabled
                                    style="width: 320px;"
                                    v-model="data.app_key"
                            />
                        </a-form-item>
                        <a-form-item label="应用图标" :wrapper-col="{ span: 12 }" :label-col="{ span: 5 }" >
                            <a-upload
                            name="file"
                            listType="picture-card"
                            class="avatar-uploader"
                            :showUploadList="false"
                            :action="api"
                            @change="handleChange"
                            :headers="headers"
                            >
                                <img  v-lazy="'/'+data.img" alt="avatar" style="width: 80px;height: 80px"/>


                            </a-upload>
                        </a-form-item>

                        <a-form-item label="备注" :wrapper-col="{ span: 12 }" :label-col="{ span: 5 }" >
                            <a-textarea
                                    style="width: 320px;"
                                    v-model="data.remark"
                            />
                        </a-form-item>
                        <a-form-item label="下载方式" :wrapper-col="{ span: 12 }" :label-col="{ span: 5 }" >
                            <a-radio-group name="radioGroup" v-model="data.download_type">
                                <a-radio :value="1">链接下载</a-radio>
                                <a-radio :value="2">openinstall</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item v-if='data.download_type==2' label="默认app_key" :wrapper-col="{ span: 12 }" :label-col="{ span: 5 }" >
                            <a-input v-model='data.default_openinstall_app_key'/>
                        </a-form-item>
                        <a-form-item v-if='data.download_type==2' label="默认渠道号" :wrapper-col="{ span: 12 }" :label-col="{ span: 5 }" >
                            <a-input v-model='data.default_channel_code'/>
                        </a-form-item>
                        <a-form-item label="统计代码" :wrapper-col="{ span: 12 }" :label-col="{ span: 5 }" >
                            <a-textarea
                            v-model='data.default_statistics_code'
                            style="width: 500px;"/>
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                            <a-button type="primary" @click="modify('appbasics')" >
                                保存数据
                            </a-button>
                        </a-form-item>

                    </a-form>
                </div>
            </a-layout-content>
        </a-layout>

    </div>
</template>

<script>
    import { mixinDevice } from '@/utils/mixin'
    import application from '@/views/application/application'
    import resolve from '@/utils/page/resolve'
    import verb from '@/utils/page/verb'
    import upload from '@/utils/page/upload'
    export default {
        name: "appBasics",
        mixins:[ mixinDevice, application, upload, resolve,verb ],
        data(){
            return{
                formLayout: 'horizontal',
                form: this.$form.createForm(this, { name: 'coordinated' }),
                loading: false,
                api:'/api/upload/image',
                downloadFn: '1',
                headers: {
                    Authorization:'Bearer '+this.$token
                },
            }
        },
        watch: {
            $route(to,from){
                this.initData(to.params.id)
            }
        },
    }
</script>

<style scoped lang="less">
    #components-layout-demo-basic .ant-layout-content {
        background: #fff;
        color: #000;
        line-height: 120px;
        min-height: 700px;
    .appinfo-content{
        margin-top: 50px;
    }
    }
</style>
