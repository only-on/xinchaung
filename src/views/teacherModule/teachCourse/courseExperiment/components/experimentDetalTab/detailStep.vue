<template>
  <div class="detail-step-box">
    <div class="line-bg"></div>
    <div style="padding:16px 15px">
      <div class="detail-step-title">详情步骤</div>
    <marked-editor :preview="true" v-model="content" />
    </div>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, watch, ref } from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
export default defineComponent({
  components: {
    "marked-editor": markedEditor,
  },
  props: ["modelValue"],
  setup(props) {
    const content = ref("");
    watch(
      () => props.modelValue,
      () => {
        content.value = props.modelValue;
      },
      {
        deep: true,
        immediate: true,
      }
    );

    return {
      content,
    };
  },
});
</script>
  <style lang="less">
.detail-step-box {
  min-height: 50%;
  background: var(--black-100);
  
  .line-bg {
    height: 15px;
    width: 100%;
    background: #f7f7f7;
  }
  .detail-step-title {
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