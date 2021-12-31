<template>
  <div class="experiment-report-box">
    <div class="action-btn">
      <a-button v-role="[tab]" type="primary" @click="openSelectReport"
        >更换实验报告</a-button
      >
    </div>
    <report-on-line v-if="reportInfo.type === 'form'"></report-on-line>

    <iframe
    v-if="reportInfo.type === 'file'"
      :src="
        env
          ? '/pdfjs-2.5.207/web/viewer.html?file=' + '/proxyPrefix' + reportInfo.url
          : '/frontend/pdfjs-2.5.207/web/viewer.html?file=' + reportInfo.url
      "
      frameborder="0"
    ></iframe>
  </div>
  <a-modal
    title="选择实验报告"
    :visible="reportVisible"
    :footer="null"
    :width="800"
    class="report-modal"
    @cancel="closeReportModal"
  >
    <select-report @close="closeReportModal"></select-report>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, reactive, toRefs, provide, ref } from "vue";
import { getExperimentReportApi } from "../../api";
import reportOnLine from "src/components/reportOnLine/reportOnLine.vue";
import selectReport from "../selectReport.vue";

export default defineComponent({
  components: {
    "report-on-line": reportOnLine,
    "select-report": selectReport,
  },
  setup() {
    const env = process.env.NODE_ENV == "development" ? true : false;
    const course_id = inject("course_id") as number;
    const experiment_id: any = inject("experiment_id");
    const tab: any = inject("tab");
    const reactiveData = reactive({
      reportVisible: false,
    });
    const reportInfo: any = ref({});
    provide("reportTemplateData", reportInfo);
    onMounted(() => {
      getExperimentReport();
    });
    function getExperimentReport() {
      const body = new FormData();
      body.append("owner_type", "cc_mid");
      body.append("owner_id", experiment_id.value);
      getExperimentReportApi(body).then((res: any) => {
        console.log("哈哈哈哈哈report");
        reportInfo.value = res.data;
      });
    }
    // 打开更换实验报告弹窗
    function openSelectReport() {
      reactiveData.reportVisible = true;
    }
    // 关闭实验报告弹窗
    function closeReportModal(val: any) {
      reactiveData.reportVisible = false;
      if (val === true) {
        getExperimentReport();
      }
    }
    return {
      ...toRefs(reactiveData),
      provide,
      reportInfo,
      env,
      openSelectReport,
      closeReportModal,
      tab,
    };
  },
});
</script>

<style lang="less">
.experiment-report-box {
  padding: 15px;
  overflow-y: auto;
  .action-btn {
    display: flex;
    > button {
      margin-left: auto;
      margin-bottom: 10px;
    }
  }
  > iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
