<template>
  <div class="trialModel">
    <div class="tips">
      内存限制:<span>128mb</span>
      时间限制限制:<span>2000ms</span>
    </div>
    <common-card title="题目描述">
      <template #content>
        <antdv-markdown v-model="formData.description"  :preview-only="true" />
      </template>
    </common-card>
    <a-row :gutter="24">
      <a-col :span="12">
        <common-card title="评测说明" :height="200">
          <template #content>
            <antdv-markdown v-model="formData.reviewDes"  :preview-only="true" />
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
              <li v-for="(item,index) in dataList" :key="index">
                {{item.name}}
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
              <uploadFile urlType="result" :file="fileList" @success="resultSuccess" @delete="resultDel"/>
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
import { ref, reactive, watch, provide, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import CommonCard from "src/components/common/CommonCard.vue";
import uploadFile from '../components/uploadFile.vue'
import Submit from "src/components/submit/index.vue";
import {downloadUrl} from 'src/utils/download.ts'
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    {
      name: `模型题目名称`,
      componenttype: 0,
    },
  ],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const formData = reactive({
  description: '题目描述111111',
  reviewDes: '评测说明'
})
const rules = {
  remark: [
    {required: true,message: '请输入作品提交说明', trigger: 'blur'},
    { max: 255, message: '作品提交说明不能超过255个字', trigger: 'blur' }
  ]
}
const submitData = {
  result_file: '',
  remark: ''
}
const dataList = reactive([
  {
    name: 'train list.txt',
    url: ''
  }
])
const downLoad = (item:any) => {
  // downloadUrl()
}
const fileList = reactive([])
const resultSuccess = (data:any) => {
  submitData.result_file = data.file_url
}
const resultDel = (id: number) => {
  submitData.result_file = ''
}
const saveLoading = ref<boolean>(false)
const formRef = ref()
const handleSave = () => {
  formRef.value.validate(()=>{})
}
const cancelSave = () => {}
</script>
<style lang="less" scoped>
.trialModel{
  .tips{
    position: absolute;
    top: 106px;
    z-index: 1;
    margin-left: var(--center-width);
    color: rgba(255,255,255,0.75);
    >span{
      color: var(--primary-color);
      margin-right: 40px;
    }
  }
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