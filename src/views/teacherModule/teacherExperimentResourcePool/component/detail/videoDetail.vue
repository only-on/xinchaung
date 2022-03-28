<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <span v-if="!fileInfo.content_id">
        <span class="tips">支持单个500M以内的MP4格式文件上传</span>
        <a-button type="primary" @click="uploadVideo">上传视频</a-button>
        <a-button type="primary" @click="selectVideoClick">选择视频</a-button>
      </span>
      <a-button type="primary" @click="deletVideo" v-else
        >移除</a-button
      >
    </div>
  </div>
  <div class="experiment-content">
    <video
      style="width: 100%; height: 650px"
      controls="true"
      :src="fileInfo.tusdVideoUrl"
      v-if="fileInfo.tusdVideoUrl"
    ></video>
  </div>
  <Submit @submit="onSubmit" @cancel="cancel" v-if="!fileInfo.content_id && fileInfo.tusdVideoUrl"></Submit>
  <!-- 选择视频抽屉 -->
  <SelectDocOrMp4 
    :activeFile="activeFile" 
    :visible="visible" 
    :docOrMp4Type="2" 
    @selectDocOrMp4File="selectDocOrMp4File" 
    @closeDrawerDoc="closeDrawerDoc" 
  />
  <!-- 上传视频弹窗 -->
  <upload-file-modal
    :type="'video'"
    v-model:visibleUpload="visibleUpload"
    @uploadSuccess="uploadSuccess"
  ></upload-file-modal>
</template>

<script lang="ts" setup>
import { ref, inject, reactive, PropType } from "vue";
import { MessageApi } from "ant-design-vue/lib/message";
import selectFile from "src/components/selectFile/selectFile.vue";
import uploadFileModal from "./../uploadFileModal.vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { useRouter, useRoute } from "vue-router";
import Submit from "src/components/submit/index.vue";
import SelectDocOrMp4 from 'src/components/SelectDocOrMp4/index.vue'
const router = useRouter();
const courseApi = request.teachCourse;
const http = request.teacherExperimentResourcePool;
const $message: MessageApi = inject("$message")!;
interface Ifiles {
  id: number
  file_name: string
  file_url: string
  content_id: string
}
interface IDetail {
  id: number
  content_task_files: Ifiles[]
}
interface Props {
  detail: IDetail
}
const props: Props = defineProps({
  detail: {
    type: Object as PropType<IDetail>,
    require: true,
    default: {
      id: 0,
      content_task_files: []
    }
  }
})
const fileInfo = props.detail.content_task_files.length ? 
  Object.assign(props.detail.content_task_files[0], {tusdVideoUrl:props.detail.content_task_files[0].file_url}) : {
    content_id: 0,
    tusdVideoUrl: ''
  }


// 移除视频
const deletVideo = () => {
  http.deleteVideo({urlParams: {content_id: fileInfo.content_id}})
  .then((res: any) => {
    fileInfo.content_id = 0
    fileInfo.tusdVideoUrl = ''
  })
};


// 选择视频
const visible = ref<boolean>(false);
let activeFile: any = reactive({})
const selectVideoClick = () => {
  visible.value = true;
};
const selectDocOrMp4File = (val: any) => {
  Object.assign(activeFile, val)
  fileInfo.tusdVideoUrl = val.file_url
  activeFile.id = val.id
};
const closeDrawerDoc = () => {
  visible.value = false;
};

// 上传视频
const visibleUpload = ref<boolean>(false);
const uploadVideo = () => {
  visibleUpload.value = true;
};
let dataId = 0
const uploadSuccess = (uploadFileList: any, id: any) => {
  dataId = id
  fileInfo.tusdVideoUrl = uploadFileList.tusdVideoUrl
};

const onSubmit = () => {
  const file = {
    "file_path": fileInfo.tusdVideoUrl,// 文档实验-文件
  }
  dataId ? Object.assign(file, {"directory_id": dataId}) : ''
  http.updateVideoGuide({
    param: {video_file:file},
    urlParams: {content_id: props.detail.id}
  }).then((res: any) => {
    dataId = 0
    $message.success("更新成功")
    router.go(-1)
  })
};
const cancel = () => {
  router.go(-1)
};
</script>

<style lang="less" scoped>
.title {
  line-height: 34px;
  padding: 10px 0 5px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  h3 {
    margin-left: 12px;
  }
  .operate-btns {
    .ant-btn {
      margin-left: 8px;
    }
    .tips {
      font-size: var(--font-size-sm);
      color: var(--black-25);
    }
  }
}
.experiment-content {
  margin-top: 16px;
}
</style>
