import request from '@/utils/request'

const api = {
  loginLog: '/cloud-leaf-admin/loginLog',
  loginLogs: '/cloud-leaf-admin/loginLog/page'
}

export function remove (logIds) {
  return request({
    url: api.loginLog + '/' + logIds,
    method: 'delete'
  })
}

export function removeAll () {
  return request({
    url: api.loginLog,
    method: 'delete'
  })
}

export function getLoginLogs (parameter) {
  return request({
    url: api.loginLogs,
    method: 'get',
    params: parameter
  })
}
