<template>
  <div class="teacherAssignmentEdit">
    <BasicInfo :name="headerObj.name" :time="headerObj.time" :explainText="headerObj.explainText" />
    <TopicDisplay :purpose="'IsEdit'" />
  </div>
  <div class="teacherAssignmentEditFooter">
    <div class="flexCenter">
      <Submit :okText="'保存作业'" @submit="save" @cancel="cancel"></Submit>
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
import BasicInfo from 'src/components/TopicDisplay/BasicInfo.vue'
import Submit from "src/components/submit/index.vue";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherAssignment;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "编辑作业", componenttype: 0 }],
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
  name:'电子科技大学2022秋季《大学计算机基础》期末考试试卷A卷',
  time:'2022 / 06 / 07 13:00:00 - 2022 / 07 / 07 13:00:00',
  explainText:'一个好的选项从来都不缺乏细节，虽然看起来并不复杂，实际要考虑的因素非常多，因为这不仅关系着用户体验，还涉及一些界面交互逻辑的问题，需要结合不同的使 用场景、合理的将各选项灵活运用到界面当中，这其中的细节不容忽视。。',
})
const cancel=()=>{
  // router.go(-1)
  // router.replace('/teacher/teacherAssignment')
  router.replace({
    path:'/teacher/teacherExamination/teacherAssignmentPreview',
    query:{editId:editId}
  })
}
const save=()=>{
  cancel()
  // router.push('/teacher/teacherAssignment')
}
</script>
<style scoped lang="less">
.teacherAssignmentEdit{

  
}
.teacherAssignmentEditFooter{
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
