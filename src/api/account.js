import request from '@/utils/request'

// 获取账号列表
export function GetAccountList(data) {
  return request({
    url: '/api/Account/GetAccountList',
    method: 'get',
    params: data
  })
}

// 新增账号
export function AddAccount(data) {
  return request({
    url: '/api/Account/AddAccount',
    method: 'post',
    data
  })
}

// 修改账号（需判断该用户是否挂在本账号下）
export function ModifyAccount(data) {
  return request({
    url: '/api/Account/ModifyAccount',
    method: 'post',
    data
  })
}

// 重置密码（需判断该用户是否挂在本账号下）
export function ResetPassword(data) {
  return request({
    url: '/api/Account/ResetPassword',
    method: 'get',
    params: data
  })
}

// 修改账号状态
export function ChangeAccountStatus(data) {
  return request({
    url: '​​/api​/Account​/ChangeAccountStatus',
    method: 'get',
    params: data
  })
}

// 删除账号
export function DeleteAccount(data) {
  return request({
    url: '​​/api/Account/DeleteAccount',
    method: 'get',
    params: data
  })
}

// 修改自己密码
export function ModifyOwnPassword(data) {
  return request({
    url: '/api/Account/ModifyOwnPassword',
    method: 'get',
    params: data
  })
}
