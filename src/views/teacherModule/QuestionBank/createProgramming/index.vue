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
            <select-directory v-model:catalogue='formState.catalogue' @vertifyAgain='validateCataloge'></select-directory>
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
          <a-form-item label="内存限制" name="memoryLimit">
            <a-input
              v-model:value="formState.memoryLimit"
              placeholder="请输入内存限制大小"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="时间限制" name="timeLimit">
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
        <a-col :span="24">
          <a-form-item label="输入格式" name="inputFormat">
            <marked-editor
              v-model="formState.inputFormat"
              :preview="preview"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col  :span="24">
          <a-form-item label="输出格式" name="outputFormat">
            <marked-editor
              v-model="formState.outputFormat"
              :preview="preview"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col  :span="12">
          <a-form-item label="样例输入" name="sampleInput">
            <a-textarea v-model:value="formState.sampleInput" :rows="4" />
          </a-form-item>
        </a-col>
        <a-col  :span="12">
          <a-form-item label="样例输出" name="sampleOutput">
            <a-textarea v-model:value="formState.sampleOutput" :rows="4" />
          </a-form-item>
        </a-col>
        <a-col  :span="24">
          <a-form-item label="测试用例" name="testCase">
            <div class="spance_bet">
              <a-radio-group v-model:value="formState.testCase" name="radioGroup" @change='radioChange'>
                <a-radio value="text">文本</a-radio>
                <a-radio value="file">文件</a-radio>
              </a-radio-group>
              <a-button type='primary' @click="addTestCase" v-if="formState.testCase=='text'">添加测试用例</a-button>
            </div>
          </a-form-item>
        </a-col>
        <a-col v-if="formState.testCase=='text'" :span="24">
          <test-case v-model:inputAndOut='inputAndOut'></test-case>
        </a-col>
        <a-col v-if="formState.testCase=='file'" :span="12">
          <a-form-item label="批量上传用例文件" name="useCaseFile">
            {{formState.useCaseFile}}00
            <upload-file v-model:fileInfo='formState.useCaseFile'>
            </upload-file>
          </a-form-item>
        </a-col>
        <a-col v-if="formState.testCase=='file'" :span="12">
          <div class="upload_limit">
            上传限制：
            <br />
            1、文件必须上传.in和.out类型的文本文件。 <br />
            2、输入输出文件需文件名称一一对应，未对应时，将无法上传。 <br />
            3、单个上传文件不能超过100MB，超过时可以分批次上传。
          </div>
        </a-col>
      </a-row>
    </a-form>
    <div class="bottom_btn">
      <a-button style="margin-right: 10px" @click="reset">取消</a-button>
      <a-button type="primary" @click="onSubmit">保存</a-button>
    </div>
  </div>
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
import { cascadeEcho,doSubmitData,doEditSubmit } from 'src/utils/cascadeEcho'


import { Modal, message } from "ant-design-vue";
import type { Rule } from 'ant-design-vue/es/form';
const route = useRoute();
const router = useRouter();
const type: any = ref(route.query.value);
const name: any = route.query.name;
const http = (request as any).QuestionBank;
const editId:any=route.query?.questionId;
const caseFile=http.caseFile
var updata = inject("updataNav") as Function;
const fileList: any = [];
updata({
  tabs: [{ name:(editId?"编辑":"创建") + name, componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const preview = false;
const formRef = ref<any>();
const inputAndOut=ref([{inputCon:'',outCon:'',ifShow:true}])
function addTestCase(){
  inputAndOut.value.push({inputCon:'',outCon:'',ifShow:true})
}
const formState = reactive({
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
  //输入格式
  inputFormat:'',
  //输出格式
  outputFormat:'',
  //样例输入
  sampleInput:'',
  //样例输出
  sampleOutput:'',
  // 测试用例
  testCase:'text',
  // 用例文件
  useCaseFile:'',
  // 题干
  stem:'',
  // 参考答案
  referenceAnswer:'',
  // 关键词
  keyword:'',
  // 题目解析
  topicAnalysis:'',
  // 评测说明
  evaluationDescription:'',
  // 评测数据
  evaluationData:'',
  // 训练集路径
  trainingSetPath:'',
  // 验证集路径
  validationSetPath:'',
  // 导入的题目路径
  topicTemplatePath:'',

  // 选择题
  // 选项内容
  multipleQuesSelection:[
    {value:'',ifAnswer:false},
    {value:'',ifAnswer:false}
  ],
  // 答案
  judgeAnswer: "1",
});
const options1: any = [
  {
    label: "Light",
    value: "light",
    children: new Array(20)
      .fill(null)
      .map((_, index) => ({ label: `Number ${index}`, value: index })),
  },
  {
    label: "Bamboo",
    value: "bamboo",
    children: [
      {
        label: "Little",
        value: "little",
        children: [
          {
            label: "Toy Fish",
            value: "fish",
          },
          {
            label: "Toy Cards",
            value: "cards",
          },
          {
            label: "Toy Bird",
            value: "bird",
          },
        ],
      },
    ],
  },
];
var selectLabels: any = ref(["A", "B", "C", "D", "E", "F"]);
const selectOptions: any = ref([
  { label: 0, value: "" },
  { label: 1, value: "" },
]);
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
    },
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
    }
  ],
  timeLimit:[
    {
      required: true,
      message: "请输入时间",
    }
  ],
  difficulty: [
    {
      required: true,
      message: "请选择类别",
    },
  ],
  referenceAnswer:[
    {
      required: true,
      message: "请输入参考答案",
    },
  ],
  keyword:[
    {
      required: true,
      message: "请输入关键词",
    }
  ],
  stem: [
    {
      required: true,
      message: "请输入题干",
    },
  ],
  evaluationDescription:[
     {
      required: true,
      message: "请输入评测说明",
    },
  ],
  evaluationData:[
     {
      required: true,
      message: "请选择评测数据",
    },
  ],
  topicTemplatePath:[
    {
      required: true,
      message: "请上传题目",
    }
  ]
};
function createProgramQues(){
  const testCaseData:any=[]
  inputAndOut.value.forEach((item:any,index:any)=>{
    testCaseData.push({in:item.inputCon,out:item.outCon})
  })
  const params={
    question:formState.name,
    used_by:formState.purpose,
    // category_id:formState.catalogue[formState.catalogue.length-1],
    category_id:doSubmitData(formState.catalogue),
    knowledge_ids:doSubmitData(formState.knowledgePoints),
    difficulty:formState.difficulty,
    // knowledge_ids:formState.knowledgePoints,
    // knowledge_ids:[],
    memory_limit:Number(formState.memoryLimit),
    time_limit:Number(formState.timeLimit),
    question_desc:formState.stem,
    input:formState.inputFormat,
    output:formState.outputFormat,
    sample_input:formState.sampleInput,
    sample_output:formState.sampleOutput,
    test_case: { // 测试用例
        type: formState.testCase,
        data:formState.testCase=='text'?testCaseData:formState.useCaseFile,
    }   
  }

  http.programQues({param:params}).then((res:any)=>{
    if(res.code==1){
        message.success('创建成功')
        router.go(-1);
      }
  })
}
const cascaData:any=reactive({
    category_chains:'',
    knowledge_map_details:''
})
function editProgressQues(){
  const testCaseData:any=[]
  inputAndOut.value.forEach((item:any,index:any)=>{
    testCaseData.push({in:item.inputCon,out:item.outCon})
  })
  const params={
    question:formState.name,
    used_by:formState.purpose,
    // category_id:formState.catalogue[formState.catalogue.length-1],
    difficulty:formState.difficulty,
    // knowledge_ids:formState.knowledgePoints,
    // knowledge_ids:[],
    category_id:doEditSubmit(formState.catalogue,cascaData.category_chains),
    knowledge_ids:doEditSubmit(formState.knowledgePoints,cascaData.knowledge_map_details),
    memory_limit:Number(formState.memoryLimit),
    time_limit:Number(formState.timeLimit),
    question_desc:formState.stem,
    input:formState.inputFormat,
    output:formState.outputFormat,
    sample_input:formState.sampleInput,
    sample_output:formState.sampleOutput,
    test_case: { // 测试用例
        type: formState.testCase,
        data:formState.testCase=='text'?testCaseData:formState.useCaseFile,
    }   
  }

  http.editProgram({param:params,urlParams:{ID:editId}}).then((res:any)=>{
    if(res.code==1){
        message.success('编辑成功')
        router.go(-1);
      }
  })
}
function onSubmit(){
  console.log(formState.multipleQuesSelection,'哈哈哈哈西西休息')
  formRef.value
    .validate()
    .then((res:any) => {
       editId?editProgressQues():createProgramQues();
    })
    .catch((err: any) => {
      console.log("error", err);
    });
};
function reset(){
  // formRef.value.resetFields();
  router.go(-1);
};
function getProgressData(){
   http.programDetail({urlParams:{ID:editId}}).then((res:any)=>{
      if(res.code==1){
        const data=res.data
        cascaData.category_chains=data.category_chains
        cascaData.knowledge_map_details=data.knowledge_map_details
        formState.name=data.question
        formState.purpose=data.used_by
        formState.difficulty=data.difficulty

        // formState.catalogue=data.category_id
        // formState.catalogue=selectDire.value.processingEchoData([93,188])
        // formState.knowledgePoints=data.knowledge_map_ids
        formState.catalogue=cascadeEcho(data.category_chains)
        formState.knowledgePoints=cascadeEcho(data.knowledge_map_details)
        formState.stem=data.question_desc
        formState.memoryLimit=data.problem.memory_limit
        formState.timeLimit=data.problem.time_limit
        formState.inputFormat=data.problem.input
        formState.outputFormat=data.problem.output
        formState.sampleInput=data.problem.sample_input
        formState.sampleOutput=data.problem.sample_output
        inputAndOut.value=[]
        data.test_case.forEach((item:any)=>{
          inputAndOut.value.push({inputCon:item.in,outCon:item.out,ifShow:true})
        })
      }
    })
}
function radioChange(){
  formState.useCaseFile=''
  inputAndOut.value=[{inputCon:'',outCon:'',ifShow:true}]
}
onMounted(()=>{
  if(editId){
     getProgressData();
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
</style>