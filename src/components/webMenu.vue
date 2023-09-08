<template>
  <div class="menu">
    <el-menu
      :default-active="activePath"
      :collapse="isCollapse"
      class="el-menu-vertical-demo"
      active-text-color="#ffd04b"
      background-color="#545c64"
      text-color="#fff"
      router
    >
      <el-menu-item
        v-for="(item, index) in routerItems"
        :key="index"
        :index="item.link"
      >
        <span>{{ item.name }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const routerItems = ref([
  {
    name: '参数',
    link: '/argument',
  },
  {
    name: '信息',
    link: '/info',
  },
  {
    name: '智能',
    link: '/noopsyche',
  },
])

let activePath = ref('')
const route = useRoute()
watch(
  () => route,
  () => {
    activePath.value = '/' + route.name
  },
  { deep: true },
)

let isCollapse = ref(false)
</script>
<style lang="scss" scoped>
.menu {
  height: 100%;
  .el-menu{
    height: 100%;
  }
}
</style>
