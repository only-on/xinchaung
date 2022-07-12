<template>
  <a-modal
    class="video-modal"
    title="评分参考视频"
    v-model:visible="visible"
    @cancel="colseModal"
    :footer="false"
    :destroyOnClose="true"
    :maskClosable="false"
    :width="1000"
  >
    <div class="code-wrap">
      <div class="video-template">
        <common-video
          :src="url"
          controls="true"
          style="width: 100%;"
          autoplay="true"
          ref="video"
        ></common-video>
      </div>
      <div class="action-footer">
        <a-button type="primary" @click="colseModal">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, defineProps, defineEmits } from "vue";
import videoCover from 'src/assets/images/common/videoCover.jpg'
import CommonVideo from "../../../../../../components/common/CommonVideo.vue";
// props传值
const props = defineProps({
  visible: {
    // 弹窗显示隐藏
    default: false,
    type: Boolean,
  },
  url: {
    // 数据
    type: Object as any,
    default: "",
  },
});

// emit方法
const emit = defineEmits(["update:visible", "update:url"]);

// 关闭弹窗
function colseModal() {
  emit("update:visible", false);
}
</script>

<style lang="less">
.video-modal {
  .action-footer {
    display: flex;
    justify-content: center;
    border-radius: 0px 0px 10px 10px;
    box-shadow: 0px -3px 6px 0px var(--black-15);
    height: 70px;
    align-items: center;
    i {
      font-style: normal;
      margin-right: 2px;
      color: var(--red-5);
    }
    label {
      flex-shrink: 0;
    }
    input {
      width: 200px;
      margin: 0 8px;
    }
  }
  // :deep(.report-modal){
  .ant-modal-body {
    padding: 0;
    .video-template {
      padding: 0 20px 0 20px;
    }
  }
  // }
}
</style>
