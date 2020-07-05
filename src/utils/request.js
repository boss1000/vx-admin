import axios from "axios";
// import { Toast } from 'vant';
import store from "@/store";
import { getToken } from "@/utils/auth";
import { MessageBox, Message } from "element-ui";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("xzb_token"));
      config.headers["Authorization"] = "Bearer " + getToken();
    }
    // 去除空字符串
    // get请求
    if (config.params && Object.keys(config.params).length > 0) {
      // 判断是否为数组
      let isArray = (Object.prototype.toString.call(config.data) === '[object Array]')
      if (!isArray) {
        let setParams = {};
        for (let index in config.params) {
          let value = config.params[index];
          if (value !== "" && value !== null && value !== undefined) {
            setParams[index] = value;
          }
        }
        config.params = setParams;
      }
    }
    // post 请求
    if (config.data && Object.keys(config.data).length > 0) {
      // 判断是否为数组
      let isArray = (Object.prototype.toString.call(config.data) === '[object Array]')
      if (!isArray) {
        let setDatas = {};
        for (let index in config.data) {
          let value = config.data[index];
          if (value !== "" && value !== null && value !== undefined) {
            setDatas[index] = value;
          }
        }
        config.data = setDatas;
      }
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (response.status !== 200) {
      return Promise.reject(new Error(response.Result || "Error"));
    } else {
      let hasTotal = response.headers.totalcount;
      let setRes = null;
      if (hasTotal) {
        setRes = Object.assign({}, res, { total: Number(hasTotal) });
      } else {
        setRes = res;
      }
      return setRes;
    }
  },
  error => {
    if (error.response.data instanceof Array) {
      Message({
        message: error.response.data[0],
        type: "error",
        duration: 5 * 1000
      });
    } else {
      if (error.toString().indexOf("404") > 0) {
        Message({
          message: "页面丢失",
          type: "error",
          duration: 5 * 1000
        });
      } else if (error.toString().indexOf("500") > 0) {
        Message({
          message: "出错了",
          type: "error",
          duration: 5 * 1000
        });
      } else if (error.toString().indexOf("401") > 0) {
        Message({
          message: "登录过期，请重新登录",
          type: "error",
          duration: 5 * 1000
        });
        setTimeout(() => {
          store.dispatch("user/logout");
        }, 1000);
      } else {
        Message({
          message: error.response.data,
          type: "error",
          duration: 5 * 1000
        });
      }
    }
    return Promise.reject(error);
  }
);

export default service;
