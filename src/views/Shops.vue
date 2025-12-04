<template>
  <div class="shops-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>店铺管理</span>
          <el-button type="primary" @click="loadShops">刷新</el-button>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索店铺名称"
          style="width: 200px; margin-right: 10px"
          clearable
        />
        <el-select
          v-model="searchForm.status"
          placeholder="状态筛选"
          style="width: 150px; margin-right: 10px"
          clearable
        >
          <el-option label="全部" value="" />
          <el-option label="审核中" :value="0" />
          <el-option label="已通过" :value="1" />
          <el-option label="已驳回" :value="2" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      
      <el-table :data="shopList" style="width: 100%; margin-top: 20px" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="merchantId" label="商家ID" width="100" />
        <el-table-column prop="name" label="店铺名称" width="200" />
        <el-table-column prop="logo" label="Logo" width="100">
          <template #default="{ row }">
            <el-avatar :src="row.logo" :size="40" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button
              v-if="row.status === 0"
              link
              type="success"
              @click="handleApprove(row)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.status === 0"
              link
              type="warning"
              @click="handleReject(row)"
            >
              驳回
            </el-button>
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
          @size-change="loadShops"
          @current-change="loadShops"
        />
      </div>
    </el-card>
    
    <!-- 编辑对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑店铺" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="店铺名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="Logo">
          <el-input v-model="editForm.logo" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status" style="width: 100%">
            <el-option label="审核中" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="已驳回" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  getShopList,
  updateShop,
  deleteShop,
  approveShop,
  rejectShop,
  type Shop
} from '@/api/shop'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const shopList = ref<Shop[]>([])
const editDialogVisible = ref(false)
const editForm = reactive({
  id: 0,
  name: '',
  logo: '',
  status: 0
})

const searchForm = reactive({
  keyword: '',
  status: undefined as number | undefined
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '审核中',
    1: '已通过',
    2: '已驳回'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'warning',
    1: 'success',
    2: 'danger'
  }
  return typeMap[status] || ''
}

const loadShops = async () => {
  loading.value = true
  try {
    const res = await getShopList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword || undefined,
      status: searchForm.status
    })
    shopList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取店铺列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadShops()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = undefined
  handleSearch()
}

const handleEdit = (row: Shop) => {
  editForm.id = row.id
  editForm.name = row.name
  editForm.logo = row.logo || ''
  editForm.status = row.status
  editDialogVisible.value = true
}

const handleSave = async () => {
  try {
    await updateShop(editForm.id, {
      name: editForm.name,
      logo: editForm.logo,
      status: editForm.status
    })
    ElMessage.success('更新成功')
    editDialogVisible.value = false
    loadShops()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const handleApprove = async (row: Shop) => {
  try {
    await ElMessageBox.confirm('确定要通过该店铺的审核吗？', '提示', {
      type: 'warning'
    })
    await approveShop(row.id)
    ElMessage.success('审核通过')
    loadShops()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleReject = async (row: Shop) => {
  try {
    await ElMessageBox.confirm('确定要驳回该店铺的审核吗？', '提示', {
      type: 'warning'
    })
    await rejectShop(row.id)
    ElMessage.success('已驳回')
    loadShops()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleDelete = async (row: Shop) => {
  try {
    await ElMessageBox.confirm('确定要删除该店铺吗？', '提示', {
      type: 'warning'
    })
    await deleteShop(row.id)
    ElMessage.success('删除成功')
    loadShops()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadShops()
})
</script>

<style scoped>
.shops-page {
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
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

