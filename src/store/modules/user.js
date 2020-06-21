import { login, logout } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router from "@/router";
import md5 from "js-md5";

const state = {
  token: getToken(),
  account: "",
  name: "",
  avatar: "",
  introduction: "",
  roles: "1",
  otherData: {
    company_Id: 0,
    name: "wuyu",
    sid: 0,
    store_name: "123"
  },
  ruleData: ""
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_OTHER: (state, roles) => {
    let { account_type, ...otherData } = roles;
    state.otherData = otherData;
  },
  SET_ACCOUNT: (state, roles) => {
    state.account = roles;
  },
  SET_RULEDATA: (state, roles) => {
    state.ruleData = roles;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ Account: account.trim(), PassWord: md5(password) })
        .then(response => {
          const { access_token, profile } = response.Result;
          commit("SET_TOKEN", access_token);
          commit("SET_ROLES", profile.account_type);
          commit("SET_OTHER", profile);
          setToken(access_token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit("SET_ACCOUNT", "");
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();

      dispatch("tagsView/delAllViews", null, { root: true });
      resolve()
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_ACCOUNT", "");
      commit("SET_TOKEN", "");
      removeToken();
      resolve();
    });
  },

  saveRules({ commit }, data) {
    commit("SET_RULEDATA", data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
