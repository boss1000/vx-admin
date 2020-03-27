import {
  login,
  logout,
  getUserAuthority
} from '@/api/userApi'
import {
  getToken,
  setToken,
  removeToken,
  removeUsername
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'
import {
  asyncRoutesUser,
  asyncRoutesAdmin
} from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  isFormal: false // 是否为正式
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, avatar) => {
    state.roles = avatar
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      if (state.isFormal) {
        login({
          username: username.trim(),
          password: password
        }).then(response => {
          const {
            data
          } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      } else {
        commit('SET_TOKEN', "1234567")
        setToken("1234567")
        resolve()
      }
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      if (state.isFormal) {
        getUserAuthority().then(response => {
          const {
            data
          } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          const roles = data
          var Troles = []
          if (roles == 1) {
            Troles = asyncRoutesAdmin
          } else {
            Troles = asyncRoutesUser
          }
          commit('SET_ROLES', Troles)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      } else {
        commit('SET_ROLES', "0")
        resolve("0")
      }
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        removeUsername()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      removeUsername()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
