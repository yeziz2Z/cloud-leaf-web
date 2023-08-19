import request from '@/utils/request'

const api = {
  type: '/cloud-leaf-admin/dict/type',
  data: '/cloud-leaf-admin/dict/data',
  typePage: '/cloud-leaf-admin/dict/type/page',
  dataList: '/cloud-leaf-admin/dict/data/type',
  options: '/cloud-leaf-admin/dict/data/options'
}

export function page (parameter) {
  return request({
    url: api.typePage,
    method: 'get',
    params: parameter
  })
}

export function addDictType (data) {
  return request({
    url: api.type,
    method: 'post',
    data: data
  })
}

export function editDictType (data) {
  return request({
    url: api.type,
    method: 'put',
    data: data
  })
}

export function removeDictType (ids) {
  return request({
    url: api.type + '/' + ids,
    method: 'delete'
  })
}

export function getDictTypeById (id) {
  return request({
    url: api.type + '/' + id,
    method: 'get'
  })
}

export function getDictDataById (id) {
  return request({
    url: api.data + '/' + id,
    method: 'get'
  })
}

export function addDictData (data) {
  return request({
    url: api.data,
    method: 'post',
    data: data
  })
}

export function editDictData (data) {
  return request({
    url: api.data,
    method: 'put',
    data: data
  })
}

export function removeDictData (ids) {
  return request({
    url: api.data + '/' + ids,
    method: 'delete'
  })
}

export function dictDataList (id) {
  return request({
    url: api.dataList + '/' + id,
    method: 'get'
  })
}

export function dictDataOptions (type) {
  return request({
    url: api.options + '/' + type,
    method: 'get'
  })
}
