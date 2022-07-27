<template>
  <!-- 选择 和 设置实验实验报告模板 -->
  <a-modal
    :destroyOnClose="true"
    v-model:visible="reportVisible"
    title="设置实验报告模板"
    class="report"
    :width="700"
    @cancel="reportCancel"
  >
    <div class="top flexCenter">
      <div class="TemplateTit flexCenter">
        <span
          :class="reportActive === 1 ? 'reportActive' : ''"
          @click="reportTab(1)"
          >选择模板</span
        >
        <span
          :class="reportActive === 2 ? 'reportActive' : ''"
          @click="reportTab(2)"
          >上传模板</span
        >
      </div>
      <div class="online" @click="viewTemplate(3)">在线制作</div>
    </div>
    <div class="content textScrollbar">
      <div v-show="reportActive === 1" class="contentLeft">
        <div class="reportList flexCenter">
          <div class="search">
            <a-input-search  enter-button v-model:value="TemplaName" placeholder="请输入关键字搜索" @keyup.enter="getTemplateList" />
          </div>
          <div class="item flexCenter" v-for="v in TemplateList" :key="v">
            <div
              class="eyeBox flexCenter"
              :class="v.id === activeTemplateItem.id ? 'activeEye' : ''"
              @click="selectTemplate(v)">
              <div class="eye"></div>
            </div>
            <div class="nameBox flexCenter">
              <span class="prefix">{{v.typeText}}</span>
              <span
                class="name single_ellipsis"
                :title="v.name"
                @click.stop="viewTemplate(v.type === 2?2:1, v)"
                >{{v.name}}</span>
              <!-- @click.stop="viewTemplate(2, v)" 离线-->
            </div>
            <div class="handle">
              <span v-if="v.type !== 0" @click.stop="handleDelete(v)">删除</span>
              <span v-if="v.type === 2" @click.stop="Download(v)">下载</span>
              <span v-if="v.type === 1"  @click="viewTemplate(0, v)">编辑</span>
            </div>
          </div>
        </div>
      </div>
      <div v-show="reportActive === 2" class="contentRight">
        <a-upload
          accept=".doc,.docx"
          :file-list="formState.reportUploadList"
          :before-upload="beforeUploadReport"
          @remove="fileRemove"
          @change="onChange"
          :showUploadList="false"
          :action="uploadAction"
        >
          <a-button type="primary"> 上传文件</a-button>
        </a-upload>
        <div v-if="formState.reportUploadList[0]?.name" class="progress-box">
          <div class="file-base-info">
            <span>文件名称：{{ formState.reportUploadList[0].name }}</span
            ><span class="icon-shanchu iconfont" @click="fileRemove" v-if="uploadPercent"></span>
          </div>
          <a-progress :percent="uploadPercent" />
        </div>
      </div>
    </div>
    <template #footer>
      <Submit @submit="reportHandleOk" @cancel="reportCancel" :loading="uploadLoading"></Submit>
    </template>
  </a-modal>
  <!-- 在线制作 预览  编辑实验模板 -->
  <a-modal v-if="reportTemplate" :destroyOnClose="true" v-model:visible="reportTemplate" :title="reportTitle" class="report" :width="1200" @cancel="cancelTemplate(1)">
    <div class="pdfBox" v-if="pdfUrl">
      <PdfVue :url="pdfUrl" />
    </div>
    <CreateTemplate v-else @cancelTemplate="cancelTemplate" 
    :id="TemplateEditId"
     :type="TemplateViewType"
      @viewTemplate="viewTemplate"
       @settingReport="settingReport" />
    <template #footer>
      <span></span>
      <a-button v-if="pdfUrl" @click="cancelTemplate">关闭</a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
} from "vue";
import { downloadUrl } from "src/utils/download";
import Submit from "src/components/submit/index.vue";
import PdfVue from "src/components/pdf/pdf.vue";
import CreateTemplate from "src/views/teacherModule/teacherTemplate/createTemplate.vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { ModalFunc } from "ant-design-vue/lib/modal/Modal";
import {getFileSuffix} from 'src/utils/getFileType'
// export default defineComponent({
// setup() {
const $confirm: ModalFunc = inject("$confirm")!;
const http = (request as any).teacherExperimentResourcePool;
const emit = defineEmits<{
  (e: "reportCancel"): void;
  (e: "reportOk", val: any): void;
}>();

// 采用ts专有声明，有默认值
interface Props {
  selectedReport?: any;
}

const props = withDefaults(defineProps<Props>(), {
  selectedReport: { id: 0, name: "" },
});
var reportVisible = ref<boolean>(true);
// console.log(props.visible)
var reportTemplate = ref<boolean>(false);
var reportActive = ref<number>(1);
const TemplateList: any = reactive([1, 2, 3, 4, 5, 6]);
var TemplaName=ref<string>("");
const TemplateEditId = ref<number>(0);
const TemplateViewType = ref<string>("");
var reportTitle = ref<string>("");
var pdfUrl = ref<string>("");
var formState: any = reactive({
  // report: {},
  reportUploadList: [],
});
const reportTab = (val: number) => {
  reportActive.value = val;
  if (val === 1) {
    getTemplateList();
  } else {
    uploadPercent.value === 100 ? formState.reportUploadList = [] : ''
  }
};
const getTemplateList = (ActId?:number) => {
  TemplateList.length=0
  // TemplaName
  http.getTemplateList({param: {type: 1,name:TemplaName.value}}).then((res: IBusinessResp) => {
    let list=res.data.list
    // type=0 系统  1在线 2离线
    list.map((v:any)=>{
      if(v.is_init === 1){
        v.type=0
      }else{
        v.type=v.word_path === '' ? 1:2
      }
      v.typeText=`【${['系统默认','在线','离线'][v.type]}】`
      if(ActId && ActId===v.id){
        let obj={
          id:v.id,
          name:v.name,
          typeText:v.typeText
        }
        settingReport(obj)
      }
    })
    TemplateList.push(...list);
  });
};

onMounted(()=>{
  getTemplateList()
})

const Download = (item: any) => {
  // const a: any = document.createElement("a");
  // a.href = item.word_path;
  // a.download = item.name;
  // document.body.appendChild(a);
  // a.click();
  // document.body.removeChild(a);
  // console.log(getFileSuffix(item.word_path))
  const name=`${item.name}.${getFileSuffix(item.word_path)}`
  downloadUrl(item.word_path,name)
};
  const env = process.env.NODE_ENV == "development" ? true : false;
const viewTemplate = (n: number, val?: any) => {

  // 3在线制作 2预览离线  1预览在线   0编辑在线
  console.log(n)
  pdfUrl.value=''
  reportTemplate.value = true;
  if (n === 3) {
    TemplateViewType.value = "create";
    reportTitle.value = "在线制作报告模板";
  }
  if (n === 2) {
    TemplateViewType.value = "";
    TemplateEditId.value = val.id;
    reportTitle.value = "离线报告模板";
    pdfUrl.value = val.pdf_path;
  }
  if (n === 1) {
    TemplateEditId.value = val.id;
    TemplateViewType.value = "view";
    reportTitle.value = "在线报告模板";
  }
  if (n === 0) {
    TemplateViewType.value = "edit";
    TemplateEditId.value = val.id;
    reportTitle.value = "在线报告模板编辑";
  }
};
var activeTemplateItem: any = reactive({
  id: 0,
  name: "",
  typeText:''
});
if (props.selectedReport) {
  activeTemplateItem.id = props.selectedReport.id;
  activeTemplateItem.name = props.selectedReport.name;
  activeTemplateItem.typeText = props.selectedReport.typeText
}
const selectTemplate = (val: any) => {
  activeTemplateItem.id = val.id;
  activeTemplateItem.name = `${val.name}`;
  activeTemplateItem.typeText=val.typeText
};

// 删除模板
const handleDelete = (item: any) => {
  return new Promise((resolve) => {
  $confirm({
    title: "提示",
    content: "确定删除实验报告模板?删除后不可恢复",
    okText: "确定",
    cancelText: "取消",
    onOk() {
      http.deleteTemplate({urlParams: {id: item.id}}).then((res:IBusinessResp) => {
        message.success(`实验报告模板：${item.name}, 删除成功！`)
        if(activeTemplateItem.id===item.id){
          activeTemplateItem.id=0
          activeTemplateItem.name=''
          activeTemplateItem.typeText=''
        }
        getTemplateList()
        resolve(1)
      })
    },
  });
  })
};

const uploadAction = (env ? '/proxyPrefix':'')+'/api/simple/report/templates/import-template'
const uploadLoading = ref(false)
function beforeUploadReport(file: any) {
  console.log(file.name.length);
  if (file.name.length > 60) {
    message.warn(`文件名称长度不能超过60`);
    return false
  }
  //  formState.reportUploadList[0] = {
  //     uid: file.uid,
  //     id:1,
  //     name: file.name,
  //     status: "done",
  //     url:'',
  //     file: file,
  //   };
    //  console.log(formState.reportUploadList)
  // return;
  // const fs = new FormData();
  // fs.append("file", file);
  // http.upLoadExperimentReport({ param: fs }).then((res: any) => {
  //   // reportUploadList.status = true      status: 'done',
  //     let data = res.data
  //     message.success("上传成功");
  //     activeTemplateItem.id = data.id;
  //     activeTemplateItem.name = data.name;
  //     formState.reportUploadList[0] = {
  //     uid: data.id,
  //     id:data.id,
  //     name: data.name,
  //     status: "done",
  //     url:data.word_path,
  //     file: file,
  //     typeText:'【离线】',
  //   };
  //   console.log(formState.reportUploadList)
  // });
  // return false
  let obj:any={
    uid: file.uid,
    name: file.name,
    typeText:'【离线】',
  }
  formState.reportUploadList[0] = obj
  uploadLoading.value = true
}
const uploadPercent = ref(0)
const onChange = (info: any) => {
  console.log(info)
  const {event, file} = info
  if (event) {
    if (event.percent===100) {
      return
    } else {
      uploadPercent.value = Math.floor(event.percent)
    }
  }
  if (file.status === 'done') { // 上传成功
    uploadLoading.value = false
    uploadPercent.value = 100
    const {id, name, word_path} = file.response?.data
    activeTemplateItem.id = id;
    activeTemplateItem.name = name;
    formState.reportUploadList[0].id = id
    formState.reportUploadList[0].url = word_path
    getTemplateList()
  }
}
async function fileRemove(file: any) {
  // console.log(file)
  uploadPercent.value === 100 ? await handleDelete(activeTemplateItem) : ''
  formState.reportUploadList = [];
  uploadLoading.value = false
}
const reportHandleOk = () => {
  // 返回选择的对象即可
  let active:any = {};
  if (reportActive.value == 2) {
    let v = formState.reportUploadList[0];
    active = { id: v.id, name: v.name,typeText:v.typeText };
  } else {
    active = activeTemplateItem;
  }
  if (!active.id) {
    message.warn(`请选择或上传模板！`)
    return
  }
  console.log(active);
  emit("reportOk", active);
  emit("reportCancel");
};
const settingReport=(val:any)=>{
  // console.log(val);
  emit("reportOk", val);
  emit("reportCancel");
}
const reportCancel = () => {
  // activeTemplateItem.id = 0;
  // activeTemplateItem.name = "";
  reportVisible.value = false;
  emit("reportCancel");
  uploadLoading.value = false
};
const cancelTemplate = (val: number,id?:number) => {
  console.log(2,id);
  
  if (val === 2) {
    getTemplateList(id);
  }
  reportTemplate.value = false;
  TemplateEditId.value = 0;
  TemplateViewType.value = "";
  pdfUrl.value = "";
};
</script>
<style scoped lang="less">
.report {
  .top {
    justify-content: space-between;
    margin-bottom: 10px;
    .online {
      cursor: pointer;
      color: var(--primary-color);
    }
    .TemplateTit {
      span {
        cursor: pointer;
        padding: 2px 6px;
        border: 3px solid transparent;
      }
      .reportActive {
        border-bottom: 3px solid var(--primary-color);
      }
    }
  }
  .content {
    max-height: 600px;
    overflow-y: auto;
    height: 400px;
    .contentLeft {
      .reportList {
        flex-wrap: wrap;
        .item {
          width: 100%;
          height: 40px;
          justify-content: space-between;
          .eyeBox {
            width: 14px;
            height: 14px;
            background: #ffffff;
            border: 1px solid rgba(0, 0, 0, 0.45);
            border-radius: 50%;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin: 0 12px;
            .eye {
              width: 8px;
              height: 8px;
              // background: var(--primary-color);
              border-radius: 50%;
            }
          }
          .eyeBox:hover {
            border: 1px solid var(--primary-color);
          }
          .activeEye {
            .eye {
              background: var(--primary-color);
            }
          }
          .nameBox {
            width: 500px;
            .prefix {
              color: var(--brightBtn);
            }
            .name {
              max-width: 410px;
              cursor: pointer;
            }
            .name:hover {
              color: var(--brightBtn);
            }
          }
          .handle {
            width: 96px;
            span {
              // display: none;
              padding: 0 10px;
              color: var(--primary-color);
              cursor: pointer;
            }
          }
        }
        .search{
          margin: 12px 0;
          input{
            width: 260px;
            border-radius: 18px;
          }
          .ant-input-search{
            width: 260px;
            border-radius: 18px;
          }
        }
        .item:hover {
          background: #f5f5f5;
          // background: var(--brightBtn);
          .handle {
            span {
              display: inline-block;
            }
          }
        }
      }
    }
    .contentRight {
      padding: 20px;
      .progress-box {
        margin-top: 24px;
        .file-base-info {
          display: flex;
          justify-content: space-between;
          padding-right: 14px;
          word-break: break-all;
        }
      }
    }
  }
  .pdfBox {
    width: 100%;
    height: 800px;
  }
}
</style>
