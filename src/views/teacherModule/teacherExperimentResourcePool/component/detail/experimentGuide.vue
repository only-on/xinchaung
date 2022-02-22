<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <a-button type="primary" @click="preview = false" v-if="preview"
        >编辑</a-button
      >
      <span v-if="!preview">
        <span class="tips">支持单个md格式文件上传</span>
        <a-upload
          name="file"
          :show-upload-list="false"
          accept=".md"
          :multiple="false"
          :before-upload="beforeUpload"
        >
          <a-button type="primary">上传文档</a-button>
        </a-upload>
      </span>
    </div>
  </div>
  <div class="experiment-content">
    <marked-editor v-model:value="experimentContent" :preview="preview" />
    <Submit @submit="onSubmit" @cancel="cancel" v-if="!preview"></Submit>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from "vue";
import { MessageApi } from "ant-design-vue/lib/message";
import markedEditor from "src/components/editor/markedEditor.vue";
import Submit from "src/components/submit/index.vue";

const $message: MessageApi = inject("$message")!;
const preview = ref<boolean>(true);
const experimentContent = ref<any>("aa");
// 上传文件
const beforeUpload = (file: any, fileList: any) => {
  // console.log(file, fileList)
  let arr = file.name.split(".");
  if (arr[arr.length - 1] !== "md") {
    $message.warn("请上传markdown文件");
    // return;
  }
  const fs = new FormData();
  fs.append("jupyter_file", file);
  // fs.append('taskfile_subdir', props.jupyterUuid)
  // props.taskList.describe = "66";
  // videoUrl.value = '111'
};
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
  .operate-btns {
    .tips {
      font-size: var(--font-size-sm);
      color: var(--black-25);
    }
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
