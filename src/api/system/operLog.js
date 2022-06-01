import request from '@/utils/request'

const api = {
  operLog: '/cloud-leaf-admin/operLog',
  operLogs: '/cloud-leaf-admin/operLog/page',
}

export function remove(logIds) {
  return request({
    url: api.operLog + '/' + logIds,
    method: 'delete'
  })
}

export function removeAll() {
  return request({
    url: api.operLog,
    method: 'delete'
  })
}

export function getOperLogs(parameter) {
  return request({
    url: api.operLogs,
    method: 'get',
    params: parameter
  })
}
