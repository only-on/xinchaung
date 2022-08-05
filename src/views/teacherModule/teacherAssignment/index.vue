<template>
  <h2 @click="router.push('/teacher/teacherAssignment/teacherAssignmentPreview')">作业去预览--暂用</h2>
  <h2 @click="router.push('/teacher/teacherAssignment/teacherAssignmentAchievement')">作业查看成绩--暂用</h2>
  <h2 @click="router.push('/teacher/teacherAssignment/teacherAssignmentEdit')">作业编辑--暂用</h2>
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
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherImageResourcePool;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "作业", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: false,
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

</script>
<style scoped lang="less"></style>
