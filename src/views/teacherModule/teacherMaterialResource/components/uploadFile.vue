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
          <span>文件名称：{{ v.name }}</span>
          <span
            >计算md5进度：{{ v.chunks + "/" + v.currentChunk }}</span
          >
        </div>
      </div>
      <div class="percent-box textScrollbar">
        <div 
          class="percent-item" 
          v-for="(value, key) in props.fileList"
          :key="value"
        >
          <div class="img" :class="getFileType(value.name)">
            <img :src="getFileTypeIcon(value.name)" alt="" />
          </div>
          <div class="right">
            <div class="item-top">
              <span>{{ value.name }}</span>
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
            <div class="file-size">{{ fileSize(value.size/value.percent/100) }}</div>
            <div class="file-percent">
              <div class="inner" :style="{width: value.percent+'%'}"></div>
            <div class="file-size" v-if="props.type === 1">{{ bytesToSize(value.size/value.progress/100) }}</div>
            <div class="file-size" v-else>{{ bytesToSize(value.size) }}</div>
            <div class="file-progress">
              <div class="inner" v-if="props.type === 1" :style="{width: value.progress+'%'}"></div>
              <div class="inner" v-else :style="{width: value.percent+'%'}"></div>
            </div>
            <!-- <div class="file-size" v-if="value.percent === '100'">{{ value.data.size }}</div>
            <div v-if="value.percent === '100'"><a-percent :percent="value.percent" /></div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, onMounted,watch ,Ref} from 'vue'
import { MessageApi } from "ant-design-vue/lib/message";
import { getFileType,getFileTypeIcon,fileSize } from "src/utils/getFileType";
import Upload from 'src/utils/MoreUpload'
import { UUID } from "src/utils/uuid";
import tusFileUpload from 'src/utils/tusFileUpload'
import { bytesToSize } from "src/utils/common"
const $message: MessageApi = inject("$message")!;
interface Props {
  type: number
  fileList: any
  complete?:any
}
var props = withDefaults(defineProps<Props>(),{
  type: 1,
  fileList: {},
  complete:{
    complete:false  // 所有文件是否全部上传完成
  }
});
// type 1:数据集 2:应用软件 3:课件 4:视频 5:备课资料 6:教学指导
const typeInfo = reactive({
  1: {id: 1, name: "数据集",accept: '', uploadFileType: ''},
  4: {id: 4, name: "视频目录", accept: '.mp4', uploadFileType: 'mp4'},
  3: {id: 3, name: "课件目录", accept: '.ppt,.pptx,.pdf', uploadFileType: 'ppt、pptx、pdf'},
  5: {id: 5, name: "备课资料目录", accept: '.pdf,.doc,.docx', uploadFileType: 'pdf、doc、docx'},
  6: {id: 6, name: "教学指导目录", accept: '.pdf,.doc,.docx', uploadFileType: 'pdf、doc、docx'},
});
const currentType = reactive(typeInfo[props.type])
const uploadFileUuid = ref(UUID.uuid4());
const ChunkStatus: any = reactive({});
const uploadFileList: any = reactive([])
let sign = 0
function fileBeforeUpload(file: any) {
  // console.log(file)
  if (file && file.size === 0) {
    $message.warn(`${file.name}文件大小不能为空`); 
    return false;
  }
  if (props.type !== 1) {
    let obj = {
      data: {},
      file,
    }
    uploadFileList.push(obj)
    Object.assign(props.fileList, {
      [sign]: {
        name: file.name,
        status: "start",
        percent: 0,
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

// var complete:Ref<boolean> = ref(false);   // 所有文件是否全部上传完成
watch(()=>{ return props.fileList},(val:any)=>{
  props.complete.complete=false
  Object.values(props.fileList).forEach((v:any)=>{
    if(v.status !== 'done'){
      props.complete.complete=true
    }
  })
},{deep:true})

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
      percent: 0,
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
      percent: Number(((e.loaded / e.total) * 100).toFixed(2)),
      upload_status: e.loaded > e.total ? "loading" : "end",
    }
  );
  let percent = 0;
  props.fileList[v.fileMd5].files.forEach((item: any) => {
    percent += item.percent;
  });

  props.fileList[v.fileMd5].percent =
    Number((percent / length).toFixed(2)) !== 100
      ? Number((percent / length).toFixed(2))
      : 99;
}
function endUploadFun(v: any, d: any) {
  props.fileList[v].status = "end";
  props.fileList[v].percent = 100;
  props.fileList[v].data = d;
}
function deleteFile(file: any, key: any) {
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
  file.files.forEach((item: any) => {
    if (item.xhr) {
      // console.log(item)
      item.xhr.abort();
    }
  });
  delete props.fileList[index];
}
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
  overflow: auto;
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
    .percent-box {
      // height: 100%;
      .percent-item {
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
          .file-percent {
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