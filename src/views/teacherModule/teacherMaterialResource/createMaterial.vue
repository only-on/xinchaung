<template>
  <div class="create-material">
    <div class="baseinfo">
      <h3 class="title">{{createMaterialType.subname}}基本信息</h3>
      <div class="baseinfo-content">
        <base-info ref="baseInfoRef" :materialType="createMaterialType.subname" class="con"></base-info>
      </div>
    </div>
    <a-form :layout="'vertical'" :model="formState" :rules="rules" ref="formRef">
      <div class="fileupload">
        <h3 class="title">{{createType === 'dataSet' ? '数据' : ''}}文件上传</h3> 
        <div class="upload-content">
          <a-form-item :label="createType === 'dataSet' ? '数据集' : ''" name="fileList">
            <div class="upload">
              <upload-file :uploadType="createMaterialType.uploadFileType" :fileList="formState.fileList"></upload-file>
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
              <div class="md-info" v-if="explainMdName">
                <span class="name">{{explainMdName}}</span>
                <span class="iconfont icon-close" @click="RemoveMdFile"></span>
              </div>
            </div>
          </a-form-item>
        </div>
      </div>
    </a-form>
    <Submit @submit="submit" @cancel="cancel"></Submit>
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
const http = (request as any).teacherMaterialResource;
const $message: MessageApi = inject("$message")!;
const router = useRouter();
const route = useRoute();
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const createType = String(route.query.key);

// 1:数据集 2:应用软件 3:课件 4:视频 5:备课资料 6:教学指导
const materialTypeList = reactive({
  'dataSet': {id: 1, name: "数据集", subname: '数据集', uploadFileType: ''},
  'videoDirectory': {id: 4, name: "视频目录", subname: '目录', uploadFileType: 'mp4，支持文件大小500MB以内'},
  'coursewareDirectory': {id: 3, name: "课件目录", subname: '目录', uploadFileType: 'ppt、pptx、pdf'},
  'lessonDirectory': {id: 5, name: "备课资料目录", subname: '目录', uploadFileType: 'pdf、doc、docx'},
  'guidanceDirectory': {id: 6, name: "教学指导目录", subname: '目录', uploadFileType: 'pdf、doc、docx'},
});
const createMaterialType = materialTypeList[createType];
updata({
  tabs: [{ name: `创建${createMaterialType.name}`, componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});

interface IFormState {
  name: string
  description: string
  range: string
  src: string
  labels: string[]
  fileList: any
}
const formState = reactive<IFormState>({
  name: '',
  description: '',
  range: '0',
  src: '',
  labels: [],
  fileList: {}
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

// 上传说明
const explainMdName = ref<string>('')
const MdFileBeforeUpload = (file: any) => {
  if (getFileType(file.name) !== "md") {
    $message.warn("请上传md文件");
    return
  }
  const fd = new FormData();
  fd.append("upload_file", file);
  http.uploadExplain({ param: fd }).then((res: any) => {
    console.log(res)
    explainMdName.value  = res.data.name
    // state.ForumSearch.doc_name = res.data.name;
    // var reader = new FileReader();
    // reader.readAsText(file, "utf-8");
    // reader.onload = () => {
    //   if (reader.result) {
    //     state.documentName = file.name;
    //     state.ForumSearch.documents = reader.result.toString();
    //   }
    // };
  });
}
const RemoveMdFile = () => {
  explainMdName.value = ''
}

// 创建
const formRef = ref()
const baseInfoRef = ref()
const submit = async() => {
  await baseInfoRef.value.fromValidate()
  Object.assign(formState, baseInfoRef.value.formState)
  // formRef.value.validate().then(() => {
  //   console.log(formState) 
  // })
  const baseInfo = baseInfoRef.value.formState
  const fd = new FormData()
  fd.append('name', baseInfo.name)
  fd.append('description', baseInfo.description)
  fd.append('tags', baseInfo.tags)
  fd.append('is_public', baseInfo.is_public)
  fd.append('cover', baseInfo.cover)
  fd.append('type', createMaterialType.id)
  http.create({param: fd}).then((res: IBusinessResp) => {
    console.log(res)
    router.go(-1)
  })
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
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .fileupload {
    background-color: var(--white-100);
    padding: 0 24px;
    .upload-content {
      margin-top: 16px;
      .upload {
        height: 254px;
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
