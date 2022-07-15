<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns" v-if="currentTab === '0'&&type!=='recommend'">
      <a-button type="primary" v-if="!idDelte" @click="delet"
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
    <div v-else-if="activeFile.file_html === ''&&activeFile.name" class="pdfBox">
      <div class="flexCenter">
        <h2 class="single_ellipsis" :title="activeFile.name">{{activeFile.name}}</h2>
        <span class="iconfont icon-shanchu" @click="removeAct()"></span>
      </div>
      <h2>
        <!-- {{activeFile.name}} -->
        <!-- 请确认保存后查看文档转换 -->
      </h2>
    </div>
    <div v-else class="pdfBox">
      <PdfVue :url="activeFile.file_html"/>
    </div>
  </div>
  <Submit v-if="idDelte" @submit="onSubmit" @cancel="cancel"></Submit>
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
import { ref, inject, reactive, PropType, onMounted, watch } from "vue";
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
import extStorage from "src/utils/extStorage";
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
const router = useRouter();
const route = useRoute();
const { currentTab, type }  = route.query
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
const emit = defineEmits<{
  (e: "getExperimentDetail"): void;
}>();

const idDelte = ref(false)  // 是否显示移除按钮
const preview = ref<boolean>(true);
const experimentContent = ref<any>(props.detail.guide);
let activeFile: any = reactive({
  name:'',
  suffix: 'md',
  file_url: '',
  pdf_url: '',
  file_html: '',
  file_name: ''
})

watch(
  () => props.detail,
  () => {
    if (props.detail.guide) {
      idDelte.value = false
      activeFile.suffix = 'md'
      experimentContent.value = props.detail.guide;
    } else if (props.detail.content_task_files&&props.detail.content_task_files.length) {
      idDelte.value = false
      Object.assign(activeFile, props.detail.content_task_files[0])
    } else {
      idDelte.value = true
      preview.value = false
      activeFile.suffix = 'md'
    }
  },
  { deep: true, immediate: true }
);


if (props.detail.content_task_files?.length) {
  Object.assign(activeFile, props.detail.content_task_files[0])
  // activeFile.pdf_url=props.detail.content_task_files[0].file_url
  // activeFile.pdf_url = props.detail.content_task_files[0].file_url
} else {
  activeFile.suffix = 'md'
}

// 上传文件
const uploadFile = () => {
  activeFile.id = 0
  visibleUpload.value = true;
};
const visibleUpload = ref<boolean>(false);
const directoryId = ref(0)
const uploadSuccess = (uploadFileList: any, id: any) => {
  console.log(uploadFileList)
  Object.assign(activeFile, uploadFileList)
  if (uploadFileList.suffix === 'md') {
    // props.detail.guide = uploadFileList
    // Object.assign(activeFile, uploadFileList)
    // experimentContent.value = uploadFileList.text
    // preview.value = false
    // directoryId.value = id
    // return
    activeFile.suffix = 'md'
    experimentContent.value = uploadFileList.mdValue
    activeFile.file_html=''
  }
  if (uploadFileList.suffix === 'pdf') {
    activeFile.suffix = 'pdf'
    // activeFile.pdf_url = uploadFileList.tusdDocumentUrl
    // activeFile.pdf_url = ''   // tusd  的这个地址不能预览
    // activeFile.file_html = uploadFileList.tusdDocumentUrl
    activeFile.file_html=''
  } else {
    // activeFile.suffix = 'pdf'
    // activeFile.pdf_url = uploadFileList.file_url
    // activeFile.file_html = uploadFileList.file_url
    activeFile.file_html=''
  }
  directoryId.value = id
  console.log(activeFile)
};
const removeAct=()=>{
  let obj = {
    name:'',
    suffix: 'md',
    file_url: '',
    pdf_url: '',
    file_html: '',
  }
  Object.assign(activeFile, obj)
  console.log(activeFile)
}
// 选择文件
const visible = ref<boolean>(false);
const selectDocOrMp4File = (val: any) => {
  Object.assign(activeFile, val)
  activeFile.name = activeFile.file_name
  // fetch('/proxyPrefix'+val.file_url, {responseType: 'text/plain;charset=utf-8', headers: {'Content-Type': 'text/plain;charset=utf-8'}}).then(res => {
  //   console.log(res)
  // })
  if (activeFile.suffix === 'md') {
    experimentContent.value = activeFile.file_html
  }
  directoryId.value = val.dataset_id
  console.log(activeFile)
};
const closeDrawerDoc = () => {
  visible.value = false;
};
const selectFileClick = () => {
  visible.value = true;
};

// 移除文件
const delet = () => {
  idDelte.value = true
  preview.value = false
  activeFile.suffix = 'md'
  activeFile.file_html = ''
  activeFile.name = ''
  experimentContent.value = ''
}
const deleteFile = () => {
  // if (props.detail.guide) {
  //   props.detail.guide = ''
  //   experimentContent.value = ''
  //   return
  // }
  http.deleteDocument({urlParams: {content_id: props.detail.id}})
  .then((res: any) => {
    preview.value = false
    props.detail.content_task_files = [];
    props.detail.guide = ''
    experimentContent.value = ''
    activeFile.file_url = ''
    activeFile.file_html = ''
    activeFile.suffix = 'md'
  })
};

const onSubmit = async () => {
  if (!(experimentContent.value || activeFile.file_url)) {
    $message.warn("请上传或选择文件")
    return
  }
  const param = {
    document_file: {
      file_path:activeFile.file_url,
      file_name:activeFile.name,
      directory_id:directoryId.value
    },
  }
  if (activeFile.suffix === 'md' || experimentContent.value) {
      Object.assign(param, {guide: experimentContent.value})
  }
  await deleteFile()
  http.updateDocumentGuide({
    urlParams: {content_id: props.detail.id},
    param,
  }).then((res: any) => {
    $message.success("更新成功")
    // router.go(-1)
    emit('getExperimentDetail');
    preview.value = true
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
  margin: 16px 0;
  min-height: 480px;
  .demo__container {
    height: 480px;
  }
  .demo__container :deep(.ant-btn) {
    // padding: 0 !important;
  }
  :deep(.mark__body) {
    .mark__editor,
    .mark__preview {
      min-height: 455px;
    }
  }
  .submit {
    margin-top: 32px;
  }
}
.pdfBox{
  height: 563px;
  .flexCenter{
    // width: 50%;
    justify-content: space-between;
    height: 40px;
    h2{
      // width: 80%;
    }
    .iconfont{
      cursor: pointer;
    }
  }
}
</style>
