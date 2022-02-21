<template>
  <div class="title-box" :class="{ show: isShow }">
    <span class="task-num">任务一</span>
    <span class="task-name" v-if="!isShow">任务名称</span>
    <div class="operate">
      <span class="pointer delet">删除</span>
      <span class="pointer" @click="isShow = !isShow">{{
        isShow ? "收起" : "展开"
      }}</span>
    </div>
  </div>
  <a-form
    class="task-form"
    ref="formRef"
    :model="formState"
    labelAlign="left"
    :rules="rules"
    layout="vertical"
    v-if="isShow"
  >
    <a-form-item label="任务名称" name="name" required>
      <a-input
        v-model:value="formState.name"
        placeholder="请在这里输入任务名称"
      />
    </a-form-item>
    <a-form-item label="任务描述" name="type" required>
      <div class="form-upload">
        <a-button type="primary" shape="round" size="small">上传文档</a-button>
      </div>
      <marked-editor v-model="formState.describe" :preview="preview" />
    </a-form-item>
    <a-form-item label="任务步骤" name="type" required>
      <div class="form-switch">
        状态
        <a-switch v-model:checked="formState.checked" />
      </div>
      <div class="form-upload">
        <a-button type="primary" shape="round" size="small">上传文档</a-button>
      </div>
      <marked-editor v-model="formState.step" :preview="preview" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
const isShow = ref<boolean>(false);
const preview = ref<boolean>(false);
const formState = reactive({
  name: "",
  describe: "",
  step: "",
  checked: false,
});
const describeValidator = () => {
  console.log(formState);
};
const rules = {
  name: [
    { required: true, message: "请输入帖子名称", trigger: "blur" },
    // { min: 1, max: 16, message: "名称长度为1-16个字符", trigger: "blur" },
  ],
  describe: [
    // {validator: describeValidator, trigger: "blur"}
  ],
};
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
    padding-left: 6px;
  }
  .task-name {
    flex: 1;
  }
  .operate {
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
}
.demo__container {
  :deep(.mark__body) {
    .mark__editor,
    .mark__preview {
      height: 316px;
    }
  }
}
</style>
