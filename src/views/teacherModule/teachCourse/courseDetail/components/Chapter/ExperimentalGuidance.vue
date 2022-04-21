<template>
  <div v-if="!props.activeExperimentObj.TeachingAids">
    <!-- 实验指导 -->
  </div>
  <div v-if="props.activeExperimentObj.TeachingAids">
  <!-- 教辅 -->
    <div class="video-box" v-if="props.activeExperimentObj.suffix==='mp4'">
      <video :src="env ? '/proxyPrefix' + props.activeExperimentObj.file_url : props.activeExperimentObj.file_url" :controls="true">
        您的浏览器不支持 video 标签
      </video>
    </div>
    <div class="pdfBox" v-if="['doc','docx','ppt','pptx','pdf'].includes(props.activeExperimentObj.suffix)">
      <PdfVue :url="props.activeExperimentObj.file_html" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  defineProps,
  withDefaults,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import PdfVue from "src/components/pdf/pdf.vue";
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
