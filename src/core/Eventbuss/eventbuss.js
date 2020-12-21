import Vue from 'vue'
var EventBus = new Vue();
export default function(Vue){
    Object.defineProperties(Vue.prototype, {
        $bus: {
            get: function () {
                return EventBus
            }
        }
    })
}