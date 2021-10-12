<template>
  <div class="experimental-note">
    <QuillEditor v-model="content" height="700px"></QuillEditor>
    <div class="experimental-action">
      <a-button type="primary">提交笔记</a-button>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import QuillEditor from "src/components/editor/quill.vue";

export default defineComponent({
  components: {
    QuillEditor,
  },
  setup() {
    const content = ref({
      ops: [
        { insert: "Delta", attributes: { bold: true } },
        { insert: "是一种富有表现力的数据格式，它是" },
      ],
    });
    return {
      content,
    };
  },
});
</script>


<style lang="less">
.experimental-note {
  white-space: break-spaces;
  padding: 15px;
  .experimental-action{
    text-align: center;
    margin-top: 20px;
  }
}
</style>
