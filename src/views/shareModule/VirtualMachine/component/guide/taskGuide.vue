<template>
  <div class="task-name single_ellipsis">任务一：任务名称任务名称任务名称任务名称</div>
  <div class="desc-content">
    <div class="title">
      <span>任务描述</span>
      <a-button type="primary" size="small">查看步骤</a-button>
    </div>
    <div class="content">
      <marked-editor
        v-model="allInfo"
        :preview="preview"
      />
    </div>
  </div>
  <div class="step-content">
    <div class="title">任务步骤</div>
    <div class="content">
      <marked-editor
        v-model="allInfo"
        :preview="preview"
      />
    </div>  
  </div>
  <div class="btns">
    <a-button type="primary" class="prev">上一任务</a-button>
    <a-button type="primary">下一任务</a-button>
  </div>
</template>


<script lang="ts" setup>
import { defineComponent, inject, ref, computed, reactive } from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
import { Modal } from "ant-design-vue";
import { stepAction } from "src/utils/vncInspect";
import { findIndex } from "lodash";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
let vmQuery = route.query as any;
let {
  opType,
  connection_id,
  topoinst_uuid,
  taskId,
  type,
  topoinst_id,
  routerQuery,
}: any = vmQuery;
topoinst_id = topoinst_uuid
console.log(opType, taskId, type, topoinst_id);

const preview = true;
const currentTaskIndex = ref(0); // 当前任务索引
const currentStepIndex = ref(0); // 当前步骤索引
let allInfo: any = inject("allInfo");
const taskList: any = reactive([
  {detail: "task1", id: 50000, name: "task1", state: 0, summary: "task1"},
  {detail: "task2", id: 50001, name: "task2", state: 0, summary: "task2"}
])
const isLookGuide = ref(false);
const steps: any = ref({});
const setpsLength = ref(0);
const isLookStep = ref(0);
const currentTest:any=ref({})
const testLength:any=ref(0)
// 开始实训
function startTrainFun() {
  currentTaskIndex.value = 0;
  currentStepIndex.value = 0
  isLookGuide.value = true;
  getCurrentStep();
  getStepStatus(steps.value.id);
}

// 返回实训
function backTrainFun() {
  isLookGuide.value = false;
}

// 上一个任务
async function lastTest() {
  
  await submitStepAction()
  currentTaskIndex.value--;
  currentStepIndex.value = 0;
  
  getCurrentStep();
  getStepStatus(steps.value.id);
}

// 下一个任务
async function nextTest() {
  await submitStepAction()
  currentTaskIndex.value++;
  currentStepIndex.value = 0;
  getCurrentStep();
  getStepStatus(steps.value.id);
}
// 查看步骤
function lookStep() {
  Modal.confirm({
    title: "提示",
    content: "查看步骤会扣除本步骤50%的分数，确定查看？",
    okText:"确定",
    cancelText:"取消",
    onOk: () => {
      let params = {
        opType: opType,
        type: type,
        taskId: taskId,
        action: "stepScore",
        topoinst_id: topoinst_id,
        task_step_id: steps.value.id,
        see_current_step: 1,
      };
      stepAction(params).then((res) => {
        let i = findIndex(allInfo.value.current_step, {
          task_step_id: steps.value.id,
        });
        if (i != -1) {
          allInfo.value.current_step[i].is_see_step = 1;
          isLookStep.value = 1;
        } else {
          allInfo.value.current_step.push({
            task_step_id: steps.value.id,
            is_see_step: 1,
          });
          isLookStep.value = 1;
        }
      });
    },
    onCancel: () => {
      return false;
    },
  });
}

// 返回当前步骤
function getCurrentStep() {
  if (
    allInfo.value &&
    allInfo.value.base_info &&
    allInfo.value.base_info.step.length > 0
  ) {
    currentTest.value=allInfo.value.base_info.step[currentTaskIndex.value]
    testLength.value=currentTest.value.length
    steps.value =
      allInfo.value.base_info.step[currentTaskIndex.value].steps[
        currentStepIndex.value
      ];
    setpsLength.value =
      allInfo.value.base_info.step[currentTaskIndex.value].steps.length;
  } else {
    steps.value = {};
    currentTest.value={}
    setpsLength.value = 0;
    testLength.value=0
  }
}

// 获取当前步骤状态
function getStepStatus(stepId: any) {
  let i = findIndex(allInfo.value.current_step, { task_step_id: stepId });
  isLookStep.value =
    i != -1 ? allInfo.value.current_step[i].is_see_step : 0;
}
// 上一个步骤
function lastStep() {
  console.log("上一个");
  currentStepIndex.value--
  getCurrentStep()
}

// 下一个步骤
function nextStep() {
  console.log("nextStep");
  currentStepIndex.value++
  getCurrentStep()
}

// 查看步骤
function submitStepAction() {
  return new Promise((resolve:any,rejects:any)=>{
    let params = {
      opType: opType,
      type: type,
      taskId: taskId,
      action: "stepScore",
      topoinst_id: topoinst_id,
      task_step_id: steps.value.id,
      see_current_step: 0,
    };
    stepAction(params).then((res) => {
      resolve()
    });
  })
}
</script>

<style lang="less" scoped>
.task-name {
  font-size: var(--font-size-18);
}
.desc-content, .step-content {
  border: 1px solid rgba(0,0,0,0.15);
  margin-bottom: 24px;
  .title {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content {
    padding: 0 16px;
  }
}
.btns {   
  .ant-btn:first-child {
    margin-right: 16px;
  }
}
</style>
