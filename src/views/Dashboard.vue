<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">用户总数</div>
            <div class="stat-value">{{ stats?.users?.total || 0 }}</div>
            <div class="stat-detail">
              <span>普通用户: {{ stats?.users?.user || 0 }}</span>
              <span>商家: {{ stats?.users?.merchant || 0 }}</span>
              <span>管理员: {{ stats?.users?.admin || 0 }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">店铺总数</div>
            <div class="stat-value">{{ stats?.shops?.total || 0 }}</div>
            <div class="stat-detail">
              <span>审核中: {{ stats?.shops?.pending || 0 }}</span>
              <span>已通过: {{ stats?.shops?.approved || 0 }}</span>
              <span>已驳回: {{ stats?.shops?.rejected || 0 }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">商品总数</div>
            <div class="stat-value">{{ stats?.products?.total || 0 }}</div>
            <div class="stat-detail">
              <span>上架: {{ stats?.products?.onSale || 0 }}</span>
              <span>下架: {{ stats?.products?.offSale || 0 }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">订单总数</div>
            <div class="stat-value">{{ stats?.orders?.total || 0 }}</div>
            <div class="stat-detail">
              <span>已完成: {{ stats?.orders?.finished || 0 }}</span>
              <span>待处理: {{ stats?.orders?.pendingPay + stats?.orders?.pendingDeliver || 0 }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>销售统计</span>
          </template>
          <div class="sales-info">
            <div class="sales-item">
              <div class="sales-label">总销售额</div>
              <div class="sales-value">¥{{ formatMoney(stats?.sales?.totalAmount || 0) }}</div>
            </div>
            <div class="sales-item">
              <div class="sales-label">已完成订单数</div>
              <div class="sales-value">{{ stats?.sales?.finishedCount || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>订单状态分布</span>
          </template>
          <div class="order-status">
            <div class="status-item">
              <span>待支付: {{ stats?.orders?.pendingPay || 0 }}</span>
            </div>
            <div class="status-item">
              <span>待发货: {{ stats?.orders?.pendingDeliver || 0 }}</span>
            </div>
            <div class="status-item">
              <span>待收货: {{ stats?.orders?.delivering || 0 }}</span>
            </div>
            <div class="status-item">
              <span>已完成: {{ stats?.orders?.finished || 0 }}</span>
            </div>
            <div class="status-item">
              <span>已取消: {{ stats?.orders?.cancelled || 0 }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getStats, type StatsData } from '@/api/stats'
import { ElMessage } from 'element-plus'

const stats = ref<StatsData | null>(null)

const formatMoney = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const loadStats = async () => {
  try {
    const res = await getStats()
    stats.value = res.data
  } catch (error) {
    ElMessage.error('获取统计数据失败')
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
}

.stat-detail {
  font-size: 12px;
  color: #909399;
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.sales-info {
  display: flex;
  justify-content: space-around;
}

.sales-item {
  text-align: center;
}

.sales-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.sales-value {
  font-size: 24px;
  font-weight: bold;
  color: #67C23A;
}

.order-status {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-item {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
}
</style>

