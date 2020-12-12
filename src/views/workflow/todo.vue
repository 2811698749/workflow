<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <div class="top-right-btn">
        <el-button type="primary" size="small" @click="query">刷新</el-button>
        <el-button type="success" size="small" :loading="saveLoading" @click="approveBatch(true)">通过</el-button>
        <el-button type="danger" size="small" :loading="saveLoading" @click="approveBatch(false)">退回</el-button>
        <el-button type="warning" size="small" :loading="saveLoading" @click="backBatch">撤回</el-button>
        <el-input-number v-model="inspectNum" :min="0" :max="100" :step="5" size="small" style="margin: 0 10px" />
        <el-button type="primary" size="small" :loading="saveLoading" @click="inspect">抽查</el-button>
      </div>
    </el-row>
    <el-table v-loading="listLoading" :data="list" fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="任务类型">
        <template slot-scope="{row}">
          <span>{{ row.moduleName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="任务时间">
        <template slot-scope="{row}">
          <span>{{ row.taskTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审批人">
        <template slot-scope="{row}">
          <span>{{ row.personName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审批信息">
        <template slot-scope="{row}">
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)">详情</el-button>
          <el-button type="text" size="mini" icon="el-icon-check" @click="check(scope.row)">审批</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="query" />

    <el-dialog title="审批" :visible.sync="approveVisible">
      <approve ref="approve" :task="task" @success="success" @fail="fail" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="approveVisible = false">关 闭</el-button>
        <el-button type="success" :loading="saveLoading" @click="approve(true)">通 过</el-button>
        <!-- 有提交人才能退回 -->
        <el-button v-if="task.userId" type="danger" :loading="saveLoading" @click="approve(false)">退 回</el-button>
      </div>
    </el-dialog>

    <el-dialog title="数据详情" :visible.sync="detailVisible">
      <component :is="detailComponent" :id="detailId" :visible="detailVisible" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTodoList, complete, deleteInstance } from '@/api/workflow'
import Pagination from '@/components/Pagination'
import Approve from './approve'

export default {
  name: 'WorkflowTodo',
  components: { Approve, Pagination },
  data() {
    return {
      list: null,
      task: {},
      total: 0,
      listLoading: true,
      approveVisible: false,
      detailVisible: false,
      detailComponent: null,
      detailId: null,
      saveLoading: false,
      // 选中数组
      selectionRows: [],
      // 抽查百分比
      inspectNum: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.query()
  },
  methods: {
    query() {
      this.listLoading = true
      fetchTodoList(this.listQuery).then(response => {
        this.list = response.content
        this.total = response.totalItems
        this.listLoading = false
      })
    },
    save() {
      this.saveLoading = true
      this.$refs.submit.submitForm()
    },
    check(task) {
      this.task = task
      this.approveVisible = true
    },
    handleSelectionChange(section) {
      this.selectionRows = section
    },
    approve(pass) {
      this.saveLoading = true
      this.$refs.approve.submitForm(pass)
    },
    approveBatch(approve) {
      if (this.selectionRows.length === 0) {
        this.msgWarning('请选择数据记录')
        return
      }
      const taskId = this.selectionRows.map(item => item.taskId).join(',')
      this.saveLoading = true
      complete({ approve, taskId }).then(response => {
        this.msgSuccess('提交成功')
        this.success()
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.saveLoading = false
      })
    },
    backBatch() {
      if (this.selectionRows.length === 0) {
        this.msgWarning('请选择数据记录')
        return
      }
      const taskId = this.selectionRows.map(item => item.taskId).join(',')
      this.saveLoading = true
      deleteInstance(taskId).then(response => {
        this.msgSuccess('撤回成功')
        this.success()
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.saveLoading = false
      })
    },
    inspect() {
      if (this.selectionRows.length === 0) {
        this.msgWarning('请选择数据记录')
        return
      }
      const passIds = []
      const rejectIds = []
      this.selectionRows.forEach(item => {
        const random = Math.random() * 100
        if (random < this.inspectNum) {
          rejectIds.push(item.taskId)
        } else {
          passIds.push(item.taskId)
        }
      })
      if (passIds.length > 0 && rejectIds.length === 0) {
        this.saveLoading = true
        complete({ approve: true, taskId: passIds.join(',') }).then(response => {
          this.msgSuccess('审批通过' + passIds.length + '条')
          this.success()
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.saveLoading = false
        })
      }
      if (rejectIds.length > 0 && passIds.length === 0) {
        this.saveLoading = true
        complete({ approve: false, taskId: rejectIds.join(',') }).then(response => {
          this.msgSuccess('审批退回' + rejectIds.length + '条')
          this.success()
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.saveLoading = false
        })
      }
      if (passIds.length > 0 && rejectIds.length > 0) {
        this.saveLoading = true
        complete({ approve: true, taskId: passIds.join(',') }).then(response => {
          complete({ approve: false, taskId: rejectIds.join(',') }).then(response => {
            this.msgSuccess('审批通过' + passIds.length + '条，审批退回' + rejectIds.length + '条')
            this.success()
          })
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.saveLoading = false
        })
      }
    },
    detail(task) {
      if (task && task.tableName) {
        this.detailComponent = resolve => require.ensure([], () => resolve(require('../' + task.tableName + '/detail.vue')))
        this.detailId = task.recordIds
        this.detailVisible = true
      }
    },
    success() {
      this.saveLoading = false
      this.query()
      this.approveVisible = false
    },
    fail() {
      this.saveLoading = false
    }
  }
}
</script>
