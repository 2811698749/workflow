<template>
  <div>
    <el-form ref="postForm" :model="postForm" class="form-container">
      <el-form-item label-width="100px" label="任务名称:">
        <el-input v-model="task.taskName" :disabled="true" />
      </el-form-item>
      <el-form-item label-width="100px" label="任务类型:">
        <el-input v-model="task.moduleName" :disabled="true" />
      </el-form-item>
      <el-form-item label-width="100px" label="审批信息:">
        <el-input v-model="postForm.message" autosize />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { complete } from '@/api/workflow'

const defaultForm = {
  taskId: '', // 任务ID
  approve: false, // 是否通过
  message: '' // 提交信息
}

export default {
  name: 'Approve',
  props: {
    task: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm)
    }
  },
  watch: {
    'task': {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.postForm = Object.assign({}, defaultForm)
          this.postForm.taskId = newVal.taskId
        }
      }
    }
  },
  methods: {
    submitForm(pass) {
      this.postForm.approve = pass
      complete(this.postForm).then(response => {
        this.msgSuccess('提交成功')
        this.$emit('success')
      }).catch(err => {
        console.log(err)
        this.$emit('fail')
      })
    }
  }
}
</script>
