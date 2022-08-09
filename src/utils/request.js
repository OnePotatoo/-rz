import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
}) // 创建一个axios的实例

const timeOut = 99999999999999999999
function isCheckTime () {
  // console.log(Date.now())
  return Date.now() - getTimeStamp() < timeOut
}

// 请求拦截器
request.interceptors.request.use(config => {
  const token = store.getters.token
  if (token) {
    if (isCheckTime()) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      Message.error('登录过期,请重新登录')
      store.dispatch('user/logOut')
      router.push('/')
      return Promise.reject(new Error('token超时了'))
    }
  }
  return config
}, error => Promise.reject(error))

// 响应拦截器
request.interceptors.response.use(response => {
  const { data: { data, message, success }} = response
  if (success) {
    return data
  }
  Message.error(message || '系统错误~')
  return Promise.reject(message || '系统错误~')
}, error => {
  if (error.response.status === 401) {
    store.dispatch('user/logOut')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || 'token过期了')
  return Promise.reject(error)
})

export default request

