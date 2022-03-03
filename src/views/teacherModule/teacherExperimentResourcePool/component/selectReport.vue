<template>
  <!-- 选择 和 设置实验实验报告模板 -->
  <a-modal
    :destroyOnClose="true"
    v-model:visible="reportVisible"
    title="设置实验实验报告模板"
    class="report"
    :width="640"
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
      <div v-if="reportActive === 1" class="contentLeft">
        <div class="reportList flexCenter">
          <div class="item flexCenter" v-for="v in TemplateList" :key="v">
            <div
              class="eyeBox flexCenter"
              :class="v === activeTemplateItem.id ? 'activeEye' : ''"
              @click="selectTemplate(v)"
            >
              <div class="eye"></div>
            </div>
            <div class="nameBox flexCenter">
              <span class="prefix">【系统默认】</span>
              <span
                class="name single-ellipsis"
                @click.stop="viewTemplate(1, v)"
                >实验报告名称实验报告名称实验报告名称实验报告名称实验报告名称实验报告名称实验报告名称</span
              >
              <!-- @click.stop="viewTemplate(2, v)" 离线-->
            </div>
            <div class="handle">
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
          :before-upload="beforeUploadReport"
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
  <!-- 在线制作 预览  编辑实验模板 -->
  <a-modal
    v-if="reportTemplate"
    :destroyOnClose="true"
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
      @viewTemplate="viewTemplate"
    ></CreateTemplate>
    <div class="pdfBox" v-if="pdfUrl">
      <PdfVue :url="'/professor/classic/courseware/112/13/1638337036569.pdf'" />
    </div>
    <template #footer>
      <span></span>
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
import Submit from "src/components/submit/index.vue";
import PdfVue from "src/components/pdf/pdf.vue";
import CreateTemplate from "src/views/teacherModule/teacherTemplate/createTemplate.vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { ModalFunc } from "ant-design-vue/lib/modal/Modal";
// export default defineComponent({
// setup() {
const $confirm: ModalFunc = inject("$confirm")!;
const http = (request as any).teacherImageResourcePool;
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
  }
};
const getTemplateList = () => {
  // TemplateList.length=0
  // http.getTemplateList().then((res: IBusinessResp) => {
  //   // TemplateList.push(...res.data);
  // });
};

const viewTemplate = (n: number, val?: any) => {
  // 3在线制作 2预览离线  1预览在线   0编辑在线
  reportTemplate.value = true;
  if (n === 3) {
    TemplateViewType.value = "create";
    reportTitle.value = "在线制作报告模板";
  }
  if (n === 2) {
    TemplateViewType.value = "";
    TemplateEditId.value = val.id;
    reportTitle.value = "离线报告模板";
    pdfUrl.value = val.url;
  }
  if (n === 1) {
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
});
if (props.selectedReport) {
  activeTemplateItem.id = props.selectedReport.id;
  activeTemplateItem.name = props.selectedReport.name;
}
const selectTemplate = (val: any) => {
  activeTemplateItem.id = val;
  activeTemplateItem.name = `报告名称${val}`;
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
function beforeUploadReport(file: any) {
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
const reportHandleOk = () => {
  // 返回选择的对象即可
  let active = {};
  if (reportActive.value == 2) {
    let v = formState.reportUploadList[0];
    active = { id: v.id, name: v.name };
  } else {
    active = activeTemplateItem;
  }
  // console.log(activeTemplateItem);
  emit("reportOk", active);
  emit("reportCancel");
};
const reportCancel = () => {
  // activeTemplateItem.id = 0;
  // activeTemplateItem.name = "";
  reportVisible.value = false;
  emit("reportCancel");
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
          .handle {
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
    }
  }
  .pdfBox {
    width: 100%;
    height: 500px;
  }
}
</style>
