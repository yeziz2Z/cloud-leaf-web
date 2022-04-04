import request from '@/utils/request'

const api = {
  user: '/user',
  userList: '/user/list',
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

