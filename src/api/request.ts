import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: "http://121.4.51.19:8080",
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    const token = sessionStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 如果返回的状态码不是200，说明有错误
    if (res.code !== 200) {
      ElMessage.error(res.msg || "请求失败");

      // 401: Token过期或未登录
      if (res.code === 401 || res.code === 403) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userInfo");
        router.push("/login");
      }

      return Promise.reject(new Error(res.msg || "请求失败"));
    }

    return res;
  },
  (error) => {
    ElMessage.error(error.message || "请求失败");
    return Promise.reject(error);
  }
);

export default service;
