<template>
  <div class="courseContent">
    <div class="leftContent content">
      <h3 class="courseH3">课程简介</h3>
      <div class="introduce">Wiki是一种在网络上开放且可供多人协同创作的超文本系统，由美国人沃德·坎宁安于1995年首先开发，这种超文本系统支持面向社群的协作式写作，同时也包括一组支持这种写作。沃德·坎宁安将wiki定义为“一种允许一群用户用简单的描述来创建和连接一组网页的社会计算系统”。 [1] Wiki站点可以有多人（甚至任何访问者）维护，每个人都可以发表自己的意见。</div>
      <SetupChapter :Editable="(currentTab === '0' && role === 3)?'canEdit':'canStudy'" :courseId="500002" />
    </div>
    <!-- rightContent 公开课详情 和学生端详情  v-if="role === 4 || (currentTab === '1' && role === 3)"     -->
    <div class="rightContent" v-if="role === 4 || (currentTab === '1' && role === 3)">
      <Ranking v-if="role === 4" :rank="[]"></Ranking>
      <graph :knowledge="[]" :words="[]"></graph>
      <relevantExpert :list="[]"></relevantExpert>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,reactive,nextTick} from "vue";
import { useRoute ,useRouter} from "vue-router";
import request from 'src/api/index'
import ExperimentsAndMaterials from 'src/components/SelectDocOrMp4/ExperimentsAndMaterials.vue'
import Submit from "src/components/submit/index.vue";
import Ranking from './components/Chapter/Ranking.vue'
import graph from './components/Chapter/graph.vue'
import relevantExpert from './components/Chapter/relevantExpert.vue'
import ChapterList from './components/Chapter/ChapterList.vue'
import extStorage from "src/utils/extStorage";
import { Modal, message } from "ant-design-vue";
import SetupChapter from './components/Chapter/SetupChapter.vue'
const env = process.env.NODE_ENV == "development" ? true : false;
const detailInfoUrl='/professor/classic/video/112/22/1523425771.mp4'
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
const route = useRoute();
const router = useRouter();
const { currentTab,course_id } = route.query;
const http=(request as any).teachCourse
const rules = {
  name: [
    { required: true, message: `请输入名称`, trigger: "blur" },
    { max: 30, message: `名称最多30个字符`, trigger: "blur" },
  ],
}
interface Props {
  courseDetail?:any
}
const props = withDefaults(defineProps<Props>(), {
  
  courseDetail: ()=> {},      // 
});
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
  // 获取课程详情
  //  获取章节树
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
      // width: 70%;
      flex: 1;
      padding-top: 40px;
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