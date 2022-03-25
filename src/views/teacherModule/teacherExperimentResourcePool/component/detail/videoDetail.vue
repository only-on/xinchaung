<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <span v-if="!props.detail.content_task_files.length||!props.detail.content_task_files[0].content_id">
        <span class="tips" v-if="!videoUrl"
          >支持单个500M以内的MP4格式文件上传</span
        >
        <!-- <a-upload
          name="file"
          :show-upload-list="false"
          accept=".mp4"
          :multiple="false"
          :before-upload="beforeUpload"
          v-if="!videoUrl"
        > -->
        <a-button type="primary" @click="uploadVideo">上传视频</a-button>
        <!-- </a-upload> -->
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
      :src="props.detail.content_task_files[0].file_url"
      v-if="props.detail.content_task_files.length&&props.detail.content_task_files[0].file_url"
    ></video>
  </div>
  <!-- <Submit @submit="onSubmit" @cancel="cancel"></Submit> -->
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
    v-if="visibleUpload"
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

const videoUrl = ref("");
// 上传视频
const uploadVideo = () => {
  visibleUpload.value = true;
};
const beforeUpload = (file: any, fileList: any) => {
  // console.log(file, fileList)
  let arr = file.name.split(".");
  if (arr[arr.length - 1] !== "mp4") {
    $message.warn("请上传mp4");
    // return;
  }
  const fs = new FormData();
  fs.append("jupyter_file", file);
  // fs.append('taskfile_subdir', props.jupyterUuid)
  // props.taskList.describe = "66";
  videoUrl.value = "111";
};
// 选择视频
const selectVideoClick = () => {
  console.log("选择视频");
  visible.value = true;
  // getFileList({
  //   type: undefined,
  //   name: "",
  //   page: 1,
  //   pageSize: 10,
  // });
};
// 移除视频
const deletVideo = () => {
  console.log("移除视频",props.detail.content_task_files[0]);
  http.deleteVideo({urlParams: {content_id: props.detail.content_task_files[0].content_id}})
  .then((res: any) => {
    console.log(res)
    videoUrl.value = "";
    props.detail.content_task_files[0].file_url = ''
  })
};

// 选择视频
const visible = ref<boolean>(false);
const onClose = () => {
  console.log("drawer");
  visible.value = false;
};
let selectId = ref(0)
const selectFileHandle = (v: any) => {
  selectId.value = v.id
  console.log(v, props.detail.content_task_files);
  props.detail.content_task_files.push(v)
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
const uploadSuccess = (uploadFileList: any, id: any) => {
  console.log("上传成功");
  http.updateVideoGuide({
    param: {video_file:{
      "file_path": uploadFileList.file_url,			// 文档实验-文件
	    "directory_id": id // 实验指导 如果是选择的文件请求的时候不需要传此参数
    }},
    urlParams: {content_id: props.detail.id}
  }).then((res: any) => {
    console.log(res)
    $message.success("更新成功")
    router.go(-1)
  })
};

const onSubmit = () => {
  // router.go(-1)
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
