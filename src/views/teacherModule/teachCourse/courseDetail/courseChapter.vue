<template>
  <div class="courseContent">
    <div class="leftContent content">
      <div class="introduceBox">
        <h3 class="courseH3">课程简介</h3>
        <div class="introduce">{{props.courseDetail.introduce}}</div>
      </div>
      <SetupChapter :Editable="getPower()" :courseId="Number(courseId)" @feedback="feedback" />
    </div>
    <div class="rightContent" v-if="role === 4 || (currentTab === '1' && [3,5].includes(role)) || role===2">
      <Ranking :courseId="Number(courseId)"  v-if="role === 4"/>
      <graph :courseId="Number(courseId)" />
      <relevantExpert :courseId="Number(courseId)" v-if="role !== 2" />
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
const { currentTab,courseId,is_authorizedText } = route.query;
const http=(request as any).teachCourse
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
console.log(props.courseDetail);
const emit = defineEmits<{
  (e: "feedback", val: any): void;
}>();
const feedback=(val:any)=>{
  emit('feedback',val)
}
const getPower=()=>{
  let str=''
  if(role===2){
    str='readOnly'
  }
  if(currentTab === '0' && [3,5].includes(role)){
    str='canEdit'
  }
  if((currentTab === '1' && [3,5].includes(role)) || role===4){
    str='canStudy'
  }
  if(is_authorizedText === 'Unauthorized'){
    str='readOnly'
  }
  console.log(str);
  return str
}
onMounted(() => {

});
</script>

<style lang="less" scope>
 .courseH3{
    margin-bottom: 8px;
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
      // padding: 20px;
    }
    .leftContent{
      // background-color: #fff;
      // width: 70%;
      flex: 1;
      // padding-top: 40px;
      .introduceBox{
        background-color: #fff;
        padding: 20px;
        margin-bottom: 24px;
      }
      .introduce{
        font-weight: 400;
        color: var(--black-65);
        line-height: 24px;
        // margin-bottom: 2rem;
      }
      
    }
    .rightContent{
      // width: 30%;
      width: 240px;
      margin-bottom: 2rem;
      margin-left: 50px;
      // padding-top: 20px;
    }
  }
</style>