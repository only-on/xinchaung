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
  <a-drawer
    class="video-drawer"
    width="640"
    placement="right"
    :title="'选择视频'"
    :closable="true"
    :visible="visible"
    @close="onClose"
  >
    <select-file
      @selectFileHandle="selectFileHandle"
      @getFileList="getFileList"
      :fileList="fileList"
      :type="'video'"
      :selectId="selectId"
    ></select-file>
  </a-drawer>
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


// 上传视频
const uploadVideo = () => {
  visibleUpload.value = true;
};

// 选择视频
const selectVideoClick = () => {
  visible.value = true;
};
// 移除视频
const deletVideo = () => {
  console.log("移除视频",fileInfo);
  http.deleteVideo({urlParams: {content_id: fileInfo.content_id}})
  .then((res: any) => {
    console.log(res)
    fileInfo.content_id = 0
    fileInfo.tusdVideoUrl = ''
  })
};

// 选择视频
const visible = ref<boolean>(false);
const onClose = () => {
  visible.value = false;
};
let selectId = ref(0)
const selectFileHandle = (v: any) => {
  selectId.value = v.id
  console.log(v, props.detail.content_task_files);
  fileInfo.tusdVideoUrl = v.file_url
  visible.value = false;
};

// 获取视频列表
interface IFileList {
  id: number;
  file_name: string;
  size: string;
  isSelected: boolean;
  suffix: string;
}
const fileList = reactive<IFileList[]>([]);
const searchInfo = reactive({
  name: '',
  page: 1,
  limit: 10
})
// 获取文档、视频  列表
interface Iparam {
  dataId: number
  file_name: string
  page: number
  limit: number
}
const getFileList = (searchInfo: Iparam) => {
  let params = {
    file_name: searchInfo.file_name,
    page: searchInfo.page,
    pageSize: searchInfo.limit,
  };
  // loading=true
  fileList.length=0
  http.getFileList({param:{...params},urlParams:{dataId:searchInfo.dataId}}).then((res: any) => {
    // loading=false
    const {list,page}=res.data
    fileList.push(...list);
    // totalCount=page.totalCount
    // console.log(docOrMp4Drawer.list)
  });
};

// 上传视频
const visibleUpload = ref<boolean>(false);
let dataId = 0
const uploadSuccess = (uploadFileList: any, id: any) => {
  console.log("上传成功", uploadFileList);
  dataId = id
  fileInfo.tusdVideoUrl = uploadFileList.tusdVideoUrl
  // http.updateVideoGuide({
  //   param: {video_file:{
  //     "file_path": uploadFileList.file_url,			// 文档实验-文件
	//     "directory_id": id // 实验指导 如果是选择的文件请求的时候不需要传此参数
  //   }},
  //   urlParams: {content_id: props.detail.id}
  // }).then((res: any) => {
  //   console.log(res)
  //   $message.success("更新成功")
  //   router.go(-1)
  // })
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
    console.log(res)
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
