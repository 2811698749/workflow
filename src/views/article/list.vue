<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" label-width="100px">
      <!-- 多字段测试 -->
      <el-form-item label="标题">
        <el-input v-model="listQuery.title" clearable placeholder="标题" />
      </el-form-item>
      <el-form-item label="标题标题">
        <el-input v-model="listQuery.title" clearable placeholder="标题" />
      </el-form-item>
      <el-form-item label="标题标题标题">
        <el-input v-model="listQuery.title" clearable placeholder="标题" />
      </el-form-item>
      <el-form-item label="标题标题标题">
        <el-input v-model="listQuery.title" clearable placeholder="标题" />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="listQuery.title" clearable placeholder="标题" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="success" size="small" icon="el-icon-plus" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" circle size="mini" icon="el-icon-edit" @click="edit(scope.row.id)" />
          <el-button type="danger" circle size="mini" icon="el-icon-delete" @click="remove(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="query" />

    <el-dialog :title="isEdit?'编辑':'新增'" :visible.sync="dialogVisible">
      <article-detail ref="detail" :is-edit="isEdit" :edit-id="editId" :visible="dialogVisible" @success="success" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchArticles, deleteArticle } from '@/api/article'
import Pagination from '@/components/Pagination'
import ArticleDetail from './detail'

export default {
  name: 'ArticleList',
  components: { Pagination, ArticleDetail },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      dialogVisible: false,
      saveLoading: false,
      isEdit: false,
      editId: null,
      listQuery: {
        pageNo: 1,
        pageSize: 20
      }
    }
  },
  created() {
    this.query()
  },
  methods: {
    query() {
      this.listLoading = true
      fetchArticles(this.listQuery).then(response => {
        this.list = response.content
        this.total = response.totalElements
        this.listLoading = false
      })
    },
    add() {
      this.isEdit = false
      this.dialogVisible = true
      this.editId = null
    },
    edit(id) {
      this.isEdit = true
      this.dialogVisible = true
      this.editId = id
    },
    save() {
      this.saveLoading = true
      this.$refs.detail.submitForm()
    },
    remove(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除文章成功',
            type: 'success',
            duration: 2000
          })
          this.query()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    success() {
      this.saveLoading = false
      this.query()
      this.dialogVisible = false
    }
  }
}
</script>
