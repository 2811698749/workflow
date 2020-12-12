<template>
  <div>waiting</div>
</template>
<script>
import settings from '@/settings'
export default {
  data() {
    return {
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    init() {
      const data = {
        'code': this.$route.query.code,
        'client_id': settings.clientId,
        'client_secret': settings.clientSecret
      }
      this.$store.dispatch('user/autologin', data)
        .then(() => {
          this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
<style>
</style>
