import request from '@/utils/request'

const api = {
  client: '/cloud-leaf-admin/oauth-clients',
  clientId: '/cloud-leaf-admin/oauth-clients/clientId',
  page: '/cloud-leaf-admin/oauth-clients/page',
}

export function add(data) {
  return request({
    url: api.client,
    method: 'post',
    data: data
  })
}

export function edit(data) {
  return request({
    url: api.client,
    method: 'put',
    data: data
  })
}

export function remove(clientIds) {
  return request({
    url: api.client + '/' + clientIds,
    method: 'delete'
  })
}

export function getClientById(clientId) {
  return request({
    url: api.client + '/' + clientId,
    method: 'get'
  })
}

export function page(param) {
  return request({
    url: api.page,
    method: 'get',
    params: param
  })
}

export function checkClientId(param){
  return request({
    url: api.clientId,
    method: 'get',
    params: param
  })
}


