<template>
  <div class="container">
    <xe-quill
      :toolbar="'full'"
      v-model:value="content"
      height="300px"
      @focus="focus"
      :readOnly="false"
      :handlers="handlers"
      @change="onEditorChange($event)"
      @selectionChange="selectionChange"
      ref="quilldom"
    />
    <textarea
      style="width: 100%; height: 200px; margin-top: 20px"
      :value="testInputContent"
      @input="handleTestInput"
    ></textarea>
    <div @click="getQuill">获取实例</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, Ref, computed } from "vue";
import {XeQuill} from "@xianfe/vue3-quill";
import { Delta } from "quill-delta";
export default defineComponent({
  name: "Quill",
  components: {
    XeQuill,
  },
  setup() {
    const quilldom = ref(null);
    let content: Ref<Partial<Delta>> = ref({
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
    const toolbars = ref([
      [{ header: 1 }, { header: 2 }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
    ]);
    const handlers = ref({
      image: () => {
        console.log(111111);
      },
    });

    const testInputContent = computed(() => {
      return JSON.stringify(content.value);
    });

    function updateQuillContent() {
      content.value = {
        ops: [
          { insert: "这是第二个quill编辑器，" },
          { insert: "吐血警告，不要使用" },
          { insert: "delta", attributes: { color: "#8955b5", bold: true } },
          { insert: "作为quill的content" },
        ],
      };
    }

    watch(
      content,
      () => {
        console.log("[App] delta: ", JSON.stringify(content.value));
      },
      { deep: true }
    );

    function onEditorChange({ quill, html, text }: any) {
      console.log("editor changed! ", quill, html, text);
    }
    function selectionChange(range: any) {
      console.log(range);
    }
    function getContent() {
      console.log(content.value);
    }

    const handleTestInput = function (e: Event) {
      console.log("[App] handleTestInput: ");
      content.value = JSON.parse((e.target as HTMLTextAreaElement).value);
    };
    function focus() {
      console.log("arguments", arguments);
    }
    function getQuill() {
      console.log((quilldom as any).value.getQuill());
    }
    return {
      content,
      testInputContent,
      toolbars,
      handlers,
      quilldom,
      updateQuillContent,
      onEditorChange,
      getContent,
      handleTestInput,
      focus,
      selectionChange,
      getQuill,
    };
  },
});
</script>
<style lang="less" scoped>
.container {
  display: flex;
}
</style>
