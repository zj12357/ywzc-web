import pick from "lodash.pick"
export default {
    data(){
        return {
            morifyData: {}
        }
    },
    methods: {
        morifySubmit(target) {
            this.form2.validateFields((err, values) => {
                if (!err) {
                    switch(target){
                        case 'domainverb': {
                            this.morifyData = values
                            this.morifyData.id = this.recordData.id
                        break;
                        }
                        case 'domain': {
                            this.morifyData = values
                            this.morifyData.id = this.recordData.id
                            this.morifyData.jump_status=this.isOpen ? 1 : 0
                        break;
                        }
                    }
                    this.modify(this.mtarget)
                }
            });
        },
        initMorifyModalData(target){
            this.$nextTick(() => {
                switch(target){
                    case 'domainverb': {
                        this.form2.setFieldsValue(pick(this.recordData, ['domain', 'channel_code','statistics_code']));
                    break;
                    }
                    case 'consumer_basic': {
                        this.form2.setFieldsValue(pick(this.recordData, ['username', 'cname','authorize','desc']));
                    break;
                    }
                    case 'domain': {
                        this.form2.setFieldsValue(pick(this.recordData, ['call_domain', 'jump_domain','remark']));
                    break;
                    }
                }
            });
        },
    },
}
