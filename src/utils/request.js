import router from "@/router"
import Vue from 'vue'
import axios from 'axios'
import { getToken, removeToken} from "./token"
// 设置基准路径， VUE_APP_BASEURL：要大写
axios.defaults.baseURL = process.env.VUE_APP_BASEURL
// 设置允许携带cookies
axios.defaults.withCredentials = true

// 添加请求拦截器
axios.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        // 把得到的token 值赋值给叫token的变量
        let token = getToken()
        // 如果有token就在请求头添加token
        if (token) {
            config.headers.token =token
        }
        
        return config
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
axios.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        if (response.data.code == 206) {
            removeToken()
              router.push('/login')
        }
        return response.data
    },
    function (error) {
        // 对响应错误做点什么
        return Promise.reject(error)
    }
)
// 把axios实例，挂载到Vue原型上
Vue.prototype.$http = axios