<template>
  <div class="app-container">
    <div>
      <img :src="api+'/workflow/image?processInstanceId='+processInstanceId">
    </div>
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

      <el-table-column align="center" label="是否通过">
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
    </el-table>
  </div>
</template>

<script>
import { fetchHistory } from '@/api/workflow'

export default {
  name: 'WorkflowHistory',
  props: {
    processInstanceId: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      api: process.env.VUE_APP_BASE_API,
      list: null,
      listLoading: true
    }
  },
  watch: {
    'visible': {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.query()
        }
      }
    }
  },
  methods: {
    query() {
      this.listLoading = true
      fetchHistory(this.processInstanceId).then(response => {
        this.list = response
        this.listLoading = false
      })
    }
  }
}
</script>
