<template>
  <div class="train-experimental-guide">
    <div v-if="!isLookGuide">
      <h2 class="guide-title">实训概述</h2>
      <marked-editor
        v-if="allInfo && allInfo.base_info"
        v-model="allInfo.base_info.detail"
        :preview="preview"
      />
    </div>
    <div v-else>
      <p class="guide-waraing"><span class="icon-shuoming iconfont"></span>查看任务步骤扣除50%的任务得分</p>
      <h4 class="experimental-step-title">
        {{ currentTestIndex + 1 }}、{{ currentTest.name
        }}<a-button type="primary" @click="lookStep" v-if="isLookStep === 0&&steps.state==0"
          >查看步骤</a-button
        >
      </h4>
      <template v-if="currentTest.describe">
        <h2 class="test-title">任务描述:</h2>
        <marked-editor
          v-model="currentTest.describe	"
          :preview="preview"
        />
      </template>
      
      <template v-if="steps.summary">
        <h2 class="test-title">步骤概述:</h2>
        <marked-editor
          
          v-model="steps.summary"
          :preview="preview"
        />
      </template>
      
      <template
       v-if="(isLookStep === 1||steps.state==1) && steps.detail"
       >
        <h2 class="test-title">任务步骤:</h2>
        <marked-editor

          v-model="steps.detail"
          :preview="preview"
        />
      </template>
      
      <div class="action">
        <a-button type="primary" @click="lastStep" v-if="currentStepIndex != 0"
          >上一步</a-button
        >
        <a-button
          type="primary"
          @click="nextStep"
          v-if="setpsLength > 1 && currentStepIndex < setpsLength - 1"
          >下一步</a-button
        >
      </div>
    </div>
    <div class="start-train" v-if="!['prepare','help'].includes(opType)">
      <a-button type="primary" @click="startTrainFun" v-if="!isLookGuide"
        >开始实训</a-button
      >
      <a-button type="primary" @click="backTrainFun" v-if="isLookGuide"
        >返回实训概述</a-button
      >
      <a-button
        type="primary"
        @click="lastTest"
        v-if="isLookGuide && currentTestIndex > 0"
        >上一任务</a-button
      >
      <a-button
        type="primary"
        @click="nextTest"
        v-if="
          isLookGuide && currentTestIndex < allInfo.base_info.step.length - 1
        "
        >下一任务</a-button
      >
    </div>
  </div>
</template>


<script lang="ts" setup>
import { defineComponent, inject, ref, computed } from "vue";
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
const currentTestIndex = ref(0); // 当前任务索引
const currentStepIndex = ref(0); // 当前步骤索引
let allInfo: any = inject("allInfo");
const isLookGuide = ref(false);
const steps: any = ref({});
const setpsLength = ref(0);
const isLookStep = ref(0);
const currentTest:any=ref({})
const testLength:any=ref(0)
// 开始实训
function startTrainFun() {
  currentTestIndex.value = 0;
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
  currentTestIndex.value--;
  currentStepIndex.value = 0;
  
  getCurrentStep();
  getStepStatus(steps.value.id);
}

// 下一个任务
async function nextTest() {
  await submitStepAction()
  currentTestIndex.value++;
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
    currentTest.value=allInfo.value.base_info.step[currentTestIndex.value]
    testLength.value=currentTest.value.length
    steps.value =
      allInfo.value.base_info.step[currentTestIndex.value].steps[
        currentStepIndex.value
      ];
    setpsLength.value =
      allInfo.value.base_info.step[currentTestIndex.value].steps.length;
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
.experimental-step-title{
  font-size: 20px;
}
.test-title{
  font-size: 16px;
  margin-top: 25px;
}
</style>
