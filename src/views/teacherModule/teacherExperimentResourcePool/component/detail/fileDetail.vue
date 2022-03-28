<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <a-button type="primary" v-if="props.detail.content_task_files.length || props.detail.guide" @click="deleteFile"
        >移除</a-button
      >
      <span v-else>
        <span class="tips">支持单个md、doc、docx、pdf格式文件上传</span>
        <a-button type="primary" @click="uploadFile">上传文档</a-button>
        <a-button type="primary" @click="selectFileClick"
          >选择文档</a-button
        >
      </span>
    </div>
  </div>
  <div class="experiment-content">
    <div v-if="activeFile.suffix === 'md'">
      <marked-editor v-model="experimentContent" :preview="preview" />
    </div>
    <PdfVue :url="activeFile.file_url" v-else />
    <Submit v-if="!preview" @submit="onSubmit" @cancel="cancel"></Submit>
  </div>
  <!-- 选择文档抽屉 -->
  <SelectDocOrMp4 
    :activeFile="activeFile" 
    :visible="visible" 
    :docOrMp4Type="1" 
    @selectDocOrMp4File="selectDocOrMp4File" 
    @closeDrawerDoc="closeDrawerDoc" 
  />
  <!-- 上传文档 -->
  <upload-file-modal
    :type="'file'"
    v-model:visibleUpload="visibleUpload"
    @uploadSuccess="uploadSuccess"
  ></upload-file-modal>
</template>

<script lang="ts" setup>
import { ref, inject, reactive, PropType } from "vue";
import { MessageApi } from "ant-design-vue/lib/message";
import markedEditor from "src/components/editor/markedEditor.vue";
import Submit from "src/components/submit/index.vue";
import PdfVue from "src/components/pdf/pdf.vue";
import selectFile from "src/components/selectFile/selectFile.vue";
import uploadFileModal from "./../uploadFileModal.vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { readFile } from "src/utils/common";
import { useRouter, useRoute } from "vue-router";
import SelectDocOrMp4 from 'src/components/SelectDocOrMp4/index.vue'
const router = useRouter();
const route = useRoute();
const http = request.teacherExperimentResourcePool;
const $message: MessageApi = inject("$message")!;

interface Ifiles {
  id: number
  file_name: string
  file_url: string
  suffix: string
  content_id: number
}
interface IDetail {
  id: number
  content_task_files: Ifiles[]
  guide: string
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
      content_task_files: [],
      guide: ''
    }
  }
})

const preview = ref<boolean>(true);
const experimentContent = ref<any>(props.detail.guide);
let activeFile = reactive({
  suffix: 'md',
  file_url: ''
})
if (props.detail.content_task_files.length) {
  Object.assign(activeFile, props.detail.content_task_files[0])
} else {
  activeFile.suffix = 'md'
}

// 上传文件
const uploadFile = () => {
  visibleUpload.value = true;
};
const visibleUpload = ref<boolean>(false);
const directoryId = ref(0)
const uploadSuccess = (uploadFileList: any, id: any) => {
  if (id === 'md') {
    // props.detail.guide = uploadFileList
    experimentContent.value = uploadFileList
    preview.value = false
    activeFile.suffix = 'md'
    return
  }
  Object.assign(activeFile, uploadFileList)
  directoryId.value = id
};

// 选择文件
const visible = ref<boolean>(false);
const selectDocOrMp4File = (val: any) => {
  Object.assign(activeFile, val)
  // fetch('/proxyPrefix'+val.file_url, {responseType: 'text/plain;charset=utf-8', headers: {'Content-Type': 'text/plain;charset=utf-8'}}).then(res => {
  //   console.log(res)
  // })
};
const closeDrawerDoc = () => {
  visible.value = false;
};
const selectFileClick = () => {
  visible.value = true;
};

// 移除文件
const deleteFile = () => {
  preview.value = false
  if (props.detail.guide) {
    props.detail.guide = ''
    experimentContent.value = ''
    return 
  }
  http.deleteDocument({urlParams: {content_id: props.detail.content_task_files[0].content_id}})
  .then((res: any) => {
    props.detail.content_task_files = [];
    props.detail.guide = ''
    experimentContent.value = ''
    activeFile.file_url = ''
    activeFile.suffix = 'md'
  })
};

const onSubmit = () => {
  const param = {}
  if (activeFile.suffix === 'md' || experimentContent.value) {
    Object.assign(param, {guide: experimentContent.value})
  } else {
    Object.assign(param, {
      document_file: {
        "file_path": activeFile.file_url,			// 文档实验-文件
        "directory_id": directoryId.value // 实验指导 如果是选择的文件请求的时候不需要传此参数
      }
    })
  }
  http.updateDocumentGuide({
    urlParams: {content_id: props.detail.id},
    param,
  }).then((res: any) => {
    $message.success("更新成功")
    router.go(-1)
  })
};
const cancel = () => {};
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
  .ant-btn {
    margin-left: 8px;
  }
  .operate-btns {
    .tips {
      font-size: var(--font-size-sm);
      color: var(--black-25);
    }
  }
}
.experiment-content {
  margin-top: 16px;
  height: 592px;
  .demo__container :deep(.ant-btn) {
    padding: 0 !important;
  }
  :deep(.mark__body) {
    .mark__editor,
    .mark__preview {
      height: 455px;
    }
  }
  .submit {
    margin-top: 32px;
  }
}
</style>
