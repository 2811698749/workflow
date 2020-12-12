import request from '@/utils/request'

export function fetchAuthors(query) {
  return request({
    url: '/demo/author/list',
    method: 'get'
  })
}
