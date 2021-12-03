<template>
  <div>
    <iframe :src="reportUrl" width="100%" height="700px"></iframe>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
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
    return { ...toRefs(state) };
  },
});
</script>
