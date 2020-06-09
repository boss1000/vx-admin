import request from '@/utils/request'

// 添加报备
export function AddReport(data) {
  return request({
    url: '/api/Report/AddReport',
    method: 'post',
    data
  })
}

// 获取报备数据（本账号的）
export function GetReportList(data) {
  return request({
    url: '/api/Report/GetReportList',
    method: 'get',
    params: data
  })
}

// 获取报备数据（根据账号id）
export function GetReportListByUserId(data) {
  return request({
    url: '/api/Report/GetReportListByUserId',
    method: 'get',
    params: data
  })
}

// 修改报备状态
export function ChangeStatus(data) {
  return request({
    url: '/api/Report/ChangeStatus',
    method: 'get',
    params: data
  })
}
