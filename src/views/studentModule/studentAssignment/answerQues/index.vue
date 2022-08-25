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
        :loading="listLoading" />
      </div>
      <div v-if="purpose === 'IsStuAnswer'" class="answer_list">
        <submit-answer
          :showCountDown="name === '考试' ? true : false"
          :dataList="questionsList"
          :typeName="name === '考试' ? '试卷' : '作业'"
          @submitComplete="submitComplete"
        ></submit-answer>
      </div>
      <div v-else>
        <score-ranking></score-ranking>
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
import scoreRanking from "src/components/scoreRanking/index.vue";
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
  httpStu.examDetail({urlParams:{ID: id}}).then((res:IBusinessResp) => {
    questionsList.length=0
    const {data}=res
    headerObj.title=data.name
    // headerObj.explain=data.note
    headerObj.explainText=data.note
    let questions_info=data.questions_info
    Object.keys(questions_info).map((v:any)=>{
      let obj={
        type:v,
        question:questions_info[v]
      }
      questionsList.push(obj)
    })
    // questionsList.map(()=>{

    // })
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
    console.log(questionsList);
    listLoading.value=false
  }).catch((err:any)=>{listLoading.value=false})
}
const submitComplete=()=>{
  message.success("提交成功");
  router.go(-1)
}
onMounted(()=>{
  console.log(purpose)
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