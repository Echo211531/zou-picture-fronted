import { defineStore } from "pinia";
import { ref } from "vue";
import { getLoginUserUsingGet } from '@/api/userController'


export const useLoginUserStore = defineStore("loginUser", () => {
  const loginUser = ref<API.LoginUserVO>({
    userName: '未登录',
  })

  // 获取当前登录用户信息
  async function fetchLoginUser() {
    const res = await getLoginUserUsingGet()
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data
    }
  }
  // 设置登录用户信息，用于首次登录或刷新时
  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser;
  }
  // 设置 JWT 令牌
  function setJwtToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  // 获取 JWT 令牌
  function getJwtToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // 清除 JWT 令牌
  function clearJwtToken() {
    localStorage.removeItem('jwt_token');
  }

  return { loginUser, setLoginUser, fetchLoginUser,setJwtToken, getJwtToken, clearJwtToken };
});
