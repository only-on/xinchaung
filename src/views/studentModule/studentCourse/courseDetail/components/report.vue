<template>
  <div>
    <template v-if="baseInfo?.template_type=='form'">
      <!-- <onLine :reportTemplateData='baseInfo' :preview='true'></onLine> -->
      <!-- <viewTemplate :reportTemplateData='baseInfo'  /> -->
      <onlinePreview :reportTemplateData="baseInfo"></onlinePreview>
    </template>
    <template v-else>
      <div class="pdfshow">
        <pdf :url="detailInfo"></pdf>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch, provide } from "vue";
import onLine from "./OnLine.vue";
import pdf from "src/components/pdf/pdf.vue";
import viewTemplate from "src/components/report/viewTemplate.vue";
import onlinePreview from "src/components/report/onlinePreview.vue"
interface Istate {
  reportUrl: string;
}
export default defineComponent({
  components: {
    onLine,
    pdf,
    viewTemplate,
    onlinePreview,
  },
  name: "report",
  props: ["detailInfo", "baseInfo"],
  setup: (props, context) => {
    const state: Istate = reactive({
      reportUrl: "",
    });
    provide("reportTemplateData", props.baseInfo);
    watch(
      () => props.detailInfo,
      () => {
        let development = process.env.NODE_ENV == "development" ? true : false;
        let baseurl = development ? "http://localhost:3000/proxyPrefix" : "";
        console.log(props.detailInfo, props.baseInfo);
        state.reportUrl =
          "pdfjs-2.5.207/web/viewer.html?file=" + baseurl + props.detailInfo;
      },
      { immediate: true, deep: true }
    );
    return { ...toRefs(state), provide };
  },
});
</script>
<style lang="less" scoped>
.teacherRemark {
  border: 1px solid var(--black-25);
  min-height: 54px;
  border-top: none;
  .remark {
    border-right: 1px solid var(--black-25);
    text-align: center;
  }
  .remarkValue {
    padding: 4px 11px;
  }
}
.pdfshow {
  width: 100%;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pdfshow > div {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
