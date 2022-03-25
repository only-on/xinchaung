<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <span v-if="!props.detail.content_task_files.length">
        <span class="tips">支持单个md、doc、docx、pdf格式文件上传</span>
        <a-button type="primary" @click="uploadFile">上传文档</a-button>
      </span>
      <a-button type="primary" @click="selectFileClick" v-if="!props.detail.content_task_files.length"
        >选择文档</a-button
      >
      <a-button type="primary" v-if="props.detail.content_task_files.length&&props.detail.content_task_files[0].content_id" @click="deleteFile"
        >移除</a-button
      >
    </div>
  </div>
  <div class="experiment-content" v-if="props.detail.content_task_files[0]">
    <!-- <iframe :src="fileUrl" width="100%" v-if="fileUrl"></iframe> -->
    <PdfVue :url="props.detail.content_task_files[0].file_url" v-if="props.detail.content_task_files[0].suffix === 'pdf'" />
    <div v-if="props.detail.content_task_files[0].suffix === 'md'">
      <marked-editor v-model:value="experimentContent" :preview="preview" />
      <Submit @submit="onSubmit" @cancel="cancel" v-if="isMarked"></Submit>
    </div>
  </div>
  <!-- 选择文档抽屉 -->
  <a-drawer
    class="video-drawer"
    width="640"
    placement="right"
    :title="'选择文档'"
    :closable="true"
    :visible="visible"
    @close="onClose"
  >
    <select-file
      @selectFileHandle="selectFileHandle"
      @getFileList="getFileList"
      :fileList="fileList"
      :type="'document'"
    ></select-file>
  </a-drawer>
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
const router = useRouter();
const route = useRoute();
const courseApi = request.teachCourse;
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
console.log(props.detail.content_task_files[0])
const isMarked = ref<boolean>(true);
const fileUrl = ref<string>("111");

const preview = ref<boolean>(false);
const experimentContent = ref<any>("aa");

const beforeUpload = async (file: any, fileList: any) => {
  const text = await readFile(file);
  experimentContent.value = text;
  fileUrl.value = "111";
};
// 上传文件
const uploadFile = () => {
  visibleUpload.value = true;
};
const visibleUpload = ref<boolean>(false);
const uploadSuccess = (uploadFileList: any, id: any) => {
  console.log(uploadFileList, props.detail.content_task_files)
  http.updateDocumentGuide({
    param: {document_file: {
      "file_path": uploadFileList.file_url,			// 文档实验-文件
	    "directory_id": id // 实验指导 如果是选择的文件请求的时候不需要传此参数
    }},
    urlParams: {content_id: props.detail.id}
  }).then((res: any) => {
    props.detail.content_task_files.push(uploadFileList)
    $message.success("更新成功")
    router.go(-1)
  })
};
// 选择文件
const selectFileClick = () => {
  console.log("选择文件");
  visible.value = true;
  getFileList({
    type: undefined,
    name: "",
    page: 1,
    pageSize: 10,
  });
};
const visible = ref<boolean>(false);
const onClose = () => {
  console.log("drawer");
  visible.value = false;
};
const selectFileHandle = (v: any) => {
  console.log(v);
  visible.value = false;
};
// 获取文档列表
interface IFileList {
  id: number;
  file_name: string;
  size: string;
  isSelected: boolean;
  type: string;
}
const fileList = reactive<IFileList[]>([]);
const getFileList = (searchInfo: any) => {
  let param = {
    course_id: 1,
    chapter_id: 1,
    dataset_id: searchInfo.type,
    file_name: searchInfo.name,
    page: searchInfo.page,
    pageSize: searchInfo.pageSize,
  };
  // courseApi.getDataSetFileApi({ param }).then((res: IBusinessResp | null) => {
  //   console.log(res);
  // });
  // 支持单个md、doc、docx、pdf格式文件上传
  fileList.push(
    ...[
      {
        id: 1,
        file_name: "111.md",
        size: "110kb",
        isSelected: false,
        type: "md",
      },
      {
        id: 2,
        file_name: "222.pdf",
        size: "120kb",
        isSelected: true,
        type: "pdf",
      },
      {
        id: 3,
        file_name: "333.doc",
        size: "130kb",
        isSelected: false,
        type: "word",
      },
      {
        id: 4,
        file_name: "444.docx",
        size: "140kb",
        isSelected: false,
        type: "word",
      },
      {
        id: 5,
        file_name: "555.docx",
        size: "150kb",
        isSelected: false,
        type: "word",
      },
    ]
  );
};

// 移除文件
const deleteFile = () => {
  console.log("移除文件");
  http.deleteDocument({urlParams: {content_id: props.detail.content_task_files[0].content_id}})
  .then((res: any) => {
    console.log(res)
    props.detail.content_task_files = [];
  })
};
const onSubmit = () => {};
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
