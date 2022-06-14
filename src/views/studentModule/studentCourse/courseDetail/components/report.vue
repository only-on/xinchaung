<template>
  <div>
    <template v-if="baseInfo?.template_type=='form'">
      <onLine :reportTemplateData='baseInfo' :preview='true'></onLine>
    </template>
    <template v-else>
      <div class="pdfshow">
        <pdf :url="detailInfo"></pdf>
      </div>
    </template>
    <!-- <table style="width: 100%" class="teacherRemark" v-if="baseInfo?.remark">
      <tr>
        <td style="width: 16.7%" class="remark">教师批注</td>
        <td colspan="6" class="remarkValue">
          {{ baseInfo?.remark }}
        </td>
      </tr>
    </table> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch, provide } from "vue";
import onLine from "./OnLine.vue";
import pdf from "src/components/pdf/pdf.vue";

interface Istate {
  reportUrl: string;
}
export default defineComponent({
  components: {
    onLine,
    pdf,
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
