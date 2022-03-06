import Vue from 'vue'
import App from './App.vue'
import router from './plugins/router'
import api from './plugins/axios'
Vue.prototype.$api = api
Vue.config.productionTip = false
import '../styles/index.css'
import 'element-ui/lib/theme-chalk/index.css'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
