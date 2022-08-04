<template>
  <div>
    <a-upload-dragger
      v-model:fileList="fileList"
      name="file"
      :multiple="true"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      @change="handleChange1"
      @drop="handleDrop"
      :before-upload="beforeUpload"
    >
      <p class="ant-upload-drag-icon">
        <i class="iconfont icon-upload"></i>
      </p>
      <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
    </a-upload-dragger>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  toRefs,
  onMounted,
  Ref,
  inject,
  computed,
  reactive,
  watch,
  toRaw,
} from "vue";
import { Modal, message } from "ant-design-vue";
import uploadFile from "src/request/uploadFile";
const env = process.env.NODE_ENV == "development" ? true : false;
interface Props {
  apiInterface: any;
  path: any;
  useCaseFile: any;
}
const props = withDefaults(defineProps<Props>(), {
  apiInterface: () => null,
  path: () => "",
  useCaseFile: () => {},
});
const fileList: any = ref([]);
function handleChange1(info: any) {
  const status = info.file.status;
  if (status !== "uploading") {
    console.log(info.file, info.fileList);
  }
  if (status === "done") {
    message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === "error") {
    message.error(`${info.file.name} file upload failed.`);
  }
}
function handleDrop(e: any) {
  console.log(e);
  console.log(props.apiInterface);
}
const emit = defineEmits<{
  (e: "update:useCaseFile", val: any): void;
}>();
// 上传前
function beforeUpload(file: any) {
  if (file.size / 1024 / 1024 >= 500) {
    message.warn("上传文件不能超过500MB");
    return false;
  }
  fileList.value.push(file);

  let i = fileList.value.findIndex((item: any) => {
    return item.uid === file.uid;
  });

  fileList.value[i].progress = 0;
  fileList.value[i].status = "loading";
  const body = {
    file: file,
    uploadFiled: "file",
    upload_path: "temp/",
  };

  fileList.value[i].upload = new uploadFile({
    url: env ? props.apiInterface : props.apiInterface,
    body,
    success: (res: any) => {
      if (res.code == 1) {
        fileList.value[i].status = "finish";
        fileList.value [i].progress = "100%";
        console.log(res.data.pdf_path, "res.data.props.path");
        emit("update:useCaseFile", res.data.pdf_path);
      } else {
        fileList.value[i].progress = 0;
        message.warn(res.msg);
      }
      fileList.value[i].upload = "";
      fileList.value.push({});
      fileList.value.pop();
    },
    progress: (e: ProgressEvent) => {
      if (e.total > 0) {
        let prog: any = Number(
          Number((e.loaded / e.total) * 100).toFixed(2)
        ) as any;
        fileList.value[i].progress = prog == 100 ? 99 : prog;
        fileList.value[i] = Object.assign(fileList.value[i], {
          progress:fileList.value[i].progress,
        });
        fileList.value.push({});
        fileList.value.pop();
      }
    },
    abort: (xhr: XMLHttpRequest) => {
      console.log("终止上传成功", xhr);
    },
    error: (err) => {
      console.log(err);
    },
  });
  fileList.value[i].upload.request();
  return false;
}
</script>
<style lang="less" scoped>
.icon-upload {
  color: var(--primary-color);
  font-size: 24px;
}
.ant-upload.ant-upload-drag p.ant-upload-text {
  font-size: 16px;
  color: #bebebe;
}
</style>