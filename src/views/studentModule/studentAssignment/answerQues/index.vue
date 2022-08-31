<template>
  <div class="answerQues">
    <div class="answerQuesCom">
      <div class="list">
        <Outline
          :title="headerObj.title"
          :explain="headerObj.explain"
          :explainText="headerObj.explainText"
        />
        <TopicDisplay 
        :list="questionsList" 
        :purpose="purpose === 'IsStuAnswer' ? 'IsStuAnswer' : 'achievement'" 
        :loading="listLoading"
        @EndOfAnswer="EndOfAnswer"
         />
      </div>
      <div v-if="purpose === 'IsStuAnswer'" class="answer_list">
        <submit-answer
          :showCountDown="name === '考试' ? true : false"
          :dataList="questionsList"
          :typeName="name === '考试' ? '试卷' : '作业'"
          @submitComplete="submitComplete"
          @EndOfAnswer="EndOfAnswer"
        ></submit-answer>
      </div>
      <div v-else>
        <ScoreRanking :info="ExamResultData" />
      </div>
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
import request from "src/api/index";
import { Modal, message } from "ant-design-vue";
import answerQuesCom from "../answerQuesCom/index.vue";
import TopicDisplay from "src/components/TopicDisplay/index.vue";
import Outline from "src/components/TopicDisplay/outline.vue";
import ScoreRanking from "src/components/scoreRanking/index.vue";
import submitAnswer from "src/components/submitAnswer/index.vue";
import { IBusinessResp } from "src/typings/fetch.d";
const http = (request as any).teacherExamination;
const httpStu = (request as any).studentExamination;
const route = useRoute();
const router = useRouter();
const { id,purpose,name,examResultId } = route.query;
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    {
      name:
       purpose == "achievement"
          ? "查看成绩"
          : route.query.name == "作业"
          ? "作业答题"
          : "开始考试",
      componenttype: 0,
    },
  ],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const headerObj: any = reactive({
  title: "",
  explain: "考试说明",
  explainText:"",
});
const questionsList:any=reactive([])
var listLoading:Ref<boolean> = ref(false);
const getExamDetail = () => {  // http  httpStu resultId:id    ID: id
  listLoading.value=true
  httpStu.examDetail({urlParams:{ID: examResultId}}).then((res:IBusinessResp) => {
    questionsList.length=0
    const {data}=res
    headerObj.title=data.name
    // headerObj.explain=data.note
    headerObj.explainText=data.note
    let question_list=data.question_list
    Object.keys(question_list).map((v:any)=>{
      let obj={
        type:v,
        question:question_list[v]
      }
      questionsList.push(obj)
    })
    questionsList.map((v:any)=>{
      v.question.map((i:any)=>{
        if(i.submit_answer){ // i.submit_answer getTopicType[i.kind]['answerformat']
          i.answer=i.submit_answer
        }
      })
    })
    listLoading.value=false
  }).catch((err:any)=>{listLoading.value=false})
}
const ExamResultData:any=reactive({})
const getExamResult = () => {
  listLoading.value=true
  http.examResult({urlParams:{examResultId: examResultId}}).then((res:IBusinessResp) => {  // examResult
    questionsList.length=0
    const {data}=res
    headerObj.title=data.name
    // headerObj.explain=data.note  question_list
    headerObj.explainText=data.note
    let question_list=data.question_list
    Object.keys(question_list).map((v:any)=>{
      let obj={
        type:v,
        question:question_list[v]
      }
      questionsList.push(obj)
    })
    questionsList.map((v:any)=>{
      v.question.map((i:any)=>{
        if(i.submit_answer){ // i.submit_answer getTopicType[i.kind]['answerformat']
          i.answer=i.submit_answer
        }
        i.submitScore=i.score
        i.score=i.question_score
      })
    })
    Object.assign(ExamResultData,data)
    console.log(questionsList);
    console.log(ExamResultData);
    listLoading.value=false
  }).catch((err:any)=>{listLoading.value=false})
}
const submitComplete=()=>{
  message.success("提交成功");
  // setTimeout(()=>{
  //   router.go(-1)
  // },0.5)
  EndOfAnswer()
}
const EndOfAnswer=()=>{
  setTimeout(()=>{
    router.go(-1)
  },0.5)
}

const startExam = () => {
  // 考试作业前调用
  httpStu.startExam({urlParams:{examResultId:examResultId}}).then((res:IBusinessResp)=>{

  })
}
onMounted(()=>{
  // console.log(purpose)
  if(purpose==="achievement"){
    getExamResult()
  }else{
    getExamDetail()
  }
  
})
</script>
<style lang="less" scoped>
.answerQues {
  // display: flex;
  .answerQuesCom {
    display: flex;
    justify-content: space-between;
    .list{
      flex: 1;
      margin-right: 12px;
    }
  }
}
</style>