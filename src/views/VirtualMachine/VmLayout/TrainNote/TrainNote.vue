<template>
  <div style="white-space: break-spaces;">
    <QuillEditor
      v-model="content"
      height="500px"
    ></QuillEditor>
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
