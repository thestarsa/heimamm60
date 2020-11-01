import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store"
// Vue.config.productionTip = false  //阻止vue启动生产消息，阻止的内容如图所示（红框标记部分）
// 导入axios
import "@/utils/request"    //axion配置文件

import '@/plugins/element.js'
// 引入公共样式
import '@/style/global.less'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
