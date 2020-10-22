import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
// 引入公共样式
import '@/style/global.less'
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
