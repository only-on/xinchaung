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
        <a-col v-if="!['5', '6'].includes(type) && type != 7" :span="12">
          <a-form-item name="difficulty" label="难度系数">
            <label-selection v-model:difficulty='formState.difficulty' :options='[{name:"简单",value:"easy"},{name:"适中",value:"normal"},{name:"困难",value:"hard"}]'></label-selection>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="catalogue" label="选择目录">
            <select-directory :formState='formState' @vertifyAgain='validateCataloge' ref='selectDire'></select-directory>
          </a-form-item>
        </a-col>
        <a-col :span="['1','2','3','4','7'].includes(type)? 12 : 24">
          <knowledge v-model:knowledgePoints="formState.knowledgePoints" :maxNum='3' :ifEdit='editId?true:false'></knowledge>
        </a-col> 
        <!-- 题干 公有 -->
        <a-col v-if="type != 7" :span="24">
          <a-form-item name="stem" label="题干">
            <marked-editor
              v-model="formState.stem"
              :preview="preview"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <!-- 选择题 填空题-->
        <a-col v-if="['1','3'].includes(type)" :span="24">
          <answer-option-com :type='type' v-model:multipleQuesSelection="formState.multipleQuesSelection" @addItem='addItem' @deleteItem='deleteItem'></answer-option-com>
        </a-col>
        <!-- 判断题 -->
        <a-col v-if="type == 2" :span="24">
          <a-form-item label="答案选项" name="analysis">
            <div class="select_difficult">
              <span
                @click="formState.judgeAnswer = 'right'"
                :class="formState.judgeAnswer === 'right' ? 'active' : ''"
                >正确</span
              >
              <span
                @click="formState.judgeAnswer = 'wrong'"
                :class="formState.judgeAnswer === 'wrong' ? 'active' : ''"
                >错误</span
              >
            </div>
          </a-form-item>
        </a-col>
        <!-- 解答题 -->
        <a-col v-if="type == 4" :span="24">
          <a-form-item label="参考答案" name="referenceAnswer">
            <marked-editor
              v-model="formState.referenceAnswer"
              :preview="preview"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="type == 4" :span="24">
          <a-form-item label="关键词" name="keyword">
            <a-textarea v-model:value="formState.keyword" />
          </a-form-item>
        </a-col>
        <a-col v-if="!['5', '6'].includes(type) && type != 7" :span="24">
          <a-form-item label="题目解析" name="topicAnalysis">
            <marked-editor
              v-model="formState.topicAnalysis"
              :preview="preview"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- <div class="bottom_btn">
      <a-button style="margin-right: 10px" @click="reset">取消</a-button>
      <a-button type="primary" @click.prevent="onSubmit">保存</a-button>
    </div> -->
    <Submit @submit="onSubmit" @cancel="reset" okText="保存" :loading='loading'></Submit>
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
import answerOptionCom from '../components/answerOptionsCom/index.vue'
import { Modal, message } from "ant-design-vue";
import knowledge from 'src/components/knowLedge/index.vue'
import selectDirectory from 'src/components/selectDirectory/index.vue'
import Submit from "src/components/submit/index.vue";
// @ts-ignore 类型声明需要完善，此处先用注解压制错误
import {renderMarkdown} from  '@xianfe/antdv-markdown';
import type { Rule } from 'ant-design-vue/es/form';
import { cascadeEcho,doSubmitData,doEditSubmit } from 'src/utils/cascadeEcho'

const route = useRoute();
const router = useRouter();
const type: any = ref(route.query.value);
const name: any = route.query.name;
const editId:any=route.query?.questionId;
const http = (request as any).QuestionBank;
const caseFile=http.caseFile
var updata = inject("updataNav") as Function;

const catalogue1:any=ref([])
const fileList: any = [];
const loading:any=ref(false)
updata({
  tabs: [{ name:(editId?"编辑":"创建" )+ name, componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const preview = false;
const formRef = ref<any>();
const selectDire=ref<any>()
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
  trainingSetPath:'',
  // 验证集路径
  validationSetPath:'',

  // 选择题
  // 选项内容
  multipleQuesSelection:[
    {value:'',ifAnswer:false},
    {value:'',ifAnswer:false}
  ],
  // 答案
  judgeAnswer: "right",
});

// 填空题最少是一个空 
type.value == 3 ? formState.multipleQuesSelection = [{value:'',ifAnswer:false}] : ''

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
      // message: "请选择目录",
      validator:validateCataloge, 
      // trigger: 'change'
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
  ]
};
// 添加选项
function addItem(index: any) {
  if (index == 6) {
    message.warning("最多七个答案选项！");
    return;
  }
  formState.multipleQuesSelection.push({value: "" ,ifAnswer:false});
}
// 删除选项
function deleteItem(index: any) {
  // 选择题最少两个选项
  if (formState.multipleQuesSelection.length == 2 && type.value == 1) {
    message.warning("最少两个选项！");
    return;
  }
  // 填空题最少一个选项
  if (formState.multipleQuesSelection.length == 1 && type.value == 3) {
    message.warning("最少一个选项！");
    return;
  }
  formState.multipleQuesSelection.splice(index, 1);
}
// 创建选择题
function createChoiceQues(){
  const choiceOptions:any=[];
  const choiceCorrectOptions:any=[]
    formState.multipleQuesSelection.forEach((item:any,index:any)=>{
      choiceOptions.push({content:item.value,originOption:selectLabels.value[index]})
      if(item.ifAnswer==true){
        choiceCorrectOptions.push(selectLabels.value[index])
      }
    })
    if(choiceCorrectOptions.length==0){
      message.warning('答案不能为空！')
      return
    }
    const params={
      question:formState.stem,
      difficulty:formState.difficulty,
      categoryId:doSubmitData(formState.catalogue),
      // knowledgeIds:doSubmitData(formState.knowledgePoints),
      knowledgeMapIds:doSubmitData(formState.knowledgePoints),
      questionAnalysis:formState.topicAnalysis,
      choiceOptions:choiceOptions,
      choiceCorrectOptions:choiceCorrectOptions,
      usedBy:formState.purpose,
      // @ts-ignore
      question_html: renderMarkdown(true, formState.stem), // 题干对应的html

    }
    loading.value=true
    http.choiceQues({param:params}).then((res:any)=>{
      loading.value=false
      if(res.code==1){
        message.success('创建成功')
        router.go(-1);
      }
    }).catch((err:any)=>{
      loading.value=false
    })
}
// 创建判断题
function createJudgeQues(){
  const params={
      usedBy:formState.purpose,
      difficulty:formState.difficulty,
      categoryId:doSubmitData(formState.catalogue),
      knowledgeMapIds:doSubmitData(formState.knowledgePoints),
      question:formState.stem, 
      judgeCorrect:formState.judgeAnswer,
      questionAnalysis:formState.topicAnalysis,
      // @ts-ignore
      question_html: renderMarkdown(true, formState.stem), // 题干对应的html
    }
    loading.value=true
    http.judgeQues({param:params}).then((res:any)=>{
      loading.value=false
      if(res.code==1){
        message.success('创建成功')
         router.go(-1);
      }
    }).catch((err:any)=>{
      loading.value=false
    })
}
// 创建填空题
function createCompleQues(){
  const blankCorrect:any=[]
   formState.multipleQuesSelection.forEach((item:any,index:any)=>{
    blankCorrect.push(item.value)
  })
  const params={
      usedBy:formState.purpose,
      difficulty:formState.difficulty,
      categoryId:doSubmitData(formState.catalogue),
      knowledgeMapIds:doSubmitData(formState.knowledgePoints),
      question:formState.stem, 
      blankCorrect:blankCorrect,
      questionAnalysis:formState.topicAnalysis,
      // @ts-ignore
      question_html: renderMarkdown(true, formState.stem), // 题干对应的html
    }
  loading.value=true
  http.complateQues({param:params}).then((res:any)=>{
     loading.value=false
     if(res.code==1){
        message.success('创建成功')
         router.go(-1);
      }
  }).catch((err:any)=>{
    loading.value=false
  })
}
// 创建解答题
function createSolutionQues(){
  const params={
      usedBy:formState.purpose,
      difficulty:formState.difficulty,
      categoryId:doSubmitData(formState.catalogue),
      // knowledgeIds:doSubmitData(formState.knowledgePoints),
      knowledgeMapIds:doSubmitData(formState.knowledgePoints),
      question:formState.stem, 
      shortAnswerReference:formState.referenceAnswer,//参考答案
      shortAnswerKeys:formState.keyword,
      questionAnalysis:formState.topicAnalysis,
      // @ts-ignore
      question_html: renderMarkdown(true, formState.stem), // 题干对应的html
    }
    loading.value=true
    http.solutionQues({param:params}).then((res:any)=>{
      loading.value=false
       if(res.code==1){
        message.success('创建成功')
        router.go(-1);
      }
    })
}
function onSubmit(){
  formRef.value.validate().then((res: any) => {
      switch(type.value){
        case "1":
        editId?editChoice():createChoiceQues();
        break;
        case '2':
        editId?editJudge():createJudgeQues();
        break;
         case '3':
        editId?editComple():createCompleQues();
        break;
         case '4':
        editId?editSolution():createSolutionQues();
        break;
      }
    })
    .catch((err: any) => {
      console.log("error", err);
    });
};
function reset(){
  // formRef.value.resetFields();
  router.go(-1);
};
function selectAnswer(){

}
const cascaData:any=reactive({
    category_chains:'',
    knowledge_map_details:''
})
//获取选择数据
function getChoiceData(){
    http.choiceDetail({urlParams:{questionId:editId}}).then((res:any)=>{
      if(res.code==1){
        const data=res.data
        cascaData.category_chains=data.category_chains
        cascaData.knowledge_map_details=data.knowledge_map_details
        formState.purpose=data.used_by
        formState.difficulty=data.difficulty
        // 目录回显
        formState.catalogue=cascadeEcho(data.category_chains)
        formState.knowledgePoints=cascadeEcho(data.knowledge_map_details)
        formState.stem=data.question
        formState.judgeAnswer=data.judge_correct
        formState.topicAnalysis=data.question_analysis
        // 答案选项
        formState.multipleQuesSelection=[]
        data.choice_options.forEach((item:any)=>{
          formState.multipleQuesSelection.push({value:item.content,ifAnswer:data.choice_correct_options.includes(item.origin_option)},)
        })
      }
    })
}
//判断
function getJudgeData(){
   http.judgeDetail({urlParams:{questionId:editId}}).then((res:any)=>{
      if(res.code==1){
      const data=res.data
      cascaData.category_chains=data.category_chains
      cascaData.knowledge_map_details=data.knowledge_map_details
      formState.purpose=data.used_by
      formState.difficulty=data.difficulty
      formState.catalogue=cascadeEcho(data.category_chains)
      formState.knowledgePoints=cascadeEcho(data.knowledge_map_details)
      formState.stem=data.question
      formState.judgeAnswer=data.judge_correct
      formState.topicAnalysis=data.question_analysis
      }
    })
}
//填空
function getCompleData(){
   http.complateDetail({urlParams:{questionId:editId}}).then((res:any)=>{
      if(res.code==1){
        const data=res.data
        cascaData.category_chains=data.category_chains
        cascaData.knowledge_map_details=data.knowledge_map_detials
        formState.purpose=data.used_by
        formState.difficulty=data.difficulty
        formState.catalogue=cascadeEcho(data.category_chains)
        formState.knowledgePoints=cascadeEcho(data.knowledge_map_detials)
        formState.stem=data.question
        formState.topicAnalysis=data.question_analysis
        formState.multipleQuesSelection=[]
        data.blank_correct.forEach((item:any,index:any)=> {
          formState.multipleQuesSelection.push({value:item,ifAnswer:false})
        });
      }
    })
}
//解答
function getSolutionData(){
   http.solutionDetail({urlParams:{questionId:editId}}).then((res:any)=>{
      if(res.code==1){
          const data=res.data
        cascaData.category_chains=data.category_chains
        cascaData.knowledge_map_details=data.knowledge_map_details
        formState.purpose=data.used_by
        formState.difficulty=data.difficulty
        formState.catalogue=cascadeEcho(data.category_chains)
        formState.knowledgePoints=cascadeEcho(data.knowledge_map_details)
        formState.stem=data.question
        formState.topicAnalysis=data.question_question_analysis
        formState.keyword=data.short_answer_keys
        formState.referenceAnswer=data.short_answer_reference
      }
    })
}
// 编辑选择
function editChoice(){
  const choiceOptions:any=[];
  const choiceCorrectOptions:any=[]
  formState.multipleQuesSelection.forEach((item:any,index:any)=>{
    choiceOptions.push({content:item.value,originOption:selectLabels.value[index]})
    if(item.ifAnswer==true){
      choiceCorrectOptions.push(selectLabels.value[index])
    }
  })
  if(choiceCorrectOptions.length==0){
    message.warning('答案不能为空！')
    return
  }
  const params={
    question:formState.stem,
    difficulty:formState.difficulty,
    categoryId:doEditSubmit(formState.catalogue,cascaData.category_chains),
    // knowledgeIds:doEditSubmit(formState.knowledgePoints,cascaData.knowledge_map_details),
    knowledgeMapIds:doEditSubmit(formState.knowledgePoints,cascaData.knowledge_map_details),
    // // categoryId:215,
    // knowledgeIds:[1],
    questionAnalysis:formState.topicAnalysis,
    choiceOptions:choiceOptions,
    choiceCorrectOptions:choiceCorrectOptions,
    usedBy:formState.purpose,
    // @ts-ignore
    question_html: renderMarkdown(true, formState.stem), // 题干对应的html
  }
  loading.value=true
  http.editChoice({param:params,urlParams:{questionId:editId}}).then((res:any)=>{
    loading.value=false
    if(res.code==1){
      message.success('编辑成功！')
      router.go(-1);
    }
  }).catch((err:any)=>{
    loading.value=false
  })
}
function editJudge(){
   const params={
      usedBy:formState.purpose,
      difficulty:formState.difficulty,
      categoryId:doEditSubmit(formState.catalogue,cascaData.category_chains),
      knowledgeMapIds:doEditSubmit(formState.knowledgePoints,cascaData.knowledge_map_details),
      question:formState.stem, 
      judgeCorrect:formState.judgeAnswer,
      questionAnalysis:formState.topicAnalysis,
      // @ts-ignore
      question_html: renderMarkdown(true, formState.stem), // 题干对应的html
    }
    loading.value=true
    http.editJudge({param:params,urlParams:{questionId:editId}}).then((res:any)=>{
      loading.value=false
      if(res.code==1){
        message.success('编辑成功！')
          router.go(-1);
      }
    }).catch((err:any)=>{
       loading.value=false
    })
}
function editComple(){
   let blankCorrect:any=[]
   console.log(formState.multipleQuesSelection,'formState.multipleQuesSelection')
   formState.multipleQuesSelection.forEach((item:any,index:any)=>{
     console.log('哈哈哈',item)
    blankCorrect.push(item.value)
  })
  console.log(blankCorrect,'blankCorrect')
  const params={
      usedBy:formState.purpose,
      difficulty:formState.difficulty,
      categoryId:doEditSubmit(formState.catalogue,cascaData.category_chains),
      knowledgeMapIds:doEditSubmit(formState.knowledgePoints,cascaData.knowledge_map_details),
      question:formState.stem, 
      blankCorrect:blankCorrect,
      questionAnalysis:formState.topicAnalysis,
      // @ts-ignore
      question_html: renderMarkdown(true, formState.stem), // 题干对应的html
    }
  loading.value=true
  http.editComplate({param:params,urlParams:{questionId:editId}}).then((res:any)=>{
    loading.value=false
     if(res.code==1){
        message.success('编辑成功！')
         router.go(-1);
      }
  }).catch((err:any)=>{
     loading.value=false
  })
}
function editSolution(){
   const params={
      usedBy:formState.purpose,
      difficulty:formState.difficulty,
      categoryId:doEditSubmit(formState.catalogue,cascaData.category_chains),
      knowledgeMapIds:doEditSubmit(formState.knowledgePoints,cascaData.knowledge_map_details),
      question:formState.stem, 
      shortAnswerReference:formState.referenceAnswer,//参考答案
      shortAnswerKeys:formState.keyword,
      questionAnalysis:formState.topicAnalysis,
      // @ts-ignore
      question_html: renderMarkdown(true, formState.stem), // 题干对应的html
    }
    loading.value=true
    http.editSolution({param:params,urlParams:{questionId:editId}}).then((res:any)=>{
      loading.value=false
       if(res.code==1){
        message.success('编辑成功！')
         router.go(-1);
      }
    }).catch((err:any)=>{
       loading.value=false
    })
}
onMounted(()=>{
  if(editId){
     switch(type.value){
        case "1":
        getChoiceData();
        break;
        case '2':
        getJudgeData();
        break;
         case '3':
        getCompleData();
        break;
         case '4':
        getSolutionData();
        break;
      }
  }
})
</script>
<style lang="less" scoped>
.create_ques {
  background-color: var(--white-100);
  padding: 20px 150px;
  box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 16%);
  min-height: 750px;
}
.bottom_btn {
  display: flex;
  justify-content: center;
}
:deep(.ant-col-21) {
  max-width: 100%;
}
.tiptit{
  font-size: 12px;
  margin-left: 10px;
  color:var(--black-45);
}
:deep(.mark__container){
  border:1px solid var(--gray-5) !important;
}
</style>