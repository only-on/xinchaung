<template>
  <div class="courseContent">
    <div class="leftContent content">
      <div class="introduceBox">
        <h3 class="courseH3">课程简介</h3>
        <div class="introduce">{{props.courseDetail.introduce}}</div>
      </div>
      <SetupChapter :Editable="getPower()" :courseId="Number(courseId)" />
    </div>
    <!-- rightContent 公开课详情 和学生端详情  v-if="role === 4 || (currentTab === '1' && role === 3)"     -->
    <div class="rightContent">
      <Ranking v-if="role === 4" :courseId="Number(courseId)" />
      <graph :courseId="Number(courseId)" />
      <relevantExpert :courseId="Number(courseId)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,reactive,nextTick} from "vue";
import { useRoute ,useRouter} from "vue-router";
import request from 'src/api/index'
import ExperimentsAndMaterials from 'src/components/SelectDocOrMp4/ExperimentsAndMaterials.vue'
import Submit from "src/components/submit/index.vue";
import Ranking from 'src/views/teacherModule/teachCourse/courseDetail/components/Chapter/Ranking.vue'
import graph from 'src/views/teacherModule/teachCourse/courseDetail/components/Chapter/graph.vue'
import relevantExpert from 'src/views/teacherModule/teachCourse/courseDetail/components/Chapter/relevantExpert.vue'
import ChapterList from 'src/views/teacherModule/teachCourse/courseDetail/components/Chapter/ChapterList.vue'  // 
import extStorage from "src/utils/extStorage";
import { Modal, message } from "ant-design-vue";
import SetupChapter from 'src/views/teacherModule/teachCourse/courseDetail/components/Chapter/SetupChapter.vue'
const env = process.env.NODE_ENV == "development" ? true : false;
const detailInfoUrl='/professor/classic/video/112/22/1523425771.mp4'
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
const route = useRoute();
const router = useRouter();
const { currentTab,courseId,state,is_authorizedText } = route.query;
const http=(request as any).studentCourse
const rules = {
  name: [
    { required: true, message: `请输入名称`, trigger: "blur" },
    { max: 30, message: `名称最多30个字符`, trigger: "blur" },
  ],
}
interface Props {
  courseDetail:any
}
const props = withDefaults(defineProps<Props>(), {
  
  courseDetail: ()=> {},      // 
});
const getPower=()=>{
  let str=''
  // :Editable="Number(state)===3?'canStudy':'noStudy'"
  if(Number(state)===3){
    str='canStudy'
  }else{
    str='noStudy'
  }
  if(is_authorizedText === 'Unauthorized'){
    str='readOnly'
  }
  return str
}
const initData = () => {
  return
  // const param = currentTab.value ? Object.assign({}, {...searchInfo}, {myexper: true}) : Object.assign({}, {...searchInfo})
  // const param: ISearchInfo = Object.assign({}, {...searchInfo})
  // loading.value = true;
  // courseList.length = 0
  // http.getExperimentList({param}).then((res: IBusinessResp) => {
  //   loading.value = false
  //   if (!res) return
  //   const { list, page }  = res.data
  //   list.forEach((v: any) => {
  //     // v.type_obj = Object.assign({}, getTypeList('90deg')[v.task_type]);
  //   });
  //   courseList.push(...list)
  //   totalCount.value = page.totalCount
  // })
};

onMounted(() => {

});
</script>

<style lang="less" scope>
 .courseH3{
    margin-bottom: 1rem;
    // color: var(--blue-6-2);
  }
  .courseContent{
    width: var(--center-width);
    margin: 0 auto;
  }
  .courseContent{
    width: var(--center-width);
    margin: 0 auto;
    display: flex;
    
    .content{
      padding: 20px;
    }
    .leftContent{
      background-color: #fff;
      // width: 70%;
      flex: 1;
      padding-top: 40px;
      .introduceBox{
        
      }
      .introduce{
        font-weight: 400;
        color: var(--black-65);
        line-height: 24px;
        margin-bottom: 2rem;
      }
      
    }
    .rightContent{
      // width: 30%;
      width: 240px;
      margin-bottom: 2rem;
      margin-left: 50px;
      padding-top: 20px;
      
      
      
    }
  }
  .modal-post{
    #KnowledgePoints{
      height: 600px;
      width: 100%;
      padding: 40px;
    }
  }
</style>