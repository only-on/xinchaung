<template>
  <div class="demo__emd">
    <!-- <div class="top">
      <div class="left">
        <editormd @change="handleChangeTopLeft" :emd-options="topLeftOptions" />
      </div>
      <div class="right">
        <editormd
          @change="handleChangeTopRight"
          :emd-options="topRightOptions"
        />
      </div>
    </div> -->
    <div class="bottom">
      <editormd @change="handleChange" :emd-options="bottomOptions" />
    </div>
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
    const bottomOptions = reactive({
      path: "/assets/editor.md/lib/",
      gotoLine: false,
      emoji: false,
      tex: true,
      flowChart: true,
      markdown: demoContent,
    });
    const topLeftOptions = reactive({
      path: "/assets/editor.md/lib/",
      gotoLine: false,
      emoji: false,
      tex: true,
      flowChart: true,
      markdown: "# top left",
      toolbarIcons: "mini",
    });
    const topRightOptions = reactive({
      mode: "gfm",
      path: "/assets/editor.md/lib/",
      gotoLine: false,
      emoji: false,
      tex: true,
      flowChart: true,
      markdown: "# top right",
      toolbarIcons: "simple",
    });
    const handleChange = function (val: string) {
      // console.log("[EditorMd/change] ", val);
    };
    const handleChangeTopLeft = function (val: string) {
      // console.log("[EditorMd/change] ", val);
    };
    const handleChangeTopRight = function (val: string) {
      // console.log("[EditorMd/change] ", val);
    };
    return {
      bottomOptions,
      topLeftOptions,
      topRightOptions,
      handleChange,
      handleChangeTopLeft,
      handleChangeTopRight,
    };
  },
});
</script>
<style lang="less" scoped>
.demo__emd {
  width: 70%;
  margin: 0 auto;
  height: 100%;
  .top {
    height: 50%;
    display: flex;
    .left,
    .right {
      width: 50%;
      height: 50%;
    }
  }
  .bottom {
    height: 50%;
  }
}
</style>
