<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <div class="top-right-btn">
        <el-button type="primary" size="small" @click="query">刷新</el-button>
      </div>
    </el-row>
    <el-table v-loading="listLoading" :data="list" fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="任务类型">
        <template slot-scope="{row}">
          <span>{{ row.taskName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审批时间">
        <template slot-scope="{row}">
          <span>{{ row.taskTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否通过" width="80">
        <template slot-scope="{row}">
          <span>{{ row.approve ? '是' : (row.approve === false ? '否' : '') }}</span>
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

      <el-table-column align="center" label="是否完成" width="80">
        <template slot-scope="{row}">
          <span>{{ row.finished ? '是' : '否' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-view" @click="detail(scope.row)">详情</el-button>
          <el-button type="text" size="mini" icon="el-icon-info" @click="history(scope.row.processInstanceId)">历史</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="query" />

    <el-dialog title="审批历史" width="80%" :visible.sync="dialogVisible">
      <history :process-instance-id="processInstanceId" :visible="dialogVisible" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
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
import { fetchDoneList } from '@/api/workflow'
import Pagination from '@/components/Pagination'
import History from './history'

export default {
  name: 'WorkflowDone',
  components: { History, Pagination },
  data() {
    return {
      list: null,
      total: 0,
      processInstanceId: null,
      dialogVisible: false,
      listLoading: true,
      detailVisible: false,
      detailComponent: null,
      detailId: null,
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
      fetchDoneList(this.listQuery).then(response => {
        this.list = response.content
        this.total = response.totalItems
        this.listLoading = false
      })
    },
    history(processInstanceId) {
      this.processInstanceId = processInstanceId
      this.dialogVisible = true
    },
    detail(task) {
      if (task && task.tableName) {
        this.detailComponent = resolve => require.ensure([], () => resolve(require('../' + task.tableName + '/detail.vue')))
        this.detailId = task.recordIds
        this.detailVisible = true
      }
    }
  }
}
</script>
