<template>
  <div class="quill-editor-wrap">
    <XeQuill
      ref="quillDom"
      v-if="type === 'edit'"
      class=""
      toolbar="full"
      :options="options"
      v-model:value="content"
      :modules="modules"
      :style="{ height: height}"
      @selectionChange="selectionChange"
      @editorChange="editorChange"
    >
    </XeQuill>
    <div v-if="type === 'preview'" v-html="html"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, PropType, ref, reactive, toRefs } from "vue";
// import { QuillEditor } from "@vueup/vue-quill";
// import "@vueup/vue-quill/dist/vue-quill.snow.css";
import {Quill, XeQuill} from "@xianfe/vue-quill/index";
import { Delta } from "quill-delta";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { isJsonString } from "src/utils/common";
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module/index.js'
Quill.register('modules/ImageExtend', ImageExtend)
const dev_base_url=(window as any).proxy_api
const updateUrl=`${dev_base_url}/api/instance/uploads/file`
interface IreactiveData {
  content: Delta;
}

export default defineComponent({
  name: "Quill",
  components: {
    XeQuill,
  },
  props: {
    options: {
      default: () => {
        // return {
        //   placeholder: "输入内容...",
        //   theme: "snow",
        // };
        return {
           placeholder: "输入内容...",
            theme: "snow",
        }
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
      default: "200px",
      type: String,
      require: false,
    },
    type: {
      default: "edit",
      require: false,
    },
    quillRef: {
      default: "quillRef",
      type: String,
    },
  },
  setup(props, { emit }) {
    const options = props.options;
    const modules:any={
      ImageExtend: {
        loading: true,
        name: 'img',
        action: updateUrl,
        response: (res:any) => {
          console.log(res)
          // return res.info
        }
      },
      toolbar: {
        container: container,
        handlers: {
          'image': function () {
            // QuillWatch.emit(this.quill.id)
            console.log(1111)
          }
        }
      }
    }
    const reactiveData: IreactiveData = reactive({ content: props.modelValue });
    const { content } = toRefs(reactiveData);
    const height = props.height;
    const quillDom = ref(props.quillRef);
    // console.log(quillDom);
    
    watch(
      () => content.value,
      () => {
        emit("update:modelValue", content.value);
      }
    );

    watch(
      () => props.modelValue,
      () => {
        console.log(props.modelValue);
        
        content.value = props.modelValue;

      },{deep:true}
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
    // console.log(props.rang);
    
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
      console.log(quillDom.value);
      // (quillDom.value as any).clipboard.dangerouslyPasteHTML(props.rang,htmlString,'api')
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
      insertHtml,
      modules
    };
  },
});
</script>
<style lang="less" scoped>
.quill-editor-wrap {
  width: 100%;
  height: 100%;
}
.quill-editor{
  overflow: auto;
}
:deep(.ql-container){
  min-height: calc(100% - 43px);
}
</style>
