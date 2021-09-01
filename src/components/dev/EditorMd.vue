<template>
  <div class="demo__emd">
    <editormd @change="handleChange" :emd-options="emdOptions" />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";
import Editormd from "@jiangyue/vue3-editormd/src/index.vue";
import demoContent from "./editormd.md";
export default defineComponent({
  name: "EditorMd",
  components: {
    Editormd,
  },
  setup() {
    const emdOptions = reactive({
      path: "/assets/editor.md/lib/",
      gotoLine: false,
      emoji: false,
      tex: true,
      flowChart: true,
      markdown: demoContent,
    });
    const handleChange = function (val: string) {
      console.log("[EditorMd/change] ", val);
    };
    return {
      emdOptions,
      handleChange,
    };
  },
});
</script>
<style lang="less" scoped>
.demo__emd {
  width: 70%;
  margin: 0 auto;
  height: 100%;
}
</style>
