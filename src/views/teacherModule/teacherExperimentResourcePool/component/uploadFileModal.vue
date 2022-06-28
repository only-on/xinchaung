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
        :options="videoDirectoryList"
      >
        <a-select-option>
        </a-select-option>
      </a-select>
      <a-upload
        :custom-request="() => {}"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :accept="props.type === 'video' ? '.mp4' : '.md,.doc,.docx,.pdf'"
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
      <div v-if="uploadFileList.name" class="progress-box">
        <div class="file-base-info">
          <span>文件名称：{{ uploadFileList.name }}</span
          ><span class="icon-shanchu iconfont" @click="remove"></span>
        </div>
        <a-progress :percent="uploadFileList.percent" />
      </div>
    </div>
    <template #footer>
      <Submit @submit="uploadvideoOk()" @cancel="cancel()" :loading="uploadFileList.status !== 'done'?true:false"></Submit>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, reactive, toRefs, watch, ref } from "vue";
import uploadFile from "src/request/uploadFile";
import { message } from "ant-design-vue";
import request from "src/api/index";
import tusFileUpload from 'src/utils/tusFileUpload'
import { readFile } from "src/utils/getFileType";
import Submit from "src/components/submit/index.vue"
const courseApi = request.teachCourse;
const http = request.teacherMaterialResource;
const httpExp = request.teacherExperimentResourcePool;
const env = process.env.NODE_ENV == "development" ? true : false;

onMounted(() => {
  getVideoDirectory()
  tusFileUpload.init()
});
// 获取视频/文档目录列表
interface IVideoDirectoryList {
  label: string
  options: any[]
}
const props = withDefaults(defineProps<Props>(), {
  visibleUpload: false,
  type: "",
});
const emit = defineEmits<{
  (e: "update:visibleUpload", visible: boolean): void;
  (e: "uploadSuccess", file: any, id: any): void;
}>();
interface Props {
  visibleUpload: boolean;
  type: string;
}
const videoDirectoryList = reactive<IVideoDirectoryList[]>([
  { label: "公有", options: [{ label: "共有1", value: 1 }] },
  { label: "私有", options: [{ label: "私有1", value: 2 }] }
]);
const getVideoDirectory = () => {
  videoDirectoryList[0].options.length = 0
  videoDirectoryList[1].options.length = 0
  // 1：数据集；2：应用软件；3：课件；4：视频；5：备课资料；6：教学指导 7: 文档实验
  http.getSelectResourceList({urlParams: {typeID: props.type==='video' ? 4:7}}).then((res: any) => {
    res.data.public.forEach((item:any) => {
      videoDirectoryList[0].options.push({
        value: item.id,
        label: item.name
      })
    })
    res.data.private.forEach((item:any) => {
      videoDirectoryList[1].options.push({
        value: item.id,
        label: item.name
      })
    })
    dataset_id.value= res.data.private[0]?.id || res.data.public[0]?.id
  });
};

let dataset_id = ref<number | undefined>();
let upload: any = reactive({});
let uploadFileList: any = reactive({
  status: 'done',
  name: '',
  percent: 0
});

async function beforeUpload(file: any) {
  console.log(dataset_id.value, file)
  if (!dataset_id.value) {
    message.warn("上传文件时请选择目录");
    return false;
  }
  const arr = file.name.split('.')
  const suffix = arr[arr.length-1]
  if (suffix === 'md') {
    const text = await readFile(file);
    const info = {
      name: file.name,
      suffix,
      text,
    }
    uploadFileList.percent = 100
    uploadFileList.status = "done"
    uploadFileList.suffix = 'md'
    uploadFileList.text = text
    uploadFileList.name = file.name
    // emit("uploadSuccess", info, dataset_id.value);
    // emit("update:visibleUpload", false);
    return false
  }
  const accept = props.type === 'file' ? ['md','doc','docx','pdf'] : ['mp4']
  const tusdDirKey = props.type === 'file' ? 'document_path' : 'video_path';
  tusFileUpload.onUpload(file,tusdDirKey, accept , uploadFileList)
  console.log(uploadFileList)
  return false;
}
// 终止上传
function abort() {
  if(uploadFileList.status !== "done"){
    tusFileUpload.remove(uploadFileList)
  }
  uploadFileList.name = ''
  uploadFileList.percent = 0
  uploadFileList.status = 'done'
}
// 移除
function remove() {
  abort();
}
function uploadvideoOk() {
  console.log(uploadFileList)
   if (!uploadFileList.name) {
    message.warning('请上传文件')
    return
  }
  emit("uploadSuccess", uploadFileList, dataset_id.value);
  emit("update:visibleUpload", false);
  uploadFileList.status = 'done'
  uploadFileList.name = ''
  uploadFileList.percent = 0
}
function cancel() {
  abort()
  emit("update:visibleUpload", false);
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
