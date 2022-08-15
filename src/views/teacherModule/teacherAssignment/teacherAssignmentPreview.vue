<template>
  <div class="teacherAssignmentPreview">
    <Outline :title="headerObj.title" :explain="headerObj.explain" :explainText="headerObj.explainText" />
    <TopicDisplay :purpose="'IsStuAnswer'" />
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
const { editId } = route.query;
const http = (request as any).teacherAssignment;
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
  title:'单元测验-《大学计算机基础第3版》第3、4章（一）-计算思维、数值与字符编码',
  explain:'作业说明',
  explainText:'交互设计本质上就是设计产品的使用方式的过程，账号怎么填写；表单怎么导出；数据怎么筛选；列表怎么排序等等。针对每个功能的使用方式，都可以花很长的时间去考虑其合理性。一个项目的交互，就是这个项目所有功能使用方式的总和。',
})
const cancel=()=>{
  // router.go(-1)
  router.replace('/teacher/teacherAssignment')
}
const edit=()=>{
  router.push({
    path:'/teacher/teacherAssignment/teacherAssignmentEdit',
    query:{editId:editId}
  })
}
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
