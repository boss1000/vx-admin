import request from '@/utils/request'

export function getStudent(data) {
  return request({
    url: '/spxtapi/student/getStudent', // 查询信息
    method: 'GET',
    params: data
  })
}

export function examineAndApproveStudent(data) {
  return request({
    url: '/spxtapi/student/examineAndApproveStudent', // 审批信息
    method: 'post',
    data
  })
}

export function distributionStudent(data) {
  return request({
    url: '/spxtapi/student/distributionStudent', // 分配学生给负责的老师
    method: 'post',
    data
  })
}

export function getUsersByUserDept() {
  return request({
    url: '/spxtapi/permissions/getUsersByUserDept', // 获取该总负责人所属部门所有审批人员
    method: 'get'
  })
}

export function uploadStudent(data) {
  return request({
    headers: {
      'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime()
    },
    url: '/spxtapi/student/uploadStudent', // 上传表单
    method: 'post',
    data
  })
}

export function getSumStudent() {
  return request({
    url: '/spxtapi/student/getSumStudent', // 获取状态展示
    method: 'get'
  })
}
