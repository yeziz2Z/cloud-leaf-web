import request from '@/utils/request'

const api = {
  operLog: '/operLog',
  operLogs: '/operLog/page',
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
