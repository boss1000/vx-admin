const state = {
  serviceId: ''
}

const mutations = {
  SET_QURERY: (state, query) => {
    state.serviceId = query.serviceId
  }
}

const actions = {
  saveQuery({ commit }, data) {
    commit('SET_QURERY', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
