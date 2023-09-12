<template>
  <div v-loading="loading">
    <el-card>
      <div class="argu_box">
        <el-form ref="ruleFormRef" label-position="top" :model="ruleForm" :rules="rules" class="ruleForm" status-icon>
          <div class="title">
            <h2 style="display: inline-block">基本信息</h2>
          </div>
          <div class="grid_box">
            <el-form-item label="名称" prop="table">
              <el-select v-model="ruleForm.table" placeholder="请选择名称" @change="judgmentShow">
                <el-option label="fangtai" value="fangtai"></el-option>
                <el-option v-for="(item, index) in files" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-if="show">
            <div class="title">
              <h2>筛选</h2>
            </div>
            <div class="grid_box">
              <el-form-item label="站点" prop="site">
                <el-select v-model="ruleForm.site" placeholder="请选择站点" disabled>
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item label="文本内容质量">
                <el-checkbox-group v-model="ruleForm.high_dim">
                  <el-checkbox v-for="(item, index) in qualityHigh" :key="index" :label="item" :value="item" />
                </el-checkbox-group>
                <el-slider v-model="ruleForm.quantile_high" :marks="{ 0: '0%', 0.5: '50%', 1: '100%', }"
                  :format-tooltip="(val) => { return Math.round(val * 100) + '%' }" :max="1" :step="0.05" />
                <el-checkbox-group v-model="ruleForm.low_dim">
                  <el-checkbox v-for="(item, index) in qualityLow" :key="index" :label="item" :value="item" />
                </el-checkbox-group>
                <el-slider v-model="ruleForm.quantile_low" :marks="{ 0: '0%', 0.5: '50%', 1: '100%', }"
                  :format-tooltip="(val) => { return Math.round(val * 100) + '%' }" :max="1" :step="0.05" />
              </el-form-item>
              <el-form-item label="数据类型" prop="combine_columns">
                <el-checkbox-group v-model="ruleForm.combine_columns">
                  <el-checkbox v-for="(item, index) in typeData" :key="index" :label="item" :value="item" />
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="地理位置">
                <el-checkbox v-model="geoChina" label="中国"></el-checkbox>
                <el-checkbox v-model="geoForeign" label="海外"></el-checkbox>
              </el-form-item>
              <el-form-item label="内容长度">
                <el-slider v-model="ruleForm.text_len_bound[0]" :max="1" :step="0.01" show-input></el-slider>
                <el-slider v-model="ruleForm.text_len_bound[1]" :min="1" :max="10" :step="0.1" show-input></el-slider>
                <el-checkbox v-model="ruleForm.upperLimit" label="是否开启无上限(选中视为开启)" size="large"></el-checkbox>
              </el-form-item>
              <el-form-item prop="exclude_by_words">
                <template #label>
                  <span>排除词</span>
                  <el-tooltip effect="customized" content="排除词是（用“|”分隔）" placement="top">
                    <el-icon :size="18" color="#409EFC" style="transform: translateY(3px)">
                      <i-ep-question-filled />
                    </el-icon>
                  </el-tooltip>
                  <span>:</span>
                </template>
                <el-input v-model="ruleForm.exclude_by_words" :rows="3" type="textarea" @input="inputChange()" placeholder="排除词请用“|”隔开" />
                <div class="tag-container">
                  <el-tag v-for="(tag, index) in excludeTags" :key="index">{{ tag }}</el-tag>
                </div>
              </el-form-item>
              <el-form-item prop="brand_name">
                <template #label>
                  <span>焦点词</span>
                  <el-tooltip effect="customized" content="焦点词是（用“|”分隔）" placement="top">
                    <el-icon :size="18" color="#409EFC" style="transform: translateY(3px)">
                      <i-ep-question-filled />
                    </el-icon>
                  </el-tooltip>
                  <span>:</span>
                </template>
                <el-input v-model="ruleForm.brand_name" :rows="3" type="textarea" @input="inputChange()" placeholder="焦点词请用“|”隔开" />
                <div class="tag-container">
                  <el-tag v-for="(tag, index) in brandTags" :key="index">{{ tag }}</el-tag>
                </div>
              </el-form-item>
              <el-form-item prop="long_words">
                <template #label>
                  <span>长词</span>
                  <el-tooltip effect="customized" content="不希望被分词的长词列表（用“|”分隔）" placement="top">
                    <el-icon :size="18" color="#409EFC" style="transform: translateY(3px)">
                      <i-ep-question-filled />
                    </el-icon>
                  </el-tooltip>
                  <span>:</span>
                </template>
                <el-input v-model="ruleForm.long_words" :rows="3" type="textarea" @input="inputChange()" placeholder="长词请用“|”隔开" />
                <div class="tag-container">
                  <el-tag v-for="(tag, index) in longTags" :key="index">{{ tag }}</el-tag>
                </div>
              </el-form-item>
              <el-form-item label="是否允许存在">
                <el-checkbox v-model="ruleForm.remove_ad" label="广告" size="large" />
                <el-checkbox v-model="ruleForm.remove_post" label="水印" size="large" />
              </el-form-item>
            </div>
            <div class="title">
              <h2>计算</h2>
            </div>
            <div class="grid_box">
              <el-form-item label="主题数目" prop="n_topics">
                <el-input-number v-model="ruleForm.n_topics" :min="0" controls-position="right" />
              </el-form-item>
              <el-form-item label="抽取典型内容数目" prop="m_texts">
                <el-input-number v-model="ruleForm.m_texts" :min="0" controls-position="right" />
              </el-form-item>
              <el-form-item label="标签头" prop="tag">
                <el-checkbox v-model="ruleForm.remove_tag" label="#"></el-checkbox>
              </el-form-item>
              <el-form-item :label="'忽略文章中出现超过 ' + Math.round(ruleForm.count_vectorizer_df[1] * 100) + '% 的词'">
                <el-slider v-model="ruleForm.count_vectorizer_df[1]" :max="1" :step="0.01" show-input></el-slider>
              </el-form-item>
              <el-form-item label="忽略词" prop="addition_stopwords">
                <template #label>
                  <span>忽略词</span>
                  <el-tooltip effect="customized" content="忽略词（用“|”分隔）" placement="top">
                    <el-icon :size="18" color="#409EFC" style="transform: translateY(3px)">
                      <i-ep-question-filled />
                    </el-icon>
                  </el-tooltip>
                  <span>:</span>
                </template>
                <el-input v-model="ruleForm.addition_stopwords" :rows="3" type="textarea" @input="inputChange()" placeholder="忽略词请用“|”隔开" />
                <div class="tag-container">
                  <el-tag v-for="(tag, index) in additionTags" :key="index">{{ tag }}</el-tag>
                </div>
              </el-form-item>
            </div>
            <div class="title">
              <h2>输出</h2>
            </div>
            <div class="grid_box">
              <el-form-item label="排序" prop="sort">
                <el-checkbox-group v-model="ruleForm.sort">
                  <el-checkbox label="词频" />
                  <el-checkbox label="语义" />
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="box_right">
          <h3>history</h3>
          <el-scrollbar class="show_box history">
            <template v-if="historyMsg[0] !== undefined">
              <p v-for="item in historyMsg" :key="item" class="scrollbar-demo-item">
                {{ item }}
              </p>
            </template>
            <template v-else>
              <p class="scrollbar-demo-item">暂无历史记录</p>
            </template>
          </el-scrollbar>
          <h3>logs</h3>
          <el-scrollbar class="show_box logs">
            <template v-if="logsMsg[0] !== undefined">
              <p v-for="item in logsMsg" :key="item" class="scrollbar-demo-item">
                {{ item }}
              </p>
            </template>
            <template v-else-if="loadShow">
              <p class="scrollbar-demo-item">运行中，时间较长，请耐心等待</p>
            </template>
            <template v-else>
              <p class="scrollbar-demo-item">等待运行。。。</p>
            </template>
          </el-scrollbar>
          <div class="btns">
            <el-button type="primary" size="large" :disabled="runBtn" @click="submitForm(ruleFormRef)">运行</el-button>
            <el-button size="large" @click="exportFile()" :disabled="deriveBtn">导出</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, tagEmits } from 'element-plus'
import {
  listFiles,
  executeNotebook,
  taskStatus,
  download,
} from '@/api/argument'
const files = ref([])
const show = ref(true) // 是否展示表单
const loading = ref(true) // 幕遮层
// 右侧信息展示
const historyMsg = ref([])
const logsMsg = ref([])
let loadShow = ref(false)
// 按钮组
let runBtn = ref(false)
let deriveBtn = ref(true)
// 多选框注释
const qualityHigh = reactive(['总互动量','转发数','评论数','点赞数','阅读数','收藏数',])
const qualityLow = reactive(['粉丝数'])
const typeData = reactive(['文本', '标题', '视频', '图片'])
const geoChina = ref(true)
const geoForeign = ref(false)
let ruleForm = reactive({
  table: 'fangtai',
  version: '0905_test', //
  file_path: 'data/brand/方太洗碗机_4486301.xlsx', //
  brand: '',
  site: '', //
  quantile_high: 0.75,
  quantile_low: 0.25,
  filter_content_status: true,
  high_dim: ['总互动量', '转发数', '评论数'],
  low_dim: [],
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
// 表单校验规则
const rules = reactive({
  table: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  combine_columns: [
    { type: 'array', required: true, message: '请选择类型', trigger: 'blur' },
  ],
  exclude_by_words: [
    { required: true, message: '请输入排除词', trigger: 'blur' },
  ],
  brand_name: [{ required: true, message: '请输入焦点词', trigger: 'blur' }],
  long_words: [{ required: true, message: '请输入长词', trigger: 'blur' }],
  n_topics: [{ required: true, message: '请输入主题数目', trigger: 'blur' }],
  m_texts: [{ required: true, message: '请输入剩余数目', trigger: 'blur' }],
  addition_stopwords: [
    { required: true, message: '请输入忽略词', trigger: 'blur' },
  ],
  sort: [
    {
      type: 'array',
      required: true,
      message: '请选择排序方式',
      trigger: 'blur',
    },
  ],
})
const initArgu = async () => {
  const { data } = await listFiles()
  files.value = data.files
}
initArgu()
// 名称输入框数据改变后触发
const judgmentShow = () => {
  if (ruleForm.table) {
    loading.value = true
    show.value = true
    loading.value = false
  } else {
    show.value = false
  }
  const formatting = {
    version: '0905_backend_test', //
    file_path: 'data/brand/方太洗碗机.xlsx', //
    brand: '',
    site: '', //
    quantile_high: 0.75,
    quantile_low: 0.25,
    filter_content_status: false,
    high_dim: [],
    low_dim: [],
    combine_columns: [],
    text_len_bound: [0.5, 5.0],
    upperLimit: true,
    exclude_by_words: '',
    brand_name: '',
    long_words: '',
    remove_ad: true,
    remove_post: true,
    n_topics: 0,
    m_texts: 0,
    lda_max_iter: 100, //
    n_features: 1024, //
    n_top_words: 10, //
    remove_tag: true,
    count_vectorizer_df: [2, 0.2],
    addition_stopwords: '',
    sort: [], //
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
  }
  // 输入框变回默认值
  ruleForm = Object.assign(ruleForm, formatting)
}
const ruleFormRef = ref()
// 文本框下的标签
const excludeTags = ref([])
const brandTags = ref([])
const longTags = ref([])
const additionTags = ref([])
const inputChange = () => {
  excludeTags.value = ruleForm.exclude_by_words.split('|')
  brandTags.value = ruleForm.brand_name.split('|')
  longTags.value = ruleForm.long_words.split('|')
  additionTags.value = ruleForm.addition_stopwords.split('|')
}
// 提交
const submitForm = (formEl) => {
  ElMessageBox.confirm('确定运行吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      if (!formEl) return
      
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          loading.value = true
          // 特殊条件判断
          if (ruleForm.upperLimit) ruleForm.text_len_bound[1] = 2000
          if (ruleForm.high_dim[0] === undefined) ruleForm.filter_content_status = false
          else ruleForm.filter_content_status = true
          if(geoChina.value && geoForeign.value) delete ruleForm.china_locations

          // console.log(ruleForm);
          await executeNotebook(ruleForm)
            .then(async (res) => {
              runBtn.value = true
              loadShow.value = true
              const timeoutId = setTimeout(() => {
                loading.value = false
                clearTimeout(timeoutId)
              }, 1000)
              const intervalId = setInterval(
                async (res) => {
                  const { data } = await taskStatus(res.data.task_id)
                  if (data.state === 'PENDING') {
                    loading.value = false
                    console.log('等待中')
                  } else {
                    console.log('删除定时器')
                    clearInterval(intervalId)
                    loading.value = false
                    runBtn.value = false
                    deriveBtn.value = false
                    logsMsg.value = data.result.log
                  }
                },
                1000 * 5,
                res,
              )
            })
            .catch((error) => {
              console.error('error:', error)
            })
        } else {
          ElMessage.error('请按照规则填写完整')
          console.log('error submit!', fields)
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消运行',
      })
    })
}
// 导出
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
      width: 65%;

      .grid_box {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, auto));
        grid-gap: 20px;

        .el-form-item {
          width: 100%;
          box-sizing: border-box;
          align-items: center;
          margin-right: 10px;
          padding: 10px;

          .el-form-item__content {
            .el-slider {
              margin-bottom: 20px;
            }

            .el-input,
            .el-select {
              width: 70%;
              height: 36px;
              line-height: 36px;
            }
          }
          .tag-container .el-tag{
            margin-right: 5px;
          }
        }
      }
    }

    .box_right {
      position: relative;
      width: 25%;

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
          font-size: 20px;
        }
      }

      .btns {
        position: absolute;
        margin: 10px;
        left: -200px;
        bottom: 20px;
        min-width: 140px;
      }
    }
  }
}
</style>
