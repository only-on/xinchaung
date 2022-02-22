<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <span v-if="!fileUrl">
        <span class="tips">支持单个md、doc、docx、pdf格式文件上传</span>
        <a-upload
          name="file"
          :show-upload-list="false"
          accept="md, doc, docx, pd"
          :multiple="false"
          :before-upload="beforeUpload"
        >
          <a-button type="primary">上传文档</a-button>
        </a-upload>
      </span>
      <a-button type="primary" v-if="!fileUrl" @click="selectFile"
        >选择文档</a-button
      >
      <a-button type="primary" v-if="fileUrl" @click="deleteFile"
        >移除</a-button
      >
    </div>
  </div>
  <div class="experiment-content">
    <iframe :src="fileUrl" width="100%" v-if="fileUrl"></iframe>
    <div v-else>
      <marked-editor v-model:value="experimentContent" :preview="preview" />
      <Submit @submit="onSubmit" @cancel="cancel" v-if="isMarked"></Submit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from "vue";
import { MessageApi } from "ant-design-vue/lib/message";
import markedEditor from "src/components/editor/markedEditor.vue";
import Submit from "src/components/submit/index.vue";

const $message: MessageApi = inject("$message")!;
const isMarked = ref<boolean>(true);
const fileUrl = ref<string>("111");

const preview = ref<boolean>(false);
const experimentContent = ref<any>("aa");

// 上传文件
const beforeUpload = (file: any, fileList: any) => {
  // console.log(file, fileList)
  let arr = file.name.split(".");
  // if (arr[arr.length - 1] !== "mp4") {
  //   $message.warn("请上传md、doc、docx、pdf格式文件");
  //   // return;
  // }
  const fs = new FormData();
  fs.append("jupyter_file", file);
  // fs.append('taskfile_subdir', props.jupyterUuid)
  // props.taskList.describe = "66";
  fileUrl.value = "111";
};
// 选择文件
const selectFile = () => {
  console.log("选择文件");
}; // 移除文件
const deleteFile = () => {
  console.log("移除文件");
  fileUrl.value = "";
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
