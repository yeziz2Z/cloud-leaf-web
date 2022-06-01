import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import {VueAxios} from './axios'
import {ACCESS_TOKEN, REFRESH_TOKEN} from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})
let refreshing = false, // 正在刷新标识，避免重复刷新
  waitQueue = []  // 请求等待队列
// 异常拦截处理器
const errorHandler = (error) => {
  let config = error.config
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: '未授权访问',
        description: data.msg
      })
    }
    /*if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          window.location.reload()
        })
      }
    }*/
    if (error.response.status === 401) {
      //非法 token 重新登录
      if (data.code === 400001 && token) {
        store.dispatch('ResetToken').then(() => {
          window.location.reload()
        })
      }
      // token过期
      if (data.code === 400002) {
        if (refreshing) { // 当前正在尝试刷新 access_token
          return new Promise((resolve => {
            waitQueue.push((token) => {
              config.headers['Authorization'] = token
              config.baseURL = process.env.VUE_APP_API_BASE_URL
              resolve(request(config))
            })
          }))
        } else {
          refreshing = true
          store.dispatch('RefreshToken').then((token) => {
            config.headers['Authorization'] = token
            config.baseURL = process.env.VUE_APP_API_BASE_URL // 请求重试时，url已包含baseURL
            waitQueue.forEach(callback => callback(token)) // 已成功刷新token，队列中的所有请求重试
            waitQueue = []
            return request(config)
          }).catch(error => {
            notification.error({
              message: '当前页面已失效，请重新登录',
              description: error.msg
            })
            store.dispatch('ResetToken').then(() => {
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            })
          }).finally(() => {
            refreshing = false
          })
        }

      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
