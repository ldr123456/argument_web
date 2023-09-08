<template>
  <div v-loading="loading">
    <el-card>
      <div class="argu_box">
        <div class="ruleForm">
          <Form :rule-form="ruleForm" :rule-form-ref="ruleFormRef"></Form>
        </div>
        <div class="box_right">
          <Logs
            :rule-form-ref="ruleFormRef"
            :logs="logs"
            :load="load"
            :deriveBtn="deriveBtn"
            @submitForm="submitForm"
            @exportFile="exportFile"
          ></Logs>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import mitt from 'mitt'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { executeNotebook, taskStatus, download } from '@/api/argument'
import Form from './components/formView.vue'
import Logs from './components/logsView.vue'

const loading = ref(true)
const logs = ref([])
let load = ref(false)
const emitter = mitt()
const ruleForm = reactive({
  table: 'fangtai',
  version: '0905_backend_test', //
  file_path: 'data/brand/方太洗碗机.xlsx', //
  brand: '',
  site: '', //
  quantile: 0.95,
  filter_content_status: true,
  filter_content_dim: ['总互动量', '转发数', '评论数'],
  combine_columns: ['标题', '文本'],
  text_len_bound: [0.5, 5.0],
  upperLimit: true,
  exclude_by_words: '美的|海尔',
  brand_name: '洗碗机',
  long_words: '红星美凯龙',
  remove_ad: true,
  remove_post: true,
  n_topics: 10,
  m_texts: 10,
  lda_max_iter: 100, //
  n_features: 1024, //
  n_top_words: 10, //
  remove_tag: true,
  count_vectorizer_df: [2, 0.2],
  addition_stopwords:
    '美的|海尔|西门子|方太|卡萨帝|红星美凯龙|colmo|Colmo|京东|维修|打折|促销',
  sort: ['语义'], //
  china_locations: [
    '广东',
    '上海',
    '湖北',
    '山东',
    '安徽',
    '河南',
    '北京',
    '江苏',
    '天津',
    '广西',
    '辽宁',
    '福建',
    '湖南',
    '云南',
    '四川',
    '浙江',
    '重庆',
    '吉林',
    '海南',
    '江西',
    '山西',
    '河北',
    '陕西',
    '贵州',
    '黑龙江',
    '内蒙古',
    '新疆',
    ' 甘肃',
    '中国',
    '青海',
    '宁夏',
    '西藏',
    '中国香港',
    '中国澳门',
    '中国台湾',
    'null',
  ], //
  drop_sim: true, //
  drop_sim_limit: 0.95, //
})
let deriveBtn = ref(true)
const ruleFormRef = ref()

const submitForm = (ruleFormRef) => {
  ElMessageBox.confirm('确定运行吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      // emitter.off('loading', true)
      loading.value = true
      console.log(loading.value)
      // loading.value = true
      if (ruleForm.upperLimit) ruleForm.text_len_bound[1] = 2000
      await executeNotebook(ruleForm)
        .then(async (res) => {
          load.value = true
          const { data } = await taskStatus(res.data.task_id)
          if (data.state === 'PENDING') {
            console.log('等待中')
          } else {
            loading.value = false
            deriveBtn.value = false
            logs.value = data.result.log
          }
        })
        .catch((error) => {
          console.error('error:', error)
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消运行',
      })
    })
}
const exportFile = async () => {
  await download({ table: ruleForm.table, version: ruleForm.version })
    .then((res) => {
      //表示一个指定的file对象或Blob对象
      let url = window.URL.createObjectURL(res.data)
      let a = document.createElement('a')
      document.body.appendChild(a)
      //filename名称从后端返回的headers截取
      let fileName = res.headers['content-disposition']
        .split(';')[1]
        .split('=')[1]
      a.href = url
      a.download = fileName //命名下载名称
      a.click() //点击触发下载
      window.URL.revokeObjectURL(url) //下载完成进行释放
    })
    .catch((error) => {
      console.log(error)
    })
}
emitter.on('loading', (val) => {
  loading.value = val
})
// 加载动画
onMounted(() => {
  loading.value = false
})
</script>
<style lang="scss" scoped>
.el-card {
  max-height: 90vh;
  border: 0px;
  overflow-y: auto;
  .argu_box {
    display: flex;
    justify-content: space-around;
    .ruleForm {
      width: 70%;
    }
    .box_right {
      position: relative;
      width: 20%;
    }
  }
}
</style>
