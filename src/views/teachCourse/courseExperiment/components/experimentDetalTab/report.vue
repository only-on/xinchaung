<template>
  <div class="experiment-report-box">
      <div class="action-btn">
          <a-button type="primary">更换实验报告</a-button>
      </div>
    <report-on-line v-if="reportInfo.type === 'form'"></report-on-line>

    <iframe
    v-if="reportInfo.type === 'file'"
      :src="`/pdfjs-2.5.207/web/viewer.html?file=${
        env ? '/proxyPrefix' + reportInfo.pdf_url:reportInfo.pdf_url
      }`"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  toRefs,
  provide,
  ref,
} from "vue";
import { getExperimentReportApi } from "../../api";
import reportOnLine from "src/components/reportOnLine/reportOnLine.vue";

export default defineComponent({
  components: {
    "report-on-line": reportOnLine,
  },
  setup() {
      const env = process.env.NODE_ENV == "development" ? true : false;
    const course_id = inject("course_id") as number;
    const experiment_id: any = inject("experiment_id");
    const reactiveData = reactive({});
    const reportInfo:any = ref({});
    provide("reportTemplateData", reportInfo);
    onMounted(() => {
      getExperimentReport();
    });
    function getExperimentReport() {
      const body = new FormData();
      body.append("owner_type", "cc_mid");
      body.append("owner_id", experiment_id.value);
      getExperimentReportApi(body).then((res: any) => {
        reportInfo.value = res.data;
      });
    }
    return {
      ...toRefs(reactiveData),
      provide,
      reportInfo,
      env
    };
  },
});
</script>

<style lang="less">
.experiment-report-box{
    padding: 15px;
    .action-btn{
        display: flex;
        >button{
            margin-left: auto;
            margin-bottom: 10px;
        }
    }
    >iframe{
        width: 100%;
        height: 100%;
    }
}
</style>