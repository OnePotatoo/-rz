import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { resetRouter } from '@/router/index'

// 状态
const state = {
  token: getToken(), // utils/auth下的方法
  userInfo: {}
}
// 修改状态
const mutations = {
  setuserInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  setToken (state, token) {
    state.token = token
    setToken(token) // utils/auth下的方法
  },
  removeToken (state) {
    state.token = null
    removeToken() // utils/auth下的方法
  },
  removeUserInfo (state) {
    state.userInfo = {}
  }
}
// 执行异步

const actions = {
  // 登录
  async login (context, data) {
    const res = await login(data)
    // console.log(res)
    setTimeStamp()
    context.commit('setToken', res)
  },
  async getUserInfo (context) {
    const res = await getUserInfo()
    // console.log(res)
    const baseInfo = await getUserDetailById(res.userId)
    // console.log(baseInfo)

    context.commit('setuserInfo', { ...res, ...baseInfo })
    return {
      ...res,
      ...baseInfo
    }
  },
   // 退出
  logOut (context) {
    context.commit('removeUserInfo')
    context.commit('removeToken')
    // 退出重置路由
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

