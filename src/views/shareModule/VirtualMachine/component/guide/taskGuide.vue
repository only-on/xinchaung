<template>
  <p class="guide-waraing" v-if="!currentTask.state">
    <span class="icon-jinggao iconfont"></span>查看任务步骤扣除50%的任务得分
  </p>
  <div class="task-name single_ellipsis">任务一：{{ currentTask.name }}</div>
  <div class="desc-content">
    <div class="title">
      <span>任务描述</span>
      <a-button
        type="primary"
        size="small"
        v-if="!currentTask.state"
        @click="lookStep"
        >查看步骤</a-button
      >
    </div>
    <div class="content" :class="currentTask.state ? 'show-step' : ''">
      <marked-editor v-model="currentTask.detail" :preview="preview" />
    </div>
  </div>
  <div class="step-content" v-if="currentTask.state">
    <div class="title">任务步骤</div>
    <div class="content" :class="currentTask.state ? 'show-step' : ''">
      <marked-editor v-model="currentTask.summary" :preview="preview" />
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
topoinst_id = topoinst_uuid;
console.log(opType, taskId, type, topoinst_id);

const preview = true;
const currentTaskIndex: any = ref(0); // 当前任务索引
let allInfo: any = inject("allInfo");
const taskList: any = reactive([
  {
    detail:
      "dasdasd\nfhfhkfhh^hkghk^**fdfghdfghdfh# dfgb xdgsdsdg**\n++fghdfghdfghd++~~dfghsertgvsdfg~~",
    id: 50000,
    name: "task1",
    state: 0,
    summary: "task1",
  },
  {
    detail:
      "dasdasd\nfhfhkfhh^hkghk^**fdfghdfghdfh# dfgb xdgsdsdg**\n++fghdfghdfghd++~~dfghsertgvsdfg~~dasdasd\nfhfhkfhh^hkghk^**fdfghdfghdfh# dfgb xdgsdsdg**\n++fghdfghdfghd++~~dfghsertgvsdfg~~dasdasd\nfhfhkfhh^hkghk^**fdfghdfghdfh# dfgb xdgsdsdg**\n++fghdfghdfghd++~~dfghsertgvsdfg~~",
    id: 50001,
    name: "task2",
    state: 0,
    summary: "task2",
  },
]);
const currentTask: any = ref({});
Object.assign(currentTask.value, taskList[currentTaskIndex.value]);
console.log(currentTask.value, taskList[currentTaskIndex.value]);
const steps: any = ref({});

// 上一个任务
const preTask = () => {
  currentTaskIndex.value--;
  Object.assign(currentTask.value, taskList[currentTaskIndex.value]);
};
// 下一个任务
const nextTask = () => {
  currentTaskIndex.value++;
  Object.assign(currentTask.value, taskList[currentTaskIndex.value]);
};

// 查看步骤
function lookStep() {
  Modal.confirm({
    title: "提示",
    content: "查看步骤会扣除本步骤50%的分数，确定查看？",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      currentTask.value.state = 1;
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
          currentTask.value.state = 1;
        } else {
          allInfo.value.current_step.push({
            task_step_id: steps.value.id,
            is_see_step: 1,
          });
          currentTask.value.state = 1;
        }
      });
    },
    onCancel: () => {
      return false;
    },
  });
}
</script>

<style lang="less" scoped>
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
    padding: 0 4px;
    .demo__container {
      :deep(.mark__preview) {
        height: 400px;
        overflow: auto;
      }
    }
    &.show-step {
      :deep(.mark__preview) {
        height: 183px;
      }
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
