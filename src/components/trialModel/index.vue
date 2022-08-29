<template>
  <div class="trialModel">
    <common-card title="题目描述">
      <template #content>
        <antdv-markdown v-model="formData.questionDesc"  :preview-only="true" />
      </template>
    </common-card>
    <a-row :gutter="24">
      <a-col :span="12">
        <common-card title="评测说明" :height="200">
          <template #content>
            <antdv-markdown v-model="formData.aiTestDesc"  :preview-only="true" />
          </template>
        </common-card>
      </a-col>
      <a-col :span="12">
        <common-card title="评测数据列表" :height="200">
          <template #right>
            <a-button type="primary" @click="downLoadAll"  :loading="downLoading" :disabled="!formData.practice.length">下载全部</a-button>
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
              <uploadFile v-model:fileInfo='submitData.result' :isMultiple="false" uploadPath="models"/>
            </a-col>
            <a-col :span="12">
              <div class="formLabel">过程文件<span>非必传项，分享建模思路</span></div>
              <uploadFile v-model:fileInfo='submitData.process' :isMultiple="true" uploadPath="models"/>
            </a-col>
          </a-row>
          <a-form-item label="作品提交说明" name="remark">
            <a-textarea v-model:value="submitData.remark" :auto-size="{ minRows: 4, maxRows: 6 }"/>
          </a-form-item>
        </a-form>
      </template>
    </common-card>
    <Submit @submit="handleSave" @cancel="cancelSave" :loading="saveLoading" ok-text="提交"></Submit>
  </div>
  <!-- 结果反馈 -->
  <a-modal :visible="resultVisible" title="试用结果反馈" :width="700" @cancel="handleCancel" :footer="null">
    <div>
      <span>得10分</span>
      <resultShow :border="true" :resultInfo="resultInfo"/>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, provide, inject, onMounted,computed,onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import CommonCard from "src/components/common/CommonCard.vue";
import uploadFile from 'src/components/uploadFile.vue'
import Submit from "src/components/submit/index.vue";
import resultShow from "./resultShow.vue"
import {downloadUrl} from 'src/utils/download'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { lStorage } from "src/utils/extStorage";
import { useStore } from "vuex";
const http = (request as any).QuestionBank;
const route = useRoute()
const store = useStore()
const questionId = ref<any>(route.query.questionId) // 题目id
const examId = ref<any>(route.query?.examId) // 学生端考试id
const userId= lStorage.get('uid')
const isTeacher = lStorage.get('role') === 3 ? true: false
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const formData = reactive<any>({
  question: '',
  questionDesc: '',
  aiTestDesc: '',
  practice: []
})
const rules = {
  remark: [
    {required: true,message: '请输入作品提交说明', trigger: 'blur'},
    { max: 255, message: '作品提交说明不能超过255个字', trigger: 'blur' }
  ]
}
const submitData = reactive<any>({
  question_id: questionId.value,
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
      questionDesc: result.questionDesc,
      aiTestDesc: result.aiTestDesc,
      practice: result.practice
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
  })
}
const downLoad = (item:any) => {
  downloadUrl(item.file_url,item.file_name)
}
const downLoading = ref<boolean>(false)
const downLoadAll = () => {
  downLoading.value = true
  http.batchDownLoad({urlParams:{questionId: questionId.value}}).then((res:IBusinessResp) => {
    downloadUrl(res.data.path, res.data.file_name)
    downLoading.value = false
  }).catch(()=>{
    downLoading.value = false
  })
}
// 结果反馈弹框
const resultVisible = ref<boolean>(false)
const resultInfo = reactive<any>({
  resultUrl: '',
  processUrl: '',
  remark: '说明'
})

const handleCancel = () => {
  resultVisible.value = false
}
const saveLoading = ref<boolean>(false)
const formRef = ref()
const handleSave = () => {
  if (!submitData.result.length) {
    message.warning('请上传结果文件')
    return
  }
  if (examId.value) {
    submitData.exam_id = examId.value
  }
  formRef.value.validate().then(()=>{
    saveLoading.value = true
    http.runQuestions({urlParams:{user: userId},param: submitData}).then((res:IBusinessResp) => {
      saveLoading.value = false
      message.success('提交成功')
      // initWs()
    }).catch(()=>{
      saveLoading.value = false
    })
  })
}
const cancelSave = () => {
  window.close()
}
// watch()
onMounted(()=>{
  getDetail()
})
</script>
<style lang="less" scoped>
.trialModel{
  .dataList{
    overflow: auto;
    li{
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      line-height: 24px;
      padding: 0 10px;
      margin-bottom: 10px;
      i{
        display: none;
        color: var(--primary-color);
      }
      &:hover{
        background: var(--primary-2);
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