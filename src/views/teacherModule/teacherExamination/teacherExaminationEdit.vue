<template>
  <div class="teacherExaminationEdit">
    <BasicInfo @edit="EditBaseFn()" :name="headerObj.name" :time="headerObj.time" :explainText="headerObj.explainText" />
    <TopicDisplay :list="questionsList" 
      :loading="listLoading"
      :purpose="'IsEdit'" 
     @updataQuestion="updataQuestion" />
  </div>
  <div class="teacherExaminationEditFooter">
    <div class="flexCenter"> 
      <Submit :okText="'保存试卷'" @submit="save" @cancel="cancel" :loading="loading"></Submit>
    </div>
  </div>
  <!-- 编辑基本信息 -->
  <EditBaseInfo v-model:visible="editModal" :id="id" :type="'考试'" :isEdit="true" @updateInfo="getExamDetail"/>
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
import EditBaseInfo from "./component/editBaseinfo.vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import Submit from "src/components/submit/index.vue";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import TopicDisplay from 'src/components/TopicDisplay/index.vue'
import BasicInfo from 'src/components/TopicDisplay/BasicInfo.vue'
const router = useRouter();
const route = useRoute();
const { id } = route.query;
const http = (request as any).teacherExamination;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "编辑试卷", componenttype: 0 }],
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
const editModal = ref<boolean>(false)
const headerObj:any=reactive({
  name:'',
  time:'',
  explainText:'',
})
const EditBaseFn=()=>{
  editModal.value=true
}
const cancel=()=>{
  router.go(-1)
  // router.replace({
  //   path:'/teacher/teacherExamination/teacherExaminationPreview',
  //   query:{id:id}
  // })
}
const save=()=>{
  if(!updataQuestionData.length){
    message.success("保存成功");
    cancel()
    return
  }
  loading.value=true
  http.editExam({param:{question_ids:updataQuestionData} ,urlParams: { ID:id}}).then((res: any) => {
    loading.value=false
    message.success("保存成功");
    cancel()
  }).catch((err:any)=>{
    loading.value=false
  })
}
var loading:Ref<boolean> = ref(false);
const updataQuestionData:any=reactive([])
const updataQuestion=(arr:any)=>{
  updataQuestionData.length=0
  updataQuestionData.push(...arr)
}
const questionsList:any=reactive([])
var listLoading:Ref<boolean> = ref(false);
const getExamDetail = () => {
  listLoading.value=true
  http.examDetail({urlParams:{ID: id}}).then((res:IBusinessResp) => {
    questionsList.length=0
    const {data}=res
    headerObj.name=data.name
    headerObj.time=`${data.started_at}-${data.closed_at}`
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
.teacherExaminationEdit{

  
}
.teacherExaminationEditFooter{
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
