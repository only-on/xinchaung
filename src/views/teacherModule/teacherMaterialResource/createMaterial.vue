<template>
  <div class="create-material">
    <a-form :layout="'vertical'" :model="formState" :rules="rules">
      <div class="baseinfo">
        <h3 class="title">数据集基本信息</h3>
        <div class="baseinfo-content">
          <div class="left">
            <a-form-item label="数据集名称" name="name" required>
              <a-input
                v-model:value="formState.name"
                placeholder="请在这里输入数据集名称"
              />
            </a-form-item>
            <a-form-item label="数据集描述" name="description">
              <a-textarea
                v-model:value="formState.description"
                :auto-size="{ minRows: 3, maxRows: 5 }"
                placeholder="请在这里输入描述文字"
              />
            </a-form-item>
            <a-form-item label="添加标签" name="label">
              <div class="label-list">
                <span
                  v-for="(item, index) in formState.labels"
                  :key="index"
                  class="active"
                >
                  {{ item }}
                  <i
                    class="remove iconfont icon-guanbi"
                    @click="removeLabel(item)"
                  ></i>
                </span>
                <span
                  class="edit-box"
                  v-if="formState.labels && formState.labels.length < 3"
                >
                  <span @click="clickCustomLabel" v-show="!openCustom">
                    <span class="iconfont iconbiaoqian"></span>
                    + 添加标签
                  </span>
                  <a-input
                    ref="refCustomLabel"
                    @pressEnter="customFinish"
                    @blur="customFinish"
                    @change="changeLabel"
                    v-show="openCustom"
                    v-model:value="customLabelV"
                  />
                </span>
              </div>
              <div class="recommend" v-if="showTag">
                <div class="tit">或从推荐中选择</div>
                <span
                  class="iconfont icon-guanbi"
                  @click="showTag = false"
                ></span>
                <div class="tagBox">
                  <span
                    v-for="v in 10"
                    :key="v"
                    @click="addTag(v)"
                    :class="formState.labels.includes(String(v)) ? 'act' : ''"
                    >{{ v }}{{ v }}{{ v }}</span
                  >
                </div>
              </div>
            </a-form-item>
          </div>
          <div class="right">
            <a-form-item
              label="可见范围"
              name="range"
              required
              class="visible-range"
            >
              <a-select v-model:value="formState.range">
                <a-select-option :value="'0'">
                  <span class="name">公开</span>
                  <span class="tips">所有人可见</span>
                </a-select-option>
                <a-select-option :value="'1'">
                  <span class="name">私有</span>
                  <span class="tips">仅自己可见</span>
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="封面图">
              <a-upload
                v-model:file-list="fileList"
                list-type="picture"
                class="uploader"
                :show-upload-list="false"
                :before-upload="beforeUpload"
              >
                <div class="upload">
                  <img
                    v-if="formState.src"
                    :src="formState.src"
                    alt=""
                    srcset=""
                  />
                  <div v-else class="cover">
                    <img
                      src="src/assets/images/teacherMaterialResource/cover.png"
                      alt=""
                    />
                  </div>
                  <loading-outlined v-if="loading"></loading-outlined>
                </div>
              </a-upload>
            </a-form-item>
          </div>
        </div>
      </div>
      <div class="fileupload">
        <h3 class="title">数据文件上传</h3>
        <div class="upload-content">
          <a-form-item label="数据集">
            <div class="upload"></div>
          </a-form-item>
          <a-form-item label="说明">
            <div class="explain">
              <a-upload
                :before-upload="MdFileBeforeUpload"
                :show-upload-list="false"
                accept=".md"
              >
                <a-button type="primary">上传说明</a-button>
                <span class="tips">仅支持md文件</span>
              </a-upload>
              <div class="md-info" v-if="explainMdName">
                <span class="name">{{ explainMdName }}</span>
                <span class="iconfont icon-close" @click="RemoveMdFile"></span>
              </div>
            </div>
          </a-form-item>
        </div>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, Ref, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { MessageApi } from "ant-design-vue/lib/message";
import { LoadingOutlined } from "@ant-design/icons-vue";
import { getFileType } from "src/utils/getFileType";
import request from "src/api/index";
const http = (request as any).teacherMaterialResource;
const $message: MessageApi = inject("$message")!;
const router = useRouter();
const route = useRoute();
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const createType = String(route.query.key);
const materialTypeList = reactive({
  dataSet: "数据集",
  videoDirectory: "视频目录",
  coursewareDirectory: "课件目录",
  lessonDirectory: "备课资料目录",
  guidanceDirectory: "教学指导目录",
});
const name = `创建${materialTypeList[createType]}`;
updata({
  tabs: [{ name: name, componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});

interface IFormState {
  name: string;
  description: string;
  range: string;
  src: string;
  labels: string[];
}
const formState = reactive<IFormState>({
  name: "",
  description: "",
  range: "0",
  src: "",
  labels: [],
});
const rules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
};
// 上传封面图
const fileList: Ref<any> = ref([]);
const loading = ref<boolean>(false);
const beforeUpload = (file: any) => {
  // console.log(file)
  const isJpgOrPng = ["image/jpeg", "image/png"].includes(file.type);
  if (!isJpgOrPng) {
    $message.warn("图片类型不正确");
    return false;
  }
  loading.value = true;
  const fd = new FormData();
  fd.append("upload_file", file);
  http.upLoadCover({ param: fd }).then((res: any) => {
    loading.value = false;
    console.log(res);
    formState.src = res.data.path;
    // let data = res.data;
    // let obj = [
    //   {
    //     uid: "-1",
    //     name: data.name,
    //     status: "",
    //     url: data.path,
    //   },
    // ];
    // (state.ForumSearch.cover = data.path), (coverFileList.value = obj);
  });
  // formState.src = "src/assets/images/cover2.png"
};
// 添加标签
const openCustom: Ref<boolean> = ref(false);
const showTag: Ref<boolean> = ref(false);
const customLabelV = ref<string>("");
const refCustomLabel = ref();
function clickCustomLabel() {
  showTag.value = true;
  openCustom.value = true;
  nextTick(() => {
    refCustomLabel.value && refCustomLabel.value.focus();
  });
}
function removeLabel(val: string) {
  let num = formState.labels.indexOf(val);
  if (num !== -1) {
    formState.labels.splice(num, 1);
  }
}
function customFinish() {
  if (customLabelV.value.trim()) {
    formState.labels.push(customLabelV.value);
    customLabelV.value = "";
    openCustom.value = false;
  } else {
    openCustom.value = false;
  }
}
function changeLabel() {
  customLabelV.value =
    customLabelV.value.length > 10
      ? customLabelV.value.slice(0, 10)
      : customLabelV.value;
}
function addTag(val: any) {
  if (formState.labels.length < 3) {
    formState.labels.push(val);
  } else {
    $message.warn("最多添加3个标签");
  }
}

// 上传说明
const explainMdName = ref<string>("");
const MdFileBeforeUpload = (file: any) => {
  if (getFileType(file.name) !== "md") {
    $message.warn("请上传md文件");
    return;
  }
  const fd = new FormData();
  fd.append("upload_file", file);
  http.uploadExplain({ param: fd }).then((res: any) => {
    console.log(res);
    explainMdName.value = res.data.name;
    // state.ForumSearch.doc_name = res.data.name;
    // var reader = new FileReader();
    // reader.readAsText(file, "utf-8");
    // reader.onload = () => {
    //   if (reader.result) {
    //     state.documentName = file.name;
    //     state.ForumSearch.documents = reader.result.toString();
    //   }
    // };
  });
};
const RemoveMdFile = () => {
  explainMdName.value = "";
};
</script>

<style lang="less" scoped>
.create-material {
  .title {
    color: var(--black-85);
    font-weight: normal;
    padding: 16px 0;
    border-bottom: 1px solid #e8e8e8;
  }
  .baseinfo {
    background-color: var(--white-100);
    padding: 0 24px;
    margin-bottom: 24px;
    .baseinfo-content {
      display: flex;
      justify-content: space-between;
      padding-top: 16px;
      .left {
        width: 570px;
      }
      .right {
        width: 500px;
        .visible-range {
          .ant-select {
            width: 300px;
          }
        }
        .upload {
          width: 162px;
          height: 90px;
          background: #fffdfb;
          border: 1px dashed #ffdcc1;
          border-radius: 17px;
          img {
            width: 100%;
            height: 100%;
          }
          .cover {
            text-align: center;
            img {
              width: 70px;
            }
          }
        }
      }
    }
  }
  .fileupload {
    background-color: var(--white-100);
    padding: 0 24px;
    .upload-content {
      margin-top: 16px;
      .upload {
        height: 254px;
      }
      .explain {
        padding-bottom: 24px;
        .tips {
          font-size: var(--font-size-sm);
          color: var(--black-45);
          margin-left: 8px;
        }
        .md-info {
          margin-top: 16px;
          cursor: pointer;
          .name {
            margin: 0 24px;
          }
          .iconfont {
            color: var(--primary-color);
            display: none;
            vertical-align: middle;
          }
          &:hover {
            .iconfont {
              display: inline-block;
            }
          }
        }
      }
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
  width: 344px;
  color: var(--black-65);
  margin-top: 1rem;
  background: var(--white-100);
  border-radius: 10px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  padding: 0 10px;
  position: absolute;
  .iconfont {
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: var(--base-font-size);
    cursor: pointer;
  }
  .tit {
    padding: 4px;
  }
  .tagBox {
    display: flex;
    flex-wrap: wrap;
    span {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      background: #ebebeb;
      border: 1px solid #dfdfdf;
      border-radius: 11px;
      font-size: 12px;
      color: var(--black-65);
      padding: 0 10px;
      margin-right: 8px;
      margin-bottom: 8px;
      cursor: pointer;
    }
    .act {
      background: var(--primary-color);
      color: #fff;
      // color: var(--primary-color);
    }
  }
}
</style>

<style lang="less">
.ant-select-item-option-content {
  display: flex;
  flex-direction: column;
  .tips {
    color: rgba(51, 57, 75, 0.25);
    font-size: var(--font-size-sm);
  }
}
</style>
