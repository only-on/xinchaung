<template>
  <h3 class="relevantExpertTit">相关实验</h3>
  <div class="relevant">
    <div class="item" v-for="v in list" :key="v.name">
      <div class="text" @click="Detail(v)">{{v.content_name}}</div>
      <div class="number">{{v.learned}}人学过</div>
    </div>
    <Empty v-if="!list.length" :text="'暂无推荐'" />
  </div>

</template>

<script lang="ts" setup>
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
  router.push({
    path:'/teacher/teacherExperimentResourcePool/experimentDetail',
    query:{
      id:val.content_id,
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