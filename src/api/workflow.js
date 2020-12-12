import request from '@/utils/request'

export function fetchTodoList(query) {
  return request({
    url: '/workflow/todo',
    method: 'get',
    params: query
  })
}

export function fetchDoneList(query) {
  return request({
    url: '/workflow/done',
    method: 'get',
    params: query
  })
}

export function complete(data) {
  return request({
    url: '/workflow/complete',
    method: 'post',
    data
  })
}

export function fetchHistory(processInstanceId) {
  return request({
    url: '/workflow/history',
    method: 'get',
    params: { processInstanceId }
  })
}

export function startDataProcess(tableName, moduleName, projectCode, recordIds) {
  const recordIdStr = recordIds.join(',')
  const data = { tableName, moduleName, projectCode, recordIds: recordIdStr }
  return request({
    url: '/workflow/startDataProcess',
    method: 'post',
    data
  })
}

export function deleteInstance(taskId) {
  return request({
    url: '/workflow/deleteInstance',
    method: 'delete',
    params: { taskId }
  })
}

