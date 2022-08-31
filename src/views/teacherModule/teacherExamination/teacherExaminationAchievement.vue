<template>
  <div class="teacherExaminationAchievement">
    <div class="achievementLeft">
        <Outline :title="headerObj.title" :explain="headerObj.explain" :explainText="headerObj.explainText" />
        <TopicDisplay :purpose="'achievement'" :list="questionsList" :loading="listLoading" @updateList="getExamDetail()" />
    </div>
    <div class="achievementRight">
        <ScoreRanking :info="ExamResultData" />
        <div class="caozuo flexCenter" v-if="ExamResultData.pre_next">
          <!-- {{ExamResultData.pre_next}} -->
          <a-button  type="primary" @click="Replacement(ExamResultData.pre_next[0])" :disabled="ExamResultData.pre_next[0]?false:true"> 上一人 </a-button>
          <a-button  type="primary" @click="Replacement(ExamResultData.pre_next[1])" :disabled="ExamResultData.pre_next[1]?false:true"> 下一人 </a-button>
        </div>
        <div class="ViolationRecord">
          <div class="title">违规记录</div>
          <div class="itemBox textScrollbar">
            <div class="item" v-for="(v,k) in 12">
              <div class="time">2022/07/19 14:00:32</div>
              <a-tooltip placement="top">
                <template #title>
                  <span>异常行为概述文字显示在这里异常行为概述文字显示在这里</span>
                </template>
                <div class="text single_ellipsis">异常行为概述文字显示在这里异常行为概述文字显示在这里</div>
              </a-tooltip>
              <!-- <div class="text single_ellipsis">异常行为概述文字显示在这里异常行为概述文字显示在这里</div> -->
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  withDefaults,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import TopicDisplay from 'src/components/TopicDisplay/index.vue'
import Outline from 'src/components/TopicDisplay/outline.vue'
import ScoreRanking from 'src/components/scoreRanking/index.vue'
const router = useRouter();
const route = useRoute();
const { id } = route.query;
const http = (request as any).teacherExamination;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "成绩详情", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
// interface Props {
//   defaultConfig: any;
//   imageList:string
// }
// const props = withDefaults(defineProps<Props>(), {
//   defaultConfig: () => {},
//   imageList:'',
// });

// const emit = defineEmits<{
//   (e: "selectedImage", val: any): void;
// }>();
const headerObj:any=reactive({
  title:'',
  explain:'考试说明',
  explainText:'',
})
const questionsList:any=reactive([])
var listLoading:Ref<boolean> = ref(false);
const ExamResultData:any=reactive({})
const curId:Ref<number> = ref(0);
const getExamDetail = () => {
  listLoading.value=true
  http.examResult({urlParams:{examResultId: curId.value}}).then((res:IBusinessResp) => {  // examResult
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
    // console.log(ExamResultData.pre_next);
    listLoading.value=false
  }).catch((err:any)=>{listLoading.value=false})
}
const Replacement= (id:number)=>{
  router.replace({
    path:'/teacher/teacherExamination/teacherExaminationAchievement',
    query:{
      id:id,
    }
  })
  curId.value=id
  getExamDetail()
}
onMounted(()=>{
  curId.value=Number(id)
  getExamDetail()
})
</script>
<style scoped lang="less">
    .teacherExaminationAchievement{
        display: flex;
        justify-content: space-between;
        .achievementLeft{
            // width: 914px;
            margin-right: 12px;
            flex: 1;
        }
        .achievementRight{
            // width: 240px;
          .caozuo{
            margin-top: 20px;
            justify-content: space-between;
          }
        }
    }
    .ViolationRecord{
      margin-top: 40px;
      width: 270px;
      background-color: var(--white);
      .title{
        text-align: center;
        padding: 15px 0;
        border-bottom: 1px solid rgba(0,0,0,0.15);
      }
      .itemBox{
        padding:16px;
        height: 650px;
        overflow-y: auto;
        .item{
          margin-bottom: 20px;
          .time{
            font-size: 12px;
            color:var(--black-45);
          }
          .text{
            // font-size: 14px;
          }
        }
      }
    }
</style>
