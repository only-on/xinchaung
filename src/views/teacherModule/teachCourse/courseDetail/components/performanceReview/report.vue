<template>
  <a-modal
    class="report-modal"
    title="批阅实验报告"
    v-model:visible="reportVisible"
    @cancel="colseModal"
    :footer="false"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <div class="report-wrap">
      <div class="report-template">报告模板</div>
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
    default: {
      remark: "",
      score: 0,
    },
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

// emit方法
const emit = defineEmits(["update:visible", "update:data"]);

// 关闭弹窗
function colseModal() {
  emit("update:visible", false);
}
// 提交
function submit() {
  console.log("submit");
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
