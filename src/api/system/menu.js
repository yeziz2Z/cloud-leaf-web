import request from '@/utils/request'

const api = {
  menu: '/menu',
  menuTree: '/menu/tree',
  menuPage: '/role/page',
}

export function getMenuTree(){
  return request({
    url: api.menuTree,
    method:'get'
  })
}