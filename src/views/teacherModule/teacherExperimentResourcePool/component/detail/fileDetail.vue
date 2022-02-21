<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <a-button type="primary">上传文档</a-button>
      <a-button type="primary">选择文档</a-button>
      <a-button type="primary">移除</a-button>
    </div>
  </div>
  <div class="experiment-content">
    <iframe :src="fileUrl" width="100%" v-if="!isMarked"></iframe>
    <div v-else>
      <marked-editor v-model:value="experimentContent" :preview="preview" />
      <Submit @submit="onSubmit" @cancel="cancel"></Submit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
import Submit from "src/components/submit/index.vue";

const isMarked = ref<boolean>(true);
const fileUrl = ref<string>("");

const preview = ref<boolean>(false);
const experimentContent = ref<any>("aa");
const onSubmit = () => {};
const cancel = () => {};
</script>

<style lang="less" scoped>
.title {
  line-height: 34px;
  padding: 10px 0 5px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  h3 {
    margin-left: 12px;
  }
  .ant-btn {
    margin-left: 8px;
  }
}
.experiment-content {
  margin-top: 16px;
  .demo__container :deep(.ant-btn) {
    padding: 0 !important;
  }
  :deep(.mark__body) {
    .mark__editor,
    .mark__preview {
      height: 455px;
    }
  }
  .submit {
    margin-top: 32px;
  }
}
</style>
