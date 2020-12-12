<template>
  <el-tabs v-model="active" tab-position="left" @tab-click="handleClick">
    <el-tab-pane name="todo" label="待办任务">
      <todo ref="todo" />
    </el-tab-pane>
    <el-tab-pane name="done" label="已办任务" lazy>
      <done ref="done" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Todo from './todo'
import Done from './done'

export default {
  name: 'WorkflowIndex',
  components: { Todo, Done },
  data() {
    return {
      active: 'todo'
    }
  },
  methods: {
    handleClick(tab) {
      if (this.$refs[tab.name]) {
        this.$refs[tab.name].query()
      }
    }
  }
}
</script>
