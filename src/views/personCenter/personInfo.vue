<template>
    <div>
        <a-layout>
            <person></person>
            <a-layout>
                <a-card style="min-height: 700px">

                    <a-layout-content>
                        <div style="margin-top: 40px">
                            <a-form :form="form" @submit="handleSubmit">
                                <a-form-item label="用户名" :label-col="{ span: 6 }" :wrapper-col="{ span: 4 }">
                                    <a-input
                                            v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                                            style="width: 300px"
                                    />
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
    import Person from './personCenter'
    export default {
        name: "personPassword",
        data(){
            return{
                formLayout: 'horizontal',
                form: this.$form.createForm(this, { name: 'coordinated' }),
            }
        },
        components:{
            Person
        },
        methods:{
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                    }
                });
            },
        }
    }
</script>

<style scoped lang="less">

</style>
