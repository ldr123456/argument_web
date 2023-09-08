<template>
  <div>
    <h3>history</h3>
    <el-scrollbar class="show_box history">
      <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
        你好啊{{ item }}
      </p>
    </el-scrollbar>
    <h3>logs</h3>
    <el-scrollbar class="show_box logs">
      <template v-if="props.logs === null">
        <p v-for="item in props.logs" :key="item" class="scrollbar-demo-item">
          {{ item }}
        </p>
      </template>
      <template v-else-if="props.load">
        <p class="scrollbar-demo-item">运行中，时间较长，请耐心等待</p>
      </template>
      <template v-else>
        <p class="scrollbar-demo-item">等待运行。。。</p>
      </template>
    </el-scrollbar>
    <div class="btns">
      <el-button
        type="primary"
        size="large"
        @click="runForm"
      >
        运行
      </el-button>
      <el-button size="large" @click="exportFile" :disabled="props.deriveBtn">
        导出
      </el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import mitt from 'mitt'
const emitter = mitt()
const props = defineProps({
  ruleFormRef: {
    required: true,
  },
  logs: {
    type: Array,
  },
  load: {
    type: Boolean,
    required: true
  },
  deriveBtn: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['submitForm', 'exportFile'])
const runForm = () => {
  emit('submitForm', props.ruleFormRef)
}
const exportFile = () => {
  emit('exportFile', '')
}

</script>
<style lang="scss" scoped>
.show_box {
  width: 100%;
  height: 40%;
  min-height: 200px;
  box-sizing: border-box;
  border: 1px solid #c0c0c0;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 0 10px;
  p {
    border-bottom: 1px solid #eee;
    border-radius: 5px;
    padding: 5px;
  }
}
.btns {
  position: absolute;
  margin: 10px;
  left: -200px;
  bottom: 20px;
  min-width: 140px;
}
</style>
