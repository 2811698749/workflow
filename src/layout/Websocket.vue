<template>
  <div />
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Websocket',
  data() {
    return {
      interval: 60, // 提示间隔分钟
      lastTime: null
    }
  },
  computed: {
    ...mapState({
      dept: state => state.user.dept
    })
  },
  created: function() {
    this.initWebSocket()
  },
  destroyed: function() {
    this.websocketClose()
  },
  methods: {
    initWebSocket: function() {
      console.log('WebSocket开始连接')
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      this.websock = new WebSocket(process.env.VUE_APP_BASE_API.replace('http', 'ws') + '/websocket/' + this.dept.deptId)
      this.websock.onopen = this.websocketOpen
      this.websock.onerror = this.websocketError
      this.websock.onmessage = this.websocketMessage
      this.websock.onclose = this.websocketClose
    },
    websocketOpen: function() {
      console.log('WebSocket连接成功')
    },
    websocketError: function(e) {
      console.log('WebSocket连接发生错误')
    },
    websocketMessage: function(e) {
      const now = new Date()
      // 间隔时间内不再重复提示
      if (this.lastTime != null) {
        const diff = Math.floor((now - this.lastTime) / 1000 / 60)
        if (diff < this.interval) return
      }
      const message = e.data
      const _this = this
      this.$notify.info({
        title: '新的任务',
        message: message,
        duration: 0,
        onClick: function() {
          _this.$router.push({ path: '/' })
          this.close()
        }
      })
      this.lastTime = now
    },
    websocketClose: function(e) {
      console.log('connection closed')
      // 自动重连
      setTimeout(this.initWebSocket, 10 * 1000)
    }
  }
}
</script>
