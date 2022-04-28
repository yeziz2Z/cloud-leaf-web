import request from '@/utils/request'

const api = {
  loginLog: '/loginLog',
  loginLogs: '/loginLog/page',
}

export function remove(logIds) {
  return request({
    url: api.loginLog + '/' + logIds,
    method: 'delete'
  })
}

export function removeAll() {
  return request({
    url: api.loginLog,
    method: 'delete'
  })
}

export function getLoginLogs(parameter) {
  return request({
    url: api.loginLogs,
    method: 'get',
    params: parameter
  })
}
