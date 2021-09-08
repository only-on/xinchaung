<template>
  <div class="container">
    <div class="left">
      <quill-editor toolbar="full" :options="options" v-model:content="content">
        <template #toolbar>
          <button @click="customize">自定义按钮</button>
        </template>
      </quill-editor>
      <textarea v-model="contentStr"></textarea>
    </div>
    <div class="right">
      <quill-editor
        toolbar="full"
        :options="options"
        v-model:content="content2"
      >
      </quill-editor>
      <textarea v-model="content2Str"></textarea>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Delta } from "quill-delta";
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
    const content = ref<Delta>({
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
    });
    const content2 = ref<Delta>({
      ops: [
        { insert: "这是第二个quill编辑器，" },
        { insert: "吐血警告，不要使用" },
        { insert: "delta", attributes: { color: "#8955b5", bold: true } },
        { insert: "作为quill的content" },
      ],
    });
    const contentStr = ref(JSON.stringify(content.value));
    const content2Str = ref(JSON.stringify(content2.value));

    watch(content, (newVal) => {
      console.log("content changed");
      contentStr.value = JSON.stringify(newVal);
    });
    watch(content2, (newVal) => {
      console.log("content2 changed");
      content2Str.value = JSON.stringify(newVal);
    });
    const customize = function () {
      console.log("customized quill toolbar button.");
    };
    return {
      options,
      content,
      content2,
      contentStr,
      content2Str,
      customize,
    };
  },
});
</script>
<style lang="less" scoped>
.container {
  display: flex;
  .left {
    border-right: 1px solid @primary-color;
  }
  textarea {
    width: 100%;
    height: 400px;
  }
}
</style>
