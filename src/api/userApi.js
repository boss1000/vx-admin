import request from '@/utils/request'

// 修改密码
export function updatgeUserPassWord(data) {
  return request({
    url: '/user/updatgeUserPassWord',
    method: 'post',
    data
  })
}
export function getUserAuthority(data) {
  return request({
    url: '/user/getUserAuthority',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function queryUsers(params) {
  // 查询单位管理
  return request({
    url: '/user/queryUsers',
    method: 'get',
    params
  })
}

export function addUser(data) {
  // 添加单位
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/user/addUser',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
export function updatgeUser(data) {
  // 修改单位
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/user/updatgeUser',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}

export function userLogoff(data) {
  // 删除单位
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/user/userLogoff',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
export function queryServiceRequestedByUser(params) {
  // 查询单位已申请服务
  return request({
    url: '/user/queryServiceRequestedByUser',
    method: 'get',
    params
  })
}
// 订阅管理-查询全部单位管理
export function queryAllUsers(params) {
  // 查询单位已申请服务
  return request({
    url: '/user/queryAllUsers',
    method: 'get',
    params
  })
}
