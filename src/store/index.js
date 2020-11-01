import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    strict: true,
    state: {
        userInfo: {}
    }, mutations: {
        setUserInfo(state, layload) {
            state.userInfo = layload
        },
       
    },
    getters: {
        getUserInfo(state) {
           return  state.userInfo
        }
    }
})

export default store

/* - state：仓库中要操作的数据，任意类型都可以
- getters：取
- mutations：同步的存
- actions：异步的存，但是它内部不能直接操作state，只能调用同步的mutations
- mudules：对store中的数据进行分类，不同类型的数据放在一起，方便查找和更改 */