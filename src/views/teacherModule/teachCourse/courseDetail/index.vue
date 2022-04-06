<template>
  <DetailHeader :info="{}" :tabs="Number(currentTab)===0?detailTabs:[]" @selectTab="selectTab" />
  <div class="tab-course-content">
    <!-- 每个tab对应的组件 -->
    <!--课程章节-->
    <courseChapter v-if="state.activeTab.value === 'courseChapter'" />
    <!-- 课程实验管理 -->
    <courseExperiment v-if="state.activeTab.value=='courseExperiment'" />
    <!-- 随堂测试 -->
    <popQuiz v-if="state.activeTab.value=='popQuiz'" />
    <!-- 成绩评阅 -->
    <performanceReview v-if="state.activeTab.value=='performanceReview'" />
    <!-- 学情分析 -->
    <studentAnalysis v-if="state.activeTab.value=='studentAnalysis'" />
    <!-- 成员管理 -->
    <memberManagement v-if="state.activeTab.value=='memberManagement'" />

  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  toRefs,
  nextTick,
  provide,
  Ref,
  ref,
  watch,
  onBeforeUnmount,
} from "vue";
import storage from "src/utils/extStorage";
import { useRoute ,useRouter} from "vue-router";
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { toVmConnect, IEnvirmentsParam } from "src/utils/vncInspect";
import PdfVue from "src/components/pdf/pdf.vue"
import DetailHeader from '../component/common/DetailHeader.vue'

// 内容去tab
import courseChapter from "./courseChapter.vue"   // 课程章节
import courseExperiment from "./courseExperiment.vue" // 课程实验
import popQuiz from "./popQuiz.vue" // 随堂测试
import performanceReview from "./performanceReview.vue" // 成绩评阅
import studentAnalysis from "./studentAnalysis.vue" // 学情分析
import memberManagement from "./memberManagement.vue" // 成员管理

interface IState{
  activeTab:any
}
var updata = inject("updataNav") as Function;
updata({
  tabs: [],
  showContent: false,
  componenttype: undefined,
  showNav: false,
});
const route = useRoute();
const router = useRouter();
const http=(request as any).teachCourse
const currentRole: number = storage.lStorage.get("role");
const routeQuery = useRoute().query;
const { currentTab,course_id } = route.query;
const detailTabs=[
  {name:'课程章节',value:'courseChapter'},
  {name:'课程实验管理',value:'courseExperiment'},
  {name:'随堂测试',value:'popQuiz'},
  {name:'成绩评阅',value:'performanceReview'},
  {name:'学情分析',value:'studentAnalysis'},
  {name:'成员管理',value:'memberManagement'},]
var state:IState=reactive({
  activeTab:{}
})
state.activeTab=detailTabs[0]
function initData(){
  http.courseDetail().then((res:IBusinessResp)=>{

  })
}
const selectTab=(val:any)=>{
  console.log(val)
  state.activeTab={...val}
}
onMounted(() => {
  // initData() HotWords
});

</script>

<style lang="less" scoped>
 
  .tab-course-content{
    width: var(--center-width);
    margin: 24.5px auto;
  }
</style>
