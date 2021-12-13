<template>
  <div>
    <iframe :src="reportUrl" width="100%" height="700px"></iframe>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from "vue";
interface Istate {
  reportUrl: string;
}
export default defineComponent({
  name: "CourseAchievement",
  props: ["detailInfo"],
  setup: (props, context) => {
    const state: Istate = reactive({
      reportUrl: "",
    });
    watch(
      () => props.detailInfo,
      () => {
        let development = process.env.NODE_ENV == "development" ? true : false;
        let baseurl = development ? "http://localhost:3000/proxyPrefix" : "";
        state.reportUrl = baseurl + props.detailInfo;
      },
      { immediate: true, deep: true }
    );
    return { ...toRefs(state) };
  },
});
</script>
