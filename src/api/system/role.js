import request from '@/utils/request'

const api = {
  role: '/cloud-leaf-admin/role',
  roles: '/cloud-leaf-admin/role/list',
  rolePage: '/cloud-leaf-admin/role/page',
  roleMenus: '/cloud-leaf-admin/role/menus'
}

export function add (data) {
  return request({
    url: api.role,
    method: 'post',
    data: data
  })
}

export function edit (data) {
  return request({
    url: api.role,
    method: 'put',
    data: data
  })
}

export function remove (roleIds) {
  return request({
    url: api.role + '/' + roleIds,
    method: 'delete'
  })
}

export function getRoleById (roleId) {
  return request({
    url: api.role + '/' + roleId,
    method: 'get'
  })
}

export function getRoles () {
  return request({
    url: api.roles,
    method: 'get'
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.rolePage,
    method: 'get',
    params: parameter
  })
}

export function selectMenusByRoleId (roleId) {
  return request({
    url: api.roleMenus + '/' + roleId,
    method: 'get'
  })
}

export function saveRoleMenus (data) {
  return request({
    url: api.roleMenus,
    method: 'post',
    data: data
  })
}
