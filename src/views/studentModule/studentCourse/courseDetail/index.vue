<template>
  <DetailHeader :info="state.courseDetail" :tabs="studentDetailTabs" :activeTabOrder="studentDetailTab?1:0" @selectTab="selectTab" />
  <div class="tab-course-content">
    <!-- 每个tab对应的组件 -->
    <!--课程章节-->
    <courseChapter v-if="state.activeTab.value === 'courseChapter'" :courseDetail="state.courseDetail" />
    <!-- 课程成绩 -->
    <courseAchievement v-if="state.activeTab.value=='courseAchievement'" />
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
import { Modal, message } from "ant-design-vue";
import storage from "src/utils/extStorage";
import { useRoute ,useRouter} from "vue-router";
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { toVmConnect, IEnvirmentsParam } from "src/utils/vncInspect";
import DetailHeader from 'src/views/teacherModule/teachCourse/component/common/DetailHeader.vue' 

// 内容去tab
import courseChapter from "./courseChapter.vue"   // 课程章节
import courseAchievement from "./courseAchievement.vue" // 课程成绩
import moment, { Moment } from 'moment';
interface IState{
  activeTab:any
  courseDetail:any
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
const http=(request as any).studentCourse
const role = Number(storage.lStorage.get("role"));
const routeQuery = useRoute().query;
const { currentTab,courseId ,course_student_id,studentDetailTab} = route.query;
const  studentDetailTabs=[
  {name:'课程内容',value:'courseChapter'},
  {name:'课程成绩',value:'courseAchievement'},
]
var state:IState=reactive({
  activeTab:{},
  courseDetail:{}
})
function initData(){
  http.courseDetail({urlParams:{courseId:course_student_id}}).then((res:IBusinessResp)=>{
    state.courseDetail=res.data
  })
}
const selectTab=(val:any)=>{
  // console.log(val)
  state.activeTab={...val}
}

onMounted(() => {
  // console.log(course_student_id)
  initData()
});

</script>

<style lang="less" scoped>
 
  .tab-course-content{
    width: var(--center-width);
    margin: 24.5px auto;
  }
  .editVisible{
    .info{
      display: flex;
      justify-content: space-around;
      .left,.right{
        width: 40%;
      }
    }
  }
  .setupVisible{
    .tips{
      padding: 0 1rem;
      font-size: 12px;
      background: linear-gradient(90deg,rgba(0,0,0,0.04), rgba(84,84,84,0.04));
    }
    .box{
      padding:1rem;
      .item{
        height: 44px;
        justify-content: space-between;
      }
      .report {
        line-height: 44px;
        .type{
          color: var(--brightBtn);
        }
      }
    }
  }
</style>
