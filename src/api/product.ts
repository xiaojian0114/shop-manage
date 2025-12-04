import request from './request'

export interface Product {
  id: number
  shopId: number
  name: string
  image: string
  price: number
  stock: number
  sales: number
  isOnSale: number
  createTime: string
}

export interface ProductListParams {
  page?: number
  pageSize?: number
  keyword?: string
  shopId?: number
  isOnSale?: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface UpdateProductParams {
  name?: string
  image?: string
  price?: number
  stock?: number
  isOnSale?: number
}

// 获取商品列表
export const getProductList = (params: ProductListParams) => {
  return request.get<{ code: number; msg: string; data: PageResult<Product> }>('/admin/products', { params })
}

// 获取商品详情
export const getProductDetail = (id: number) => {
  return request.get<{ code: number; msg: string; data: Product }>(`/admin/product/${id}`)
}

// 更新商品信息
export const updateProduct = (id: number, params: UpdateProductParams) => {
  return request.put(`/admin/product/${id}`, params)
}

// 删除商品
export const deleteProduct = (id: number) => {
  return request.delete(`/admin/product/${id}`)
}

// 上架/下架商品
export const updateProductSale = (id: number, isOnSale: number) => {
  return request.put(`/admin/product/${id}/sale`, null, { params: { isOnSale } })
}

