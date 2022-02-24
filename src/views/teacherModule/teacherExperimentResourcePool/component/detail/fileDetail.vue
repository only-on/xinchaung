<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns">
      <span v-if="!fileUrl">
        <span class="tips">支持单个md、doc、docx、pdf格式文件上传</span>
        <a-button type="primary" @click="uploadFile">上传文档</a-button>
      </span>
      <a-button type="primary" v-if="!fileUrl" @click="selectFileClick"
        >选择文档</a-button
      >
      <a-button type="primary" v-if="fileUrl" @click="deleteFile"
        >移除</a-button
      >
    </div>
  </div>
  <div class="experiment-content">
    <!-- <iframe :src="fileUrl" width="100%" v-if="fileUrl"></iframe> -->
    <PdfVue :url="fileUrl" v-if="fileUrl" />
    <div v-else>
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
import { ref, inject, reactive } from "vue";
import { MessageApi } from "ant-design-vue/lib/message";
import markedEditor from "src/components/editor/markedEditor.vue";
import Submit from "src/components/submit/index.vue";
import PdfVue from "src/components/pdf/pdf.vue";
import selectFile from "src/components/selectFile/selectFile.vue";
import uploadFileModal from "./../uploadFileModal.vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
const courseApi = request.teachCourse;

const $message: MessageApi = inject("$message")!;
const isMarked = ref<boolean>(true);
const fileUrl = ref<string>("111");

const preview = ref<boolean>(false);
const experimentContent = ref<any>("aa");

const beforeUpload = (file: any, fileList: any) => {
  // console.log(file, fileList)
  let arr = file.name.split(".");
  // if (arr[arr.length - 1] !== "mp4") {
  //   $message.warn("请上传md、doc、docx、pdf格式文件");
  //   // return;
  // }
  const fs = new FormData();
  fs.append("jupyter_file", file);
  // fs.append('taskfile_subdir', props.jupyterUuid)
  // props.taskList.describe = "66";
  fileUrl.value = "111";
};
// 上传文件
const uploadFile = () => {
  visibleUpload.value = true;
};
const visibleUpload = ref<boolean>(false);
const uploadSuccess = () => {
  console.log("上传成功");
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
  courseApi.getDataSetFileApi({ param }).then((res: IBusinessResp | null) => {
    console.log(res);
  });
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
  fileUrl.value = "";
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
