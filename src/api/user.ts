import request from './request'

export interface User {
  id: number
  phone: string
  nickname: string
  avatar: string
  role: string
  status: number
  createTime: string
}

export interface UserListParams {
  page?: number
  pageSize?: number
  keyword?: string
  role?: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface UpdateUserParams {
  nickname?: string
  avatar?: string
  role?: string
  status?: number
}

// 获取用户列表
export const getUserList = (params: UserListParams) => {
  return request.get<{ code: number; msg: string; data: PageResult<User> }>('/admin/users', { params })
}

// 获取用户详情
export const getUserDetail = (id: number) => {
  return request.get<{ code: number; msg: string; data: User }>(`/admin/user/${id}`)
}

// 更新用户信息
export const updateUser = (id: number, params: UpdateUserParams) => {
  return request.put(`/admin/user/${id}`, params)
}

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete(`/admin/user/${id}`)
}

// 启用/禁用用户
export const updateUserStatus = (id: number, status: number) => {
  return request.put(`/admin/user/${id}/status`, null, { params: { status } })
}

