<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns" v-if="currentTab === '0'&&type!=='recommend'">
      <span v-if="!fileInfo.id">
        <span class="tips">支持单个500M以内的MP4格式文件上传</span>
        <a-button type="primary" @click="uploadVideo">上传视频</a-button>
        <a-button type="primary" @click="selectVideoClick">选择视频</a-button>
      </span>
      <a-button type="primary" @click="delet" v-else
        >移除</a-button
      >
    </div>
  </div>
  <div class="experiment-content">
    <common-video
      style="width: 100%; height: 570px"
      controls="true"
      :src="fileInfo.tusdVideoUrl"
      v-if="fileInfo.tusdVideoUrl"
    ></common-video>
    <div v-else><Empty /> </div>
  </div>
  <!-- <Submit @submit="onSubmit" @cancel="cancel" v-if="!fileInfo.id"></Submit> -->
  <!-- 选择视频抽屉 -->
  <SelectDocOrMp4
    :activeFile="fileInfo"
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
import { ref, inject, reactive, PropType, watch } from "vue";
import videoCover from 'src/assets/images/common/videoCover.jpg'
import { MessageApi } from "ant-design-vue/lib/message";
import selectFile from "src/components/selectFile/selectFile.vue";
import uploadFileModal from "./../uploadFileModal.vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { useRouter, useRoute } from "vue-router";
import Submit from "src/components/submit/index.vue";
import SelectDocOrMp4 from 'src/components/SelectDocOrMp4/index.vue'
import CommonVideo from "../../../../../components/common/CommonVideo.vue";

const router = useRouter();
const route = useRoute();
const { currentTab, type }  = route.query
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
const emit = defineEmits<{
  (e: "getExperimentDetail"): void;
}>();
let fileInfo: any = reactive({})
watch(
  () => props.detail,
  () => {
    if (props.detail.content_task_files&&props.detail.content_task_files.length) {
      fileInfo.id = props.detail.content_task_files[0].id
      fileInfo.tusdVideoUrl = props.detail.content_task_files[0].file_url
    } else {
      fileInfo.id = 0
      fileInfo.tusdVideoUrl = ''
      fileInfo.file_url = ''
    }
  },
  { deep: true, immediate: true }
);
const delet = () => {
  fileInfo.id = 0
  fileInfo.tusdVideoUrl = ''
  fileInfo.file_url = ''
}
// 移除视频
const deletVideo = () => {
  return new Promise((resolve) => {
    http.deleteVideo({urlParams: {content_id: props.detail.id}})
      .then((res: any) => {
        fileInfo.id = 0
        fileInfo.tusdVideoUrl = ''
        fileInfo.file_url = ''
        resolve(res)
      })
  })
};


// 选择视频
const visible = ref<boolean>(false);
const selectVideoClick = () => {
  visible.value = true;
};
const selectDocOrMp4File = (val: any) => {
  // console.log(val)
  Object.assign(fileInfo, val)
  fileInfo.tusdVideoUrl = val.file_url
  fileInfo.file_url = fileInfo.file_html
  fileInfo.name = val.file_name
};
const closeDrawerDoc = () => {
  visible.value = false;
  fileInfo.file_url ? updateVideoGuide() : ''
};

// 上传视频
const visibleUpload = ref<boolean>(false);
const uploadVideo = () => {
  visibleUpload.value = true;
};
let dataId = 0
const uploadSuccess = (uploadFileList?: any, id?: any) => {
  // console.log(fileInfo)
  // console.log(uploadFileList)
  dataId = id
  fileInfo.tusdVideoUrl = uploadFileList.tusdVideoUrl
  fileInfo.file_url = uploadFileList.file_url
  fileInfo.name = uploadFileList.name
  updateVideoGuide()
};
const updateVideoGuide = async () => {
  // console.log(fileInfo)
  const file = {
    "file_path": fileInfo.file_url,// 文档实验-文件
    file_name: fileInfo.name
  }
  Object.assign(file, {"directory_id": dataId || fileInfo.dataset_id})
  await deletVideo()
  http.updateVideoGuide({
    param: {video_file:file},
    urlParams: {content_id: props.detail.id}
  }).then((res: any) => {
    dataId = 0
    $message.success("更新成功")
    // router.go(-1)
    emit('getExperimentDetail')
  })
}

const onSubmit = () => {
  if (!fileInfo.file_url) {
    $message.warn("请上传或选择视频")
    return
  }
  const file = {
    "file_path": fileInfo.file_url,// 文档实验-文件
  }
  Object.assign(file, {"directory_id": dataId || fileInfo.dataset_id})
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
