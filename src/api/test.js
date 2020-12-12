/* eslint-disable */
import request from '@/utils/request'
export function listPage(params) {
    return request({
        url: 'demo/test/page',
        method: 'get',
        params
    })
}
export function listAll() {
  return request({
    url: 'demo/test/list',
    method: 'get'
  })
}
export function findById(id) {
    return request({
        url: 'demo/test/getInfo',
        method: 'get',
        params: {
            id
        }
    })
}
export function insert(data) {
    return request({
        url: 'demo/test',
        method: 'post',
        data
    })
}
export function imp(data) {
  return request({
    url: 'demo/test/import',
    method: 'post',
    data
  })
}
export function update(data) {
    return request({
        url: 'demo/test/',
        method: 'put',
        data
    })
}
export function del(ids) {
    return request({
        url: 'demo/test',
        method: 'delete',
        params: {
            ids
        }
    })
}
