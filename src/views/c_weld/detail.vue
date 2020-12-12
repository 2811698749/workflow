<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="项目编码" prop="projectNumber">
      <el-input v-model="form.projectNumber" disabled />
    </el-form-item>
    <el-form-item label="管线编号" prop="pipelineNumber">
      <el-input v-model="form.pipelineNumber" disabled />
    </el-form-item>
    <el-form-item label="分部工程编号" prop="branchengineeringNumber">
      <el-input v-model="form.branchengineeringNumber" disabled />
    </el-form-item>
    <el-form-item label="标段" prop="section">
      <el-input v-model="form.section" disabled />
    </el-form-item>
    <el-form-item label="焊口编号" prop="weldNumber">
      <el-input v-model="form.weldNumber" disabled />
    </el-form-item>
    <el-form-item label="焊口类型" prop="weldType">
      <el-input v-model="form.weldType" disabled />
    </el-form-item>
  </el-form>
</template>

<script>
import { findById } from '@/api/cWeld'

export default {
  name: 'CwellDetail',
  props: {
    id: {
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
      form: {}
    }
  },
  watch: {
    'visible': {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.findById(this.id)
        }
      }
    }
  },
  methods: {
    findById(id) {
      findById(id).then(response => {
        this.form = response
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
