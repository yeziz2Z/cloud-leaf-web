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

// 异常拦截处理器
const errorHandler = (error) => {
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
        store.dispatch('Logout').then(() => {
          window.location.reload()
        })
      }
      // token过期
      if (data.code === 400002) {
        store.dispatch('RefreshToken').then(() => {
          return request(error.config)
        }).catch(error => {
          if (error && error.code === 400002) {
            notification.error({
              message: '登录超时',
              description: error.msg
            })
          }
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          })
        })
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
    config.headers['Access-Token'] = token
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
