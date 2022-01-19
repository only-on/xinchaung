<template>
  <div class="demo__container">
    <marked-editor editor-name="content" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import MarkedEditor from 'packages/marked-editor/src/meditor.vue'
  export default defineComponent({
    name: 'DemoMarkedEditor',
    components: {
      MarkedEditor
    }
  })
</script>
<style lang="less" scoped>
  .demo__container {
    width: 80%;
    height: 100%;
    margin: 0 auto;
  }
</style>
