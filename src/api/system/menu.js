import request from '@/utils/request'

const api = {
  menu: '/cloud-leaf-admin/menu',
  menuTree: '/cloud-leaf-admin/menu/tree',
  menuPage: '/cloud-leaf-admin/role/page',
}

export function getMenuTree(parameter){
  return request({
    url: api.menuTree,
    method:'get',
    params: parameter
  })
}

export function getMenuById(id){
  return request({
    url: api.menu + '/' +id,
    method:'get'
  })
}

export function remove(id){
  return request({
    url: api.menu + '/' +id,
    method:'delete'
  })
}

export function add(data){
  return request({
    url: api.menu,
    method:'post',
    data:data
  })
}

export function edit(data){
  return request({
    url: api.menu,
    method:'put',
    data:data
  })
}