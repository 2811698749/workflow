<template>
  <div class="top-container">
    <logo style="float: left" />
    <navbar style="float: right" />
  </div>
</template>

<script>
import Logo from './Logo'
import Navbar from './Navbar'

export default {
  components: { Logo, Navbar }
}
</script>

<style lang="scss" scoped>
.top-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2001;
  width: 100%;
  height: 70px;
  line-height: 70px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;
}
</style>
