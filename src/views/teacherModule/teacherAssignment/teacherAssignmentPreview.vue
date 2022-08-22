<template>
  <div class="teacherAssignmentPreview">
    <Outline :title="headerObj.title" :explain="headerObj.explain" :explainText="headerObj.explainText" />
    <TopicDisplay :list="questionsList" :purpose="'IsPreview'" :loading="listLoading" />
  </div>
  <div class="teacherAssignmentPreviewFooter">
    <div class="flexCenter">
      <Submit :okText="'编辑作业'" :cancelText="'返回'" @submit="edit" @cancel="cancel"></Submit>
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
import Submit from "src/components/submit/index.vue";
const router = useRouter();
const route = useRoute();
const { id } = route.query;
const http = (request as any).teacherAssignment;
// const http = (request as any).teacherExamination;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "作业预览", componenttype: 0 }],
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
  explain:'作业说明',
  explainText:'',
})
const cancel=()=>{
  // router.go(-1)
  router.replace('/teacher/teacherAssignment')
}
const edit=()=>{
  router.push({
    path:'/teacher/teacherAssignment/teacherAssignmentEdit',
    query:{id:id}
  })
}
const questionsList:any=reactive([])
var listLoading:Ref<boolean> = ref(false);
const getExamDetail = () => {
  listLoading.value=true
  http.assignmentDetail({urlParams:{ID: id}}).then((res:IBusinessResp) => {
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
    listLoading.value=false
  }).catch((err:any)=>{listLoading.value=false})
}
onMounted(()=>{
  getExamDetail()
})
</script>
<style scoped lang="less">
.teacherAssignmentPreview{
  padding: 32px 40px;
  // background-color: #fff;
}
.teacherAssignmentPreviewFooter{
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
