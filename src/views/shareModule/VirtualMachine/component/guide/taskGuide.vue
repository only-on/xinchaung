<template>
<div v-if="baseInfo.base_info.step.length" class="vm-task-guide">
  <p class="guide-waraing" v-if="!isLookStep&&currentTask.state&&role===4&&!recommendType">
    <span class="icon-jinggao iconfont"></span>查看任务步骤扣除50%的任务得分
  </p>
  <div class="current-task-content">
  <div class="task-name single_ellipsis" :title="currentTask.name">任务{{ NoToCh(currentTaskIndex + 1) }}：{{ currentTask.name }}</div>
  <div class="task-content" :class="!recommendType&&(isLookStep&&currentTask.state || role !== 4) ? 'show-step' : ''">
  <div class="desc-content">
    <div class="title">
      <span>任务描述</span>
      <a-button
        type="primary"
        size="small"
        v-if="!isLookStep&&currentTask.state&&role===4&&!recommendType"
        @click="lookStep"
        >查看步骤</a-button
      >
    </div>
    <div class="content">
      <marked-editor v-model="currentTask.summary" :preview="preview" />
    </div>
  </div>
  <div class="step-content" v-if="!recommendType&&(isLookStep&&currentTask.state || role !== 4)">
    <div class="title">任务步骤</div>
    <div class="content">
      <marked-editor v-model="currentTask.detail" :preview="preview" />
    </div>
  </div>
  </div>
  </div>
  <div class="btns">
    <a-button
      type="primary"
      class="prev"
      @click="preTask"
      v-if="currentTaskIndex > 0"
      >上一任务</a-button
    >
    <a-button
      type="primary"
      @click="nextTask"
      v-if="currentTaskIndex < taskList.length - 1"
      >下一任务</a-button
    >
  </div>
</div>
<empty v-else> </empty>
</template>

<script lang="ts" setup>
import { defineComponent, inject, ref, computed, reactive, watch } from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
import { Modal } from "ant-design-vue";
import { stepAction } from "src/utils/vncInspect";
import { findIndex } from "lodash";
import { useRoute, useRouter } from "vue-router";
import storage from "src/utils/extStorage";
import { NoToCh } from "src/utils/common";
const route = useRoute();
const router = useRouter();
let role = storage.lStorage.get("role");
let vmQuery = route.query as any;
let {
  opType,
  connection_id,
  topoinst_uuid,
  taskId,
  type,
  topoinst_id,
  routerQuery,
  recommendType,
}: any = vmQuery;
topoinst_id = topoinst_uuid;
console.log(opType, taskId, type, topoinst_id);

const preview = true;
const currentTaskIndex: any = ref(0); // 当前任务索引
const isLookStep = ref(0);
let baseInfo: any = inject("baseInfo");
const taskList: any = reactive([]);
const currentTask: any = ref({});
// Object.assign(currentTask.value, taskList[currentTaskIndex.value]);
console.log(currentTask.value, taskList[currentTaskIndex.value]);
const steps: any = ref({});

// 上一个任务
const preTask = async () => {
  baseInfo.value.base_info.step_score_exists && role===4 ? await submitStepAction() : ''
  currentTaskIndex.value--;
  currentTask.value = baseInfo.value.base_info.step[currentTaskIndex.value];
  getStepStatus(currentTask.value.id)
};
// 下一个任务
const nextTask = async () => {
  console.log(baseInfo.value.base_info.step_score_exists && role===4)
  baseInfo.value.base_info.step_score_exists && role===4 ? await submitStepAction() : ''
  currentTaskIndex.value++;
  currentTask.value = baseInfo.value.base_info.step[currentTaskIndex.value];
  console.log(taskList)
  getStepStatus(currentTask.value.id)
};
function submitStepAction() { 
  return new Promise((resolve:any,rejects:any)=>{
    let params = {
      opType: opType,
      type: type,
      taskId: taskId,
      action: "stepScore",
      topoinst_id: topoinst_id,
      task_step_id: currentTask.value.id,
      see_current_step: 0,
    };
    stepAction(params).then((res:any) => {
      resolve()
    });
  })
}
// 获取当前步骤状态
function getStepStatus(stepId: any) {
  let i = findIndex(baseInfo.value.current_step, { task_step_id: currentTask.value.id });
  isLookStep.value =
    i != -1 ? baseInfo.value.current_step[i].is_see_step : 0;
}

// 查看步骤
function lookStep() {
  if (role !== 4) {
    currentTask.value.state = 1;
    isLookStep.value = 1
    return
  }
  Modal.confirm({
    title: "提示",
    content: "查看步骤会扣除本步骤50%的分数，确定查看？",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      // currentTask.value.state = 1;
      let params = {
        opType: opType,
        type: type,
        taskId: taskId,
        action: "stepScore",
        topoinst_id: topoinst_id,
        task_step_id: currentTask.value.id,
        see_current_step: 1,
      };
      stepAction(params).then((res:any) => {
        let i = findIndex(baseInfo.value.current_step, {
          task_step_id: currentTask.value.id,
        });
        currentTask.value.state = 1;
        isLookStep.value = 1
        if (i != -1) {
          baseInfo.value.current_step[i].is_see_step = 1;
        } else {
          baseInfo.value.current_step.push({
            task_step_id: currentTask.value.id,
            is_see_step: 1,
          });
          // currentTask.value.state = 1;
        }
      }).catch(() => {
        currentTask.value.state = 1;
        isLookStep.value = 1
      });
    },
    onCancel: () => {
      return false;
    },
  });
}
watch(
  () => baseInfo.value.base_info,
  () => {
    console.log(baseInfo.value.base_info);
    if (baseInfo.value.base_info) {
      taskList.length = 0
      baseInfo.value.base_info.step.length ? currentTask.value = baseInfo.value.base_info.step[currentTaskIndex.value]:'';
      taskList.push(...baseInfo.value.base_info.step)
    }
    getStepStatus(currentTask.value.id)
  },
  { deep: true, immediate: true }
);
</script>

<style lang="less" scoped>
.vm-task-guide {
  height: 100%;
  // display: flex;
  // flex-direction: column;
  .current-task-content {
    // flex: 1;
    height: calc(100% - 70px);
    .task-content {
      height: calc(100% - 29px);
      .desc-content, .step-content {
        height: calc(100% - 24px);
      }
      &.show-step {
        .desc-content, .step-content {
          height: calc(50% - 24px);
        }
      }
      :deep(.markdown-body) {
        overflow: auto;
      }
    }
  }
}
.task-name {
  font-size: var(--font-size-18);
}
.desc-content,
.step-content {
  border: 1px solid rgba(0, 0, 0, 0.15);
  margin-bottom: 24px;
  .title {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ant-btn {
      background: var(--brightBtn);
      border-color: var(--brightBtn);
    }
  }
  .content {
    height: calc(100% - 40px);
    padding: 0 4px;
    .demo__container {
      height: 100%;
      overflow: auto;
      // :deep(.mark__preview) {
      //   height: 290px;
      //   overflow: auto;
      // }
    }
    &.show-step {
      // :deep(.mark__preview) {
      //   height: 130px;
      // }
    }
  }
}
.btns {
  .ant-btn:first-child {
    margin-right: 16px;
  }
}
.guide-waraing {
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
</style>
