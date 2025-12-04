import request from './request'

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  productImage: string
  price: number
  num: number
}

export interface Order {
  id: number
  orderNo: string
  userId: number
  shopId: number
  totalAmount: number
  status: number
  address: string
  payTime: string | null
  deliverTime: string | null
  createTime: string
  items?: OrderItem[]
}

export interface OrderListParams {
  page?: number
  pageSize?: number
  orderNo?: string
  status?: number
  shopId?: number
  userId?: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface OrderDetail {
  order: Order
  items: OrderItem[]
}

// 获取订单列表
export const getOrderList = (params: OrderListParams) => {
  return request.get<{ code: number; msg: string; data: PageResult<Order> }>('/admin/orders', { params })
}

// 获取订单详情
export const getOrderDetail = (id: number) => {
  return request.get<{ code: number; msg: string; data: OrderDetail }>(`/admin/order/${id}`)
}

// 更新订单状态
export const updateOrderStatus = (id: number, status: number) => {
  return request.put(`/admin/order/${id}/status`, null, { params: { status } })
}

// 删除订单
export const deleteOrder = (id: number) => {
  return request.delete(`/admin/order/${id}`)
}

