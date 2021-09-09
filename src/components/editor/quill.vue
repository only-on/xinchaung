<template>
  <div class="quill-editor-wrap">
    <quill-editor class="scrollbar" toolbar="full" :options="options" v-model:content="content" :style="{height:height}">
    </quill-editor>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch ,PropType,ref} from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Delta } from "quill-delta";
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
    }
  },
  setup(props,{emit}) {
    const options=props.options
    const content=ref(props.modelValue)
    const height=props.height
    watch(()=>content.value,()=>{
        emit("update:modelValue",content.value)
    })
    
    return {
      options,
      content,
      height
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
