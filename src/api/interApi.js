import request from '@/utils/request'

export function queryServiceVersionTree(data) {
  return request({
    url: '/services/queryServiceVersionTree',
    method: 'get',
    data
  })
}
export function queryExplain(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/queryExplain',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
export function updateExplain(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/updateExplain',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
