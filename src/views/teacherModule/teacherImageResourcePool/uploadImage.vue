<template>
  <div class="uploadImage">
    <a-upload-dragger
      name="file"
      :multiple="true"
      :before-upload="beforeUpload"
      :remove="remove"
      :fileList="fileList"
      accept=".tar,.qcow2"
      class="upload"
    >
      <p class="ant-upload-drag-icon">
        <span class="iconfont icon-upload"></span>
      </p>
      <p class="ant-upload-hint" style="font-size: 14px">
        选择要上传的镜像或将镜像拖拽到此处 仅支持tar和qcow2
      </p>
    </a-upload-dragger>
    <a-progress v-if="ifProgress" :percent="percentage" />
    <div v-if="file" class="uploadBtn">
      <a-button class="btn" :disabled="uploadFile" @click="onUpload">上传</a-button>
      <!-- <a-button class="btn" :disabled="recover" @click="recoveryUpload">恢复</a-button>
      <a-button class="btn" :disabled="stop" @click="stopUpload">暂停</a-button> -->
      <a-button class="btn" :disabled="deleteFile" @click="deleteUpload">删除</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  Ref,
  ref,
  inject,
  reactive,
  toRefs,
  onMounted,
} from "vue";
import * as tus from "tus-js-client";
// import { createMirrorApi, getConfigApi } from "./api";
import request from "src/api/index";
const http = (request as any).teacherImageResourcePool;
const httpCommon=(request as any).commom;
import { message } from "ant-design-vue";
import { lStorage } from '../../../utils/extStorage';

interface ImageType {
  name: string;
  imageType: any;
  classify_id: any;
  tag: any;
  desc: any;
}
interface Istate {
  upload: any;
  name: string;
  size: string;
  percentage: number;
  file: any;
  fileList: any;
  uploadFile: boolean;
  recover: boolean;
  stop: boolean;
  deleteFile: boolean;
  ifProgress: boolean;
}
export default defineComponent({
  name: "uploadImage",
  setup(props, context) {
    const env = process.env.NODE_ENV == "development" ? true : false;
    const state: Istate = reactive({
      upload: "",
      file: "",
      name: "",
      size: "",
      percentage: 0,
      fileList: [],
      uploadFile: false,
      recover: true,
      stop: true,
      deleteFile: false,
      ifProgress: false,
    });
    const methods = {
      // 有文件输入
      beforeUpload(file: any) {
        if (!file) {
          message.warning("请先上传文件！");
          return;
        }
        const type = file.name.split(".")[file.name.split(".").length - 1];
        if (type !== "tar" && type !== "qcow2") {
          message.warning("只能上传.tar和.qcow2的文件");
          return;
        }
        state.file = file;
        state.name = file.name;
        state.size = file.size;
        state.fileList = [file];
        state.uploadFile = false;
        context.emit("upload-imageinfo",state.name, "",'');
        return false;
      },
      onUpload() {
        state.ifProgress = true;
        const type = state.name.split(".")[state.name.split(".").length - 1];
        if (!state.file) {
          message.warning("请先上传文件！");
          return;
        }
        var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        if (reg.test(state.name)) {
          message.warning("文件名不能包含汉字!");
          return;
        }
        state.uploadFile = true;
        state.stop = false;
        state.deleteFile = false;
        // 创建一个tus实例
        state.upload = new tus.Upload(state.file, {
          // tus服务器的上传URL
          // endpoint: env ? "http://192.168.200.140:1080/files/" : "/tusd/files/",
          endpoint:FileConfig.endpoint,
          // 数组或null
          retryDelays: [0, 3000, 5000, 10000, 20000],
          // 在所有请求中使用的具有自定义头值的对象。用于添加身份验证细节
          headers: {
            Authorization: "Bearer ...",
            // 自定义的header字段，传给后台：存放上传文件的路径
            "Project-Path": FileConfig.ProjectPath,
          },
          // 默认值：Infinity
          chunkSize: 5242880,
          // 附加元数据。当(且仅当)创建新的上传时，将传递给服务器。可以用于文件名，文件类型
          metadata: {
            filename: state.file.name,
            filetype: state.file.type,
          },
          // 出现错误时调用的可选函数。该参数将是一个 Error 实例，其中包含有关所涉及请求​​的附加信息。
          onError: function (error) {
            message.warning("Failed because: " + error);
          },
          // 获取进度信息时调用该函数
          onProgress: function (bytesUploaded, bytesTotal) {
            var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
            state.percentage = Number(percentage);
            context.emit("upload-percentage", Number(state.percentage));
          },
          // 上传完成时调用的函数
          onSuccess: function () {
            // console.log(state.upload, state.upload.url, "state.upload state.upload");
            const name = state.upload.url.split("/")[
              state.upload.url.split("/").length - 1
            ];
            const type = state.name.split(".")[state.name.split(".").length - 1];
            // console.log(FileConfig.ProjectPath + name + "." + type, "path");
            context.emit(
              "upload-imageinfo",
              state.name,
              state.size,
              FileConfig.ProjectPath+ "/" + name + "." + type
            );
          },
        });

        // 检查是否有以前的上传，继续上传。
        state.upload.findPreviousUploads().then(function (previousUploads: any) {
          // 找到以前的上传，选择第一次上传的。
          if (previousUploads.length) {
            state.upload.resumeFromPreviousUpload(previousUploads[0]);
          }

          // Start the upload
          state.upload.start();
        });
        return false
      },
      recoveryUpload() {
        state.upload.start().then(() => {
          state.stop = false;
          state.recover = true;
        });
      },
      stopUpload() {
        state.upload.abort().then(() => {
          state.stop = true;
          state.recover = false;
        });
      },
      deleteUpload(file: any) {
        if (state.stop === false) {
          methods.stopUpload();
        }
        state.fileList = [];
        state.file = "";
        state.percentage = 0;
        state.name = "";
        state.size = "";
        state.ifProgress = false;
        context.emit("upload-imageinfo", "", "",'');
        return true;
      },
      remove(file: any) {
        state.upload.abort();
        state.file = "";
        state.percentage = 0;
        state.fileList = [];
        state.ifProgress = false;
        console.log(file, "已经删除啦");
      },
    };
    watch(
      () => state.percentage,
      (val: any) => {
        // console.log(val)
        state.stop = state.percentage === 100 ? true : false;
      }
    );
    const FileConfig:any=reactive({
      endpoint:'',
      ProjectPath:''
    })
    onMounted(() => {
      FileConfig.endpoint = lStorage.get('tusd_url');
      FileConfig.ProjectPath = lStorage.get('tusd_image_path');
    });
    return { ...methods, ...toRefs(state) };
  },
});
</script>

<style lang="less">
.uploadImage {
  .icon-upload {
    font-size: 24px;
    color: var(--primary-color);
  }
  .uploadBtn {
    display: flex;
    margin-top: 10px;
    .btn {
      margin-right: 10px;
    }
  }
  .upload {
    .ant-upload.ant-upload-drag .ant-upload-btn {
      padding: 40px;
    }
    .ant-upload-list-item-card-actions {
      display: none;
    }
  }
}
</style>
