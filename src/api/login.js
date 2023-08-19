import request from '@/utils/request'

const userApi = {
  Login: '/cloud-leaf-oauth2/oauth2/token',
  Captcha: '/cloud-leaf-admin/auth/captcha',
  Logout: '/cloud-leaf-oauth2/oauth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/cloud-leaf-admin/user/info',
  UserMenu: '/cloud-leaf-admin/user/nav',
  RefreshToken: '/auth/refreshToken'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
/* export function login(parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
} */

export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    params: parameter,
    headers: {
      Authorization: 'Basic Y2xvdWQtbGVhZi1hZG1pbjoxMjM0NTY='
    }
  })
}

export function captcha () {
  return request({
    url: userApi.Captcha,
    method: 'get'
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function refreshToken (refreshToken) {
  return request({
    url: userApi.RefreshToken,
    method: 'get',
    params: refreshToken
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
