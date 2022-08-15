<template>
  <div class="teacherExaminationPreview">
    <Outline :title="headerObj.title" :explain="headerObj.explain" :explainText="headerObj.explainText" />
    <TopicDisplay :list="questionsList" :purpose="'IsPreview'" />
  </div>
  <div class="teacherExaminationPreviewFooter">
    <div class="flexCenter">
      <Submit :okText="'编辑试卷'" :cancelText="'返回'" @submit="edit" @cancel="cancel"></Submit>
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
import Submit from "src/components/submit/index.vue";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import TopicDisplay from 'src/components/TopicDisplay/index.vue'
import Outline from 'src/components/TopicDisplay/outline.vue'
const router = useRouter();
const route = useRoute();
const { id } = route.query;
const http = (request as any).teacherExamination;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "试卷预览", componenttype: 0 }],
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
  title:'单元测验-《大学计算机基础第3版》第3、4章（一）-计算思维、数值与字符编码',
  explain:'考试说明',
  explainText:'交互设计本质上就是设计产品的使用方式的过程，账号怎么填写；表单怎么导出；数据怎么筛选；列表怎么排序等等。针对每个功能的使用方式，都可以花很长的时间去考虑其合理性。一个项目的交互，就是这个项目所有功能使用方式的总和。',
})
const cancel=()=>{
  // router.go(-1)
  router.replace('/teacher/teacherExamination')
}
const edit=()=>{
  //     <!-- achievement IsEdit teacherExaminationAchievement     teacherExaminationEdit-->
  router.push({
    path:'/teacher/teacherExamination/teacherExaminationEdit',
    query:{id:id}
  })
}
const questionsList:any=reactive([])
const getExamDetail = () => {
  http.examDetail({urlParams:{ID: id}}).then((res:IBusinessResp) => {
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
  })
}
onMounted(()=>{
  getExamDetail()
})
</script>
<style scoped lang="less">
.teacherExaminationPreview{
  padding: 32px 40px;
}
.teacherExaminationPreviewFooter{
  position: fixed;
  bottom: 0;
  height: 70px;
  background: #fafafb;
  width: 100%;
  .flexCenter{
    height: 100%;
    justify-content: center;
  }
}
</style>
