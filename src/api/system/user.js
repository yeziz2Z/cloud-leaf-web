import request from '@/utils/request'

const api = {
  user: '/user',
  userList: '/user/list',
  userProfile: '/user/profile',
  updateUserPwd: '/user/updatePwd'

}

export function add(data) {
  return request({
    url: api.user,
    method: 'post',
    data: data
  })
}

export function edit(data) {
  return request({
    url: api.user,
    method: 'put',
    data: data
  })
}

export function remove(userIds) {
  return request({
    url: api.user + '/' + userIds,
    method: 'delete'
  })
}

export function getUserById(userId) {
  return request({
    url: api.user + '/' + userId,
    method: 'get'
  })
}

export function list(param) {
  return request({
    url: api.userList,
    method: 'get',
    parameter: param
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: api.userProfile,
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(data) {
  return request({
    url: api.updateUserPwd,
    method: 'put',
    params: data
  })
}

