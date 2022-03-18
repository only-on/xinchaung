<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <a-button type="primary" @click="preview = false" v-if="preview"
        >编辑</a-button
      >
      <a-button type="primary" class="add-task" v-if="!preview" @click="addTask"
        >添加任务</a-button
      >
      <a-button type="primary" v-if="!preview" @click="onSubmit">保存</a-button>
    </div>
  </div>
  <div class="experiment-content">
    <div
      class="task-list"
      v-for="(v, i) in taskData.taskList"
      :key="v.name + i"
    >
      <task-list :preview="preview" :taskList="v" :index="i">{{ i }}</task-list>
    </div>
  </div>
  <Submit @submit="onSubmit" @cancel="cancel" v-if="!preview"></Submit>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import markedEditor from "src/components/editor/markedEditor.vue";
import Submit from "src/components/submit/index.vue";
import taskList from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/taskList.vue";

const router = useRouter();
const route = useRoute();
const { id } = route.query;
const preview = ref<boolean>(true);
const experimentContent = ref<any>("aa");
interface ItaskList {
  id?: number;
  name: string;
  describe: string;
  step: string;
  checked: boolean;
  isAdd?: boolean;
}
interface ItaskData {
  taskList: ItaskList[];
}
const taskData = reactive<ItaskData>({
  taskList: [
    {
      id: 1,
      name: "1",
      describe: "1",
      step: "1",
      checked: true,
    },
    {
      id: 2,
      name: "2",
      describe: "2",
      step: "2",
      checked: false,
    },
  ],
});
const addTask = () => {
  taskData.taskList.push({
    name: "",
    describe: "",
    step: "",
    checked: false,
    isAdd: true,
  });
};
const onSubmit = () => {
  console.log(taskData.taskList);
};
const cancel = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
.title {
  line-height: 34px;
  padding: 10px 0 5px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  h3 {
    margin-left: 12px;
  }
  .ant-btn {
    margin-left: 8px;
  }
  .add-task {
    background: var(--brightBtn);
    border-color: var(--brightBtn);
  }
}
.experiment-content {
  // margin-top: 16px;
  padding: 0 23px;
  .task-list {
    margin-top: 24px;
  }
}
.submit {
  margin-top: 16px;
}
</style>
