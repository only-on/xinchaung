<template>
  <a-modal
    v-model:visible="props.visibleUpload"
    :title="'上传' + type + '文件'"
    :width="580"
    @ok="uploadvideoOk"
    @cancel="cancel"
  >
    <div class="upload-file-box">
      <a-select
        style="width: 240px"
        v-model:value="dataset_id"
        placeholder="请选择目录"
      >
        <a-select-option
          v-for="(val, key) in selfDirectoryList"
          :value="key"
          :key="key"
          >{{ val }}
        </a-select-option>
      </a-select>
      <a-upload
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :accept="'.mp4'"
        :remove="remove"
      >
        <div class="upload-box">
          <span class="icon-upload iconfont"></span>
          <p class="hint-handle-type">
            选择要上传的{{ type }}或将{{ type }}拖拽到此处
          </p>
          <p class="hint-file-type">{{ tips }}</p>
        </div>
      </a-upload>
      <div v-if="uploadFileList.file_name" class="progress-box">
        <div class="file-base-info">
          <span>文件名称：{{ uploadFileList.file_name }}</span
          ><span class="icon-shanchu-copy iconfont" @click="remove"></span>
        </div>
        <a-progress :percent="progress" />
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, reactive, toRefs, watch, ref } from "vue";
import uploadFile from "src/request/uploadFile";
import { message } from "ant-design-vue";
import request from "src/api/index";
const courseApi = request.teachCourse;
const env = process.env.NODE_ENV == "development" ? true : false;

onMounted(() => {
  // getDirectoryList();
});
// 获取数据集列表
interface ISelfDirectoryList {
  [key: number]: string;
}
let selfDirectoryList = reactive<ISelfDirectoryList>({
  1: "私1",
});
function getDirectoryList() {
  // { type: type, name: "" }
  courseApi.getDataSetListApi({}).then((res: any) => {
    console.log(res);
  });
  let obj = { 1: "hello", 2: "world", 3: "hello world" };
  Object.assign(selfDirectoryList, obj);
}

let dataset_id = ref<number | undefined>();
let upload: any = reactive({});
let uploadFileList: any = reactive({});
let progress = ref(0);

function beforeUpload(file: any) {
  if (!dataset_id.value) {
    message.warn("上传文件时请选择目录");
    return false;
  }
  const body = {
    dataset: file,
    pageType: 1,
    dataId: dataset_id.value,
  };

  (uploadFileList as any).file_name = file.name;
  upload = new uploadFile({
    url: env
      ? "/proxyPrefix/dataset/data/upload-file"
      : "/dataset/data/upload-file",
    body,
    success: (res: any) => {
      if (res.status === 1) {
        Object.assign(uploadFileList, res.data);
      } else {
        message.error("上传失败");
      }
      upload = "";
    },
    progress: (e: ProgressEvent) => {
      if (e.total > 0) {
        progress.value = Number(Number((e.loaded / e.total) * 100).toFixed(2));
      }
    },
    abort: (xhr: XMLHttpRequest) => {
      console.log("终止上传成功", xhr);
    },
    error: (err) => {
      console.log(err);
    },
  });
  upload.request();
  return false;
}
// 终止上传
function abort() {
  if (upload) {
    upload.abortUpload();
  }
}
// 移除
function remove() {
  abort();
  Object.assign(uploadFileList, {});
  progress.value = 0;
}
function uploadvideoOk() {
  if (upload) {
    message.warn("文件上传中，请稍后提交");
    return;
  }
  const body = new FormData();
  body.append("items[0][file_name]", uploadFileList.file_name);
  body.append("items[0][file_url]", uploadFileList.file_url);
  body.append("items[0][suffix]", uploadFileList.suffix);
  body.append("items[0][size]", uploadFileList.size as any);
  body.append("dataset_id", dataset_id as any);
  courseApi.addDataSetFileApi({}).then((res: any) => {
    uploadFileList = {
      file_name: "",
      file_url: "",
      suffix: "",
      size: 0,
    };
    cancel();
    emit("uploadSuccess");
  });
}
function cancel() {
  emit("update:visibleUpload", false);
}
const props = withDefaults(defineProps<Props>(), {
  visibleUpload: false,
  type: "",
});
const emit = defineEmits<{
  (e: "update:visibleUpload", visible: boolean): void;
  (e: "uploadSuccess"): void;
}>();
interface Props {
  visibleUpload: boolean;
  type: string;
}
console.log(props.type);
let type = "";
let tips = "";
if (props.type === "video") {
  type = "视频";
  tips = "支持单个MP4格式文件上传 且文件小于500M";
} else if (props.type === "file") {
  type = "文档";
  tips = "支持单个md、doc、docx、pdf格式文件上传";
}
</script>

<style lang="less">
.upload-file-box {
  .ant-upload.ant-upload-select {
    margin-top: 20px;
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    background: #fafafa;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 0.3s;
    &:hover {
      border: 1px dashed var(--primary-color);
    }
    > span {
      width: 100%;
      height: 100%;
      display: block;
      .upload-box {
        width: 100%;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .iconfont {
          font-size: 24px;
          color: var(--primary-color);
        }
        .hint-handle-type {
          font-size: var(--font-size-16);
          color: var(--black-45);
        }
        .hint-file-type,
        .hint-file-size {
          font-size: var(--base-font-size);
          color: var(--black-25);
        }
      }
    }
  }
  .progress-box {
    margin-top: 10px;
    .file-base-info {
      display: flex;
      justify-content: space-between;
      &:hover {
        cursor: pointer;
        color: var(--primary-color);
      }
    }
  }
}
</style>
