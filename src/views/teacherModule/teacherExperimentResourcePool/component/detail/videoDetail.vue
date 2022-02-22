<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <span class="tips" v-if="!videoUrl"
        >支持单个500M以内的MP4格式文件上传</span
      >
      <a-upload
        name="file"
        :show-upload-list="false"
        accept=".mp4"
        :multiple="false"
        :before-upload="beforeUpload"
        v-if="!videoUrl"
      >
        <a-button type="primary">上传视频</a-button>
      </a-upload>
      <a-button type="primary" @click="selectVideo" v-if="!videoUrl"
        >选择视频</a-button
      >
      <a-button type="primary" @click="deletVideo" v-if="videoUrl"
        >移除</a-button
      >
    </div>
  </div>
  <div class="experiment-content">
    <video
      style="width: 100%; height: 650px"
      controls="true"
      :src="videoUrl"
      v-if="videoUrl"
    ></video>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from "vue";
import { MessageApi } from "ant-design-vue/lib/message";
const $message: MessageApi = inject("$message")!;
const videoUrl = ref("");
// 上传视频
const beforeUpload = (file: any, fileList: any) => {
  // console.log(file, fileList)
  let arr = file.name.split(".");
  if (arr[arr.length - 1] !== "mp4") {
    $message.warn("请上传mp4");
    // return;
  }
  const fs = new FormData();
  fs.append("jupyter_file", file);
  // fs.append('taskfile_subdir', props.jupyterUuid)
  // props.taskList.describe = "66";
  videoUrl.value = "111";
};
// 选择视频
const selectVideo = () => {
  console.log("选择视频");
};
// 移除视频
const deletVideo = () => {
  console.log("移除视频");
  videoUrl.value = "";
};
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
  .operate-btns {
    .ant-btn {
      margin-left: 8px;
    }
    .tips {
      font-size: var(--font-size-sm);
      color: var(--black-25);
    }
  }
}
.experiment-content {
  margin-top: 16px;
}
</style>
