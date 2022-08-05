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
            <a-cascader
              v-model:value="formState.catalogue"
              :options="options"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
         <a-col :span="['1','2','3','4','7'].includes(type)? 12 : 24">
          <a-form-item name="knowledgePoints">
            <template v-slot:label>
              <div>
                知识点<span class="tiptit">最多可选择3个</span>
              </div>
            </template>
            <a-cascader
              v-model:value="formState.knowledgePoints"
              :style="['1','2','3','4','7'].includes(type) ? 'width:100%' : 'width:50%'"
              :multiple="true"
              max-tag-count="responsive"
              :options="options1"
              placeholder="请选择"
            ></a-cascader>
          </a-form-item>
        </a-col>
        <a-col v-if="type == 7" :span="24">
          <a-form-item
            name="topicTemplatePath"
          >
            <template v-slot:label>
              <div>
                下载导入
                <span @click="DownloadTemplate" class="download">题目模板</span>
                每次最多导入100条。
              </div>
            </template>
            <a-upload-dragger
              v-model:fileList="fileList"
              name="file"
              :multiple="true"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              @change="handleChange1"
              @drop="handleDrop"
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
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";
import { Form } from "ant-design-vue";
import request from "src/api/index";
import markedEditor from "src/components/editor/markedEditor.vue";
import labelSelection from 'src/components/labelSelection/index.vue'
import uploadFile from 'src/components/uploadFile.vue'
import testCase from '../testCase/index.vue'
import { Modal, message } from "ant-design-vue";
const route = useRoute();
const router = useRouter();
const type: any = ref(route.query.value);
const name: any = route.query.name;
const http = (request as any).studentAssignment;
const caseFile=http.caseFile
var updata = inject("updataNav") as Function;
const fileList: any = [];
updata({
  tabs: [{ name: "创建" + name, componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const preview = false;
const formRef = ref<any>();
const inputAndOut=ref([{inputCon:'',outCon:'',ifShow:false}])
function addTestCase(){
  inputAndOut.value.push({inputCon:'',outCon:'',ifShow:false})
}
const formState = reactive({
  catalogue: [],
  // 知识点
  knowledgePoints: [],
  // 导入的题目路径
  topicTemplatePath:'',
});
const options1: any = [
  {
    label: "Light",
    value: "light",
    children: new Array(20)
      .fill(null)
      .map((_, index) => ({ label: `Number ${index}`, value: index })),
  },
  {
    label: "Bamboo",
    value: "bamboo",
    children: [
      {
        label: "Little",
        value: "little",
        children: [
          {
            label: "Toy Fish",
            value: "fish",
          },
          {
            label: "Toy Cards",
            value: "cards",
          },
          {
            label: "Toy Bird",
            value: "bird",
          },
        ],
      },
    ],
  },
];
const rules = {
  catalogue: [
    {
      required: true,
      message: "请选择目录",
    },
  ],
  topicTemplatePath:[
    {
      required: true,
      message: "请上传题目",
    }
  ]
};
const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then((res: any) => {
      console.log(res, toRaw(formState));
      
    })
    .catch((err: any) => {
      console.log("error", err);
    });
};
const reset = () => {
  formRef.value.resetFields();
  router.go(-1);
};
function handleChange1(info: any) {
  const status = info.file.status;
  if (status !== "uploading") {
    console.log(info.file, info.fileList);
  }
  if (status === "done") {
    message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === "error") {
    message.error(`${info.file.name} file upload failed.`);
  }
}
function handleDrop(e: any) {
  console.log(e);
}
function selectAnswer(){

}
function DownloadTemplate() {
      const isDev = process.env.NODE_ENV == "development" ? true : false;
      let url = isDev
        ? "./public/template/Teacher.xlsx"
        : "/api/template/Teacher.xlsx";
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