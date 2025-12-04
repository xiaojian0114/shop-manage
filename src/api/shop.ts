import request from './request'

export interface Shop {
  id: number
  merchantId: number
  name: string
  logo: string
  status: number
  createTime: string
}

export interface ShopListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface UpdateShopParams {
  name?: string
  logo?: string
  status?: number
}

// 获取店铺列表
export const getShopList = (params: ShopListParams) => {
  return request.get<{ code: number; msg: string; data: PageResult<Shop> }>('/admin/shops', { params })
}

// 获取待审核店铺列表
export const getPendingShops = () => {
  return request.get<{ code: number; msg: string; data: Shop[] }>('/admin/shops/pending')
}

// 获取店铺详情
export const getShopDetail = (id: number) => {
  return request.get<{ code: number; msg: string; data: Shop }>(`/admin/shop/${id}`)
}

// 更新店铺信息
export const updateShop = (id: number, params: UpdateShopParams) => {
  return request.put(`/admin/shop/${id}`, params)
}

// 删除店铺
export const deleteShop = (id: number) => {
  return request.delete(`/admin/shop/${id}`)
}

// 审核通过
export const approveShop = (id: number) => {
  return request.put(`/admin/shop/approve/${id}`)
}

// 审核驳回
export const rejectShop = (id: number) => {
  return request.put(`/admin/shop/reject/${id}`)
}

