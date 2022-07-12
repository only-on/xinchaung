<template>
  <div class="title-box" :class="{ show: props.taskList.isAdd }">
    <span class="task-num">任务{{ NoToCh(props.index + 1) }}</span>
    <span class="task-name" v-if="!props.taskList.isAdd">{{props.taskList.name}}</span>
    <div class="operate">
      <span class="pointer delet" @click="delet" v-if="!props.preview">删除</span>
      <span
        class="pointer"
        @click="props.taskList.isAdd = !props.taskList.isAdd"
        >{{ props.taskList.isAdd ? "收起" : "展开" }}</span
      >
    </div>
  </div>
  <a-form
    class="task-form"
    ref="formRef"
    :model="props.taskList"
    labelAlign="left"
    :rules="rules"
    layout="vertical"
    v-if="props.taskList.isAdd"
  >
    <a-form-item label="任务名称" name="name" required>
      <a-input
        v-model:value="props.taskList.name"
        placeholder="请在这里输入任务名称"
        :disabled="props.preview"
      />
    </a-form-item>
    <a-form-item label="任务描述" class="item2" name="summary" required>
      <div class="form-upload" v-if="!props.preview">
        <a-upload
          name="file"
          :show-upload-list="false"
          accept=".md"
          :multiple="false"
          :before-upload="beforeUpload"
        >
          <a-button type="primary" shape="round" size="small"
            >上传文档</a-button
          >
        </a-upload>
      </div>
      <marked-editor
        v-model="props.taskList.summary"
        :preview="props.preview"
        class="markdown__editor"
      />
    </a-form-item>
    <a-form-item label="任务步骤" class="step" name="detail" required v-if="props.is_show_task_step">
      <div class="form-switch">
        状态
        <a-switch
          v-model:checked="state"
          :disabled="props.preview"
          @change="onChange"
        />
      </div>
      <div class="form-upload" v-if="!props.preview">
        <a-upload
          name="file"
          :show-upload-list="false"
          accept=".md"
          :multiple="false"
          :before-upload="stepbeforeUpload"
        >
          <a-button type="primary" shape="round" size="small"
            >上传文档</a-button
          >
        </a-upload>
      </div>
      <marked-editor
        v-model="props.taskList.detail"
        :preview="props.preview"
        class="markdown__editor"
      />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup="props">
import { ref, reactive, inject,Ref, computed } from "vue";
import { MessageApi } from "ant-design-vue/lib/message";
import markedEditor from "src/components/editor/markedEditor.vue";
import { NoToCh } from "src/utils/common";
import { readFile } from "src/utils/common";
const $message: MessageApi = inject("$message")!;
// const dev_base_url = import.meta.env.VITE_APP_BASE_API || "";
// var uploadUrl = `${dev_base_url}/api/content/vnc/upload_mkfile`;
// console.log(uploadUrl);
const isShow = ref<boolean>(false);
// const preview = ref<boolean>(false);
const formState = reactive({
  name: "",
  describe: "",
  step: "",
  checked: false,
});
const rules = {
  name: [
    { required: true, message: "请输入任务名称", trigger: "blur" },
    // { min: 1, max: 16, message: "名称长度为1-16个字符", trigger: "blur" },
  ],
};
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "delet", i: number): void;
}>();
props.taskList.state = props.taskList.state ? true : false
const state = computed(() => {
  return props.taskList.state ? true : false
})
const onChange = (val: any) => {
  props.taskList.state = val
}
const beforeUpload = async (file: any, fileList: any) => {
  const text = await readFile(file);
  props.taskList.detail = text;
};
const stepbeforeUpload = async (file: any, fileList: any) => {
  const text = await readFile(file);
  props.taskList.summary = text;
};
var Visible: Ref<boolean> = ref(false);
const delet = () => {
  emit('delet', props.index)
}
// console.log(props.is_show_task_step)
interface Props {
  preview: boolean;
  taskList: ItaskList;
  index: number;
  is_show_task_step:boolean
}
interface ItaskList {
  name: string;
  detail: any;
  summary: any;
  state: any;
  isAdd?: boolean;
}
</script>

<style lang="less" scoped>
.title-box {
  height: 51px;
  line-height: 51px;
  background-color: var(--lightgray-2);
  display: flex;
  justify-content: space-between;
  .task-num,
  .task-name {
    font-size: var(--font-size-16);
    color: var(--black-85);
  }
  .task-num {
    margin-right: 24px;
    padding-left: 8px;
  }
  .task-name {
    flex: 1;
  }
  .operate {
    padding-right: 8px;
    span {
      margin-left: 16px;
      color: var(--primary-color);
    }
    .delet {
      display: none;
    }
  }
  &:hover {
    .delet {
      display: inline-block;
    }
  }
  &.show {
    border-bottom: 1px dashed #dbdbdb;
    margin-bottom: 16px;
  }
}

.task-form {
  .form-upload {
    position: absolute;
    top: -30px;
    right: 0;
  }
  .form-switch {
    position: absolute;
    top: -31px;
    left: 80px;
  }
  .ant-form-item.step {
    padding-bottom: 24px;
    margin-bottom: 0;
  }
}
.demo__container {
  :deep(.mark__body) {
    .mark__editor,
    .mark__preview {
      // height: 316px;
    }
  }
}
.markdown__editor{
  // height: 100%;
  height: 500px;
}
</style>
