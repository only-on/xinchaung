<template>
  <div class="trialModel">
    <common-card title="题目描述">
      <template #content>
        <antdv-markdown v-model="formData.question_desc"  :preview-only="true" />
      </template>
    </common-card>
    <a-row :gutter="24">
      <a-col :span="12">
        <common-card title="评测说明" :height="200">
          <template #content>
            <antdv-markdown v-model="formData.ai_test_desc"  :preview-only="true" />
          </template>
        </common-card>
      </a-col>
      <a-col :span="12">
        <common-card title="评测数据列表" :height="200">
          <template #right>
            <a-button type="primary">下载全部</a-button>
          </template>
          <template #content>
            <ul class="dataList setScrollbar">
              <li v-for="(item,index) in formData.practice" :key="index">
                {{item.file_name}}
                <i class="iconfont icon-download-1-copy" @click="downLoad(item)"></i>
              </li>
            </ul>
          </template>
        </common-card>
      </a-col>
    </a-row>
    <common-card title="提交答案">
      <template #content>
        <a-form
          ref="formRef"
          :model="submitData"
          :rules="rules"
          layout="vertical"
        >
          <a-row :gutter="24">
            <a-col :span="12">
              <div class="formLabel import">结果文件<span>必传项，成绩评测必备文件</span></div>
              <uploadFile urlType="result" :file="fileList" @success="resultSuccess" @delete="resultDel"/>
            </a-col>
            <a-col :span="12">
              <div class="formLabel">过程文件<span>非必传项，分享建模思路</span></div>
              <uploadFile urlType="process" :file="fileList" @success="processSuccess" @delete="processDel"/>
            </a-col>
          </a-row>
          <a-form-item label="作品提交说明" name="remark">
            <a-textarea v-model:value="submitData.remark" :auto-size="{ minRows: 4, maxRows: 6 }"/>
          </a-form-item>
        </a-form>
      </template>
    </common-card>
    <Submit @submit="handleSave" @cancel="cancelSave" :loading="saveLoading"></Submit>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, provide, inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import CommonCard from "src/components/common/CommonCard.vue";
import uploadFile from '../components/uploadFile.vue'
import Submit from "src/components/submit/index.vue";
import {downloadUrl} from 'src/utils/download.ts'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
const http = (request as any).QuestionBank;
const route = useRoute()
const questionId = ref<any>(route.query.id)
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const formData = reactive({
  question: '题目名称',
  question_desc: '题目描述111111',
  ai_test_desc: '评测说明',
  practice: [
    {
      file_name: 'train list.txt',
      file_url: ''
    }
  ]
})
updata({
  tabs: [
    {
      name: `${formData.question}`,
      componenttype: 0,
    },
  ],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const rules = {
  remark: [
    {required: true,message: '请输入作品提交说明', trigger: 'blur'},
    { max: 255, message: '作品提交说明不能超过255个字', trigger: 'blur' }
  ]
}
const submitData = reactive<any>({
  object_question_id: '',
  object_type: '',
  result: [],
  process: [],
  remark: ''
})
// 获取模型题详情
const getDetail = () => {
  http.modelDeatil({urlParams: {questionId: questionId.value}}).then((res:IBusinessResp) => {
    let result = res.data
    Object.assign(formData, {
      question: result.question,
      question_desc: result.question_desc,
      ai_test_desc: result.ai_test_desc,
      practice: result.practice
    })
  })
}
const downLoad = (item:any) => {
  downloadUrl(item.file_name, item.file_url)
}
const fileList = reactive([])
const resultSuccess = (data:any) => {
  submitData.result = [data]
}
const resultDel = (id: number) => {
  submitData.result = []
}
const processSuccess = (data:any) => {
  submitData.process = [data]
}
const processDel = (id: number) => {
  submitData.process = []
}
const saveLoading = ref<boolean>(false)
const formRef = ref()
const handleSave = () => {
  formRef.value.validate(()=>{
    // saveLoading.value = true
    // http.runModelQuestions({urlParams:{questionId: questionId.value}}).then((res:IBusinessResp) => {
    //   saveLoading.value = false
    // }).catch(()=>{
    //   saveLoading.value = false
    // })
  })
}
const cancelSave = () => {}
</script>
<style lang="less" scoped>
.trialModel{
  .dataList{
    overflow: auto;
    li{
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      padding: 0 10px;
      i{
        display: none;
        color: var(--primary-color);
      }
      &:hover{
        background: var(--primary-1);
        i{
          display: block;
        }
      }
    }
  }
  .ant-form{
    .ant-row{
      margin-bottom: 20px;
    }
  }
  .formLabel{
       margin-bottom: 10px;
       position: relative;
       &.import{
        margin-left: 10px;
       }
       &.import::before{
        position: absolute;
        content: '*';
        display: block;
        font-family: SimSun,sans-serif;
        left: -8px;
        color: var(--red-5);
        font-size: 14px;
       }
       span{
        margin-left: 20px;
        color: var(--black-25);
        font-size: 13px;
       }
     }
}
</style>