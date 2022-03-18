<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <span class="tips">仅支持ipynb文件</span>
      <a-upload
        name="file"
        :show-upload-list="false"
        accept=".ipynb"
        :multiple="false"
        :before-upload="beforeUpload"
      >
        <a-button type="primary">重新上传</a-button>
      </a-upload>
    </div>
  </div>
  <div class="experiment-content">

  </div>
</template>

<script lang="ts" setup>
import { ref, inject, reactive } from "vue";
import { MessageApi } from "ant-design-vue/lib/message";
import Submit from "src/components/submit/index.vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { readFile } from "src/utils/getFileType";
const $message: MessageApi = inject("$message")!;
const http = request.teacherExperimentResourcePool;

const beforeUpload = async (file: any, fileList: any) => {
  // const text = await readFile(file, 'ipynb');
  const suffix = (file && file.name).split(".")[1];
  if (suffix !== 'ipynb') {
    $message.warn(`请上传 .ipynb格式文件`)
    return false;
  }
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
