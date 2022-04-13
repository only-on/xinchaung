<template>
  <div class="create-material">
    <div class="baseinfo">
      <h3 class="title">{{createMaterialType.subname}}基本信息</h3>
      <div class="baseinfo-content">
        <base-info ref="baseInfoRef" :materialType="createMaterialType.subname" class="create"></base-info>
      </div>
    </div>
    <a-form :layout="'vertical'" :model="formState" :rules="rules" ref="formRef">
      <div class="fileupload">
        <h3 class="title">{{createType === 'dataSet' ? '数据' : ''}}文件上传</h3> 
        <div class="upload-content">
          <a-form-item :label="createType === 'dataSet' ? '数据集' : ''" name="fileList">
            <div class="upload">
              <upload-file :type="createMaterialType.id" :fileList="formState.fileList" :complete="uploadComplete"></upload-file>
            </div>
          </a-form-item>
          <a-form-item label="说明" v-if="createType === 'dataSet'">
            <div class="explain">
              <a-upload
                :before-upload="MdFileBeforeUpload"
                :show-upload-list="false"
                accept=".md"
              >
                <a-button type="primary">上传说明</a-button>
                <span class="tips">仅支持md文件</span>
              </a-upload>
              <div class="md-info" v-if="formState.doc_name">
                <span class="name">{{formState.doc_name}}</span>
                <span class="iconfont icon-close" @click="RemoveMdFile"></span>
              </div>
            </div>
          </a-form-item>
        </div>
      </div>
    </a-form>
    <Submit @submit="submit" @cancel="cancel" :loading="uploadComplete.complete&&createMaterialType.id!==1"></Submit>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, Ref, nextTick } from 'vue'
import { useRouter, useRoute } from "vue-router";
import { MessageApi } from "ant-design-vue/lib/message";
import { LoadingOutlined } from '@ant-design/icons-vue';
import { getFileType } from "src/utils/getFileType";
import { RuleObject } from "ant-design-vue/es/form/interface";
import baseInfo from './components/baseInfo.vue'
import uploadFile from './components/uploadFile.vue'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import Submit from "src/components/submit/index.vue";
import extStorage from "src/utils/extStorage";
import { readFile } from "src/utils/common";
const http = (request as any).teacherMaterialResource;
const datasetHttp = (request as any).dataSet;
const $message: MessageApi = inject("$message")!;
const router = useRouter();
const route = useRoute();
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const createType = String(route.query.key);

// 1:数据集 2:应用软件 3:课件 4:视频 5:备课资料 6:教学指导
const materialTypeList = reactive({
  'dataSet': {id: 1, name: "数据集", subname: '数据集', uploadFileType: ''},
  'videoDirectory': {id: 4, name: "视频目录", subname: '目录', uploadFileType: 'mp4'},
  'coursewareDirectory': {id: 3, name: "课件目录", subname: '目录', uploadFileType: 'ppt、pptx、pdf'},
  'lessonDirectory': {id: 5, name: "备课资料目录", subname: '目录', uploadFileType: 'pdf、doc、docx'},
  'guidanceDirectory': {id: 6, name: "教学指导目录", subname: '目录', uploadFileType: 'pdf、doc、docx'},
  'documentDirectory': {id: 7, name: "实验文档目录", subname: '目录', uploadFileType: 'pdf、doc、docx、md'},
});
const createMaterialType = materialTypeList[createType];
updata({
  tabs: [{ name: `创建${createMaterialType.name}`, componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});

interface IFormState {
  creator: number
  role: number
  name: string
  description: string
  range: string
  src: string
  cover: string
  tags: string[]
  fileList: any
  categoryText: string
  is_public: any
  documents: string
  doc_name: string
}
const { lStorage } = extStorage;
const formState = reactive<IFormState>({
  creator: Number(lStorage.get("user_id")) || 100,
  role: Number(lStorage.get("role")) || 3,
  name: '',
  description: '',
  range: '0',
  src: '',
  cover: '',
  tags: [],
  fileList: {},
  categoryText: '',
  is_public: '',
  documents: '',
  doc_name: ''
})
// const rules = {
//   name: [{ required: true, message: "请输入名称", trigger: "blur" }],
// };
const rules = {
  name: [
    { required: true, message: `请输入${createMaterialType.subname}名称`, trigger: "blur" },
    { max: 20, message: `${createMaterialType.subname}名称最多20个字符`, trigger: "blur" },
  ],
  fileList: [
    { required: true, message: `请选择${createMaterialType.subname}` },
    { validator: fileListValidator, message: `请选择${createMaterialType.subname}` },
  ],
};
async function fileListValidator(rule: RuleObject, value: string) {
  // console.log(state.ForumSearch.fileList)
  if (Object.keys(formState.fileList).length === 0) {
    return Promise.reject(`请选择${createMaterialType.subname}`);
  } else {
    return Promise.resolve();
  }
}

const uploadComplete: any = reactive({
  complete: false
})
// 上传说明
const MdFileBeforeUpload = async (file: any) => {
  if (getFileType(file.name) !== "md") {
    $message.warn("请上传md文件");
    return
  }
  const text: any = await readFile(file) || '';
  formState.documents = text;
  formState.doc_name = file.name;
  // const fd = new FormData();
  // fd.append("upload_file", file);
  // http.uploadExplain({ param: fd }).then((res: any) => {
  //   console.log(res)
    // state.ForumSearch.doc_name = res.data.name;
    // var reader = new FileReader();
    // reader.readAsText(file, "utf-8");
    // reader.onload = () => {
    //   if (reader.result) {
    //     state.documentName = file.name;
    //     state.ForumSearch.documents = reader.result.toString();
    //   }
    // };
  // });
}
const RemoveMdFile = () => {
  formState.documents = ''
  formState.doc_name = ''
}

// 创建
const formRef = ref()
const baseInfoRef = ref()
const submit = async() => {
  await baseInfoRef.value.fromValidate()
  Object.assign(formState, baseInfoRef.value.formState)
  formRef.value.validate().then(() => {
    const baseInfo = baseInfoRef.value.formState
    if (createMaterialType.id === 1) {
      createDataSet()
      return
    }
    const fd = new FormData()
    fd.append('name', formState.name)
    fd.append('description', formState.description)
    // fd.append('tags', formState.tags)
    fd.append('is_public', formState.is_public)
    fd.append('cover', formState.cover)
    fd.append('type', createMaterialType.id)
    formState.tags.forEach((v: string, k: number) => {
      fd.append(`tags[${k}]`, v)
    })
    Object.keys(formState.fileList).forEach((k: string, i, v) => {
      if (formState.fileList[k].status!=="done") return
      fd.append(`items[${i}][file_name]`, formState.fileList[k].name)
      fd.append(`items[${i}][file_url]`, formState.fileList[k].file_url)
      fd.append(`items[${i}][suffix]`, formState.fileList[k].suffix)
      fd.append(`items[${i}][size]`, formState.fileList[k].size)
    })
    http.create({param: fd}).then((res: IBusinessResp) => {
      router.go(-1)
    })
  })
}
const createDataSet = () => {
  const file = []
  for (const key in formState.fileList) {
    if (
      Object.prototype.hasOwnProperty.call(formState.fileList, key)
    ) {
      if (formState.fileList[key].status === "end") {
        file.push({
          uid: formState.fileList[key].data.uid,
          path: formState.fileList[key].data.path,
        });
      }
    }
  }
  const param = {
    creator: formState.creator,
    role: formState.role,
    name: formState.name,
    description: formState.description,
    common: Number(formState.is_public),
    category: [formState.categoryText],
    label: formState.tags,
    cover: formState.src,
    file,
    doc_name: formState.doc_name,
    documents: formState.documents,
  }
  datasetHttp.create({ param }).then((res: any) => {
    const fd = new FormData()
    fd.append('name', formState.name)
    fd.append('is_public', formState.is_public)
    fd.append('type', createMaterialType.id)
    fd.append('slab_uid', res.data.uid)
    formState.tags.forEach((v: string, k: number) => {
      fd.append(`tags[${k}]`, v)
    })
    http.create({param: fd}).then((res: IBusinessResp) => {
      $message.success("创建成功");
      router.go(-1);
    })
  });
}
const cancel = () => {
  router.go(-1)
}
</script>

<style lang="less" scoped>
.create-material {
  .title {
    color: var(--black-85);
    font-weight: normal;
    padding: 16px 0;
    border-bottom: 1px solid #e8e8e8;
  }
  .baseinfo {
    background-color: var(--white-100);
    padding: 0 24px;
    margin-bottom: 24px;
    .baseinfo-content {
      // display: flex;
      // justify-content: space-between;
      padding-top: 16px;
      .con {
        // display: flex;
        // justify-content: space-between;
      }
    }
  }
  .fileupload {
    background-color: var(--white-100);
    padding: 0 24px;
    .upload-content {
      margin-top: 16px;
      .upload {
        height: 400px;
      }
      .explain {
        padding-bottom: 24px;
        .tips {
          font-size: var(--font-size-sm);
          color: var(--black-45);
          margin-left: 8px;
        }
        .md-info {
          margin-top: 16px;
          cursor: pointer;
          .name {
            margin: 0 24px;
          }
          .iconfont {
            color: var(--primary-color);
            display: none;
            vertical-align: middle;
          }
          &:hover {
            .iconfont {
              display: inline-block;
            }
          }
        }
      }
    }
  }
  .footer {
    text-align: center;
    .ant-btn-primary {
      margin-left: 16px;
    }
  }
}
</style>
