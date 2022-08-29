<template>
  <div class="create_ques">
    <a-form
      ref="formRef"
      name="advanced_search"
      class="ant-advanced-search-form"
      :model="formState"
      layout="vertical"
      :wrapperCol="{ span: 21 }"
      :rules="rules"
    >
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item name="name" label="题目名称">
            <a-input
              v-model:value="formState.name"
              placeholder="请输入题目名称"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="purpose" label="题目用途">
            <a-select
              ref="select"
              v-model:value="formState.purpose"
            >
              <a-select-option value="exam">考试题</a-select-option>
              <a-select-option value="homework">作业题</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="catalogue" label="选择目录">
            <select-directory :formState='formState' @vertifyAgain='validateCataloge'></select-directory>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="difficulty" label="难度系数">
            <label-selection v-model:difficulty='formState.difficulty' :options='[{name:"简单",value:"easy"},{name:"适中",value:"normal"},{name:"困难",value:"hard"}]'></label-selection>
          </a-form-item>
        </a-col>
         <a-col :span="24">
          <knowledge v-model:knowledgePoints="formState.knowledgePoints" :ifEdit='editId?true:false'></knowledge>
        </a-col> 
        <!-- 编程题 模型题 -->
        <a-col :span="12">
          <a-form-item label="内存限制(MB)" name="memoryLimit">
            <a-input
              v-model:value="formState.memoryLimit"
              placeholder="请输入内存限制大小"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="时间限制(MS)" name="timeLimit">
            <a-input
              v-model:value="formState.timeLimit"
              placeholder="请输入时间限制"
            ></a-input>
          </a-form-item>
        </a-col>
        <!-- 编程题-->
        <a-col :span="24">
          <a-form-item name="stem" label="题目描述">
            <marked-editor
              v-model="formState.stem"
              :preview="preview"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col  :span="12">
          <div class="sampleHead">
            <span>用例输入</span>
            <span @click="checkSample('in')">示例</span>
          </div>
            <a-textarea v-model:value="formState.sampleInput" :rows="4" />
        </a-col>
        <a-col  :span="12">
          <div class="sampleHead">
            <span>用例输出</span>
            <span @click="checkSample('out')">示例</span>
          </div>
            <a-textarea v-model:value="formState.sampleOutput" :rows="4" />
        </a-col>
      </a-row>
    </a-form>
    <Submit @submit="onSubmit" @cancel="reset" okText="保存" :loading='loading'></Submit>
  </div>
  <!-- 用例示例 -->
  <a-modal :visible="sampleData.visible" :title="(sampleData.isIn?'输入':'输出') + '示例'" :width="sampleData.isIn ? 700: 450" :destroyOnClose="true" @cancel="handleCancel">
    <div>
      <a-textarea
      :bordered="false"
        resize="none"
        autoSize
        :readonly="true"
        placeholder="请输入内容"
        v-model:value="sampleData.data"
      >
      </a-textarea>
    </div>
    <template #footer>
      <a-button @click="handleCancel">关闭</a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  ref,
  toRefs,
  onMounted,
  Ref,
  inject,
  computed,
  reactive,
  watch,
  toRaw,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";
import { Form } from "ant-design-vue";
import request from "src/api/index";
import markedEditor from "src/components/editor/markedEditor.vue";
import labelSelection from 'src/components/labelSelection/index.vue'
import testCase from '../components/testCase/index.vue'
import uploadFile from 'src/components/uploadFile.vue'
import selectDirectory from 'src/components/selectDirectory/index.vue'
import knowledge from 'src/components/knowLedge/index.vue'
import Submit from "src/components/submit/index.vue";

import { Modal, message } from "ant-design-vue";
import type { Rule } from 'ant-design-vue/es/form';
import { cascadeEcho,doSubmitData,doEditSubmit,validateNum } from 'src/utils/cascadeEcho'
import {inputValue,outputValue} from './sample'
// @ts-ignore 类型声明需要完善，此处先用注解压制错误
import {renderMarkdown} from  '@xianfe/antdv-markdown';
const route = useRoute();
const router = useRouter();
const type: any = ref(route.query.value);
const name: any = route.query.name;
const http = (request as any).QuestionBank;
const editId:any=route.query?.questionId;
var updata = inject("updataNav") as Function;
const fileList: any = [];
updata({
  tabs: [{ name:(editId?"编辑":"创建") + name, componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const loading:any=ref(false)
const preview = false;
const formRef = ref<any>();
const formState = reactive<any>({
  // 名称
  name: "",
  // 用途
  purpose: "",
  // 选择的目录
  catalogue: [],
  // 难度系数
  difficulty: "easy",
  // 知识点
  knowledgePoints: [],
  //内存限制
  memoryLimit:'',
  //时间限制
  timeLimit:'',
  //样例输入
  sampleInput:'',
  //样例输出
  sampleOutput:'',
  // 测试用例
  testCase:'text',
  // 题干
  stem:''
});
let validateCataloge = async (_rule?: Rule, value?: any) => {
  setTimeout(()=>{
    if(formState.catalogue?.length==0){
    return Promise.reject('请选择目录！！');
  }else{
    return Promise.resolve();
  }
  },1000)
};
const rules = {
  name: [
    {
      required: true,
      trigger: "blur",
      message: "请输入名称",
    }
  ],
  purpose: [
    {
      required: true,
      tigger: "blur",
      message: "请选择用途",
    },
  ],
  catalogue: [
    {
      required: true,
      validator:validateCataloge,
      // message: "请选择目录",
    },
  ],
  memoryLimit:[
    {
      required: true,
      message: "请输入内存",
    },
    validateNum
  ],
  timeLimit:[
    {
      required: true,
      message: "请输入时间",
    },
    validateNum
  ],
  difficulty: [
    {
      required: true,
      message: "请选择类别",
    },
  ],
  stem: [
    {
      required: true,
      message: "请输入题干",
    },
  ]
};
const sampleData = reactive<any>({
  visible: false,
  isIn: false,
  data: ''
})
const checkSample = (type:string) => {
  if (type === 'in') {
    sampleData.isIn = true
    sampleData.data = inputValue
  } else {
    sampleData.isIn = false
    sampleData.data = outputValue
  }
  sampleData.visible = true
}
const handleCancel = () => {
  sampleData.visible = false
}
function createSqlQues(){
  loading.value=true
  const params={
    question:formState.name,
    used_by:formState.purpose,
    category_id:doSubmitData(formState.catalogue),
    difficulty:formState.difficulty,
    knowledge_ids:doSubmitData(formState.knowledgePoints),
    memory_limit:Number(formState.memoryLimit),
    time_limit:Number(formState.timeLimit),
    question_desc:formState.stem,
    test_case: { // 测试用例
        type:'text',
        data:[{in:formState.sampleInput,out:formState.sampleOutput}]
    },
    // @ts-ignore
    question_desc_html: renderMarkdown(true, formState.stem), // 题目描述对应的html
  }

  http.sqlQues({param:params}).then((res:any)=>{
    loading.value=false
    if(res.code==1){
        message.success('创建成功')
         router.go(-1);
      }
  }).catch((err:any)=>{
    loading.value=false
  })
}
const cascaData:any=reactive({
    category_chains:'',
    knowledge_map_details:''
})
function editSqlQues(){
  loading.value=true
  const params={
    question:formState.name,
    used_by:formState.purpose,
    category_id:doEditSubmit(formState.catalogue,cascaData.category_chains),
    difficulty:formState.difficulty,
    knowledge_ids:doEditSubmit(formState.knowledgePoints,cascaData.knowledge_map_details),
    memory_limit:Number(formState.memoryLimit),
    time_limit:Number(formState.timeLimit),
    question_desc:formState.stem,
    test_case: { // 测试用例
        type:'text',
        data:[{in:formState.sampleInput,out:formState.sampleOutput}]
    },
    // @ts-ignore
    question_desc_html: renderMarkdown(true, formState.stem), // 题目描述对应的html
  }
  http.editSql({param:params,urlParams:{ID:editId}}).then((res:any)=>{
    loading.value=false
    if(res.code==1){
        message.success('编辑成功')
         router.go(-1);
      }
  }).catch((err:any)=>{
    loading.value=false
  })
}
function onSubmit(){
  formRef.value
    .validate()
    .then((res:any) => {
       editId?editSqlQues():createSqlQues();
    })
    .catch((err: any) => {
      console.log("error", err);
    });
};
function reset(){
  router.go(-1);
};
function getSqlData(){
   http.sqlDetail({urlParams:{ID:editId}}).then((res:any)=>{
      if(res.code==1){
        const data=res.data
        // 暂时把后端返回的目录知识点数据保存
        cascaData.category_chains=data.category_chains
        cascaData.knowledge_map_details=data.knowledge_map_details
        formState.name=data.question
        formState.purpose=data.used_by
        formState.difficulty=data.difficulty
        formState.catalogue=cascadeEcho(data.category_chains)
        formState.knowledgePoints=cascadeEcho(data.knowledge_map_details)
        formState.stem=data.question_desc
        formState.memoryLimit=data.problem.memory_limit
        formState.timeLimit=Number(data.problem.time_limit)
        formState.sampleInput=data.test_case.data[0]?.in
        formState.sampleOutput=data.test_case.data[0]?.out
      }
    })
}
onMounted(()=>{
  if(editId){
     getSqlData();
  }
})
</script>
<style lang="less" scoped>
.create_ques {
  background-color: var(--white-100);
}
.bottom_btn {
  display: flex;
  justify-content: center;
}
:deep(.ant-col-21) {
  max-width: 100%;
}
.select_answer {
  width: 34px;
  height: 34px;
  border: 1px solid #dfdfdf;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}
.upload_limit {
  background-color: #f9f9f9;
  padding: 20px;
  margin-top: 30px;
  width: 100%;
}
.tiptit{
  font-size: 12px;
  margin-left: 10px;
  color:var(--black-45);
}

.create_ques{
  padding: 20px 40px;
}
.icon-upload{
  color: var(--primary-color);
  font-size: 24px;
}
.ant-upload.ant-upload-drag p.ant-upload-text{
  font-size: 16px;
  color:#BEBEBE;
}
:deep(.ant-form-item .ant-upload){
  background-color: white;
}
.modalLabel{
  margin-right: 10px;
}
:deep(.mark__container){
  border:1px solid var(--gray-5) !important;
}
.spance_bet{
  display: flex;
  justify-content: space-between;
}
.sampleHead{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  >span:last-child{
    color: var(--primary-color);
    cursor: pointer;
  }
}
.ant-form{
  margin-bottom: 20px;
}
</style>