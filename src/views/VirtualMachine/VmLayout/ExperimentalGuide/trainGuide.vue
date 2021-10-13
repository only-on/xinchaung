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
      <h4 class="experimental-step-title">
        {{ currentStepIndex + 1 }}、{{ steps.name
        }}<a-button type="primary" @click="lookStep" v-if="isLookStep === 0"
          >查看步骤</a-button
        >
      </h4>
      <marked-editor
        v-if="steps.summary"
        v-model="steps.summary"
        :preview="preview"
      />

      <marked-editor
        v-if="isLookStep === 1 && steps.detail"
        v-model="steps.detail"
        :preview="preview"
      />
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
    <div class="start-train">
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


<script lang="ts">
import { defineComponent, inject, ref, computed } from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
import { Modal } from "ant-design-vue";
import { stepAction } from "src/utils/vncInspect";
import { findIndex } from "lodash";

export default defineComponent({
  components: {
    "marked-editor": markedEditor,
  },
  props: ["opType", "type", "taskId", "topoinst_id"],
  setup(props) {
    const preview = true;
    const currentTestIndex = ref(0); // 当前任务索引
    const currentStepIndex = ref(0); // 当前步骤索引
    let allInfo: any = inject("allInfo");
    const isLookGuide = ref(false);
    const steps: any = ref({});
    const setpsLength = ref(0);
    const isLookStep = ref(0);
    // 开始实训
    function startTrainFun() {
      currentTestIndex.value = 0;
      isLookGuide.value = true;
      getCurrentStep();
      getStepStatus(steps.value.id);
    }

    // 返回实训
    function backTrainFun() {
      isLookGuide.value = false;
    }

    // 上一个任务
    function lastTest() {
      currentTestIndex.value--;
      currentStepIndex.value = 0;
      getCurrentStep();
      getStepStatus(steps.value.id);
    }

    // 下一个任务
    function nextTest() {
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
        onOk: () => {
          let params = {
            opType: props.opType,
            type: props.type,
            taskId: props.taskId,
            action: "stepScore",
            topoinst_id: props.topoinst_id,
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
        steps.value =
          allInfo.value.base_info.step[currentTestIndex.value].steps[
            currentStepIndex.value
          ];
        setpsLength.value =
          allInfo.value.base_info.step[currentTestIndex.value].steps.length;
      } else {
        steps.value = {};
        setpsLength.value = 0;
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
    }

    // 下一个步骤
    function nextStep() {
      console.log("nextStep");
    }
    return {
      allInfo,
      isLookGuide,
      preview,
      currentTestIndex,
      startTrainFun,
      backTrainFun,
      lastTest,
      nextTest,
      steps,
      currentStepIndex,
      lookStep,
      setpsLength,
      lastStep,
      nextStep,
      isLookStep,
    };
  },
});
</script>
