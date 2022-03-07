<template>
  <div class="upload-file">
    <a-upload
      :multiple="true"
      :before-upload="fileBeforeUpload"
      :show-upload-list="false"
      class="upload"
    >
      <div class="left">
        <div class="prompt">
          <div class="iconfont icon-upload"></div>
          <div class="con">选择要上传的文件或将文件拖拽到此处</div>
          <div class="tips" v-if="props.uploadType">支持文件格式：{{props.uploadType}}</div>
        </div>
      </div>
    </a-upload>
    <div class="right scroll-bar-customize">
      <div class="chunk-list">
        <div v-for="(v, k, i) in ChunkStatus" :key="i">
          <span>文件名称：{{ v.name }}</span>
          <span
            >计算md5进度：{{ v.chunks + "/" + v.currentChunk }}</span
          >
        </div>
      </div>
      <div class="progress-box">
        <div 
          class="progress-item" 
          v-for="(value, key) in props.fileList"
          :key="value"
        >
          <div class="img" :class="getFileType(value.name)">
            <img :src="iconList[getFileType(value.name)]" alt="" />
          </div>
          <div class="right">
            <div class="item-top">
              <span>{{ value.name }}</span>
              <span
                class="deleteicon"
                v-if="value.status !== 'end'"
                @click="deleteFile(value, key)"
              >
                <i class="icon-close iconfont"></i>
              </span>
              <span
                v-if="value.status === 'end'"
                class="icon-shanchu iconfont"
                @click="removeFile(value, key)"
              ></span>
            </div>
            <div class="file-size">{{ size(value.size/value.progress/100) }}</div>
            <div class="file-progress">
              <div class="inner" :style="{width: value.progress+'%'}"></div>
            </div>
            <!-- <div class="file-size" v-if="value.progress === '100'">{{ value.data.size }}</div>
            <div v-if="value.progress === '100'"><a-progress :percent="value.progress" /></div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject } from 'vue'
import { MessageApi } from "ant-design-vue/lib/message";
import { getFileType } from "src/utils/getFileType";
import Upload from 'src/utils/MoreUpload'
import { UUID } from "src/utils/uuid";
import iconList from "src/utils/iconList";
const $message: MessageApi = inject("$message")!;
interface Props {
  uploadType: string
  fileList: any
}
const props = withDefaults(defineProps<Props>(), {
  uploadType: '',
  fileList: {}
});
const uploadFileUuid = ref(UUID.uuid4());
const ChunkStatus: any = reactive({});
function fileBeforeUpload(file: any) {
  // console.log(file)
  if (file && file.size === 0) {
    $message.warn("文件大小不能为空");
    return false;
  }
  Upload({
    startUploadURL: "/dmc/v1.0/create_multi_part",
    multiUploadURL: "/dmc/v1.0/multi_part_upload",
    mergeUploadUrl: "/dmc/v1.0/compose_part",
    data_set_id: "",
    file: file,
    chunkSize: 5242880, // 2096963
    chunkFun: chunkFun,
    startUploadFun: startUploadFun,
    processFun: processFun,
    endUploadFun: endUploadFun,
    eruptNum: 6,
    uploadFileUuid: uploadFileUuid.value,
  });
  return false;
}
function chunkFun(
  name: string,
  chunks: number,
  currentChunk: number,
  key: string
) {
  Object.assign(ChunkStatus, {
    [key]: { name: name, chunks: chunks, currentChunk: currentChunk },
  });
  if (chunks === currentChunk) {
    delete ChunkStatus[key];
  }
}
function startUploadFun(v: any, file_name: string, file_size: number) {
  Object.assign(props.fileList, {
    [v]: {
      name: file_name,
      status: "start",
      progress: 0,
      files: [],
      data: {},
      open: false,
      size: file_size,
    },
  });
}
function processFun(e: any, v: any, length: number) {
  // console.log(e, v, length)
  if (!props.fileList[v.fileMd5]?.status) {
    return;
  }
  Object.assign(
    typeof props.fileList[v.fileMd5].files[v.index] === "object"
      ? props.fileList[v.fileMd5].files[v.index]
      : (props.fileList[v.fileMd5].files[v.index] = {}),
    {
      xhr: v.xhr,
      progress: Number(((e.loaded / e.total) * 100).toFixed(2)),
      upload_status: e.loaded > e.total ? "loading" : "end",
    }
  );
  let progress = 0;
  props.fileList[v.fileMd5].files.forEach((item: any) => {
    progress += item.progress;
  });

  props.fileList[v.fileMd5].progress =
    Number((progress / length).toFixed(2)) !== 100
      ? Number((progress / length).toFixed(2))
      : 99;
}
function endUploadFun(v: any, d: any) {
  props.fileList[v].status = "end";
  props.fileList[v].progress = 100;
  props.fileList[v].data = d;
}
function deleteFile(file: any, key: any) {
  if (file.files.length > 0) {
    file.files.forEach((item: any) => {
      if (item.xhr) {
        // console.log(item)
        item.xhr.abort();
      }
    });
  }
  delete props.fileList[key];
}
function removeFile(file: any, index: any) {
  file.files.forEach((item: any) => {
    if (item.xhr) {
      // console.log(item)
      item.xhr.abort();
    }
  });
  delete props.fileList[index];
}
function size(size:any){
  let num=Number(size)
  console.log(num)
  if (num < 1024 * 1024) {
    return (num / 1024).toFixed(2) + 'kb'
  } else {
    return (num / 1024 / 1024).toFixed(2) + 'Mb'
  }
}
</script>


<style lang="less" scoped>
.upload-file {
  height: 100%;
  display: flex;
  justify-content: space-between;
  .upload {
    width: 400px;
    margin-right: 30px;
    background: #ffffff;
    border: 1px dashed #bebebe;
    border-radius: 4px;
    position: relative;
    :deep(.ant-upload) {
      width: 100%;
      height: 100%;
      .left {
        width: 100%;
        height: 100%;
        cursor: pointer;
        .prompt {
          position: absolute;
          top: 50%;
          margin-top: -42px;
          left: 63px;
          text-align: center;
          .iconfont {
            font-size: var(--font-size-24);
            color: var(--primary-color);
          }
          .con {
            font-size: var(--font-size-16);
            color: var(--black-45);
          }
          .tips {
            color: var(--black-25);
          }
        }
      }
    }
  }
  .right {
    flex: 1;
    // height: 100%;
    // overflow: auto;
    margin-right: 24px;
    padding-right: 24px;
    .progress-box {
      .progress-item {
        display: flex;
        flex-direction: row;
        margin-bottom: 32px;
        // height: 44px;

        .img {
          // width: 24px;
          // height: 26px;
          flex-shrink: 0;
          img {
            width: 44px;
          }
        }

        .right {
          width: 100%;
          margin-left: 24px;
          > .item-top {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            list-style: none;
            height: 19px;
            line-height: 19px;
            margin-top: 3px;

            > span:nth-child(1) {
              color: #404040;
              font-size: 14px;
            }

            .iconfont {
              font-size: var(--font-size-18);
              color: var(--black-45);
              cursor: pointer;
            }
          }

          .file-size {
            color: var(--black-5);
            height: 16px;
            line-height: 16px;
          }
          .file-progress {
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: #ebebeb;
            margin-top: 2px;
            .inner {
              height: 100%;
              border-radius: 2px;
              background: var(--primary-color);
            }
          }
        }
      }
    }

    .chunk-list {
      > div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    }
  }
}
</style>