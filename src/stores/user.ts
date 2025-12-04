import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, getUserInfo, type LoginResponse, type UserInfo } from '@/api/auth'
import { ElMessage } from 'element-plus'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  // 登录
  const handleLogin = async (phone: string, password: string) => {
    try {
      const res = await login({ phone, password })
      const data = res.data as LoginResponse
      
      token.value = data.token
      userInfo.value = {
        id: data.userId,
        phone: '',
        nickname: data.nickname,
        avatar: '',
        role: data.role,
        status: 1,
        createTime: ''
      }
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      
      ElMessage.success('登录成功')
      return true
    } catch (error: any) {
      ElMessage.error(error.message || '登录失败')
      return false
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo()
      userInfo.value = res.data
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    } catch (error) {
      console.error('获取用户信息失败', error)
    }
  }

  // 退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
  }

  // 初始化用户信息
  const initUserInfo = () => {
    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo) {
      userInfo.value = JSON.parse(storedUserInfo)
    }
    if (token.value) {
      fetchUserInfo()
    }
  }

  return {
    token,
    userInfo,
    handleLogin,
    fetchUserInfo,
    logout,
    initUserInfo
  }
})

