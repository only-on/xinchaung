<template>
  <div class="marked__demo">
    <antdv-markdown v-model="content" class="markdown__editor" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import AntdvMarkdown from "@jiangyue/antdv-markdown/src/index.vue";
import readme from '@jiangyue/antdv-markdown/README.md';
export default defineComponent({
  name: "Markdown",
  components: {
    AntdvMarkdown,
  },
  setup() {
    const content = ref(readme);
    watch(content, (newVal) => {
      console.log("[markdown] content: ", content.value);
    });
    return { content };
  },
});
</script>
<style lang="less" scoped>
.markdown__editor {
  // height: 700px;
}
</style>
