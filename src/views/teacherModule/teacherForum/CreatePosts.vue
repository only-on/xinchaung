<template>
  <div class="creatpost">
    <div class="left">
      <a-form
        ref="formRef"
        :model="formState"
        :label-col="{ span: 12 }"
        :wrapper-col="{ span: 24 }"
        labelAlign="left"
        :rules="rules"
      >
        <a-form-item :label="role !== 2 ? '帖子名称':'公告名称'" name="title">
          <a-input
            v-model:value="formState.title"
            placeholder="请在这里输入帖子标题"
          />
        </a-form-item>
        <div class="type">
          <a-form-item class="forum-label" label="添加标签" name="label">
            <LabelList :tag="formState.label_name" />
          </a-form-item>
          <a-form-item class="forum-type" label="帖子类型" name="type" v-if="role !== 2">
            <a-select
              v-model:value="formState.type"
              placeholder="请选择帖子类型"
            >
              <a-select-option :value="item.name" v-for="item in tagList" :key="item.name">{{item.name}}</a-select-option>
              <!-- <a-select-option value="2">分享</a-select-option> -->
            </a-select>
          </a-form-item>
        </div>
        <a-form-item name="content">
          <div class="text">
            <QuillEditor
              v-model="formState.content"
              :height="'400px'"
              :uploadPathName="'teacherForum'"
              :toolbar="toolbarOptions"
            />
          </div>
        </a-form-item>
        <a-form-item>
          <Submit @submit="onSubmit" @cancel="cancel" :loading="loading"></Submit>
        </a-form-item>
      </a-form>
    </div>
    <div class="right" v-if="role !== 2">
      <!-- 热门标签 -->
      <hot-label></hot-label>
      <!-- 热力图 -->
      <heat-map></heat-map>
      <!-- 推荐课程 -->
      <recommend-course></recommend-course>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  toRefs,
  inject,
  provide,
  nextTick,
} from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { useRouter, useRoute } from "vue-router";
import { Modal, message } from "ant-design-vue";
import { Delta } from "quill-delta";
import QuillEditor from "src/components/editor/quill.vue";
import HotLabel from "./components/HotLabel.vue";
import HeatMap from "./components/HeatMap.vue";
import RecommendCourse from "./components/RecommendCourse.vue";
import Submit from "src/components/submit/index.vue";
import { goHtml } from "src/utils/common";
import { ILabelList, ITagList } from "./forumnTyping.d";
import extStorage from "src/utils/extStorage";
import LabelList from 'src/components/LabelList.vue'
const { lStorage } = extStorage;
const role = lStorage.get("role") || 3;
const http = (request as any).teacherForum;
interface IFormState {
  title: string;
  type: string | undefined;
  content: Delta;
  label_name: string[]
}
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
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

const tabs = [{ name: role !== 2 ? "发帖" : '发布公告', componenttype: 0 }];
var updata = inject("updataNav") as Function;
updata({
  tabs: tabs,
  showContent: true,
  componenttype: undefined,
  showNav: true,
});

// 自定义标签
const refLabel = ref<HTMLElement>();
let isInput = ref<boolean>();
let labelContent = ref<string>("");
function clickLabelBtn() {
  isInput.value = true;
  nextTick(() => {
    refLabel.value && refLabel.value.focus();
  });
}
function changeLabel() {
  labelContent.value =
    labelContent.value?.length > 20
      ? labelContent.value.slice(0, 20)
      : labelContent.value;
}
function labelSubmit() {
  if (labelContent.value.trim()) {
    formState.label_name.push(labelContent.value);
    labelContent.value = "";
    isInput.value = false;
  } else {
    isInput.value = false;
  }
}
function removeLabel(val: string) {
  let num = formState.label_name.indexOf(val);
  if (num !== -1) {
    formState.label_name.splice(num, 1);
  }
}

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
  type: [
    { required: true, message: "请选择帖子类型", trigger: "change" },
  ],
  content: [
    // { required: true, message: "请输入帖子内容", trigger: "blur" },
    { validator: contentValidator, message: "请输入帖子内容" },
  ],
}
const formRef = ref()
const formState = reactive<IFormState>({
  title: "",
  type: undefined,
  content: {
    ops: [],
  },
  label_name: []
})
const loading = ref(false)
const onSubmit = () => {
  // return
  formRef.value.validate().then(() => {
    role === 2 ? formState.type = '公告' : ''
    let obj = {
      ...formState,
      content: JSON.stringify(formState.content),
    };
    loading.value = true
    http
      .createForum({ param: { ...obj } })
      .then((res: IBusinessResp) => {
        message.success(editId ? "修改成功" : "发布成功");
        loading.value = false
        router.go(-1);
      });
  });
}
const getDetail = () => {}
const cancel = () => {
  router.go(-1);
}
onMounted(() => {
  getHotLabels()
  editId ? getDetail() : "";
  getTagsList({scene: 'private'})
});
// 热门标签
const hotLabelList = reactive<ILabelList[]>([])
provide("hotLabelList", hotLabelList)
const getHotLabels = () => {
  http.getHotLabels().then((res: IBusinessResp) => {
    hotLabelList.push(...res.data)
  })
}

// 常驻类型
let tagList = reactive<ITagList[]>([])
const getTagsList = (param: any) => {
  tagList.length = 0
  http.getForumTags({param}).then((res: IBusinessResp) => {
    const { data } = res
    data.forEach((v: ITagList) => {
      v.value = v.name
    })
    tagList.push(...data)
  })
}
</script>

<style scoped lang="less">
.creatpost {
  display: flex;
  justify-content: space-between;
  .left {
    width: 830px;
    .type {
      display: flex;
      justify-content: space-between;
      .ant-form-item {
        &.forum-type {
          width: 206px;
        }
        &.forum-label {
          margin-right: 80px;
          flex: 1;
          .add-btn {
            display: inline-block;
            height: 24px;
            line-height: 24px;
            background: var(--white-100);
            border: 1px solid var(--lightgray-6);
            border-radius: 13px;
            color: var(--primary-color);
            padding: 0 18px;
            .iconfont {
              font-size: var(--font-size-sm);
              margin-right: 6px;
            }
          }
          .ant-input {
            width: 112px;
          }
        }
      }
    }
  }
  .right {
    width: 300px;
    .hot-label {
      margin-top: 32px;
    }
  }
  .quill-editor-wrap {
    :deep(.quill-editor) {
      .ql-tooltip {
        left: 12px!important;
      }
    }
  }
}
.header {
  display: flex;
  justify-content: space-between;
  width: var(--center-width);
  margin: 0 auto;
}

h1 {
  color: #333;
  font-size: 17px;
  height: 20px;
  line-height: 20px;
  margin: 20px 0 10px 0;
}
:deep(.ant-form-item-control) {
  flex: 0 0 100%;
}

:deep(.ql-container) {
  text-align: center;
  height: calc(100% - 43px);
}
.text {
  // height: 340px;
}
.foot {
  margin-top: 50px;
  width: 100%;
  text-align: center;
}
.quill-editor-wrap {
  :deep(.quill-editor) {
    h1 {
      font-size: var(--font-size-18);
    }
    h2 {
      font-size: var(--font-size-16);
    }
  }
}
</style>
