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

// 根据项目Id获取报备列表
export function GetReportListByProjectId(data) {
  return request({
    url: '/api/Report/GetReportListByProjectId',
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

// 导出查询的报备数据
export function ExportReportList(data) {
  return request({
    url: '/api/Report/ExportReportList',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

// 导出报备操作记录
export function ExportProjectEditRecordList(data) {
  return request({
    url: '/api/Report/ExportReportEditRecordList',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}
