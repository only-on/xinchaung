<template>
  <h3 class="courseH3">相关实验</h3>
  <div class="relevant">
    <div class="item" v-for="v in list" :key="v.name">
      <div class="text">{{v.name}}</div>
      <div class="number">{{v.learend_count}}</div>
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
const list:any=reactive([])
const courseExperimentRecommend=()=>{
  list.length=0
  http.courseExperimentRecommend({urlParams: {courseId:props.courseId}}).then((res: any) => {
    const {data}=res.data
    list.push(...data)
  });
}
onMounted(() => {
  // if(Number(currentTab) === 1){
    courseExperimentRecommend()
  // }
});
</script>

<style lang="less" scope>
  .courseH3{
    margin-bottom: 1rem;
    // color: var(--blue-6-2);
  }
  .relevant{
    .item{
      margin-bottom: 1rem;
      .text{
        color: var(--primary-color);
        letter-spacing: 0.34px;
      }
      .number{
        color: var(--black-45);
      }
    }
  }
</style>