import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/spxtapi/user/signIn',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/spxtapi/user/verify',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/spxtapi/user/logout',
    method: 'get'
  })
}
