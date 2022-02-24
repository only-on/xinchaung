<template>
  <a-form
    :model="formState"
    ref="formRef"
    layout="vertical"
    :label-col="{ span: 10 }"
    :wrapperCol="{ span: 20 }"
    :rules="rules"
  >
    <h3>实验基本信息</h3>
    <div class="create-middle">
      <div class="left">
        <a-form-item label="实验名称" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="实验难度" name="difficulty">
          <div class="difficulty flexCenter">
            <span
              @click="formState.difficulty = 1"
              :class="formState.difficulty === 1 ? 'active' : ''"
              >初级</span
            >
            <span
              @click="formState.difficulty = 2"
              :class="formState.difficulty === 2 ? 'active' : ''"
              >中级</span
            >
            <span
              @click="formState.difficulty = 3"
              :class="formState.difficulty === 3 ? 'active' : ''"
              >高级</span
            >
          </div>
        </a-form-item>
        <a-form-item name="datasets" label="知识点">
          <div class="datasets-box flexCenter">
            <a-button
              type="primary"
              @click="isShowKnowledge = true"
              :disabled="formState.selectedKnowledgeList.length >= 3"
              class="add-data-set-btn"
            >
              选择</a-button
            >
            <LabelDisplay
              :labels="formState.selectedKnowledgeList"
              @remove="removeKnowledge"
            ></LabelDisplay>
          </div>
          <knowledge-modal
            v-model:isShow="isShowKnowledge"
            v-model:selectedList="formState.selectedKnowledgeList"
          ></knowledge-modal>
        </a-form-item>
        <a-form-item name="datasets" label="数据集">
          <div class="datasets-box flexCenter">
            <a-button
              type="primary"
              @click="formState.drawerVisible = true"
              :disabled="formState.selectedName.length >= 3"
              class="add-data-set-btn"
            >
              选择</a-button
            >
            <LabelDisplay
              :labels="formState.selectedName"
              @remove="remove"
            ></LabelDisplay>
          </div>
          <div class="data-set-hint">最多可选3个数据集</div>
        </a-form-item>
      </div>
      <div class="right">
        <a-form-item label="课时" name="class_cnt">
          <a-input v-model:value="formState.class_cnt" />
        </a-form-item>
        <a-form-item label="所属技术方向" name="region">
          <a-select
            v-model:value="formState.region"
            placeholder="请选择技术方向"
          >
            <a-select-option value="shanghai">Zone one</a-select-option>
            <a-select-option value="beijing">Zone two</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="实验报告" name="report">
          <a-button type="primary" @click="selectReport()">选 择</a-button>
          <div class="data-set-hint">支持单个doc或docx格式文件上传</div>
        </a-form-item>
      </div>
    </div>
    <div class="configuration">
      <Environment :type="formState.single"></Environment>
    </div>
    <div class="zhuomian">
      <div class="guide">
        <div class="guide-top flexCenter">
          <h3>实验指导</h3>
          <div class="upload-box">
            <a-upload
              class="upload"
              :showUploadList="false"
              :before-upload="mdBeforeUpload"
              accept=".md"
            >
              <a-button type="primary"> 上传文档 </a-button>
            </a-upload>
            <i class="hint">仅支持md文件</i>
          </div>
          <div class="osd-mode">
            <span @click="openScreen"> 进入同屏模式 </span>
          </div>
        </div>
      </div>
      <MarkedEditor v-model="formState.guide" class="markdown__editor" />
    </div>
    <div class="jupyter">
      <h3>实验指导</h3>
      <div class="jupyterBox">
        <div class="uploadBox">
          <a-upload
            accept=".ipynb"
            :file-list="formState.ipynbList"
            :before-upload="beforeUploadIpynb"
            :remove="IpynbFileRemove"
          >
            <a-button type="primary"> 上传文档</a-button>
          </a-upload>
        </div>
        <div class="data-set-hint">仅选择ipynb文件</div>
      </div>
    </div>
    <div class="TaskSystem">
      <div class="top flexCenter">
        <h3>实验指导</h3>
        <a-button
          type="primary"
          @click="addTask()"
          :disabled="TaskLIst && TaskLIst.length >= 3 ? true : false"
        >
          添加任务
        </a-button>
      </div>
      <div class="item" v-for="(v, k) in TaskLIst" :key="v">
        <div class="title flexCenter">
          <div class="left">
            <span class="num">{{ `任务${["一", "二", "三"][k]}` }}</span>
            <span>{{ v.name }}</span>
          </div>
          <div class="right">
            <span @click="deleteTask(k)">删除</span>
            <span @click="v.open = !v.open">{{
              v.open ? "收起" : "展开"
            }}</span>
          </div>
        </div>
        <div class="TaskContent" v-show="v.open">
          <div class="taskName">
            <div><span class="star">*</span>任务名称</div>
            <a-input
              v-model:value="v.name"
              placeholder="请输入任务名称"
            ></a-input>
          </div>
          <div class="taskStep">
            <div class="taskStepBox flexCenter">
              <div class="stepBox"><span class="star">*</span>任务描述</div>
              <!-- <a-button type="primary" size="small" @click="selectTaskMd(v,'describe')">上传文档</a-button> -->
              <div @click="TaskMdTaskStep(k, 'describe')">
                <a-upload
                  class="upload"
                  :showUploadList="false"
                  :before-upload="TaskMdBeforeUpload"
                  accept=".md"
                >
                  <a-button type="primary" size="small"> 上传文档 </a-button>
                </a-upload>
              </div>
            </div>
            <MarkedEditor v-model="v.describe" class="markdown__editor" />
          </div>
          <div class="taskDescribe">
            <div class="statusBox flexCenter">
              <div>
                <span class="star">*</span>任务步骤
                <span class="status">状态</span
                ><a-switch
                  class="switch"
                  size="midile"
                  :checked="v.disabled"
                  @change="v.disabled = !v.disabled"
                />
              </div>
              <!-- <a-button type="primary" size="small" @click="selectTaskMd(v,'taskStep')">上传文档</a-button> -->
              <div @click="TaskMdTaskStep(k, 'taskStep')">
                <a-upload
                  class="upload"
                  :showUploadList="false"
                  :before-upload="TaskMdBeforeUpload"
                  accept=".md"
                >
                  <a-button type="primary" size="small"> 上传文档 </a-button>
                </a-upload>
              </div>
            </div>
            <MarkedEditor v-model="v.taskStep" class="markdown__editor" />
          </div>
        </div>
      </div>
    </div>
    <div class="submitBox">
      <Submit @submit="create" @cancel="cancel"></Submit>
    </div>
  </a-form>
  <a-drawer
    class="select-imag-drawer"
    :closable="false"
    placement="right"
    :visible="formState.drawerVisible"
    width="640"
    @close="closeDrawer"
  >
    <select-data-set
      v-model:value="formState.datasets"
      v-model:names="formState.selectedName"
    ></select-data-set>
  </a-drawer>
  <a-modal
    v-model:visible="reportVisible"
    title="设置实验实验报告模板"
    class="report"
    :width="640"
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
      <div v-if="reportActive === 1" class="contentLeft">
        <!-- formState.report.id -->
        <div class="reportList flexCenter">
          <div class="item flexCenter" v-for="v in TemplateList" :key="v">
            <div
              class="eyeBox flexCenter"
              :class="v === formState.report.id ? 'activeEye' : ''"
              @click="selectTemplate(v)"
            >
              <div class="eye"></div>
            </div>
            <div class="nameBox flexCenter">
              <span class="prefix">【系统默认】</span>
              <span
                class="name single-ellipsis"
                @click.stop="viewTemplate(2, v)"
                >实验报告名称实验报告名称实验报告名称实验报告名称实验报告名称实验报告名称实验报告名称</span
              >
            </div>
            <div class="caozuo">
              <span @click.stop="handleDelete(v)">删除</span>
              <!-- <span @click.stop="Download(v)">下载</span> -->
              <span @click="viewTemplate(0, v)">编辑</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="reportActive === 2" class="contentRight">
        <a-upload
          accept=".doc,.docx"
          :file-list="formState.reportUploadList"
          :before-upload="beforeUpload"
          :remove="fileRemove"
        >
          <a-button type="primary"> 上传文件</a-button>
        </a-upload>
      </div>
    </div>
    <template #footer>
      <Submit @submit="reportHandleOk" @cancel="reportCancel"></Submit>
    </template>
  </a-modal>
  <a-modal
    v-model:visible="reportTemplate"
    :title="reportTitle"
    class="report"
    :width="1080"
    @cancel="cancelTemplate(1)"
  >
    <CreateTemplate
      @cancelTemplate="cancelTemplate"
      :id="TemplateEditId"
      :type="TemplateViewType"
    ></CreateTemplate>
    <div class="pdfBox" v-if="pdfUrl">
      <PdfVue :url="'/professor/classic/courseware/112/13/1638337036569.pdf'" />
    </div>
    <template #footer>
      <span></span>
    </template>
  </a-modal>
  <!-- 同屏模式 -->
  <SameScreen
    ref="sameScreen"
    v-model:screenStatus="screenStatus"
    v-model="formState.guide"
    :screenInfo="screenVmInfo"
  ></SameScreen>
</template>
<script lang="ts" setup>
import SameScreen from "src/components/teacherExperiment/sameScreen.vue";
import MarkedEditor from "src/components/editor/markedEditor.vue";
import PdfVue from "src/components/pdf/pdf.vue";
import CreateTemplate from "src/views/teacherModule/teacherTemplate/createTemplate.vue";
import Submit from "src/components/submit/index.vue";
import knowledgeModal from "src/views/teacherModule/teachCourse/createTestPaper/knowledgeModal.vue";
import LabelDisplay from "src/components/labelDisplay/index.vue";
import selectDataSet from "src/components/selectDataSet/selectDataSet.vue";
import Environment from "./component/Environment.vue";
import { ModalFunc } from "ant-design-vue/lib/modal/Modal";
import _ from "lodash";
import { UUID } from "src/utils/uuid";
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  nextTick,
} from "vue";
const $confirm: ModalFunc = inject("$confirm")!;
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { resolve } from "path/posix";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherImageResourcePool;
const ExperimentTypeList = reactive({
  desktop: "桌面实验",
  Jupyter: "Jupyter实验",
  task: "任务制实验",
  text: "文档实验",
  video: "视频实验",
});
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const createType = String(route.query.key);
const name = `创建${ExperimentTypeList[createType]}`;
updata({
  tabs: [{ name: name, componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
var isShowKnowledge = ref<boolean>(false);
var reportVisible = ref<boolean>(false);
var reportTemplate = ref<boolean>(false);
var reportActive = ref<number>(1);
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  url?: string;
  file: string | Blob;
}
const formRef = ref();
const formState: any = reactive({
  drawerVisible: false,
  datasets: [],
  selectedName: [],
  class_cnt: 2,
  name: "",
  difficulty: 2,
  selectedKnowledgeList: [],
  report: { id: 2 },
  single: false,
  reportUploadList: [],
  guide: "",
  ipynbList: [],
});
const rules = {
  name: [
    { required: true, message: "请输入实验名称", trigger: "blur" },
    { max: 30, message: "实验名称最长为30个字符", trigger: "blur" },
  ],
  class_cnt: [
    { required: true, message: "" },
    { validator: classCutValidator, trigger: "blur" },
  ],
  imageDataSelected: [
    { required: true, message: "" },
    { validator: imageDataSelectedValidator, message: "请选择实验环境" },
  ],
  taskData: [
    { required: true, message: "" },
    { validator: taskDataValidator, message: "请选择实验任务" },
  ],
  Environment: [
    { required: true, message: "" },
    { validator: taskDataValidator, message: "请选择实验任务" },
  ],
};
async function classCutValidator(rule: any, value: string) {
  if (!value) {
    return Promise.reject("请输入课时数");
  }
  const reg = new RegExp("^([1-9]|[1][0-6])$");
  if (!reg.test(String(formState.class_cnt))) {
    return Promise.reject("课时数为1~16之间整数");
  }
}
async function imageDataSelectedValidator(rule: any, value: string) {
  if (formState.imageDataSelected.length === 0) {
    return Promise.reject("请选择实验环境");
  } else {
    return Promise.resolve();
  }
}
async function taskDataValidator(rule: any, value: string) {
  if (formState.taskData.length <= 1 && formState.taskData[0].name === "") {
    return Promise.reject("请选择实验任务");
  }
}
const closeDrawer = () => {
  formState.drawerVisible = false;
};
// 移除知识点
function removeKnowledge(val: any, index: number) {
  formState.selectedKnowledgeList.forEach((v: any, k: number) => {
    if (v.id === val.id) {
      formState.selectedKnowledgeList.splice(k, 1);
    }
  });
}
// 移除数据集
function remove(val: any, index: number) {
  let i = formState.datasets.indexOf(val.uid);
  i != -1 ? formState.datasets.splice(i, 1) : "";
  formState.selectedName.splice(index, 1);
}
function beforeUpload(file: any) {
  console.log(file);
  formState.reportUploadList[0] = {
    uid: "-1",
    name: "",
    status: "uploading",
    url: "",
    file: file,
  };
  formState.reportUploadList[0].name = file.name;
  formState.reportUploadList[0].status = "done";
  return;
  const fs = new FormData();
  fs.append("file", file);
  http.uploadTaskFile({ param: fs }).then((res: any) => {
    // reportUploadList.status = true      status: 'done',
    formState.reportUploadList[0].url = res.data;
  });
}

function fileRemove(file: any) {
  // console.log(file)
  formState.reportUploadList = [];
}
function create() {
  formRef.value.validate().then(() => {
    http.create().then((res: IBusinessResp) => {
      // list.push(...res.data);
    });
  });
}
// 取消
function cancel() {
  router.go(-1);
}
const reportHandleOk = () => {};
const reportCancel = () => {
  reportVisible.value = false;
};
const selectTemplate = (val: any) => {
  formState.report.id = val;
};
const selectReport = () => {
  reportVisible.value = true;
  getTemplateList();
};
const reportTab = (val: number) => {
  reportActive.value = val;
  if (val === 1) {
    getTemplateList();
  }
};
const TemplateList: any = reactive([1, 2, 3, 4, 5, 6]);
const getTemplateList = () => {
  // TemplateList.length=0
  // http.getTemplateList().then((res: IBusinessResp) => {
  //   // TemplateList.push(...res.data);
  // });
};
const TemplateEditId = ref<number>(0);
const TemplateViewType = ref<string>("");
var reportTitle = ref<string>("");
var pdfUrl = ref<string>("");
const viewTemplate = (n: number, val?: any) => {
  // 3在线制作 2预览离线  1预览在线   0编辑在线
  reportTemplate.value = true;
  if (n === 3) {
    reportTitle.value = "在线制作报告模板";
  }
  if (n === 2) {
    TemplateEditId.value = val.id;
    reportTitle.value = "离线报告模板";
    pdfUrl.value = val.url;
  }
  if (n === 1) {
    TemplateViewType.value = "view";
    reportTitle.value = "在线报告模板";
  }
  if (n === 0) {
    TemplateEditId.value = val.id;
    reportTitle.value = "在线报告模板编辑";
  }
};
const Download = (item: any) => {
  const a: any = document.createElement("a");
  a.href = item.word_path;
  a.download = item.file_name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
// 删除模板
const handleDelete = (item: any) => {
  $confirm({
    title: "提示",
    content: "确定删除实验报告模板?删除后不可恢复",
    okText: "确定",
    cancelText: "取消",
    onOk() {
      // http.deleteTemplate({param: {id: item.id}}).then((res:IBusinessResp) => {
      //   message.success(`实验报告模板：${item.name}, 删除成功！`)
      //   getTemplateList()
      // })
    },
  });
};

const cancelTemplate = (val: number) => {
  if (val === 2) {
    getTemplateList();
  }
  reportTemplate.value = false;
  TemplateEditId.value = 0;
  TemplateViewType.value = "";
  pdfUrl.value = "";
};

// 同屏vm连接信息
let screenVmInfo: any = reactive([]);
let screenStatus = ref<boolean>(false);
// 获取同屏连接信息请求参数
let screenParam: any = reactive({
  container: [],
  topo_id: "",
  dataset_id: [],
  notebook: [],
});
let sameScreen = ref();
let oldImageDataSelected: any = "";
let topoinstId = -1;
// reportCancel
function pollGetVM(id: number) {
  screenVmInfo.length = 0;
  // clearInterval(timers);
  // screenStatus.value = true;
  getTopoVmInfo(id);
}
function openScreen() {
  screenParam.container = [];
  screenParam.dataset_id = [];
  formState.selectedName.forEach((item: any) => {
    screenParam.dataset_id.push(item.uid);
  });
  formState.imageDataSelected.forEach((item: any) => {
    screenParam.container.push({
      image: item.id,
      flavor: item.flavor,
      is_use_gpu: item.is_use_gpu,
    });
  });
  if (screenParam.container.length <= 0) {
    message.warn("请选择镜像");
    return;
  }
  console.log(sameScreen.value);
  sameScreen.value.detail = formState.guide;
  // screenStatus.value = true
  if (_.isEqual(oldImageDataSelected, formState.imageDataSelected)) {
    pollGetVM(topoinstId);
  } else {
    getTopoBaseInfo()
      .then((res: any) => {
        console.log(res);
        if (res.code === 1) {
          if (res.data?.topo?.id) {
            screenParam.topo_id = res.data.topo.id;
          }
          oldImageDataSelected = _.cloneDeep(formState.imageDataSelected);
          topoinstId = res.data.topoinst.topoinst_id;
          pollGetVM(res.data.topoinst.topoinst_id);
          // this.screenStatus = true
        }
      })
      .catch((err) => {
        // $message.warn(err.message);
      });
  }
}
function getTopoBaseInfo() {
  return new Promise((response: any, reject: any) => {
    http
      .getSameScreenInfo({ param: screenParam })
      .then((res: IBusinessResp) => {
        response(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}
// 获取基础信息
function getTopoVmInfo(id: number) {
  return new Promise((resolve: any, reject: any) => {
    http.getTopoVmInfo({ urlParams: { id } }).then((res: IBusinessResp) => {
      console.log(res);
      if (res.code === 1) {
        if (res.data.vms.length > 0) {
          screenVmInfo.push(...res.data.vms);
          // this.vncLoading = false
          // clearInterval(timers);
          screenStatus.value = true;
          nextTick(() => {
            sameScreen.value.init();
          });

          // this.screenStatus = true
        } else {
          setTimeout(() => {
            getTopoVmInfo(id);
          }, 1500);
        }
      } else {
        message.warn(res.msg);
      }
      resolve(res);
    });
  });
}
const TaskItem = {
  name: "",
  describe: "",
  taskStep: "",
  disabled: false,
  open: true,
};
//   任务制实验
var TaskLIst: any = reactive([]);
const addTask = () => {
  TaskLIst.push({
    name: "",
    describe: "",
    taskStep: "",
    disabled: false,
    open: true,
  });
};
const deleteTask = (k: number) => {
  TaskLIst.splice(k, 1);
};
const selectTaskMd = (v: any, key: string) => {
  // v[key]=
};
let jupyterUuid: any = ref(UUID.uuid4());
function beforeUploadIpynb(file: any) {
  let arr = file.name.split(".");
  if (arr[arr.length - 1] !== "ipynb") {
    message.warn("请上传jupyter");
    return;
  }
  formState.ipynbList[0].status = false;
  formState.ipynbList[0].name = file.name;
  const fs = new FormData();
  fs.append("jupyter_file", file);
  fs.append("taskfile_subdir", jupyterUuid);
  // console.log(fs)
  // return
  http.uploadTaskFile({ param: fs }).then((res: any) => {
    formState.ipynbList[0].status = true;
    formState.ipynbList[0].data = res.data;
  });
}
const IpynbFileRemove = () => {
  formState.ipynbList = [];
};
const mdBeforeUpload = async (file: any) => {
  const text = await readFile(file);
  formState.guide = text;
};
const TaskMdBeforeUpload = async (file: any) => {
  const text = await readFile(file);
  // console.log(text)
  TaskLIst[activeTaskMd.idx][activeTaskMd.key] = text;
};
const activeTaskMd: any = reactive({
  idx: 0,
  key: "",
});
const TaskMdTaskStep = (num: number, key: string) => {
  activeTaskMd.idx = num;
  activeTaskMd.key = key;
  // console.log(num)
};
const readFile = (file: any) => {
  return new Promise((resolve: any, reject: any) => {
    const suffix = (file && file.name).split(".")[1];
    if (suffix !== "md") {
      message.warn("请上传 .md 格式文件");
      return false;
    }
    const reader = new FileReader();
    reader.readAsText(file, "utf-8");
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result);
      }
    };
  });
};
</script>
<style scoped lang="less">
h3 {
  padding-left: 2rem;
}
.datasets-box {
  .ant-btn {
    margin-right: 1rem;
  }
  .add-data-set-btn {
    width: 100px;
    font-size: var(--base-font-size);
    border: 1px solid var(--primary-color);
  }
}
.data-set-hint {
  font-size: 12px;
  font-style: normal;
  color: var(--black-25);
  margin-top: 1rem;
}
.configuration {
  padding: 2rem;
  padding-top: 0;
}
.create-middle {
  display: flex;
  padding: 2rem;
  .left,
  .right {
    width: 50%;
  }
}
.difficulty {
  span {
    line-height: 34px;
    width: 100px;
    border: 1px solid #dfdfdf;
    color: rgba(51, 57, 75, 0.85);
    text-align: center;
    cursor: pointer;
  }
  .active {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
}
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
    max-height: 200px;
    overflow-y: auto;
    height: 200px;
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
            width: 445px;
            .prefix {
              color: var(--brightBtn);
            }
            .name {
              max-width: 360px;
              cursor: pointer;
            }
            .name:hover {
              color: var(--brightBtn);
            }
          }
          .caozuo {
            width: 96px;
            span {
              display: none;
              padding: 0 10px;
              color: var(--primary-color);
              cursor: pointer;
            }
          }
        }
        .item:hover {
          background: #f5f5f5;
          // background: var(--brightBtn);
          .caozuo {
            span {
              display: inline-block;
            }
          }
        }
      }
    }
    .contentRight {
      padding: 20px;
    }
  }
  .pdfBox {
    width: 100%;
    height: 500px;
  }
}
.zhuomian {
  .guide-top {
    display: flex;
    .upload-box {
      .upload {
        button {
          margin: 0 16px;
        }
      }
    }
    .hint {
      font-style: normal;
      color: rgba(0, 0, 0, 0.2);
      font-size: 12px;
      line-height: 24px;
    }
    .osd-mode {
      margin-left: auto;
      color: var(--brightBtn);
      cursor: pointer;
    }
  }
}
.markdown__editor {
  height: 400px;
  padding: 1rem 2rem 0;
}
.jupyter {
  padding-top: 2rem;
  .jupyterBox {
    padding: 2rem;
  }
  .uploadBox {
    width: 40%;
  }
}
.TaskSystem {
  padding-top: 2rem;
  .top {
    justify-content: space-between;
  }
  .item {
    .title {
      justify-content: space-between;
      padding: 1rem 2rem;
      .left {
        color: var(--black-85);
        font-size: 16px;
        .num {
          margin-right: 2rem;
        }
      }
      .right {
        span {
          color: var(--primary-color);
          cursor: pointer;
          padding: 0 10px;
        }
      }
    }
    .TaskContent {
      .star {
        width: 12px;
        color: red;
      }
      .taskName {
        padding: 6px 2rem;
        .ant-input {
          width: 400px;
          margin-top: 5px;
        }
      }
      .taskDescribe {
        .statusBox {
          padding: 1rem 2rem 0;
          justify-content: space-between;
        }
        .status {
          margin-left: 20px;
          margin-right: 10px;
          color: #ccc;
        }
      }
      .taskStep {
        .taskStepBox {
          padding: 0rem 2rem 0;
          justify-content: space-between;
        }
        margin-top: 20px;
      }
    }
  }
}
.submitBox {
  margin-top: 2rem;
}
</style>
