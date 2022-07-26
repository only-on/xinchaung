<template>
  <template v-if="!props.activeExperimentObj.TeachingAids">
    <!-- 桌面实验 -->
    <!-- {{props.activeExperimentObj.type}} -->
    <!-- {{props.activeExperimentObj.Newguidance.guide}} -->
    <template v-if="props.activeExperimentObj.type===1">
      <MarkedEditor v-model="props.activeExperimentObj.Newguidance.guide" class="markdown__editor" :preview="true" :class="privateCourse?'markdown__editor2':''" />
    </template>
    <!-- ide -->
    <template v-if="props.activeExperimentObj.is_webide || props.activeExperimentObj.type===3 || props.activeExperimentObj.type===2">
      <iframe v-if="props.activeExperimentObj.Newguidance.content_task_files?.length" :src="props.activeExperimentObj.Newguidance.content_task_files[0].file_html" frameborder="0" style="width:100%;height:100%"></iframe>
      <MarkedEditor v-else v-model="props.activeExperimentObj.Newguidance.guide" class="markdown__editor" :preview="true" :class="privateCourse?'markdown__editor2':''" />
    </template>
    <!-- jupyter -->
    <template v-if="props.activeExperimentObj.type===4&&!props.activeExperimentObj.is_webide">
      <div class="pdfBox" :class="privateCourse?'pdfBox2':''">
        <iframe :src="props.activeExperimentObj.Newguidance.guide" frameborder="0" style="width:100%;height:100%"></iframe>
      </div>
    </template>
    <template v-if="props.activeExperimentObj.type===5">
    <!-- 任务制 -->
      <div class="task-list" v-for="(v, i) in props.activeExperimentObj.Newguidance.task_steps" :key="v.content_id">
        <task-list :preview="true" :taskList="v" :index="i" :is_show_task_step="props.activeExperimentObj.is_show_task_step" />
      </div>
    </template>
    <template v-if="props.activeExperimentObj.type===6">
      <!-- 视频 -->
      <div class="video-box" :class="privateCourse?'video-box2':''">
        <common-video v-if="props.activeExperimentObj.Newguidance.id && props.activeExperimentObj.Newguidance.file_url" :src="env ? '/proxyPrefix' +props.activeExperimentObj.Newguidance.file_url : props.activeExperimentObj.Newguidance.file_url" controls="true">
        </common-video>
        <div v-else>
          <Empty />
        </div>
      </div>
    </template>
    <template v-if="props.activeExperimentObj.type===7">
      <!-- 文档实验 -->
      <div v-if="!props.activeExperimentObj.Newguidance.content_task_files.length">
        <marked-editor v-if="props.activeExperimentObj.Newguidance.guide" v-model="props.activeExperimentObj.Newguidance.guide" :preview="true" />
        <div v-if="!props.activeExperimentObj.Newguidance.guide">
          <Empty />
        </div>
      </div>
      <div class="pdfBox" :class="privateCourse?'pdfBox2':''" v-else>
        <PdfVue  :url="props.activeExperimentObj.Newguidance.content_task_files[0].file_html" />
      </div>
    </template>
  </template>
  <template v-if="props.activeExperimentObj.TeachingAids">
    <!-- 教辅 -->
    <div class="video-box" v-if="props.activeExperimentObj.suffix==='mp4'">
      <common-video :src="env ? '/proxyPrefix' + props.activeExperimentObj.file_url : props.activeExperimentObj.file_url" controls="true">
        您的浏览器不支持 video 标签
      </common-video>
    </div>
    <div class="pdfBox" :class="privateCourse?'pdfBox2':''" v-if="['doc','docx','ppt','pptx','pdf'].includes(props.activeExperimentObj.suffix)">
      <PdfVue :url="props.activeExperimentObj.file_html" />
    </div>
  </template>
</template>
<script lang="ts" setup>
import {
  defineProps,
  withDefaults,
  computed
} from "vue";
import videoCover from 'src/assets/images/common/videoCover.jpg'
import MarkedEditor from "src/components/editor/markedEditor.vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import PdfVue from "src/components/pdf/pdf.vue";
import taskDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/taskDetail.vue";
import taskList from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/taskList.vue";
import extStorage from "src/utils/extStorage";
import CommonVideo from "../../../../../../components/common/CommonVideo.vue";

const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
const route = useRoute();
const { currentTab} = route.query;
const env = process.env.NODE_ENV == "development" ? true : false;
interface Props {
  activeExperimentObj: any;
}
const props = withDefaults(defineProps<Props>(), {
  activeExperimentObj: () => {},
});
const privateCourse=computed(()=>{
  if(Number(currentTab) ===0 && role ===3){
    return true
  }else{
    return false
  }
})
console.log(props.activeExperimentObj);

// const emit = defineEmits<{
//   (e: "selectedImage", val: any): void;
// }>();

</script>
<style scoped lang="less">
.ExperimentalGuidance{
  height:100%
}
.markdown__editor{
  height: 500px;
  // height: 100%;
  // padding: 1rem 2rem 0;
}
.markdown__editor2{
  height: 700px;
}
.taskItem {
    .title {
      justify-content: space-between;
      padding: 1rem 2rem;
      .left {
        color: var(--black-85);
        font-size: 16px;
        .num {
          margin-right: 2rem;
        }
      }
      .right {
        span {
          color: var(--primary-color);
          cursor: pointer;
          padding: 0 10px;
        }
      }
    }
    .TaskContent {
      .star {
        width: 12px;
        color: red;
      }
      .taskName {
        padding: 6px 2rem;
        .ant-input {
          width: 400px;
          margin-top: 5px;
        }
      }
      .taskDescription {
        .statusBox {
          padding: 1rem 2rem 0;
          justify-content: space-between;
        }
        .status {
          margin-left: 20px;
          margin-right: 10px;
          color: #ccc;
        }
      }
      .taskStep {
        .taskStepBox {
          padding: 0rem 2rem 0;
          justify-content: space-between;
        }
        margin-top: 20px;
      }
    }
  }
.video-box{
  height: 500px;
  width: 100%;
  video{
    width:100%;
    height:100%;
    object-fit: cover;
  }
}
.video-box2{
  height: 600px;
}
.pdfBox{
  // min-height: 500px;
  height: 500px;
  // min-height: 500px;
  // height:100%;
  width: 100%;
}
.pdfBox2{
  height: 750px;
}
</style>
