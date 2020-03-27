import request from '@/utils/request'

export function getList(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/queryServices',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
export function addServices(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/addServices',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
export function updateServices(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/updateServices',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
export function deleteServices(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/delService',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
// 服务管理-查询版本信息
export function querySystemServicesVersion(params) {
  return request({
    url: '/services/querySystemServicesVersion',
    method: 'get',
    params
  })
}

// 服务管理-查询版本信息
export function addVersions(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/addVersions',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
// 查询已申请单位详情
export function queryServiceHaveAppliedFor(params) {
  return request({
    url: '/services/queryServiceHaveAppliedFor',
    method: 'get',
    params
  })
}
// 获取业务域
export function getBusiness() {
  return request({
    url: '/common/getBusiness',
    method: 'get'
  })
}
// 查询安全等级
export function getSafetyGrade() {
  return request({
    url: '/common/getSafetyGrade',
    method: 'get'
  })
}
// 查询服务类型
export function getServicetype(params) {
  return request({
    url: '/common/getServicetype',
    method: 'get'
  })
}
// 查询纳税主体
export function getTaxpayer(params) {
  return request({
    url: '/common/getTaxpayer',
    method: 'get'
  })
}
// 申请管理-查询申请管理
export function queryApply(params) {
  return request({
    url: '/services/queryApply',
    method: 'get',
    params
  })
}
// 申请管理-审批
export function updateApproval(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/updateApproval',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
// 申请管理-查询申请管理书
export function queryServiceVersionTree(params) {
  return request({
    url: '/services/queryServiceVersionTree',
    method: 'get',
    params
  })
}
// 服务申请（客户端）
export function getAllapply(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/getAllapply',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
export function getSwjg(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/common/getSwjg',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
// 服务申请操作（客户端）
export function addUserApply(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/addUserApply',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
// 服务申请操作（客户端）
export function getServiceapplied(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/getServiceapplied',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}

export function querySubscribe(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/querySubscribe',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
// 订阅管理-添加
export function addSubscribe(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/addSubscribe',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
// 订阅管理-修改
export function updateSubscribe(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/services/updateSubscribe',
    method: 'post',
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    data
  })
}
// 服务管理-查询版本信息
export function queryServicesVersion(params) {
  return request({
    url: '/services/queryServicesVersion',
    method: 'get',
    params
  })
}
