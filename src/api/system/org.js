import request from '@/utils/request'

const api = {
  tree: '/cloud-leaf-admin/org/tree',
  org: '/cloud-leaf-admin/org',
  organizationTree: '/cloud-leaf-admin/org/getOrganizationTree',
}

export function getOrgTree(parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

export function add(data) {
  return request({
    url: api.org,
    method: 'post',
    data: data
  })
}

export function edit(data) {
  return request({
    url: api.org,
    method: 'put',
    data: data
  })
}

export function removeById(id) {
  return request({
    url: api.org + '/' + id,
    method: 'delete'
  })
}

export function getOrganizationById(id) {
  return request({
    url: api.org + '/' + id,
    method: 'get'
  })
}

export function getOrganizationTree() {
  return request({
    url: api.organizationTree,
    method: 'get'
  })
}