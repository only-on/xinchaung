<template>
  <div class="experimental-guide-tab">
    <!-- taskType 5任务制实验 -->
    <task-guide v-if="taskType === 5"></task-guide>
    <test-guide v-else></test-guide>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, inject, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import taskGuide from "./taskGuide.vue";
import testGuide from "./testGuide.vue";
const preview = true;
const route = useRoute();
const router = useRouter();
let vmQuery = route.query as any;
const {
  opType,
  connection_id,
  topoinst_uuid,
  taskId,
  type,
  topoinst_id,
  routerQuery,
}: any = vmQuery;
console.log(opType, taskId, type, topoinst_id);
let taskType: any = inject("taskType");
taskType = 5;
</script>

<style lang="less">
.experimental-guide-tab {
  padding: 16px;
  white-space: break-spaces;
  overflow: auto;
  height: calc(100% - 23px);
  .train-experimental-guide {
    // height: 100%;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    > .start-train {
      margin-left: auto;
      margin-top: 35px;
      > button {
        margin-left: 10px;
      }
    }
  }
  .experimental-step-title {
    display: flex;
    justify-content: space-between;
    button {
      flex-shrink: 0;
    }
  }
  .action {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    button {
      margin-left: 15px;
    }
  }
  .guide-title {
    font-size: 20px;
    color: #050101;
    font-weight: 700;
  }
  .demo__container {
    .mark__container {
      border: none;
    }
  }
  .markdown-body.mark__preview {
    min-width: auto;
    overflow: hidden;
  }
  .guide-waraing {
    // background: #f19100;
    // color: var(--black-100);
    background: var(--orangeyellow-6-24);
    color: var(--orangeyellow-6);
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    > span {
      margin-right: 5px;
      font-size: 12px;
    }
  }
}
</style>
