<template>
  <template v-if="!props.activeExperimentObj.TeachingAids">
    <!-- 桌面实验 -->
    <template v-if="props.activeExperimentObj.type===1">
      <MarkedEditor v-model="props.activeExperimentObj.Newguidance.guide" class="markdown__editor" :preview="true" />
    </template>
    <template v-if="props.activeExperimentObj.type===4">
      <!-- jupyter -->
      <iframe :src="props.activeExperimentObj.Newguidance.guide" frameborder="0" style="width:100%;height:100%"></iframe>
    </template>
    <template v-if="props.activeExperimentObj.type===5">
    <!-- 任务制 -->
      <div class="task-list" v-for="(v, i) in props.activeExperimentObj.Newguidance.task_steps" :key="v.content_id">
        <task-list :preview="true" :taskList="v" :index="i" />
      </div>
    </template>
    <template v-if="props.activeExperimentObj.type===6">
      视频
      <div class="video-box">
        <video v-if="props.activeExperimentObj.Newguidance.id" :src="env ? '/proxyPrefix' +props.activeExperimentObj.Newguidance.file_url : props.activeExperimentObj.Newguidance.file_url" :controls="true">
          您的浏览器不支持 video 标签
        </video>
      </div>
    </template>
    <template v-if="props.activeExperimentObj.type===7">
      <!-- 文档实验 -->
      <div v-if="!props.activeExperimentObj.Newguidance.content_task_files.length">
        <marked-editor v-model="props.activeExperimentObj.Newguidance.guide" :preview="true" />
      </div>
      <PdfVue v-else  :url="props.activeExperimentObj.Newguidance.content_task_files[0].file_url" />
    </template>
  </template>
  <template v-if="props.activeExperimentObj.TeachingAids">
    <!-- 教辅 -->
    <div class="video-box" v-if="props.activeExperimentObj.suffix==='mp4'">
      <video :src="env ? '/proxyPrefix' + props.activeExperimentObj.file_url : props.activeExperimentObj.file_url" :controls="true">
        您的浏览器不支持 video 标签
      </video>
    </div>
    <div class="pdfBox" v-if="['doc','docx','ppt','pptx','pdf'].includes(props.activeExperimentObj.suffix)">
      <PdfVue :url="props.activeExperimentObj.file_html" />
    </div>
  </template>
</template>
<script lang="ts" setup>
import {
  defineProps,
  withDefaults,
} from "vue";
import MarkedEditor from "src/components/editor/markedEditor.vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import PdfVue from "src/components/pdf/pdf.vue";
import taskDetail from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/taskDetail.vue";
import taskList from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/taskList.vue";

const env = process.env.NODE_ENV == "development" ? true : false;
interface Props {
  activeExperimentObj: any;
}
const props = withDefaults(defineProps<Props>(), {
  activeExperimentObj: () => {},
});

// const emit = defineEmits<{
//   (e: "selectedImage", val: any): void;
// }>();

</script>
<style scoped lang="less">
.ExperimentalGuidance{
  height:100%
}
.markdown__editor{
  height: 400px;
  padding: 1rem 2rem 0;
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
.pdfBox{
  height: 500px;
  width: 100%;
}
</style>
