<template>
  <div class="init-experiment-guide-box">
    <div class="guide-title">{{type==="experiment"?'实验指导':'实训概述'}}</div>
    <marked-editor :preview="true" v-model="content" />
  </div>
</template>

<script lang="ts">
import { defineComponent,watch,ref } from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
export default defineComponent({
  components: {
    "marked-editor": markedEditor,
  },
  props: ["modelValue","type"],
  setup(props) {
    const content=ref("")
    watch(()=>props.modelValue,()=>{
        content.value = props.modelValue;
    },{
        deep:true,
        immediate:true
    })
    
    return {
      content,
    };
  },
});
</script>
<style lang="less">
.init-experiment-guide-box {
//   flex: 1;
    // height: 100%;
  background: var(--black-100);
  padding: 16px 19px;
  .guide-title{
      font-size: 16px;
      font-weight: 600;
  }
  .mark__container {
    // height: 100%;
    .mark__body {
      .mark__preview {
        overflow-y: auto;
        border: none;
      }
    }
  }
}
</style>