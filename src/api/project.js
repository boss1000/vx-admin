import request from '@/utils/request'

// 获取项目列表
export function getProjectList(data) {
  return request({
    url: '/api/Project/GetProjectList',
    method: 'get',
    params: data
  })
}

// 新增项目
export function AddProject(data) {
  return request({
    url: '/api​/Project​/AddProject',
    method: 'post',
    data
  })
}

// 修改项目
export function EditProject(data) {
  return request({
    url: '/api​/Project​/EditProject',
    method: 'post',
    data
  })
}

// 删除项目
export function DelProject(data) {
  return request({
    url: '/api​/Project​/DelProject',
    method: 'post',
    data
  })
}

// 修改项目顺序（仅管理员）
export function ChangeSort(data) {
  return request({
    url: '​/api/Project/ChangeSort',
    method: 'get',
    params: data
  })
}

// 关注项目(最多关注五个项目)
export function FollowProject(data) {
  return request({
    url: '/api/Project/FollowProject',
    method: 'get',
    params: data
  })
}

// 地区
export function GetAreaList(data) {
  return request({
    url: '/api/Area/GetAreaList',
    method: 'get',
    params: data
  })
}

// 获取关注项目列表
export function getFollowProjects(data) {
  return request({
    url: '/api/Project/GetFollowProjects',
    method: 'get',
    params: data
  })
}

// 获取项目详情
export function GetDetail(data) {
  return request({
    url: '/api/Project/GetDetail',
    method: 'get',
    params: data
  })
}
