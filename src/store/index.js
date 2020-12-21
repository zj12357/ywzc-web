import Vue from 'vue'
import Vuex from 'vuex'
// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'
const moduleFiles = require.context('./modules', true, /\.js$/)
const modules = moduleFiles.keys().reduce((res, cur) => {
  const fileName = cur.replace(/^\.\/(.*)\.\w+$/, '$1')
  const moduleContent = moduleFiles(cur)
  res[fileName] = moduleContent.default
  return res
}, {})
Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules
})
