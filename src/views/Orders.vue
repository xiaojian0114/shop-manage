<template>
  <div class="orders-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
          <el-button type="primary" @click="loadOrders">刷新</el-button>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchForm.orderNo"
          placeholder="搜索订单号"
          style="width: 200px; margin-right: 10px"
          clearable
        />
        <el-select
          v-model="searchForm.status"
          placeholder="订单状态"
          style="width: 150px; margin-right: 10px"
          clearable
        >
          <el-option label="全部" value="" />
          <el-option label="待支付" :value="1" />
          <el-option label="待发货" :value="2" />
          <el-option label="待收货" :value="3" />
          <el-option label="已完成" :value="4" />
          <el-option label="已取消" :value="5" />
        </el-select>
        <el-input
          v-model.number="searchForm.shopId"
          placeholder="店铺ID"
          style="width: 150px; margin-right: 10px"
          clearable
        />
        <el-input
          v-model.number="searchForm.userId"
          placeholder="用户ID"
          style="width: 150px; margin-right: 10px"
          clearable
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      
      <el-table :data="orderList" style="width: 100%; margin-top: 20px" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="shopId" label="店铺ID" width="100" />
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="{ row }">¥{{ row.totalAmount }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="收货地址" width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">详情</el-button>
            <el-button link type="warning" @click="handleEditStatus(row)">更新状态</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadOrders"
          @current-change="loadOrders"
        />
      </div>
    </el-card>
    
    <!-- 订单详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="订单详情" width="800px">
      <div v-if="orderDetail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ orderDetail.order.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ orderDetail.order.userId }}</el-descriptions-item>
          <el-descriptions-item label="店铺ID">{{ orderDetail.order.shopId }}</el-descriptions-item>
          <el-descriptions-item label="总金额">¥{{ orderDetail.order.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(orderDetail.order.status)">
              {{ getStatusText(orderDetail.order.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ orderDetail.order.address }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">
            {{ orderDetail.order.payTime || '未支付' }}
          </el-descriptions-item>
          <el-descriptions-item label="发货时间">
            {{ orderDetail.order.deliverTime || '未发货' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ orderDetail.order.createTime }}</el-descriptions-item>
        </el-descriptions>
        
        <h4 style="margin-top: 20px; margin-bottom: 10px">订单项</h4>
        <el-table :data="orderDetail.items" border>
          <el-table-column prop="productName" label="商品名称" />
          <el-table-column prop="productImage" label="商品图片" width="100">
            <template #default="{ row }">
              <el-avatar :src="row.productImage" :size="40" shape="square" />
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="100">
            <template #default="{ row }">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column prop="num" label="数量" width="80" />
          <el-table-column label="小计" width="120">
            <template #default="{ row }">¥{{ (row.price * row.num).toFixed(2) }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    
    <!-- 更新状态对话框 -->
    <el-dialog v-model="statusDialogVisible" title="更新订单状态" width="400px">
      <el-form :model="statusForm" label-width="100px">
        <el-form-item label="订单状态">
          <el-select v-model="statusForm.status" style="width: 100%">
            <el-option label="待支付" :value="1" />
            <el-option label="待发货" :value="2" />
            <el-option label="待收货" :value="3" />
            <el-option label="已完成" :value="4" />
            <el-option label="已取消" :value="5" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveStatus">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  getOrderList,
  getOrderDetail,
  updateOrderStatus,
  deleteOrder,
  type Order,
  type OrderDetail
} from '@/api/order'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const orderList = ref<Order[]>([])
const orderDetail = ref<OrderDetail | null>(null)
const detailDialogVisible = ref(false)
const statusDialogVisible = ref(false)
const statusForm = reactive({
  id: 0,
  status: 1
})

const searchForm = reactive({
  orderNo: '',
  status: undefined as number | undefined,
  shopId: undefined as number | undefined,
  userId: undefined as number | undefined
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    1: '待支付',
    2: '待发货',
    3: '待收货',
    4: '已完成',
    5: '已取消'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    1: 'warning',
    2: 'info',
    3: 'primary',
    4: 'success',
    5: 'danger'
  }
  return typeMap[status] || ''
}

const loadOrders = async () => {
  loading.value = true
  try {
    const res = await getOrderList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      orderNo: searchForm.orderNo || undefined,
      status: searchForm.status,
      shopId: searchForm.shopId,
      userId: searchForm.userId
    })
    orderList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadOrders()
}

const handleReset = () => {
  searchForm.orderNo = ''
  searchForm.status = undefined
  searchForm.shopId = undefined
  searchForm.userId = undefined
  handleSearch()
}

const handleView = async (row: Order) => {
  try {
    const res = await getOrderDetail(row.id)
    orderDetail.value = res.data
    detailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取订单详情失败')
  }
}

const handleEditStatus = (row: Order) => {
  statusForm.id = row.id
  statusForm.status = row.status
  statusDialogVisible.value = true
}

const handleSaveStatus = async () => {
  try {
    await updateOrderStatus(statusForm.id, statusForm.status)
    ElMessage.success('状态更新成功')
    statusDialogVisible.value = false
    loadOrders()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const handleDelete = async (row: Order) => {
  try {
    await ElMessageBox.confirm('确定要删除该订单吗？', '提示', {
      type: 'warning'
    })
    await deleteOrder(row.id)
    ElMessage.success('删除成功')
    loadOrders()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.orders-page {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

