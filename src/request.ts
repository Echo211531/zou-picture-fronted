import axios from 'axios'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/userloginUserStore'

// 区分开发和生产环境
const DEV_BASE_URL = "http://localhost:8123";
const PROD_BASE_URL = "xxx"; //与后端绑定的服务器，通过其反向代理访问到后端，可以做到不暴露端口

// 创建 Axios 实例
const myAxios = axios.create({
  baseURL: PROD_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

// 全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 获取本地存储中的 JWT 令牌
    const loginUserStore = useLoginUserStore();  //从登录态中取
    const token = loginUserStore.getJwtToken();

    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    // 未登录
    if (data.code === 40100) {
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !window.location.pathname.includes('/user/login')
      ) {
        message.warning('请先登录')
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    return response
  },
  async function (error) {
    // 检查响应状态码是否为401
    if (error.response && error.response.status === 401) {
      const loginUserStore = useLoginUserStore();
      const originalRequest = error.config;

      // 检查是否有特定的错误信息表示Token已过期
      if (error.response.data.message === "Token expired") {
        // 清除JWT Token
        loginUserStore.clearJwtToken();

        // 提示用户Token已过期
        message.error('您的会话已过期，请重新登录');

        // 跳转到登录页面
        window.location.href = `/user/login?redirect=${encodeURIComponent(window.location.href)}`;
      } else {
        // 对于其他401错误，直接拒绝Promise
        return Promise.reject(error);
      }
    } else {
      // 不是401错误，继续抛出错误
      return Promise.reject(error);
    }
  }
);

export default myAxios
