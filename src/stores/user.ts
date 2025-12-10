import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, getUserInfo, type LoginResponse, type UserInfo } from '@/api/auth'
import { ElMessage } from 'element-plus'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(sessionStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  
  const handleLogin = async (phone: string, password: string) => {
    try {
      const res = await login({ phone, password })
      const data = res.data as LoginResponse
      
    
      if (data.role !== 'admin') {
        ElMessage.error('只有管理员可以登录后台管理系统')
        return false
      }
      
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
      
      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      
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
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    } catch (error) {
      console.error('获取用户信息失败', error)
    }
  }

  // 退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = null
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('userInfo')
    router.push('/login')
  }

  // 初始化用户信息
  const initUserInfo = () => {
    const storedUserInfo = sessionStorage.getItem('userInfo')
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

