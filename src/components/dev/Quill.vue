<template>
  <quill-editor toolbar="full" :options="options" v-model:content="delta">
    <template #toolbar>
      <button @click="customize">自定义按钮</button>
    </template>
  </quill-editor>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
export default defineComponent({
  name: "Quill",
  components: {
    QuillEditor,
  },
  setup() {
    const options = {
      placeholder: "输入内容...",
      theme: "snow",
    };
    const delta = {
      ops: [
        { insert: "Delta", attributes: { bold: true } },
        { insert: "是一种富有表现力的数据格式，它是" },
        { insert: "JSON", attributes: { color: "#8955b5", bold: true } },
        {
          insert:
            "的严格子集，Quill用它来描述Quill的文档及其文档的变化，它的链接在这里：",
        },
        {
          insert: "https://quilljs.com/docs/delta",
          attributes: { link: "https://quilljs.com/docs/delta" },
        },
      ],
    };
    const customize = function () {
        console.log('customized quill toolbar button.')
    }
    return {
      options,
      delta,
      customize
    };
  },
});
</script>
<style lang="less" scoped></style>
