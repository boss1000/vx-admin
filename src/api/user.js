import request from '@/utils/request'

// 用户登录接口
export function login(data) {
  return request({
    url: '/api/Home/Login',
    method: 'get',
    params: data
  })
}

// 用户注册接口
export function register(data) {
  return request({
    url: '/api/Home/Register',
    method: 'post',
    data
  })
}

// 获取手机验证码
export function getCode(data) {
  return request({
    url: '/api/Home/GetCode',
    method: 'get',
    data
  })
}

export function logout() {
  return request({
    url: '/spxtapi/user/logout',
    method: 'get'
  })
}
