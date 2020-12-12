import request from '@/utils/request'

export function fetchArticles(query) {
  return request({
    url: '/demo/article/page',
    method: 'get',
    params: query
  })
}

export function fetchList(query) {
  return request({
    url: '/demo/article/page',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/demo/article/detail',
    method: 'get',
    params: { id }
  })
}

export function saveArticle(data) {
  return request({
    url: '/demo/article/save',
    method: 'post',
    data
  })
}

export function deleteArticle(id) {
  return request({
    url: '/demo/article/delete',
    method: 'delete',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
