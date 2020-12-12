import request from '@/utils/request'
export function listPage(params) {
  return request({
    url: 'dcs/cWeld/page',
    method: 'get',
    params
  })
}

export function findById(id) {
  return request({
    url: 'dcs/cWeld/selectOne',
    method: 'get',
    params: {
      id
    }
  })
}

export function insert(data) {
  return request({
    url: 'dcs/cWeld',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: 'dcs/cWeld/',
    method: 'put',
    data
  })
}
export function del(ids) {
  return request({
    url: 'dcs/cWeld',
    method: 'delete',
    params: {
      ids
    }
  })
}
