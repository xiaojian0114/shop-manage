<template>
  <div class="products-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>商品管理</span>
          <el-button type="primary" @click="loadProducts">刷新</el-button>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索商品名称"
          style="width: 200px; margin-right: 10px"
          clearable
        />
        <el-input
          v-model.number="searchForm.shopId"
          placeholder="店铺ID"
          style="width: 150px; margin-right: 10px"
          clearable
        />
        <el-select
          v-model="searchForm.isOnSale"
          placeholder="上架状态"
          style="width: 150px; margin-right: 10px"
          clearable
        >
          <el-option label="全部" value="" />
          <el-option label="上架" :value="1" />
          <el-option label="下架" :value="0" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      
      <el-table :data="productList" style="width: 100%; margin-top: 20px" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="shopId" label="店铺ID" width="100" />
        <el-table-column prop="name" label="商品名称" width="200" />
        <el-table-column prop="image" label="图片" width="100">
          <template #default="{ row }">
            <el-avatar :src="row.image" :size="40" shape="square" />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column prop="isOnSale" label="上架状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isOnSale === 1 ? 'success' : 'info'">
              {{ row.isOnSale === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button
              link
              :type="row.isOnSale === 1 ? 'warning' : 'success'"
              @click="handleToggleSale(row)"
            >
              {{ row.isOnSale === 1 ? '下架' : '上架' }}
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
          @size-change="loadProducts"
          @current-change="loadProducts"
        />
      </div>
    </el-card>
    
    <!-- 编辑对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑商品" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="商品图片">
          <el-input v-model="editForm.image" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="editForm.price" :precision="2" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="editForm.stock" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="上架状态">
          <el-radio-group v-model="editForm.isOnSale">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
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
  getProductList,
  updateProduct,
  deleteProduct,
  updateProductSale,
  type Product
} from '@/api/product'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const productList = ref<Product[]>([])
const editDialogVisible = ref(false)
const editForm = reactive({
  id: 0,
  name: '',
  image: '',
  price: 0,
  stock: 0,
  isOnSale: 1
})

const searchForm = reactive({
  keyword: '',
  shopId: undefined as number | undefined,
  isOnSale: undefined as number | undefined
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const loadProducts = async () => {
  loading.value = true
  try {
    const res = await getProductList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword || undefined,
      shopId: searchForm.shopId,
      isOnSale: searchForm.isOnSale
    })
    productList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadProducts()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.shopId = undefined
  searchForm.isOnSale = undefined
  handleSearch()
}

const handleEdit = (row: Product) => {
  editForm.id = row.id
  editForm.name = row.name
  editForm.image = row.image || ''
  editForm.price = row.price
  editForm.stock = row.stock
  editForm.isOnSale = row.isOnSale
  editDialogVisible.value = true
}

const handleSave = async () => {
  try {
    await updateProduct(editForm.id, {
      name: editForm.name,
      image: editForm.image,
      price: editForm.price,
      stock: editForm.stock,
      isOnSale: editForm.isOnSale
    })
    ElMessage.success('更新成功')
    editDialogVisible.value = false
    loadProducts()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const handleToggleSale = async (row: Product) => {
  const newStatus = row.isOnSale === 1 ? 0 : 1
  try {
    await updateProductSale(row.id, newStatus)
    ElMessage.success(newStatus === 1 ? '已上架' : '已下架')
    loadProducts()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      type: 'warning'
    })
    await deleteProduct(row.id)
    ElMessage.success('删除成功')
    loadProducts()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.products-page {
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

