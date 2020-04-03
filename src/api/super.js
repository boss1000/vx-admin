import request from '@/utils/request'

export function getUsers(data) {
  return request({
    url: '/spxtapi/permissions/getUsers', // 查询用户信息
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/spxtapi/permissions/addUser', // 新增用户信息
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/spxtapi/permissions/updateUser', // 修改用户信息
    method: 'post',
    data
  })
}

export function delUsers(data) {
  return request({
    url: '/spxtapi/permissions/delUsers', // 删除用户信息
    method: 'post',
    data
  })
}
