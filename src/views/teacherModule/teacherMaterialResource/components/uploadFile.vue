<template>
  <div class="upload-file">
    <a-upload
      :multiple="true"
      :before-upload="fileBeforeUpload"
      :show-upload-list="false"
      class="upload"
      :accept="currentType.accept"
    >
      <div class="left">
        <div class="prompt">
          <div class="iconfont icon-upload"></div>
          <div class="con">选择要上传的文件或将文件拖拽到此处</div>
          <div class="tips" v-if="props.type!==1">支持文件格式：{{currentType.uploadFileType}}{{props.type===4?'，支持文件大小500MB以内':''}}</div>
        </div>
      </div>
    </a-upload>
    <div class="rightBox textScrollbar">
      <div class="chunk-list">
        <div v-for="(v, k, i) in ChunkStatus" :key="i">
          <span v-if="v.name">文件名称：{{ v.name }}</span>
          <span v-if="v.currentChunk">计算md5进度：{{ v.currentChunk + "/" + v.chunks }}</span>
        </div>
      </div>
      <div class="progress-box textScrollbar">
        <div
          class="progress-item"
          v-for="(value, key) in props.fileList"
          :key="value"
        >
          <div class="img" :class="getFileType(value.name)">
            <img :src="getFileTypeIcon(value.name)" alt="" />
          </div>
          <div class="right">
            <div class="item-top">
              <span class="item-name single_ellipsis" :title=" value.name">{{ value.name }}</span>
              <span
                class="deleteicon"
                v-if="value.status !== 'end'&&props.type===1 || value.status !== 'done'&&props.type!==1"
                @click="deleteFile(value, key)"
              >
                <i class="icon-close iconfont"></i>
              </span>
              <span
                v-if="value.status === 'end'&&props.type===1 || value.status === 'done'&&props.type!==1"
                class="icon-shanchu iconfont"
                @click="removeFile(value, key)"
              ></span>
            </div>
            <!-- <div class="file-size" v-if="props.type === 1">{{ size(value.size/value.progress/100) }}</div> -->
            <div class="file-size">{{ bytesToSize(value.size) }}</div>
            <div class="file-progress">
              <div class="inner" v-if="props.type === 1" :style="{width: value.progress+'%'}"></div>
              <div class="inner" v-else :style="{width: value.percent+'%'}"></div>
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
import { ref, reactive, inject, onMounted ,watch, markRaw} from 'vue'
import { MessageApi } from "ant-design-vue/lib/message";
import { getFileType,getFileTypeIcon } from "src/utils/getFileType";
import Upload from 'src/utils/MoreUpload'
import { UUID } from "src/utils/uuid";
import tusFileUpload from 'src/utils/tusFileUpload'
import { bytesToSize } from "src/utils/common"
import request from "src/api/index";
const http = (request as any).teacherMaterialResource;
const $message: MessageApi = inject("$message")!;
// import api from 'src/api';
interface Props {
  type: number
  fileList: any
  complete?:any
  slab_uid?: string
}
const props = withDefaults(defineProps<Props>(), {
  type: 1,
  fileList: {},
  complete:{
    complete:false // 全部文件是否上传完成
  },
  slab_uid: ''
});
// type 1:数据集 2:应用软件 3:课件 4:视频 5:备课资料 6:教学指导
const typeInfo = reactive({
  1: {id: 1, name: "数据集",accept: '', uploadFileType: ''},
  4: {id: 4, name: "视频目录", accept: '.mp4', uploadFileType: 'mp4'},
  3: {id: 3, name: "课件目录", accept: '.ppt,.pptx,.pdf', uploadFileType: 'ppt、pptx、pdf'},
  5: {id: 5, name: "备课资料目录", accept: '.pdf,.doc,.docx', uploadFileType: 'pdf、doc、docx'},
  6: {id: 6, name: "教学指导目录", accept: '.pdf,.doc,.docx', uploadFileType: 'pdf、doc、docx'},
  7: {id: 7, name: "实验文档目录", accept: '.pdf,.doc,.docx,.md', uploadFileType: 'pdf、doc、docx、md'},
});
const currentType = reactive(typeInfo[props.type])
const uploadFileUuid = ref(UUID.uuid4());
let ChunkStatus: any = reactive({});
const uploadFileList: any = reactive([])
let sign = 0
function fileBeforeUpload(file: any) {
  // console.log(file)
  if (file && file.size === 0) {
    $message.warn(`${file.name}文件大小不能为空`);
    return false;
  }
  if (props.type === 4 && file.size > 500*1024*1024) {
    $message.warn(`上传文件大小必须要在500M以内`);
    return
  }
  if (props.type !== 1) {
    if (file.name.length > 100) {
      $message.warn(`文件名称长度不能大于100`);
      return
    }
    let obj = {
      data: {},
      file,
    }
    uploadFileList.push(obj)
    Object.assign(props.fileList, {
      [sign]: {
        name: file.name,
        status: "start",
        progress: 0,
        files: [],
        data: {},
        open: false,
        size: file.size,
      },
    });
    // console.log(props.fileList)
    const accept = currentType.uploadFileType.split('、')
    const tusdDirKey = props.type !== 4 ? 'document_path' : 'video_path';
    // console.log(accept)
    tusFileUpload.onUpload(file, tusdDirKey, accept, props.fileList[sign])
    sign ++
    return false;
  }
  if (file.name.length > 60) {
    $message.warn(`文件名称长度不能大于60`);
    return
  }
  Upload({
    startUploadURL: "/dmc/v1.0/create_multi_part",
    multiUploadURL: "/dmc/v1.0/multi_part_upload",
    mergeUploadUrl: "/dmc/v1.0/compose_part",
    data_set_id: props.slab_uid || '',
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
watch(()=>{return props.fileList},(val:any)=>{
  const arr=Object.values(props.fileList)
  // console.log(arr)
  props.complete.complete=false
  arr.length?arr.forEach((v:any)=>{
    let str=props.type===1?'end':'done'
    if(v.status !== str){
      props.complete.complete=true
    }
  }):''
},{deep:true})
function chunkFun(
  name: string,
  chunks: number,
  currentChunk: number,
  key: string
) {
  // console.log(currentChunk)
  if (currentChunk!==1 && !ChunkStatus[key].name) return
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
  if (!props.fileList[v]) return
  props.fileList[v].status = "end";
  props.fileList[v].progress = 100;
  props.fileList[v].data = d;
}
function deleteFile(file: any, key: any) {
  ChunkStatus[key] = {}
  if (props.type !== 1) { // 不是数据集
    if(props.fileList[key] !== "done"){
      tusFileUpload.remove(props.fileList[key])
    }
  } else {
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
  // console.log(file);
  // console.log(props.fileList);
  file.files.forEach((item: any) => {
    if (item.xhr) {
      // console.log(item)
      item.xhr.abort();
    }
  });
  if(props.type!==1){
    delete props.fileList[index];
  }else{
    const deleteParam = {
      file_id: file.data.uid,
      file_name: file.data.name,
    }
    http.deleteItemFile({param:{...deleteParam}}).then((res:any)=>{
      delete props.fileList[index];
    })
  }
  // delete props.fileList[index];
}
function removeAllFile() {
  ChunkStatus = {}
  Object.keys(props.fileList).forEach((v: any) => {
    console.log(props.fileList[v], props.type===1)
    if (props.fileList[v].status==='end' || props.fileList[v].status === 'done') {
      delete props.fileList[v];
    } else {
      if (props.type === 1) {
        props.fileList[v].files.forEach((item: any) => {
          if (item.xhr) {
            console.log(item)
            item.xhr.abort();
          }
        })
      } else {
        tusFileUpload.remove(props.fileList[v]);
      }
      delete props.fileList[v];
    }
  })
}
defineExpose({
  removeAllFile
})
onMounted(() => {
  tusFileUpload.init()
})
</script>


<style lang="less" scoped>
.upload-file {
  // height: 100%;
  display: flex;
  justify-content: space-between;
  height: 400px;
  // overflow: auto;
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
  .rightBox {
    flex: 1;
    height: 100%;
    overflow: auto;
    margin-right: 24px;
    padding-right: 24px;
    .progress-box {
      // height: 100%;
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
          width: calc(100% - 44px);
          padding-left: 24px;
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
              width: 85%;
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
