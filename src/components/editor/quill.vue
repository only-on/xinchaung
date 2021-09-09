<template>
  <div class="quill-editor-wrap">
    <quill-editor v-if="type==='edit'" class="scrollbar" toolbar="full" :options="options" v-model:content="content" :style="{height:height}">
    </quill-editor>
    <div v-if="type==='preview'" v-html="html">
        
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch ,PropType,ref,reactive, toRefs} from "vue";
import { QuillEditor} from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Delta } from "quill-delta";
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html"
import {isJsonString} from "src/utils/common"
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
    modelValue:{
        type:Object as PropType<Delta>,
        default:()=>[],
        require:true
    },
    height:{
        default:"250px",
        type:String,
        require:false
    },
    type:{
        default:"edit",
        require:false
    }
  },
  setup(props,{emit}) {
    const options=props.options
    const reactiveData:IreactiveData=reactive({content:props.modelValue})
    const {content}= toRefs(reactiveData)
    const height=props.height
    watch(()=>content.value,()=>{
        emit("update:modelValue",content.value)
    })

    watch(()=>props.modelValue,()=>{
        console.log(props.modelValue);
        
        content.value=props.modelValue
        console.log(QuillEditor);
    })
    let html:any=''
    //     content.value.ops= [
    //     { insert: "这是第二个quill编辑器，" },
    //     { insert: "吐血警告，不要使用" },
    //     { insert: "delta", attributes: { color: "#8955b5", bold: true } },
    //     { insert: "作为quill的content" },
    //   ]
    console.log(content.value);
    let contentPre:any=isJsonString(content.value)?JSON.parse(content.value as any):""
    if (contentPre.ops) {
        var converter = new QuillDeltaToHtmlConverter(contentPre.ops, {})
        html= converter.convert()
    }else{
        html=content.value
    }
    return {
      options,
      ...toRefs(reactiveData),
      height,
      html
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
