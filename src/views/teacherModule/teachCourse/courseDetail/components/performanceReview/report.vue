<template>
  <a-modal
    class="report-modal"
    title="批阅实验报告"
    v-model:visible="reportVisible"
    @cancel="colseModal"
    :footer="false"
    :destroyOnClose="true"
    :maskClosable="false"
    :width="800"
  >
    <div class="report-wrap">
      <div class="report-template">
        <!-- <onLineReport></onLineReport> -->
        <div v-html="data.html_content"></div>
      </div>
      <div class="action-footer">
        <label><i>*</i>评分</label>
        <a-input placeholder="0~100" v-model:value="data.score"></a-input>
        <a-button type="primary" @click="submit">提交</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, defineProps, defineEmits } from "vue";
// import onLineReport from "src/components/report/onlineReport.vue"
import { message } from "ant-design-vue";

// props传值
const props = defineProps({
  reportVisible: {
    // 弹窗显示隐藏
    default: false,
    type: Boolean,
  },
  data: {
    // 数据
    type: Object as any,
    default: {},
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

// emit方法
const emit = defineEmits(["update:visible", "update:data",'submit']);

// 关闭弹窗
function colseModal() {
  emit("update:visible", false);
}
// 提交
function submit() {
  console.log("submit");
  if (isNaN(props.data.score)) {
    message.warn("非法分数")
    return;
  }

  if (props.data.score>100) {
    message.warn("请输入小于或者等于100")
    return;
  }
  emit("submit")
}
</script>

<style lang="less">
.report-modal {
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
    .report-template{
      padding:0 40px 0 40px;
    }
  }
  // }
}
</style>
