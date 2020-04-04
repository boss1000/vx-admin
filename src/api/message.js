import request from '@/utils/request'

export function addMessage(data) {
  return request({
    url: '/spxtapi/message/addMessage', // 新增公告
    method: 'POST',
    data
  })
}

export function delMessage(data) {
  return request({
    url: '/spxtapi/message/delMessage', // 删除公告
    method: 'post',
    data
  })
}

export function getMessage(data) {
  return request({
    url: '/spxtapi/message/getMessage', // 查询公告
    method: 'GET',
    params: data
  })
}

export function setMessage(data) {
  return request({
    url: '/spxtapi/message/setMessage', // 启用公告
    method: 'post',
    data
  })
}

export function getNewMessage() {
  return request({
    url: '/spxtapi/message/getNewMessage', // 用户查询当前公告
    method: 'get'
  })
}
