<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="审批状态" prop="approveStatus">
        <el-select v-model="queryParams.approveStatus" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <div class="top-right-btn">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
        <el-button
          type="success"
          icon="el-icon-upload2"
          size="mini"
          @click="handleStart"
        >上报</el-button>
      </div>
    </el-row>

    <el-table
      ref="table"
      v-loading="loading"
      :data="typeList"
      :select-on-indeterminate="false"
      @select-all="handleSelectionAll"
      @select="handleSelection">
      <el-table-column type="selection" width="55" />
      <el-table-column label="项目编码" align="center" prop="projectNumber" />
      <el-table-column label="管线编号" align="center" prop="pipelineNumber" />
      <el-table-column label="分部工程编号" align="center" prop="branchengineeringNumber" />
      <el-table-column label="标段" align="center" prop="section" />
      <el-table-column label="焊口编号" align="center" prop="weldNumber" />
      <el-table-column label="焊口类型" align="center" prop="weldType" />
      <el-table-column label="审批状态" align="center">
        <template slot-scope="scope">
          {{ getAppoveName(scope.row.approveStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
            v-if="editable(scope.row.approveStatus)"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-if="deletable(scope.row.approveStatus)"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目编码" prop="projectNumber">
          <el-input v-model="form.projectNumber" placeholder="请输入项目编码" />
        </el-form-item>
        <el-form-item label="管线编号" prop="pipelineNumber">
          <el-input v-model="form.pipelineNumber" placeholder="请输入管线编号" />
        </el-form-item>
        <el-form-item label="分部工程编号" prop="branchengineeringNumber">
          <el-input v-model="form.branchengineeringNumber" placeholder="请输入分部工程编号" />
        </el-form-item>
        <el-form-item label="标段" prop="section">
          <el-input v-model="form.section" placeholder="请输入标段" />
        </el-form-item>
        <el-form-item label="焊口编号" prop="weldNumber">
          <el-input v-model="form.weldNumber" placeholder="请输入焊口编号" />
        </el-form-item>
        <el-form-item label="焊口类型" prop="weldType">
          <el-input v-model="form.weldType" placeholder="请输入焊口类型" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看对话框 -->
    <el-dialog title="焊口详情" :visible.sync="detailOpen" width="500px" append-to-body>
      <cwell-detail :id="detailId" :visible="detailOpen" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPage, findById, insert, update, del } from '@/api/cWeld'
import { getAppoveName, statusList, editable, deletable, checkable } from '@/utils/approve'
import { startDataProcess } from '@/api/workflow'
import CwellDetail from './detail'

export default {
  name: 'CWeld',
  components: { CwellDetail },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      selectionRows: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      detailOpen: false,
      detailId: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      statusList: statusList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getAppoveName(code) {
      return getAppoveName(code)
    },
    editable(code) {
      return editable(code)
    },
    deletable(code) {
      return deletable(code)
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    getList() {
      this.loading = true
      this.queryParams.pageNo = this.queryParams.pageNum
      listPage(this.queryParams).then(res => {
        this.typeList = res.content
        this.total = res.totalElements
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {}
      // this.resetForm("form")
    },
    resetForm(refName) {
      this.$refs[refName].resetFields()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加焊口'
    },
    /** 上报按钮操作 */
    handleStart() {
      if (this.selectionRows.length === 0) return
      const projectCode = this.selectionRows[0].section
      const ids = this.selectionRows.map(item => item.id)
      this.loading = true
      startDataProcess('c_weld', '焊口', projectCode, ids).then(response => {
        this.msgSuccess('上报成功')
        this.getList()
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },
    // 多选框全选
    handleSelectionAll(selection) {
      const toggleRows = selection.filter(item => !checkable(item.approveStatus))
      toggleRows.forEach(item => this.$refs.table.toggleRowSelection(item, false))
      this.selectionRows = selection.filter(item => checkable(item.approveStatus))
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 多选框选中
    handleSelection(selection, row) {
      if (!checkable(row.approveStatus)) {
        this.msgWarning('禁止选中')
        this.$refs.table.toggleRowSelection(row, false)
      }
      this.selectionRows = selection.filter(item => checkable(item.approveStatus))
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleDetail(row) {
      this.detailId = row.id
      this.detailOpen = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      findById(row.id).then(res => {
        this.form = res
        this.open = true
        this.title = '修改焊口'
      })
      // this.form = _.cloneDeep(row)
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            update(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            insert(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return del(row.id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    }
  }
}
</script>
<style scoped>
</style>
