<template>
  <div class="course-experiment-detail-box">
    <template v-if="currentContent === 'initNotebook'&&updateRight"><notebook-tab/></template>
    <template v-if="currentContent === 'initWebide'&&updateRight">
      <webide-tab/>
    </template>
    <template v-if="currentContent === 'initVnc'&&updateRight">
      <vnc-tab/>
    </template>
    <template v-if="currentContent === 'teacherVnc'&&updateRight">
      <vnc-tab/>
    </template>
    <template v-if="currentContent === 'teacherNotebook'&&updateRight"><notebook-tab/></template>
    <template v-if="currentContent === 'initTrain'&&updateRight">
      <train-tab/>
    </template>
    <template v-if="currentContent === 'teacherTrain'&&updateRight"><train-tab/></template>
    <template v-if="currentContent === 'video'&&updateRight">
        <video-tab></video-tab>
    </template>
    <template v-if="currentContent === 'document'&&updateRight">
        <document-tab></document-tab>
    </template>
    <div v-if="currentContent === undefined">undefined</div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  toRefs,
  watch,
  provide,
  ref
} from "vue";
import { getContentDetailApi } from "./api";
import videoTab from "./components/experimentDetalTab/videoTab.vue"
import documentTab from "./components/experimentDetalTab/documentTab.vue"
import notebookTab from "./components/experimentDetalTab/notebookTab.vue"
import webideTab from "./components/experimentDetalTab/webideTab.vue"
import vncTab from "./components/experimentDetalTab/vncTab.vue"
import trainTab from "./components/experimentDetalTab/trainTab.vue"
type TcurrentContent =
  | "initNotebook"
  | "initWebide"
  | "initVnc"
  | "teacherVnc"
  | "teacherNotebook"
  | "initTrain"
  | "teacherTrain"
  | "video"
  | "document"
  | undefined;
type TreactiveData = {
  currentContent: TcurrentContent; // 当前展示的内容类型tab
  updateRight:boolean
};
export default defineComponent({
    components:{
        "video-tab":videoTab,
        "document-tab":documentTab,
        "notebook-tab":notebookTab,
        "webide-tab":webideTab,
        "vnc-tab":vncTab,
        "train-tab":trainTab
    },
  setup() {
    const experiment_id: any = inject("experiment_id");
    const reactiveData: TreactiveData = reactive({
      currentContent: undefined,
      updateRight:true
    });
    const detailInfo:any=ref({})
    provide("detailInfo",detailInfo)
    onMounted(() => {
      //   getContentDetail();
    });
    watch(
      () => experiment_id,
      () => {
        reactiveData.updateRight=false
        setTimeout(()=>{
          reactiveData.updateRight=true
        })
        getContentDetail();
      },
      { deep: true, immediate: true }
    );
    function getContentDetail() {
      getContentDetailApi({ id: experiment_id.value }).then((res: any) => {

        detailInfo.value = res.data;
        if (detailInfo.value.is_init === 1) {
          if (detailInfo.value.task_type.type === 4) {
            if (detailInfo.value.task_type.programing_type === 1) {
              reactiveData.currentContent = "initWebide";
            } else if (detailInfo.value.task_type.programing_type === 0) {
              reactiveData.currentContent = "initNotebook";
            }
          } else if (detailInfo.value.task_type.type === 1) {
            reactiveData.currentContent = "initVnc";
          } else if (detailInfo.value.task_type.name === "实训") {
            reactiveData.currentContent = "initTrain";
          }
        }
        if (detailInfo.value.is_init === 0) {
          if (detailInfo.value.task_type.name === "实训") {
            reactiveData.currentContent = "teacherTrain";
          }
          if (detailInfo.value.task_type.type === 4) {
            reactiveData.currentContent = "teacherNotebook";
          }
          if (detailInfo.value.task_type.type === 1) {
            reactiveData.currentContent = "teacherVnc";
          }
        }
        if (detailInfo.value.task_type.name === "视频实验") {
          reactiveData.currentContent = "video";
        }
        if (detailInfo.value.task_type.name === "文档实验") {
          reactiveData.currentContent = "document";
        }
      });
    }
    return {
      ...toRefs(reactiveData),
      provide
    };
  },
});
</script>

<style lang="less">
.course-experiment-detail-box{
    width: 100%;
    height: 100%;
    font-size: 14px;
}
</style>
