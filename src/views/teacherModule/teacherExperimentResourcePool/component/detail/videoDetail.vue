<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <span class="tips">支持单个500M以内的MP4格式文件上传</span>
      <a-button type="primary">上传视频</a-button>
      <a-button type="primary">选择视频</a-button>
      <a-button type="primary">移除</a-button>
    </div>
  </div>
  <div class="experiment-content">
    <video
      style="width: 100%; height: 650px"
      controls="true"
      :src="videoUrl"
    ></video>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const videoUrl = ref("");
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
