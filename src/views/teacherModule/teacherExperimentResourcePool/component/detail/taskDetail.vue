<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <a-button type="primary" @click="preview = false" v-if="preview === true"
        >编辑</a-button
      >
      <a-button type="primary">上传文档</a-button>
    </div>
  </div>
  <div class="experiment-content">
    <div class="task-list" v-for="(v, i) in 3" :key="v">
      <task-list>{{ i }}</task-list>
    </div>
    <Submit @submit="onSubmit" @cancel="cancel"></Submit>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
import Submit from "src/components/submit/index.vue";
import taskList from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/taskList.vue";

const preview = ref<boolean>(true);
const experimentContent = ref<any>("aa");
const onSubmit = () => {};
const cancel = () => {};
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
}
.experiment-content {
  // margin-top: 16px;
  padding: 0 24px;
  .task-list {
    margin-top: 24px;
  }
  .submit {
    margin-top: 16px;
  }
}
</style>
