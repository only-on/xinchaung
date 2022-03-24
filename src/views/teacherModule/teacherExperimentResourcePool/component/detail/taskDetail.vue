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
      v-for="(v, i) in props.detail.task_steps"
      :key="v.content_id"
    >
      <task-list :preview="preview" :taskList="v" :index="i" @delet="delet"></task-list>
    </div>
  </div>
  <Submit @submit="onSubmit" @cancel="cancel" v-if="!preview"></Submit>
</template>

<script lang="ts" setup>
import { ref, reactive, PropType } from "vue";
import { useRouter, useRoute } from "vue-router";
import markedEditor from "src/components/editor/markedEditor.vue";
import Submit from "src/components/submit/index.vue";
import taskList from "src/views/teacherModule/teacherExperimentResourcePool/component/detail/taskList.vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
const http = request.teacherExperimentResourcePool;
const router = useRouter();
const route = useRoute();
const { id } = route.query;
const preview = ref<boolean>(true);

interface Ifiles {
  content_id: number
  name: string
  detail: string
  summary: string
  state: number
}
interface IDetail {
  id: number
  task_steps: Ifiles[]
}
interface Props {
  detail: IDetail
}
const props: Props = defineProps({
  detail: {
    type: Object as PropType<IDetail>,
    require: true,
    default: {
      id: 0,
      task_steps: []
    }
  }
})

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
  props.detail.task_steps.push({
    content_id: 0,
    name: '',
    detail: '',
    summary: '',
    state: 0,
  });
};
const delet = (i: number) => {
  props.detail.task_steps.splice(i, 1)
}
const onSubmit = () => {
  console.log( props.detail.task_steps);
  const tasks: any = []
  props.detail.task_steps.forEach(v => {
    tasks.push({
      "name": v.name,
      "summary": v.summary,
      "detail": v.detail,
      "state": v.state // (非必填 默认开启)
    })
  })
  http.updateTaskGuide({param: {tasks}, urlParams: {content_id: props.detail.id}}).then((res: any) => {
    console.log(res)
    router.go(-1);
  })
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
