<template>
  <h3 class="relevantExpertTit">相关实验</h3>
  <div class="relevant">
    <div class="item" v-for="v in list" :key="v.name">
      <div class="text" @click="Detail(v)">{{v.content_name}}</div>
      <div class="number">{{v.learned}}人学过</div>
    </div>
    <Empty v-if="!list.length" :text="'暂无推荐'" type="tableEmpty" />
  </div>

</template>

<script lang="ts" setup>
import { Modal, message } from "ant-design-vue";
import { ref, toRefs, onMounted ,Ref,reactive} from "vue";
import extStorage from "src/utils/extStorage";
import { useRoute ,useRouter} from "vue-router";
import request from 'src/api/index'
const route = useRoute();
const router = useRouter();
const { lStorage } = extStorage;
const { currentTab } = route.query;
const role = Number(lStorage.get("role"));
const http=(request as any).teachCourse
interface Props {
  courseId: number;
}
const props = withDefaults(defineProps<Props>(), {
  courseId: 0,  
});
var list:any=reactive([])
const courseExperimentRecommend=()=>{
  list.length=0
  http.courseExperimentRecommend({urlParams: {courseId:props.courseId}}).then((res: any) => {
    const {data}=res
    list.push(...data)
    // console.log(data)
  });
}
// /teacher/teacherExperimentResourcePool/experimentDetail?id=500043&currentTab=0
const Detail=(val:any)=>{
  if(!val.is_authorize){
    message.success('该实验未授权，暂不能查看！')
    return
  }
  var obj={
    3:'/teacher/teacherCourse/CourseExperimentDetail',
    4:'/student/studentCourse/StuCourseExperimentDetail',
    5:'/teacher/teacherCourse/CourseExperimentDetail'
  }
  if(!obj[role]){
    message.success('权限错误')
    return
  }
  router.push({
    path:obj[role],
    query:{
      id:val.id,
      currentTab:0,
      type: 'recommend'
    }
  })
}
onMounted(() => {
  courseExperimentRecommend()
});
</script>

<style lang="less" scope>
  .relevantExpertTit{
    // margin-bottom: 1rem;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #dcdcdc;
    // color: var(--blue-6-2);
  }
  .relevant{
    .item{
      margin-bottom: 1rem;
      .text{
        color: var(--primary-color);
        letter-spacing: 0.34px;
        cursor:pointer;
      }
      .number{
        color: var(--black-45);
      }
    }
    .no-data{
      background-color: transparent;
    }
  }
</style>