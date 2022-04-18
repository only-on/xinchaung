<template>
  <div class="forumn">
    <div class="forumn-input" v-if="!isShowForumn">
      <a-input @focus="isShowForumn = true" placeholder="说点什么" />
    </div>
    <div class="forumn-create" v-if="isShowForumn">
      <span class="close pointer" @click="isShowForumn = false"
        ><span class="iconfont icon-guanbi"></span
      ></span>
      <a-form ref="formRef" :model="formState" labelAlign="left">
        <a-form-item label="帖子名称" name="name">
          <a-input
            v-model:value="formState.title"
            placeholder="请在这里输入帖子标题"
          />
        </a-form-item>
        <a-form-item>
          <QuillEditor
            v-model="formState.content"
            :height="'200px'"
            :uploadPathName="'teacherForum'"
          />
        </a-form-item>
        <a-form-item class="btn">
          <a-button type="primary" @click.prevent="onSubmit">发布</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, Ref, watch, inject } from "vue";
import { Delta } from "quill-delta";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import QuillEditor from "src/components/editor/quill.vue";
const http = (request as any).teacherForum;
// 论坛
const isShowForumn = ref<boolean>(false);
interface IFormState {
  title: string;
  content: Delta;
}
const formState = reactive<IFormState>({
  title: "",
  content: {
    ops: [],
  },
});
// 发帖
function onSubmit() {
  const param = {
    type: "求助",
    label_name: [],
    title: formState.title,
    content: JSON.stringify(formState.content),
  };
  http.createForum({ param }).then((res: IBusinessResp) => {
    message.success("发布成功");
    isShowForumn.value = false;
    formState.title = "";
    formState.content = {
      ops: [],
    };
  });
}
</script>

<style lang="less" scoped>
.forumn {
  width: 100%;
  position: absolute;
  bottom: 0;
  background-color: var(--white-100);
  box-shadow: 0px -3px 6px 0px rgba(0, 0, 0, 0.14);
  .forumn-input {
    padding: 18px 42px 18px 37px;
  }
  .forumn-create {
    padding: 20px 30px;
    position: relative;
    .ant-form {
      .btn {
        margin-bottom: 0;
        text-align: right;
      }
      .ant-input {
        width: 80%;
      }
    }
    .close {
      position: absolute;
      top: 13px;
      right: 13px;
      color: var(--black-45);
    }
  }
}
</style>
