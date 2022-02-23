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
            placeholder="please select your zone"
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
    <div>
      <h3>实验指导</h3>
    </div>
    <Submit @submit="create" @cancel="cancel"></Submit>
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
      <div class="online">在线制作</div>
    </div>
    <div class="content textScrollbar">
      <div v-if="reportActive === 1" class="contentLeft">
        <a-radio-group
          v-model:value="formState.report.id"
          class="reportList flexCenter"
        >
          <a-radio
            :value="v"
            class="item flexCenter"
            v-for="v in TemplateList"
            :key="v"
          >
            <div class="flexCenter">
              <div class="nameBox flexCenter">
                <span class="prefix">【系统默认】</span>
                <span class="name single-ellipsis"
                  >实验报告名称实验报告名称实验报告名称实验报告名称实验报告名称实验报告名称实验报告名称</span
                >
              </div>
              <div class="caozuo">
                <span>删除</span>
                <span>下载</span>
                <!-- <span>编辑</span> -->
              </div>
            </div>
          </a-radio>
        </a-radio-group>
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
</template>
<script lang="ts" setup>
import Submit from "src/components/submit/index.vue";
import knowledgeModal from "src/views/teacherModule/teachCourse/createTestPaper/knowledgeModal.vue";
import LabelDisplay from "src/components/labelDisplay/index.vue";
import selectDataSet from "src/components/selectDataSet/selectDataSet.vue";
import Environment from "./component/Environment.vue";
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  withDefaults,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
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
  report: {},
  single: false,
  reportUploadList: [],
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
// reportCancel
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
          .nameBox {
            width: 440px;
            .prefix {
              color: var(--brightBtn);
            }
            .name:hover {
              color: var(--brightBtn);
            }
          }
          .caozuo {
            width: 112px;
            span {
              display: none;
              padding: 0 14px;
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
}
</style>
