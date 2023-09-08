<template>
  <el-container>
    <el-header style="background-color: #409EFF"><Nav /></el-header>
    <el-container>
      <el-aside width="200px">
        <Menu />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import Nav from '@/components/webNav.vue'
import Menu from '@/components/webMenu.vue'

</script>
<style lang="scss">
@import '@/style/main.scss';
#app {
  background: #eee;
  height: 100vh;
  overflow: hidden;
  min-width: 900px;
  font-weight: 400 !important;
  .el-container {
    height: 100%;
  }
}
</style>
