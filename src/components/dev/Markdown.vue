<template>
  <div class="marked__demo">
    <p>markdown</p>
    <antdv-markdown v-model="content"></antdv-markdown>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import AntdvMarkdown from "packages/antdv-markdown/src/index.vue";
export default defineComponent({
  name: "Markdown",
  components: {
    AntdvMarkdown,
  },
  setup() {
    const content = ref("# demo");
    return { content };
  },
});
</script>
<style lang="less" scoped></style>
