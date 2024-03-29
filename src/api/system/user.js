import request from '@/utils/request'

const api = {
  user: '/cloud-leaf-admin/user',
  userList: '/cloud-leaf-admin/user/page',
  userProfile: '/cloud-leaf-admin/user/profile',
  updateAvatar: '/cloud-leaf-admin/user/avatar',
  resetPassword: '/cloud-leaf-admin/user/resetPassword'

}

export function add (data) {
  return request({
    url: api.user,
    method: 'post',
    data: data
  })
}

export function edit (data) {
  return request({
    url: api.user,
    method: 'put',
    data: data
  })
}

export function remove (userIds) {
  return request({
    url: api.user + '/' + userIds,
    method: 'delete'
  })
}

export function getUserById (userId) {
  return request({
    url: api.user + '/' + userId,
    method: 'get'
  })
}

export function list (param) {
  return request({
    url: api.userList,
    method: 'get',
    params: param
  })
}

// 修改用户个人信息
export function updateUserProfile (data) {
  return request({
    url: api.userProfile,
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function resetPassword (data) {
  return request({
    url: api.resetPassword,
    method: 'put',
    data: data
  })
}

export function updateAvatar (data) {
  return request({
    url: api.updateAvatar,
    method: 'post',
    data: data
  })
}
