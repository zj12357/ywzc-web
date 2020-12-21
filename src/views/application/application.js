import { appInfo } from '@/api/application'
import moment from 'moment'
export default {
    data(){
        return {
            data:{}
        }
    },
    methods: {
        async initData(id){
            const res = await appInfo(id)
            const { data } = res
            data.created_at = moment.unix(data.created_at).format('YYYY-MM-DD HH:mm:ss')
            this.data = data
        }
    },
    created() {
        this.initData(this.$route.params.id)
    },
}