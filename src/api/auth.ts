import request from './request'

export interface LoginParams {
  phone: string
  password: string
}

export interface LoginResponse {
  token: string
  userId: number
  role: string
  nickname: string
}

export interface UserInfo {
  id: number
  phone: string
  nickname: string
  avatar: string
  role: string
  status: number
  createTime: string
}

// 登录
export const login = (params: LoginParams) => {
  return request.post<{ code: number; msg: string; data: LoginResponse }>('/auth/login', params)
}

// 获取当前用户信息
export const getUserInfo = () => {
  return request.get<{ code: number; msg: string; data: UserInfo }>('/auth/info')
}

