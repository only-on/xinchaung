<template>
  <div class="quill-editor-wrap">
    <quill-editor
      ref="quillDom"
      v-if="type === 'edit'"
      class="scrollbar"
      toolbar="full"
      :options="options"
      v-model:content="content"
      :style="{ height: height }"
      @selectionChange="selectionChange"
      @editorChange="editorChange"
    >
    </quill-editor>
    <div v-if="type === 'preview'" v-html="html"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, PropType, ref, reactive, toRefs } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Delta } from "quill-delta";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { isJsonString } from "src/utils/common";
import { number } from "echarts";
interface IreactiveData {
  content: Delta;
}

export default defineComponent({
  name: "Quill",
  components: {
    QuillEditor,
  },
  props: {
    options: {
      default: () => {
        return {
          placeholder: "输入内容...",
          theme: "snow",
        };
      },
    },
    modelValue: {
      type: Object as PropType<Delta>,
      default: () => [],
      require: true,
    },
    rang:{
      type: Number,
      // default: () => 0,
    },
    height: {
      default: "250px",
      type: String,
      require: false,
    },
    type: {
      default: "edit",
      require: false,
    },
    quillRef: {
      default: "quillRef",
      type: Object as PropType<Delta>,
    },
  },
  setup(props, { emit }) {
    const options = props.options;
    const reactiveData: IreactiveData = reactive({ content: props.modelValue });
    const { content } = toRefs(reactiveData);
    const height = props.height;
    const quillDom = ref(props.quillRef);
    watch(
      () => content.value,
      () => {
        emit("update:modelValue", content.value);
      }
    );

    watch(
      () => props.modelValue,
      () => {
        content.value = props.modelValue;
      }
    );
    let html: any = "";
    let contentPre: any = isJsonString(content.value)
      ? JSON.parse(content.value as any)
      : "";
    if (contentPre.ops) {
      var converter = new QuillDeltaToHtmlConverter(contentPre.ops, {});
      html = converter.convert();
    } else {
      html = content.value;
    }

    function setContents(delta: Delta) {
      if (delta.ops) {
        (quillDom.value as any).setContents(delta);
      } else {
        (quillDom.value as any).setContents({ ops: [] });
      }
    }
    console.log(props.rang);
    
    // 选择的发送变化时
    function  selectionChange(val:any) {
      // (quillDom.value as any).getQuill().clipboard.dangerouslyPasteHTML(2,'<img src="https://gw.alicdn.com/tps/TB1W_X6OXXXXXcZXVXXXXXXXXXX-400-400.png">','api')

      val.range?emit("update:rang", val.range.index):'';
    }

    // 编辑器发送变化时
    function  editorChange(val:any) {
      if (val.name==="selection-change") {
        val.range?emit("update:rang", val.range.index):'';
      }
    }

    // 插入html
    function  insertHtml(htmlString:string) {
      (quillDom.value as any).getQuill().clipboard.dangerouslyPasteHTML(props.rang,htmlString,'api')
    }
    return {
      options,
      ...toRefs(reactiveData),
      height,
      html,
      quillDom,
      setContents,
      selectionChange,
      editorChange,
      insertHtml
    };
  },
});
</script>
<style lang="less" scoped>
.quill-editor-wrap {
  width: 100%;
  height: 100%;
}
</style>
