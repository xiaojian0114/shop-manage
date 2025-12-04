import request from './request'

export interface UserStats {
  total: number
  user: number
  merchant: number
  admin: number
}

export interface ShopStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

export interface ProductStats {
  total: number
  onSale: number
  offSale: number
}

export interface OrderStats {
  total: number
  pendingPay: number
  pendingDeliver: number
  delivering: number
  finished: number
  cancelled: number
}

export interface SalesStats {
  totalAmount: number
  finishedCount: number
}

export interface StatsData {
  users: UserStats
  shops: ShopStats
  products: ProductStats
  orders: OrderStats
  sales: SalesStats
}

// 获取数据统计
export const getStats = () => {
  return request.get<{ code: number; msg: string; data: StatsData }>('/admin/stats')
}

