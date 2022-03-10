<template>
  <div class="create-image-box">
    <a-form layout="vertical" ref="formRef" :model="image" :rules="rules">
      <a-form-item label="镜像文件" name="fileName">
        <upload-image @upload-imageinfo="uploadImageinfo"></upload-image>
      </a-form-item>
      <div class="create-img-middle">
        <div>
          <a-form-item label="镜像名称" name="name">
            <a-input class="form-input" v-model:value="image.name"></a-input>
          </a-form-item>
          <a-form-item label="系统类型" name="classify_id">
            <a-select
              class="form-input"
              v-model:value="image.classify_id"
              placeholder="请选择系统类型"
            >
              <a-select-option
                :value="item"
                v-for="(item, index) in ['Windows','Linux']"
                :key="index.toString()"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div>
          <a-form-item label="镜像类型" required>
            <a-input
              class="form-input"
              disabled
              v-model:value="image.imageType"
            ></a-input>
            <!-- 是通过上传的文件获取的文件类型 -->
          </a-form-item>
          <a-form-item label="添加标签" name="tag">
            <div class="label-list">
              <span
                v-for="(item, index) in image.tag"
                :key="index"
                class="active"
              >
                {{ item }}
                <i
                  class="remove iconfont icon-guanbi"
                  @click="removeLabel(item)"
                ></i>
              </span>
              <span class="edit-box" v-if="image.tag && image.tag.length < 3">
                <span @click="clickCustomLabel" v-show="!openCustom">
                  <span class="iconfont iconbiaoqian"></span>
                  + 自定义标签
                </span>
                <a-input
                  ref="refCustomLabel"
                  @pressEnter="customFinish"
                  @blur="customFinish"
                  @change="changeLabel"
                  v-show="openCustom"
                  v-model:value="state.customLabelV"
                />
              </span>
            </div>
            <div class="recommend" v-if="showTag">
              <div class="tit">或从推荐中选择</div>
              <div class="tagBox">
                <div v-for="v in 10" :key="v">
                  <span
                    @click="addTag(v)"
                    :class="image.tag.includes(v) ? 'act' : ''"
                    >默认标签1</span
                  >
                </div>
              </div>
            </div>
          </a-form-item>
        </div>
      </div>
      <a-form-item label="镜像描述">
        <a-textarea
          placeholder="镜像描述"
          class="ant-input-desc"
          v-model:value="image.desc"
          :auto-size="{ minRows: 6, maxRows: 8 }"
        ></a-textarea>
      </a-form-item>
    </a-form>
    <Submit @submit="create" @cancel="cancel"></Submit>
  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  watch,
  Ref,
  ref,
  inject,
  reactive,
  toRefs,
  onMounted,
  nextTick,
} from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import uploadImage from "./uploadImage.vue";
import Submit from "src/components/submit/index.vue";
import request from "src/api/index";
const http = (request as any).teacherImageResourcePool;
interface ImageType {
  name: string;
  imageType: any;
  classify_id: any;
  tag: any;
  desc: any;
  fileName: any;
  fileSize: any;
}
interface IState {
  config: any;
  customLabelV: any;
}
const router = useRouter();
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "创建镜像", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const rules = {
  fileName: [{ required: true, message: "请选择镜像文件", trigger: "change" }],
  name: [{ required: true, message: "请输入镜像名称", trigger: "blur" }],
  classify_id: [{ required: true, message: "请选择系统类型" }],
  tag: [
    // { required: true, message: "请选择镜像标签1",trigger: "change"},
    // { validator: fileListValidator, message: "请选择镜像标签2"},
  ],
};
async function fileListValidator() {
  console.log(image);
  if (image.tag.length === 0) {
    message.warn("请选择镜像标签");
    return Promise.reject();
  } else {
    return Promise.resolve();
  }
}
const image: ImageType = reactive({
  name: "",
  imageType: "",
  classify_id: undefined,
  tag: [],
  desc: "",
  fileSize: "",
  fileName: "",
});
const config: any = reactive({});
const state: IState = reactive({
  customLabelV: "",
  config: {},
});
const formRef = ref();
var showTag: Ref<boolean> = ref(false);
var openCustom: Ref<boolean> = ref(false);
const refCustomLabel = ref<HTMLElement>();
function removeLabel(val: any) {
  let num = image.tag.indexOf(val);
  if (num !== -1) {
    image.tag.splice(num, 1);
  }
}
function clickCustomLabel() {
  showTag.value = true;
  openCustom.value = true;
  nextTick(() => {
    refCustomLabel.value && refCustomLabel.value.focus();
  });
}
function customFinish() {
  if (state.customLabelV.trim()) {
    image.tag.push(state.customLabelV);
    // image.tag=['555']
    state.customLabelV = "";
    openCustom.value = false;
  } else {
    openCustom.value = false;
  }
}
function addTag(val: any) {
  if (image.tag.length < 3) {
    image.tag.push(val);
  } else {
    message.warn("最多添加3个标签");
  }
}
function changeLabel() {
  // console.log(val)
  // console.log(state.customLabelV)
  state.customLabelV =
    state.customLabelV.length > 10
      ? state.customLabelV.slice(0, 10)
      : state.customLabelV;
}
const uploadImageinfo = (name: any, size: any, url: any) => {
  image.fileName = name;
  image.fileSize = size;
  image.imageType =
    image.fileName.split(".")[image.fileName.split(".").length - 1];
  image.classify_id = image.imageType === "qcow2" ? 2 : 1;
};
const cancel = () => {
  console.log("取消");
  router.go(-1)
  // router.push({
  //   path: "/teacher/Workbench",
  //   query: {
  //     currentTab: 1,
  //   },
  // });
};
const create = () => {
  console.log("提交");
  // console.log(formRef.value)
  // fileListValidator()
  // return
  formRef.value.validate().then(() => {
    fileListValidator();
    const parmas = {
      name: image.name,
      file_path: "/www/tusd/uploads/" + image.fileName,
      file_size: image.fileSize,
      classify_id: image.classify_id,
      tag: image.tag,
      description: image.desc,
      ssh_user: " ",
      ssh_pass: " ",
      is_use_gpu: image.tag.indexOf(3) !== -1 ? 1 : 0,
    };
    http.createMirrorApi(parmas).then((res: any) => {
      cancel();
    });
  });
};
const getConfig = () => {
  http.getConfigApi().then((res: any) => {
    state.config = res.data;
  });
};
onMounted(() => {
  //  methods.getConfig()
});
</script>

<style lang="less">
.create-image-box {
  width: 806px;
  margin: 0 auto;
  height: 100%;
  font-size: 14px;
  //   .uploadBtn{
  //       display: flex;
  //   }
  //   .upload{
  //       .ant-upload.ant-upload-drag .ant-upload-btn{
  //           padding: 40px;
  //       }
  //   }
  .ant-input-desc {
    height: 115px;
    min-height: 115px;
    max-height: 136px;
    overflow-y: hidden;
  }
  .form-bottom {
    width: 100%;
    margin-top: auto;
    text-align: center;
    > button {
      margin-right: 16px;
    }
  }
}
.create-img-middle {
  display: flex;
  justify-content: space-between;
  > div {
    width: 45%;
    .form-input {
      width: 100%;
    }
  }
}

.label-list {
  display: flex;
  flex-wrap: wrap;

  > span {
    margin: 0px 5px 0px 0px;
    padding: 5px 15px;
    background: #ebebeb;
    margin-bottom: 5px;
    position: relative;
    border-radius: 5px;
    margin-right: 10px;

    > .remove {
      position: absolute;
      font-size: 12px;
      background: red;
      width: 14px;
      height: 14px;
      top: -5px;
      right: -5px;
      border-radius: 50%;
      text-align: center;
      line-height: 14px;
      cursor: pointer;
    }

    &.active {
      background: var(--primary-color);
      color: #ffffff;
    }
  }

  .edit-box {
    margin: 0px 5px 0px 0px;
    padding: 0px 0px;
    background: #ebebeb;
    margin-bottom: 5px;
    position: relative;
    width: 120px;
    cursor: pointer;

    > span {
      // padding: 0px 15px;
      display: block;
      text-align: center;
      width: 100%;
      line-height: 30px;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
      border-radius: 5px;
      background: #ffffff;

      &:hover {
        background: #f8efff;
      }
    }
  }
}
.recommend {
  color: var(--black-65);
  margin-top: 1rem;
  .tagBox {
    display: flex;
    flex-wrap: wrap;
    div {
      text-align: center;
      cursor: pointer;
      width: 25%;
      padding: 6px 0;
      span {
        background: #ebebeb;
        border: 1px solid #dfdfdf;
        border-radius: 11px;
        font-size: 12px;
        color: var(--black-65);
        padding: 2px 7px;
      }
      .act {
        background: var(--primary-color);
        color: #fff;
        // color: var(--primary-color);
      }
    }
  }
}
</style>
