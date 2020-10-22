import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login.vue'
import Layonut from "../views/layonut/layont.vue"
import NOfount from "../views/login/Nofount.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "./login" //重定向
    ,   
  },
  {
    path: '/login',
    component:Login
  }, {
    path: '/layonut',
    component:Layonut
  },{
    path: " *",
    component:NOfount
  }
]

const router = new VueRouter({
  routes
})

export default router
