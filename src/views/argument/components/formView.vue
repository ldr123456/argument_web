<template>
  <div>
    <el-form
      :ref="props.ruleFormRef"
      label-position="top"
      :model="ruleForm"
      :rules="rules"
      status-icon
    >
      <div class="title">
        <h2 style="display: inline-block">基本信息</h2>
      </div>
      <div class="grid_box">
        <el-form-item label="名称" prop="table">
          <el-select
            v-model="ruleForm.table"
            placeholder="请选择名称"
            @change="judgmentShow"
          >
            <el-option label="fangtai" value="fangtai" />
            <el-option label="tianmao" value="tianmao" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="品牌" prop="brand">
              <el-input
                v-model="ruleForm.brand"
                placeholder="请输入品牌"
                @blur="judgmentShow"
              ></el-input>
            </el-form-item> -->
      </div>
      <div v-if="show">
        <div class="title">
          <h2>筛选</h2>
        </div>
        <div class="grid_box">
          <el-form-item label="站点" prop="site">
            <el-select v-model="ruleForm.site" placeholder="请选择站点">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="内容质量">
            <el-checkbox-group v-model="ruleForm.filter_content_dim">
              <el-checkbox label="总互动量" name="type" />
              <el-checkbox label="转发数" name="type" />
              <el-checkbox label="评论数" name="type" />
              <el-checkbox label="点赞数" name="type" />
              <el-checkbox label="阅读数" name="type" />
              <el-checkbox label="收藏数" name="type" />
            </el-checkbox-group>
            <el-slider
              v-model="ruleForm.quantile"
              :marks="{
                0: '0%',
                0.5: '50%',
                1: '100%',
              }"
              :format-tooltip="
                (val) => {
                  return Math.round(val * 100) + '%'
                }
              "
              :max="1"
              :step="0.05"
            />
          </el-form-item>
          <el-form-item label="数据类型" prop="combine_columns">
            <el-checkbox-group v-model="ruleForm.combine_columns">
              <el-checkbox label="文本" name="type"></el-checkbox>
              <el-checkbox label="标题" name="type"></el-checkbox>
              <el-checkbox label="视频" name="type"></el-checkbox>
              <el-checkbox label="图片" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="内容长度">
            <el-slider
              v-model="ruleForm.text_len_bound[0]"
              :max="1"
              :step="0.01"
              show-input
            ></el-slider>
            <el-slider
              v-model="ruleForm.text_len_bound[1]"
              :min="1"
              :max="10"
              :step="0.1"
              show-input
            ></el-slider>
            <el-checkbox
              v-model="ruleForm.upperLimit"
              label="是否开启无上限(选中视为开启)"
              size="large"
            ></el-checkbox>
          </el-form-item>
          <el-form-item prop="exclude_by_words">
            <template #label>
              <span>排除词</span>
              <el-tooltip
                effect="customized"
                content="请使用“|”隔离排除词"
                placement="top"
              >
                <el-icon
                  :size="18"
                  color="#409EFC"
                  style="transform: translateY(3px)"
                >
                  <i-ep-question-filled />
                </el-icon>
              </el-tooltip>
              <span>:</span>
            </template>
            <el-input
              v-model="ruleForm.exclude_by_words"
              :rows="3"
              type="textarea"
              placeholder="排除词请用“|”隔开"
            />
          </el-form-item>
          <el-form-item prop="brand_name">
            <template #label>
              <span>焦点词</span>
              <el-tooltip
                effect="customized"
                content="请使用“|”隔离焦点词词"
                placement="top"
              >
                <el-icon
                  :size="18"
                  color="#409EFC"
                  style="transform: translateY(3px)"
                >
                  <i-ep-question-filled />
                </el-icon>
              </el-tooltip>
              <span>:</span>
            </template>
            <el-input
              v-model="ruleForm.brand_name"
              :rows="3"
              type="textarea"
              placeholder="焦点词请用“|”隔开"
            />
          </el-form-item>
          <el-form-item prop="long_words">
            <template #label>
              <span>长词</span>
              <el-tooltip
                effect="customized"
                content="不希望被分词的长词列表（用“|”分隔）"
                placement="top"
              >
                <el-icon
                  :size="18"
                  color="#409EFC"
                  style="transform: translateY(3px)"
                >
                  <i-ep-question-filled />
                </el-icon>
              </el-tooltip>
              <span>:</span>
            </template>
            <el-input
              v-model="ruleForm.long_words"
              :rows="3"
              type="textarea"
              placeholder="长词请用“|”隔开"
            />
          </el-form-item>
          <el-form-item label="是否允许存在">
            <el-checkbox
              v-model="ruleForm.remove_ad"
              label="广告"
              size="large"
            />
            <el-checkbox
              v-model="ruleForm.remove_post"
              label="水印"
              size="large"
            />
          </el-form-item>
        </div>
        <div class="title">
          <h2>计算</h2>
        </div>
        <div class="grid_box">
          <el-form-item label="主题数目" prop="n_topics">
            <el-input-number
              v-model="ruleForm.n_topics"
              :min="0"
              :max="10"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="剩余数目" prop="m_texts">
            <el-input-number
              v-model="ruleForm.m_texts"
              :min="0"
              :max="10"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="标签头" prop="tag">
            <el-checkbox v-model="ruleForm.remove_tag" label="#"></el-checkbox>
          </el-form-item>
          <el-form-item
            :label="
              '忽略文章中出现超过 ' +
              Math.round(ruleForm.count_vectorizer_df[1] * 100) +
              '% 的词'
            "
          >
            <el-slider
              v-model="ruleForm.count_vectorizer_df[1]"
              :max="1"
              :step="0.01"
              show-input
            ></el-slider>
          </el-form-item>
          <el-form-item label="忽略词" prop="addition_stopwords">
            <template #label>
              <span>忽略词</span>
              <el-tooltip
                effect="customized"
                content="请使用“|”隔离忽略词"
                placement="top"
              >
                <el-icon
                  :size="18"
                  color="#409EFC"
                  style="transform: translateY(3px)"
                >
                  <i-ep-question-filled />
                </el-icon>
              </el-tooltip>
              <span>:</span>
            </template>
            <el-input
              v-model="ruleForm.addition_stopwords"
              :rows="3"
              type="textarea"
              placeholder="忽略词请用“|”隔开"
            />
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
  </div>
</template>
<script setup>
import { ref, reactive,defineProps } from 'vue'
// import emitter from '@/utils/bus'
import mitt from 'mitt'
const emitter = mitt()
const show = ref(true)
const props = defineProps({
  ruleForm: {
    type: Object,
    required: true,
  },
  ruleFormRef: {
    required: true,
  },
})
let ruleForm = reactive(props.ruleForm)
const rules = reactive({
  // name: [
  //   {
  //     required: true,
  //     pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
  //     message: '请输入合法的名称',
  //     trigger: 'blur',
  //   },
  // ],
  // table: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  // brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
  // site: [{ required: true, message: '请选择站点', trigger: 'change' }],
  combine_columns: [
    { type: 'array', required: true, message: '请选择类型', trigger: 'change' },
  ],
  exclude_by_words: [
    { required: true, message: '请输入排除词', trigger: 'blur' },
  ],
  brand_name: [{ required: true, message: '请输入焦点词', trigger: 'blur' }],
  long_words: [{ required: true, message: '请输入长词', trigger: 'blur' }],
  n_topics: [{ required: true, message: '请输入主题数目', trigger: 'change' }],
  m_texts: [{ required: true, message: '请输入剩余数目', trigger: 'change' }],
  addition_stopwords: [
    { required: true, message: '请输入忽略词', trigger: 'change' },
  ],
  sort: [
    {
      type: 'array',
      required: true,
      message: '请选择排序方式',
      trigger: 'change',
    },
  ],
})

const judgmentShow = () => {
  if (ruleForm.table) {
    emitter.emit('loading', true)
    loading.value = true
    show.value = true
    // emitter.emit('loading', false)
    // loading.value = false
  } else {
    show.value = false
  }
}
</script>
<style lang="scss" scoped>
.grid_box {
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-gap: 20px;
  .el-form-item {
    width: 350px;
    align-items: center;
    margin-right: 10px;
    padding: 10px;
    .el-form-item__content {
      .el-input,
      .el-select {
        width: 70%;
        height: 36px;
        line-height: 36px;
      }
    }
  }
}
</style>
