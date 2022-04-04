import request from '@/utils/request'

const api = {
  tree: '/org/tree',
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}