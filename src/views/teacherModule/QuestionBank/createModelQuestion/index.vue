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
        <a-col v-if="['5', '6'].includes(type)" :span="12">
          <a-form-item name="name" label="题目名称">
            <a-input
              v-model:value="formState.name"
              placeholder="请输入题目名称"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col v-if="type != 7" :span="12">
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
        <a-col v-if="['5', '6'].includes(type)" :span="12">
          <a-form-item name="difficulty" label="难度系数">
            <label-selection v-model:difficulty='formState.difficulty' :options='[{name:"简单",value:"easy"},{name:"适中",value:"normal"},{name:"困难",value:"hard"}]'></label-selection>
          </a-form-item>
        </a-col>
        <a-col :span="12">
         <knowledge v-model:knowledgePoints="formState.knowledgePoints" :ifEdit='editId?true:false'></knowledge>
        </a-col>
        <!-- 题干 公有 -->
        <a-col v-if="type != 7" :span="24">
          <a-form-item name="stem" label="题目描述">
            <marked-editor
              v-model="formState.stem"
              :preview="preview"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="type == 6" :span="24">
          <a-form-item name="evaluationDescription" label="评测说明">
            <marked-editor
              v-model="formState.evaluationDescription"
              :preview="preview"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="type == 6" :span="24">
          <a-form-item name="evaluationData" label="评测数据">
            <span class="modalLabel">模型评估算法</span>
            <a-select
              ref="select"
              v-model:value="formState.evaluationData"
              style="width: 120px"
            >
              <a-select-option v-for="(item,index) in algorithmList" :value="item.value" :key="index">{{item.label}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col v-if="type == 6" :span="12">
          <a-form-item name="trainingSetPath" label="上传训练集">
            <!-- {{formState.trainingSetPath}} -->
            <upload-file v-model:fileInfo='formState.trainingSetPath' :uploadData='uploadData' ></upload-file>
          </a-form-item>
        </a-col>
        <a-col v-if="type == 6" :span="12">
          <a-form-item name="validationSetPath">
            <template v-slot:label>
              上传验证集
              <span class="tiptit">此文件不对学生展示</span>
            </template>
            <!-- {{formState.validationSetPath}} -->
            <upload-file v-model:fileInfo='formState.validationSetPath'  :uploadData='uploadData' ></upload-file>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="bottom_btn">
      <a-button style="margin-right: 10px" @click="reset">取消</a-button>
      <a-button type="primary" @click.prevent="onSubmit">保存</a-button>
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
import uploadFile from 'src/components/uploadFile.vue'
import selectDirectory from 'src/components/selectDirectory/index.vue'
import { Modal, message } from "ant-design-vue";
import type { Rule } from 'ant-design-vue/es/form';
// @ts-ignore 类型声明需要完善，此处先用注解压制错误
import {renderMarkdown} from  '@xianfe/antdv-markdown';
const route = useRoute();
const router = useRouter();
const type: any = ref(route.query.value);
const name: any = route.query.name;
const editId:any=route.query?.questionId;
const http = (request as any).QuestionBank;
const caseFile=http.caseFile
import knowledge from 'src/components/knowLedge/index.vue'
import { cascadeEcho,doSubmitData,doEditSubmit } from 'src/utils/cascadeEcho'
import { IBusinessResp } from "src/typings/fetch";


var updata = inject("updataNav") as Function;
const fileList: any = [];
updata({
  tabs: [{ name:(editId?"编辑":"创建") + name, componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const preview = false;
const algorithmList = reactive<any>([])
const formRef = ref<any>();
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
  testCase:'1',
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
  trainingSetPath:[],
  // 验证集路径
  validationSetPath:[],
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
// 所有正在上传的文件列表
const uploadData = reactive({
  fileAllList: [],
  loading: false
})
var options: any[] = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];
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
  // formState.catalogue=value
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
      message: "请选择目录",
      // validator:validateCataloge,
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
      message: "请输入题目描述",
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
function createModelQues(){
  const params={
    question:formState.name,
    usedBy:formState.purpose,
    // categoryId:1,
    difficulty:formState.difficulty,
    // knowledgeMapIds:ids,
    categoryId:doSubmitData(formState.catalogue),
    knowledgeMapIds:doSubmitData(formState.knowledgePoints),
    questionDesc:formState.stem,
    aiTestDesc:formState.evaluationDescription,
    pattern:formState.evaluationData,
    practice:formState.trainingSetPath,
    verify:formState.validationSetPath,
    // @ts-ignore
    question_desc_html: renderMarkdown(true, formState.stem), // 题目描述对应的html
  }
  http.modelQues({param:params}).then((res:any)=>{
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
function editModalQues(){
  const params={
    question:formState.name,
    usedBy:formState.purpose,
    // categoryId:188,
    difficulty:formState.difficulty,
    // knowledgeMapIds:ids,
    categoryId:doEditSubmit(formState.catalogue,cascaData.category_chains),
    knowledgeMapIds:doEditSubmit(formState.knowledgePoints,cascaData.knowledge_map_details),
    questionDesc:formState.stem,
    aiTestDesc:formState.evaluationDescription,
    pattern:formState.evaluationData,
    practice:formState.trainingSetPath,
    verify:formState.validationSetPath,
    // @ts-ignore
    question_desc_html: renderMarkdown(true, formState.stem), // 题目描述对应的html
  }
  http.editModel({param:params,urlParams:{questionId:editId}}).then((res:any)=>{
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
    .then((res: any) => {
      if (!formState.trainingSetPath.length) {
        message.warning('请上传训练集')
        return
      }
      if (!formState.validationSetPath.length) {
        message.warning('请上传验证集')
        return
      }
      editId?editModalQues():createModelQues()  
    })
    .catch((err: any) => {
      console.log("error", err);
    });
};
function reset(){
  // formRef.value.resetFields();
  router.go(-1);
};
function getModalQuesData(){
   http.modelDeatil({urlParams:{questionId:editId}}).then((res:any)=>{
      if(res.code==1){
        const data=res.data
        cascaData.category_chains=data.category_chains
        cascaData.knowledge_map_details=data.knowledge_map_details
        formState.name=data.question
        formState.purpose=data.usedBy
        formState.difficulty=data.difficulty
        formState.evaluationDescription=data.aiTestDesc
        formState.stem=data.questionDesc
        formState.evaluationData=data.pattern
        // 上传训练集 验证集文件回显
        const practice:any=[]
        const verify:any=[]
        data.practice.forEach((item:any)=> {
          practice.push({file_name:item.file_name,file_url:item.file_url,size:item.size,suffix:item.suffix})
        });
        data.verify.forEach((item:any)=> {
          verify.push({file_name:item.file_name,file_url:item.file_url,size:item.size,suffix:item.suffix})
        });
        formState.trainingSetPath=practice
        formState.validationSetPath=verify
        formState.catalogue=cascadeEcho(data.category_chains)
        formState.knowledgePoints=cascadeEcho(data.knowledge_map_details)
        
      }
    })
}
onMounted(()=>{
  if(editId){
     getModalQuesData();
  }
  http.modelConfig().then((res:IBusinessResp) => {
    for(let i in res.data) {
      algorithmList.push({
        value: i,
        label: res.data[i]
      })
    }
  })
})
</script>
<style lang="less" scoped>
.create_ques {
  background-color: var(--white-100);
  padding: 20px 150px;
  box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 16%);
}
.bottom_btn {
  display: flex;
  justify-content: center;
}
:deep(.ant-col-21) {
  max-width: 100%;
}
.upload_limit {
  background-color: #f9f9f9;
  padding: 20px;
  margin-top: 30px;
  width: 100%;
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