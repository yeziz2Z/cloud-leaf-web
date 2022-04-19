import storage from 'store'
import {getInfo, login, logout, refreshToken} from '@/api/login'
import {ACCESS_TOKEN, REFRESH_TOKEN} from '@/store/mutation-types'
import {welcome} from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    permissions: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {name, welcome}) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code == 200) {
            const result = response.data
            storage.set(ACCESS_TOKEN, result.accessToken)
            storage.set(REFRESH_TOKEN, result.refreshToken)
            commit('SET_TOKEN', result.accessToken)
            resolve()
          } else {
            reject(response)
          }

        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({commit}) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data
          console.log("GetInfo response", response);
          // if (result.roles && result.roles.permissions.length > 0) {
          if (result.roles) {
            commit('SET_ROLES', result.roles)
            commit('SET_PERMISSIONS', result.permissions)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', {name: result.name, welcome: welcome()})
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // 登出
    Logout({commit, state}) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          storage.remove(REFRESH_TOKEN)
          resolve()
        }).catch((err) => {
          console.log('logout fail:', err)
          // resolve()
        }).finally(() => {
        })
      })
    },
    // 登出
    RefreshToken({commit}) {
      return new Promise((resolve, reject) => {
        refreshToken({refreshToken: storage.get(REFRESH_TOKEN)}).then(resp => {
          if (resp.code === 200) {
            storage.set(ACCESS_TOKEN, resp.data.accessToken)
            // 更新 refreshToken
            // storage.set(REFRESH_TOKEN, resp.data.refreshToken)
            commit('SET_TOKEN', resp.data.accessToken)
            resolve()
          } else {
            reject(resp)
          }
        }).catch((err) => {
          reject(err)
        })
      })
    },

  }
}

export default user
