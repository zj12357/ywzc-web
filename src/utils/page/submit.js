export default {
      data(){
        return {
          addData: {}
        }
    },
    methods: {
        addSubmit(target) {
            this.form.validateFields((err, values) => {
                if (!err) {
                  switch(target){
                      case 'domainverb': {
                        this.addData = values
                        this.addData.id = this.$route.params.id
                        break;
                      }
                      case 'app': {
                        this.addData['name'] = values['name']
                        break;
                      }
                      case 'sigapp_and': {
                          if(!this.isuping){
                              this.addData['name'] = values['name']
                              if(this.relpaceData.id!==undefined){this.addData.id = this.relpaceData.id}
                              break;
                          }
                      }
                      case 'addConsumer': {
                        this.addData = values
                        break;
                      }
                      case 'domain': {
                        this.addData = values
                        break;
                      }
                      case 'tool': {
                        this.addData['name'] = values['name']
                        break;
                      }
                  }
                  this.add(this.target)
                }
            });
        },
    },
}
