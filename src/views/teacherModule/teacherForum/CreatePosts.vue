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
        <a-form-item label="帖子名称" name="title">
          <a-input
            v-model:value="formState.title"
            placeholder="请在这里输入帖子标题"
          />
        </a-form-item>
        <div class="type">
          <a-form-item label="帖子类型" name="type">
            <a-select
              v-model:value="formState.type"
              placeholder="请选择帖子类型"
            >
              <a-select-option :value="item.name" v-for="item in tagList" :key="item.name">{{item.name}}</a-select-option>
              <!-- <a-select-option value="2">分享</a-select-option> -->
            </a-select>
          </a-form-item>
          <a-form-item label="添加标签" name="label">
            <!-- <span class="pointer add-btn"><i class="iconfont icon-tianjia"></i>添加标签</span> -->
            <div class="label-list">
              <span
                v-for="(item, index) in formState.label_name"
                :key="index"
                class="list"
              >
                {{ item }}
                <i
                  class="remove iconfont icon-guanbi"
                  @click="removeLabel(item)"
                ></i>
              </span>
              <span
                class="add-btn pointer"
                v-show="!isInput"
                @click="clickLabelBtn"
                ><i class="iconfont icon-tianjia"></i>添加标签</span
              >
              <a-input
                ref="refLabel"
                @pressEnter="labelSubmit"
                @blur="labelSubmit"
                @change="changeLabel"
                v-show="isInput"
                v-model:value="labelContent"
              />
            </div>
          </a-form-item>
        </div>
        <a-form-item name="content">
          <div class="text">
            <QuillEditor
              v-model="formState.content"
              :height="'400px'"
              :uploadPathName="'teacherForum'"
            />
          </div>
        </a-form-item>
        <a-form-item>
          <Submit @submit="onSubmit" @cancel="cancel"></Submit>
        </a-form-item>
      </a-form>
    </div>
    <div class="right">
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

const tabs = [{ name: "发帖", componenttype: 0 }];
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
    labelContent.value?.length > 10
      ? labelContent.value.slice(0, 10)
      : labelContent.value;
}
function labelSubmit() {
  // console.log(state.customLabelV)
  if (labelContent.value.trim()) {
    formState.label_name.push(labelContent.value);
    labelContent.value = "";
    isInput.value = false;
  } else {
    isInput.value = false;
  }
}
function removeLabel(val: string) {
  let num = labelContent.value.indexOf(val);
  if (num !== -1) {
    formState.label_name.splice(num, 1);
  }
}

const contentValidator = (rule: any, value: Delta) => {
  console.log(goHtml(JSON.stringify(value)))
  if (value.ops && value.ops.length) {
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
const onSubmit = () => {
  console.log(formState);
  // return
  formRef.value.validate().then(() => {
    console.log("验证过");
    let obj = {
      ...formState,
      content: JSON.stringify(formState.content),
    };
    http
      .createForum({ param: { ...obj } })
      .then((res: IBusinessResp) => {
        message.success(editId ? "修改成功" : "发布成功");
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
  getTagsList({self: 1})
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
  console.log(param)
  tagList.length = 0
  http.getForumTags({param}).then((res: IBusinessResp) => {
    console.log(res)
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
        &:first-child {
          width: 206px;
          margin-right: 80px;
        }
        &:nth-child(2) {
          flex: 1;
          .label-list .list {
            display: inline-block;
            height: 24px;
            line-height: 24px;
            background: var(--white-100);
            border: 1px solid var(--lightgray-6);
            border-radius: 13px;
            // color: var(--primary-color);
            padding: 0 18px;
            margin-right: 8px;
            .iconfont {
              font-size: var(--font-size-sm);
            }
          }
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
</style>
