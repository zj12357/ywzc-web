<template>
    <div>
        <a-layout>
            <person></person>
             <a-layout>
                  <a-card style="min-height: 700px">
                     <a-layout-content>
                    <div style="margin-top: 40px">
                        <a-form :form="form" @submit="handleSubmit">
                            <a-form-item label="原密码" :label-col="{ span: 6 }" :wrapper-col="{ span: 4 }">
                                <a-input-password
                                        v-decorator="['params.oPassword', {
                                        rules: [
                                        { required: true, message: '请输入原密码！' },
                                         { max:16, message: '输入长度不可以超过16位' },
                                            {whitespace:true, message: '不可以输入空格'}
                                        ] }]"
                                        style="width: 300px"
                                        type="password"

                                >
                                </a-input-password>
                            </a-form-item>
                            <a-form-item label="新密码" :label-col="{ span: 6 }" :wrapper-col="{ span: 4 }">
                                <a-input-password
                                        v-decorator="['params.password', {
                                        rules: [
                                        { required: true, message: '请输入新密码!' },
                                         { max:16, message: '输入长度不可以超过16位' },
                                           {whitespace:true, message: '不可以输入空格'}
                                        ] }]"
                                        style="width: 300px"
                                        type="password"
                                >
                                </a-input-password>
                            </a-form-item>
                            <a-form-item label="重复密码" :label-col="{ span: 6 }" :wrapper-col="{ span: 4 }">
                                <a-input-password
                                        v-decorator="['params.rPassword', {
                                        rules: [
                                         { required: true, message: '请输入重复密码!' },
                                         { max:16, message: '输入长度不可以超过16位' },
                                         {whitespace:true, message: '不可以输入空格'}

                                        ] }]"
                                        style="width: 300px"
                                        type="password"
                                >
                                </a-input-password>
                            </a-form-item>


                            <a-form-item :wrapper-col="{ span: 6, offset: 6 }">
                                <a-button type="primary" html-type="submit">
                                    保存
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </div>


                </a-layout-content>
                 </a-card>
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
    import Person from './personCenter';
    import {ChangePassword} from '@/api/user'
    export default {
        name: "personPassword",
        data(){
            return{
                formLayout: 'horizontal',
                form: this.$form.createForm(this, { name: 'coordinated' }),
                params:{
                    password:'',
                    rPassword:'',
                    oPassword:''
                }
            }
        },
        components:{
            Person
        },
        mounted(){

        },
        methods:{
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if(!err){
                        ChangePassword(values.params).then(res=>{
                            const {code,msg} =res;
                            if(code==1001){
                                this.$notification.success({message:msg});
                                this.form.resetFields()
                            }else {
                                this.$notification.error({message:msg})
                            }
                        })
                    }


                });
                this.params={}
            },
        }
    }
</script>

<style scoped lang="less">

</style>
