import { getToken, } from '@/utils/token'

// 导包
import Vue from 'vue'
import VueRouter from 'vue-router'
// 只要是基于Vue，都需要使用Vue.use，代表Vue中使用路由
Vue.use(VueRouter)

// 导入页面
/* import Login from '@/views/login/Login'
import Layout from "../views/layout/Index.vue"
import NotFound from '@/views/login/Nofount'
import web from "../views/layout/web/web.vue"
import Chart from "../views/layout/chart/Index"
import User from "../views/layout/user/Index"
import Enterprise from "../views/layout/enterprise/Index"
import Question from "../views/layout/question/Index"
import Subject from "../views/layout/subject/Index" */
// 动态导入 实现懒加载
const Login = () => import("@/views/login/Login")
const Layout = () => import("../views/layout/Index.vue")
const NotFound = () => import("@/views/login/Nofount")
const web = () => import("../views/layout/web/web.vue")
const Chart = () => import("../views/layout/chart/Index")
const User = () => import("../views/layout/user/Index")
const Enterprise = () => import("../views/layout/enterprise/Index")
const Question = () => import("../views/layout/question/Index")
const Subject = () => import("../views/layout/subject/Index")

const router = new VueRouter({
  // routes 路由规则配置、这个单词不要写错
  routes: [{
    path: '/login', component: Login
  },
  { path: '/', redirect: '/login' },
  {
    path: '/layout', component: Layout,
    redirect: "/layout/web",
    meta: { title: '后台管理', roles: ['超级管理员', '管理员', '老师', '学生'] },
    children: [
      {
        path: 'web', component: web,
        meta: {
          title: '首页',
          fullpath: '/layout/web',
          icon: 'el-icon-s-home',
          roles: ['超级管理员', '管理员', '老师', '学生']
        }
      },
      {
        path: "chart", component: Chart,
        // 路由元信息配置  路由元的本质是携带一些参数
        meta: {
          title: '数据预览',
          fullpath: '/layout/chart',
          icon: 'el-icon-pie-chart',
          roles: ['超级管理员', '管理员', '老师']
        }
      },
      {
        path: "user", component: User, meta: {
          title: '用户列表',
          fullpath: '/layout/user',
          icon: 'el-icon-user',
          roles: ['超级管理员', '管理员', '老师']
        }
      },
      {
        path: "enterprise", component: Enterprise, meta: {
          title: '企业列表',
          fullpath: '/layout/enterprise',
          icon: 'el-icon-office-building',
          roles: ['超级管理员', '管理员', '老师']
        }
      },
      {
        path: "question", component: Question, meta: {
          title: '题库列表',
          fullpath: '/layout/question',
          icon: 'el-icon-edit-outline',
          roles: ['超级管理员', '管理员', '老师', '学生']
        }
      },
      {
        path: "subject", component: Subject, meta: {
          title: '学科列表',
          fullpath: '/layout/subject',
          icon: 'el-icon-notebook-2',
          roles: ['超级管理员', '管理员', '老师']
        }
      },
   
    ]
  },
  { path: '*', component: NotFound }
  ]
})

// 导航守卫
/**
 * 这个回调函数，在每次路由切换之前（无论是声明式导航，还是编程式导航）都会执行这个方法
 *
 * 参数1：to 表示你要去的路径
 * 参数2：from 你上一次的路径
 * 参数3：next 代表放行以及跳转指定的页面
 */
router.beforeEach((to, from, next) => {
  // console.log('to---', to)
  // console.log('from---', from)
  if (to.path === '/login') {
    // 登录页面直接放行
    next()
  } else {
    const token = getToken()
    if (token) {
      // 登录了
      next()
    } else {
      // 没有登录，跳转到登录页面
      next('/login')
    }
  }
})
// 跳转之后执行的代码
router.afterEach((to) => {
  document.title = to.meta.title||'黑马面面'

})
export default router
