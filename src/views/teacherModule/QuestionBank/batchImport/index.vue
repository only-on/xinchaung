<template>
  <div class="create_ques">
    <a-form
      ref="formRef"
      name="advanced_search"
      class="ant-advanced-search-form"
      :model="formState"
      layout="vertical"
      :wrapperCol="{ span: 21 }"
      :rules="rules"
    >
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item name="catalogue" label="选择目录">
            <select-directory v-model:catalogue='formState.catalogue' @vertifyAgain='validateCataloge' ref='selectDire'></select-directory>
          </a-form-item>
        </a-col>
         <a-col :span="12">
          <knowledge v-model:knowledgePoints="formState.knowledgePoints"></knowledge>
        </a-col>
        <a-col :span="24">
          <div>
            <span style="color:red">*</span>
                下载导入
                <span class='download'>题目模板</span>
                每次最多导入100条。
              </div>
          <a-form-item >
             <!-- @change="handleChange1"
              @drop="handleDrop" -->
            <a-upload-dragger
              v-model:fileList="fileList"
              name="file"
              :multiple="true"
              :before-upload="beforeUpload"
            >
                <p class="ant-upload-drag-icon">
                    <i class="iconfont icon-upload"></i>
                </p>
                <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
            </a-upload-dragger>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="bottom_btn">
      <a-button style="margin-right: 10px" @click="reset">取消</a-button>
      <a-button type="primary" @click.prevent="onSubmit">保存</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  toRefs,
  onMounted,
  Ref,
  inject,
  computed,
  reactive,
  watch,
  toRaw,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { Form } from "ant-design-vue";
import request from "src/api/index";
import { Modal, message } from "ant-design-vue";
import knowledge from 'src/components/knowLedge/index.vue'
import selectDirectory from 'src/components/selectDirectory/index.vue'
import type { Rule } from 'ant-design-vue/es/form';
import {saveAs} from "file-saver";
import uploadFile from "src/request/uploadFile";
const env = process.env.NODE_ENV == "development" ? true : false;
const route = useRoute();
const router = useRouter();
const type: any = ref(route.query.value);
const name: any = route.query.name;
const http = (request as any).QuestionBank;
const caseFile=http.caseFile
var updata = inject("updataNav") as Function;
const fileInfo:any=ref()
const fileList: any = ref([]);
updata({
  tabs: [{ name:"批量导入", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const preview = false;
const formRef = ref<any>();
const formState = reactive({
  catalogue: [],
  // 知识点
  knowledgePoints: [],
  // 导入的题目路径
  topicTemplatePath:'',
});
let validateCataloge = async (_rule?: Rule, value?: any) => {
  setTimeout(()=>{
    if(formState.catalogue?.length==0){
    return Promise.reject('请选择目录！！');
  }else{
    return Promise.resolve();
  }
  },1000)
};
const rules = {
  catalogue: [
    {
      required: true,
      validator:validateCataloge, 
      // message: "请选择目录",
    },
  ],
  topicTemplatePath:[
    {
      required: true,
      message: "请上传题目",
    }
  ]
};
// 上传前
function beforeUpload(file: any) {
  if (file.size / 1024 / 1024 >= 500) {
    message.warn("上传文件不能超过500MB");
    return false;
  }
  fileList.value.push(file);
  fileInfo.value=file
  // let i = fileList.value.findIndex((item: any) => {
  //   return item.uid === file.uid;
  // });

  // fileList.value[i].progress = 0;
  // fileList.value[i].status = "loading";
  // const body = {
  //   file:file,
  //   upload_path: "createQues",
  //   default_name:1,
  // };

  // fileList.value[i].upload = new uploadFile({
  //   url: env ? '/proxyPrefix/api/instance/uploads/file':'/api/instance/uploads/file',
  //   body,
  //   success: (res: any) => {
  //     if (res.code == 1) {
  //       fileList.value[i].status = "finish";
  //       fileList.value [i].progress = "100%";
  //       console.log(res.data.pdf_path, "res.data.props.path");
  //     } else {
  //       fileList.value[i].progress = 0;
  //       message.warn(res.msg);
  //     }
  //     fileList.value[i].upload = "";         
  //     fileList.value.push({});
  //     fileList.value.pop();
  //   },
  //   progress: (e: ProgressEvent) => {
  //     if (e.total > 0) {
  //       let prog: any = Number(
  //         Number((e.loaded / e.total) * 100).toFixed(2)
  //       ) as any;
  //       fileList.value[i].progress = prog == 100 ? 99 : prog;
  //       fileList.value[i] = Object.assign(fileList.value[i], {
  //         progress:fileList.value[i].progress,
  //       });
  //       fileList.value.push({});
  //       fileList.value.pop();
  //     }
  //   },
  //   abort: (xhr: XMLHttpRequest) => {
  //     console.log("终止上传成功", xhr);
  //   },
  //   error: (err:any) => {
  //     console.log(err);
  //   },
  // });
  // fileList.value[i].upload.request();
  return false;
}
const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then((res: any) => {
      const fd:any=new FormData()
      let ids:any=[]
      formState.knowledgePoints.forEach((item:any,index:any)=>{
        ids.push(item[item.length-1])
      })
      fd.append('directoryId',formState.catalogue[formState.catalogue.length-1])
      ids.forEach((item:any)=> {
        fd.append('knowledgeMapIds[]',item)
      });
      fd.append('importQuestionFile',fileInfo.value)
      http.batchImport({param:fd}).then((res:any)=>{
          if(res?.code==1){
            message.success('导入成功！')
          }
      }) 
    })
    .catch((err: any) => {
      console.log("error", err);
    });
};
const reset = () => {
  formRef.value.resetFields();
  router.go(-1);
};
function handleChange1(){

}
function handleDrop(){

}
function DownloadTemplate() {
      const isDev = process.env.NODE_ENV == "development" ? true : false;
      let url = isDev
        ? "/public/template/importTemplate.xlsx"
        : "/api/template/QuestionImport.xlsx";
      const a = document.createElement("a");
      a.href = url;
      a.download = "题目模板.xlsx";
      a.click();
}
</script>
<style lang="less" scoped>
.create_ques {
  background-color: var(--white-100);
  padding: 20px 40px;
}
.bottom_btn {
  display: flex;
  justify-content: center;
}
:deep(.ant-col-21) {
  max-width: 100%;
}
.tiptit{
  font-size: 12px;
  margin-left: 10px;
  color:var(--black-45);
}
.download{
  color: var(--primary-color);
  text-decoration-line: underline;
}
.download:hover{
  cursor: pointer;
}
.icon-upload{
  color: var(--primary-color);
  font-size: 24px;
}
.ant-upload.ant-upload-drag p.ant-upload-text{
  font-size: 16px;
  color:#BEBEBE;
}
:deep(.ant-form-item .ant-upload){
  background-color: white;
}
</style>