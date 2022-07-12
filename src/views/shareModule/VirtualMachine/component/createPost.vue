<template>
  <div class="forumn">
    <div class="forumn-input" v-if="!isShowForumn">
      <a-input @focus="isShowForumn = true" placeholder="说点什么" />
    </div>
    <div class="forumn-create" v-if="isShowForumn">
      <span class="close pointer" @click="isShowForumn = false"
        ><span class="iconfont icon-guanbi"></span
      ></span>
      <a-form ref="formRef" :model="formState" labelAlign="left" :rules="rules">
        <a-form-item label="帖子名称" name="title">
          <a-input
            v-model:value="formState.title"
            placeholder="请在这里输入帖子标题"
          />
        </a-form-item>
        <a-form-item name="content">
          <QuillEditor
            v-model="formState.content"
            :height="'596px'"
            :uploadPathName="'teacherForum'"
            :toolbar="toolbarOptions"
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

const emit = defineEmits<{
  (e: "forumChange"): void;
}>();
const toolbarOptions: any = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  // [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  ['clean']                                         // remove formatting button
];
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
const contentValidator = (rule: any, value: Delta) => {
  if (value.ops && value.ops.length) {
    if (value.ops[0]&&JSON.stringify(value.ops[0].insert).length < 5) {
      return Promise.reject("请输入帖子内容");
    }
    return Promise.resolve();
  } else {
    return Promise.reject("请输入帖子内容");
  }
}
const rules = {
  title: [
    { required: true, message: "请输入帖子名称", trigger: "change" },
    { min: 1, max: 16, message: "名称长度为1-16个字符", trigger: "blur" },
  ],
  content: [
    // { required: true, message: "请输入帖子内容", trigger: "blur" },
    { validator: contentValidator, message: "请输入帖子内容" },
  ],
}
const formRef = ref()
// 发帖
function onSubmit() {
  formRef.value.validate().then(() => {
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
      emit('forumChange')
    });
  })
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
