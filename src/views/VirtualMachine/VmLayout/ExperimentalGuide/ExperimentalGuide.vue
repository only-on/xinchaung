<template>
  <div class="experimental-guide-tab">
    <div v-if="!taskType" class="train-experimental-guide">
      {{ isStartTrain }}
      <div v-if="!isStartTrain" class="start-guide-box">
        <h2 class="guide-title">实训概述</h2>
        <marked-editor
          v-if="allInfo && allInfo.base_info.detail"
          v-model="allInfo.base_info.detail"
          :preview="preview"
        />
      </div>
      <div v-else>
        <h4 class="experimental-step-title">
          {{ i + 1 }}、{{ currentStep.name
          }}<a-button type="primary" @click="lookStep" v-if="!isLookTrainGuid"
            >查看步骤</a-button
          >
        </h4>
        <marked-editor
          v-if="currentStep.summary"
          v-model="currentStep.summary"
          :preview="preview"
        />

        <marked-editor
          v-if="isLookTrainGuid && currentStep.detail"
          v-model="currentStep.detail"
          :preview="preview"
        />
        <div class="action">
          <a-button type="primary" @click="lastStep" v-if="i != 0"
            >上一步</a-button
          >
          <a-button
            type="primary"
            @click="nextStep"
            v-if="setpsLength > 1 && i < setpsLength - 1"
            >下一步</a-button
          >
        </div>
      </div>
      <div class="start-train">
        <a-button type="primary" @click="startTrainFun" v-if="!isStartTrain"
          >开始实训</a-button
        >
        <a-button type="primary" @click="backTrainFun" v-if="isStartTrain"
          >返回实训概述</a-button
        >
        <a-button
          type="primary"
          @click="lastTest"
          v-if="isStartTrain && currentTest > 0"
          >上一任务</a-button
        >
        <a-button
          type="primary"
          @click="nextTest"
          v-if="isStartTrain && currentTest < setps.length - 1"
          >下一任务</a-button
        >
      </div>
      <!-- 任务：
      <a-select
        :default-value="setps[0].name"
        style="width: 150px"
        @change="currentSetpChange"
      >
        <a-select-option
          v-for="(item, index) in setps"
          :key="index"
          :value="item.name"
          >{{ item.name }}</a-select-option
        >
      </a-select> -->
    </div>

    <div v-if="taskType && allInfo">
      <h4 class="experimental-step-title">
        {{ i + 1 }}、{{ currentStep.name
        }}<a-button
          type="primary"
          @click="lookStep"
          v-if="currentSteps[i].is_score === 0"
          >查看步骤</a-button
        >
      </h4>
      <marked-editor
        v-if="currentStep.summary"
        v-model="currentStep.summary"
        :preview="preview"
      />

      <marked-editor
        v-if="currentSteps[i].is_score === 1 && currentStep.detail"
        v-model="currentStep.detail"
        :preview="preview"
      />
      <div class="action">
        <a-button type="primary" @click="lastStep" v-if="i != 0"
          >上一步</a-button
        >
        <a-button
          type="primary"
          @click="nextStep"
          v-if="setpsLength > 1 && i < setpsLength - 1"
          >下一步</a-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, watch, onMounted, computed } from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
import { Modal } from "ant-design-vue";
import { stepAction } from "src/utils/vncInspect";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  components: {
    "marked-editor": markedEditor,
  },
  setup() {
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
    const i = ref(0); // 当前第几步
    const currentTest = ref(0); // 当前第几个任务
    const currentStep: any = ref("");
    const setpsLength = ref(0);
    let allInfo: any = inject("allInfo");
    let taskType: any = inject("taskType");
    const setps: any = ref([]);
    const currentSteps: any = ref([]);
    const isStartTrain = ref(false);
    const isLookTrainGuid = ref(false);
    watch(
      () => allInfo,
      () => {
        if (allInfo.value) {
          setps.value = allInfo.value.base_info.step;
          currentSteps.value = allInfo.value.current_step;
          if (currentSteps.value.length === 0) {
            currentSteps.value.length === 2;
          }
          setps.value.forEach((item: any, index: number) => {
            if (currentSteps.value[index]) {
              return;
            } else {
              currentSteps.value[index] = { is_score: 0 };
            }
          });

          currentStep.value = getCurrentStep()[i.value];
        }
      },
      { deep: true, immediate: true }
    );

    function currentSetpChange(value: any, option: any) {
      console.log(value, option);
      currentTest.value = option.key;
      i.value = 0;
      currentStep.value = getCurrentStep()[i.value];
    }

    // 更新当前步骤
    function getCurrentStep() {
      let currentsteps = !taskType.value
        ? setps.value[currentTest.value].steps
        : setps.value;
      setpsLength.value = currentsteps.length;
      return currentsteps;
    }

    // 上一步
    function lastStep() {
      i.value === 0 ? "" : i.value--;
      currentStep.value = getCurrentStep()[i.value];
    }
    // 下一步
    function nextStep() {
      stepActionFun(false).then(() => {
        i.value < setpsLength.value ? i.value++ : "";
        currentStep.value = getCurrentStep()[i.value];
      });
    }

    // 查看步骤
    function lookStep() {
      Modal.confirm({
        title: "提示",
        content: "查看步骤会扣除本步骤50%的分数，确定查看？",
        onOk: () => {
          stepActionFun(true);
        },
        onCancel: () => {
          return false;
        },
      });
    }

    // 查看步骤
    function stepActionFun(isSee: boolean) {
      return new Promise((resolve: any, reject: any) => {
        let params = {
          opType: opType,
          type: type,
          taskId: taskId,
          action: "stepScore",
          topoinst_id: topoinst_id,
          task_step_id: currentStep.value.id,
          see_current_step: isSee ? 1 : 0,
        };
        stepAction(params)
          .then((res: any) => {
            console.log(res);
            if (!taskType.value) {
              currentSteps.value.forEach((item: any) => {
                if (currentStep.value.id === item.task_step_id) {
                  item.is_score =1
                  isLookTrainGuid.value = true
                }else{
                  currentSteps.value.push({
                    task_step_id:currentStep.value.id,
                    is_score:1
                  })
                  isLookTrainGuid.value = true
                }
              });
              console.log(currentSteps);
              
            } else {
              isSee ? (currentSteps.value[i.value].is_score = 1) : "";
            }

            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            reject(false);
          });
      });
    }

    // 开始实训
    function startTrainFun() {
      console.log("start");
      isLookTrainGuid.value = false;
      isStartTrain.value = true;
      currentTest.value = 0;
      i.value = 0;
      currentStep.value = getCurrentStep()[i.value];
      currentSteps.value.forEach((item: any) => {
        if (currentStep.value.id === item.task_step_id) {
          item.is_score === 1
            ? (isLookTrainGuid.value = true)
            : (isLookTrainGuid.value = false);
        }
      });
    }

    // 返回实训概述
    function backTrainFun() {
      console.log("back");

      isStartTrain.value = false;
    }

    // 上一个任务
    function lastTest() {
      isLookTrainGuid.value = false;
      currentTest.value === 0 ? "" : currentTest.value--;
      i.value = 0;
      currentStep.value = getCurrentStep()[i.value];
      currentSteps.value.forEach((item: any) => {
        if (currentStep.value.id === item.task_step_id) {
          item.is_score === 1
            ? (isLookTrainGuid.value = true)
            : (isLookTrainGuid.value = false);
        }
      });
    }
    // 下一个任务
    function nextTest() {
      isLookTrainGuid.value = false;
      currentTest.value < setps.value.length ? currentTest.value++ : "";

      i.value = 0;
      currentStep.value = getCurrentStep()[i.value];
      console.log(currentStep.value);
      currentSteps.value.forEach((item: any) => {
        if (currentStep.value.id === item.task_step_id) {
          item.is_score === 1
            ? (isLookTrainGuid.value = true)
            : (isLookTrainGuid.value = false);
        }
      });
      console.log(currentSteps.value,isLookTrainGuid.value);
    }
    return {
      allInfo,
      preview,
      isStartTrain,
      i,
      setps,
      taskType,
      currentSetpChange,
      currentTest,
      currentStep,
      lastStep,
      nextStep,
      lookStep,
      setpsLength,
      currentSteps,
      startTrainFun,
      backTrainFun,
      lastTest,
      nextTest,
      isLookTrainGuid,
    };
  },
});
</script>

<style lang="less">
.experimental-guide-tab {
  padding: 16px 25px;
  white-space: break-spaces;
  overflow: auto;
  height: calc(100% - 23px);
  .train-experimental-guide {
    height: 100%;
    .start-guide-box {
      display: flex;
      flex-direction: column;
      height: 100%;
      > .start-train {
        margin-left: auto;
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
}
</style>