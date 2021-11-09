<template>
  <div class="demo__container">
    <AntdvMarkdown editor-name="content"  :preview-only="preview" v-model="content"/>
  </div>
</template>
<script lang="ts">
  import { defineComponent,watch,ref } from 'vue'
  import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
  export default defineComponent({
    name: 'DemoMarkedEditor',
    components: {
      AntdvMarkdown
    },
    props:['modelValue','preview'],
    setup(props,{emit}){
        // const preview=props.preview
        const content=ref("")
        watch(()=>props.modelValue,()=>{
            content.value=props.modelValue
        },{deep:true,immediate:true})
        watch(()=>content.value,()=>{
            emit("update:modelValue",content.value)
        })
        return{
            // preview,
            content
        }
    }
  })
</script>
<style lang="less" scoped>
  .demo__container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
</style>
