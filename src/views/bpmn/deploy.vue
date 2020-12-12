<template>
  <div>
    <el-input v-model="processFile" style="width:250px; margin-right:10px" placeholder="不需要加.bpmn后缀名" />
    <el-button type="primary" @click="deploy">部署</el-button>
  </div>
</template>

<script>
// import Api from '../../../api/index';

export default {
  name: 'flow_bpmn_deploy',
  data(){
    return {
      // 部署文件名
      processFile: ''
    }
  },
  methods:{
    deploy(){
      if (!this.processFile) {
        this.$message({
          type :'error',
          message:"文件名为空"
        })
        return
      }
      // Api.bpmnDeploy(this.processFile).then(res => {
      //   this.$message({
      //       message: '部署成功',
      //       type: 'success'
      //   });
      // })
    }
  }
}
</script>
