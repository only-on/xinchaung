<template>
<div v-if="allInfo &&allInfo.base_info">
  <div
    v-if="
      allInfo.base_info.is_simple == 0 &&
      steps.length > 0 &&
      taskType === '1'
    "
  >
    <p class="guide-waraing">
      <span class="icon-shuoming iconfont"></span>查看任务步骤扣除50%的任务得分
    </p>
    <h4 class="experimental-step-title">
      {{ currentStepIndex + 1 }}、{{ steps[currentStepIndex].name
      }}<a-button type="primary" @click="lookStep" v-if="isLookStatus === 0"
        >查看步骤</a-button
      >
    </h4>
    <marked-editor
      v-if="steps[currentStepIndex].summary"
      v-model="steps[currentStepIndex].summary"
      :preview="preview"
    />

    <marked-editor
      v-if="isLookStatus === 1 && steps[currentStepIndex].detail"
      v-model="steps[currentStepIndex].detail"
      :preview="preview"
    />
    <div class="action">
      <a-button type="primary" @click="lastStep" v-if="currentStepIndex !== 0"
        >上一步</a-button
      >
      <a-button
        type="primary"
        @click="nextStep"
        v-if="steps.length > 1 && currentStepIndex < steps.length - 1"
        >下一步</a-button
      >
    </div>
  </div>
  <div
    v-else-if="allInfo.base_info.guide && Number(taskType) === 1"
    class="111"
  >
    <marked-editor v-model="allInfo.base_info.guide" :preview="preview" />
  </div>
  <div
    v-else-if="allInfo && allInfo.base_info && allInfo.base_info.guide && Number(taskType) === 4"
    class="juypter-box"
  >
    <iframe
      :src="allInfo.base_info.guide"
      frameborder="0"
      style="width: 100%; height: 100%"
    ></iframe>
  </div>
  <div v-else-if="allInfo.base_info.guide && Number(taskType) === 6">
    <video
      :poster="videoCover"
      style="width: 100%; height: 650px"
      controls="true"
      :src="allInfo.base_info.guide"
    ></video>
  </div>
  <div v-else-if="allInfo.base_info.guide && Number(taskType) === 7">
    <div v-if="true">
      <marked-editor v-model="allInfo.base_info.guide" :preview="preview" />
    </div>
    <PdfVue :url="allInfo.base_info.guide" v-else />
  </div>
</div>
<empty v-else> </empty>
</template>

<script lang="ts" setup>
import { defineComponent, ref, inject, onMounted, Ref, watch } from "vue";
import videoCover from 'src/assets/images/common/videoCover.jpg'
import markedEditor from "src/components/editor/markedEditor.vue";
import PdfVue from "src/components/pdf/pdf.vue";
import { stepAction } from "src/utils/vncInspect";
import { findIndex } from "lodash";
import { Modal } from "ant-design-vue";
import empty from "src/components/Empty.vue";
import extStorage from "src/utils/extStorage";
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
topoinst_id = topoinst_uuid;
console.log(opType, taskId, type, topoinst_id);

const ls = extStorage.lStorage;
const role = ls.get("role");
const preview = true;
const currentStepIndex = ref(0); // 当前步骤索引
let allInfo: any = inject("baseInfo") || ref({ base_info: {} });
const taskType: any = inject("taskType");
const steps: Ref<any> = ref([]); // 所有步骤
const isLookStatus = ref(0); // 当前步骤能否查看
const currentStepStatus: any = ref([]); // 当前查看过的所有步骤
onMounted(() => {
  // console.log(allInfo.value.base_info.step);
  // allInfo.value.current_step=[]
});

// ？？？
watch(
  () => allInfo.value.base_info,
  () => {
    console.log(allInfo.value.base_info);
    if (allInfo.value.base_info) {
      steps.value = allInfo.value.base_info.step;
    }
  },
  { deep: true, immediate: true }
);
watch(
  () => allInfo.value.current_step,
  () => {
    console.log(allInfo.value.current_step);
    if (allInfo.value.current_step) {
      currentStepStatus.value = allInfo.value.current_step;
      getCurrentStepStatus();
    }
  },
  { deep: true, immediate: true }
);

// 查看步骤
function lookStep() {
  if (role === 3) {
    isLookStatus.value = 1;
    return;
  }
  Modal.confirm({
    title: "提示",
    content: "查看步骤会扣除本步骤50%的分数，确定查看？",
    onOk: () => {
      let params = {
        opType: opType,
        type: type,
        taskId: taskId,
        action: "stepScore",
        topoinst_id: topoinst_id,
        task_step_id: steps.value[currentStepIndex.value].id,
        see_current_step: 1,
      };
      stepAction(params).then((res:any) => {
        let i = findIndex(allInfo.value.current_step, {
          task_step_id: steps.value[currentStepIndex.value].id,
        });
        if (i !== -1) {
          allInfo.value.current_step[i].is_see_step = 1;
          isLookStatus.value = 1;
        } else {
          allInfo.value.current_step.push({
            task_step_id: steps.value[currentStepIndex.value].id,
            is_see_step: 1,
          });
          isLookStatus.value = 1;
        }
      });
    },
    onCancel: () => {
      return false;
    },
  });
}

// 上一步
function lastStep() {
  currentStepIndex.value--;
  if (role === 3) return;
  getCurrentStepStatus();
}

// 下一步
function nextStep() {
  if (role === 3) {
    currentStepIndex.value++;
    return;
  }
  let params = {
    opType: opType,
    type: type,
    taskId: taskId,
    action: "stepScore",
    topoinst_id: topoinst_id,
    task_step_id: steps.value[currentStepIndex.value].id,
    see_current_step: 0,
  };
  stepAction(params).then((res:any) => {
    currentStepIndex.value++;
    getCurrentStepStatus();
  });
}

// 获取当前步骤显示状态
function getCurrentStepStatus() {
  isLookStatus.value = 0;
  if (currentStepStatus.value.length === 0) return;
  let i = findIndex(currentStepStatus.value, {
    task_step_id: steps.value[currentStepIndex.value].id,
  });
  console.log(i);
  if (i !== -1) {
    isLookStatus.value = currentStepStatus.value[i].is_see_step;
  } else {
    isLookStatus.value = 0;
  }
}
</script>

<style lang="less" scoped>
.juypter-box {
  height: 536px;
}
</style>
