import {
  asyncRoutesUser,
  constantRoutes
} from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({
    commit
  }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      let copyRouter = JSON.parse(JSON.stringify(asyncRoutesUser))
      let setRole = (roles == 0) ? 'maximum' : (roles == 1) ? 'second' : 'three';
      // roles 0 超级管理员权限  1  总负责人 2 审批人员
      // level maximum 超级管理员权限  second  总负责人  three 审批人员
      accessedRoutes = copyRouter[0].children.filter(item => {
        return item.level == setRole
      })
      // 改变默认跳转目录
      copyRouter[0].redirect = `/${accessedRoutes[0].path}`
      // 改变权限
      copyRouter[0].children = accessedRoutes

      commit('SET_ROUTES', copyRouter)
      resolve(copyRouter)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
