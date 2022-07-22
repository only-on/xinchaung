<template>
<a-modal
  v-model:visible="props.visible"
  :width="reportTemplateData && reportTemplateData.template_type === 'form'? 1200 : 540"
  title="实验报告"
  @ok="handleOk"
  @cancel="cancel"
  :footer="null"
>
  <div class="report-content" v-if="reportTemplateData">
    <!-- 在线报告 -->
    <div v-if="reportTemplateData && reportTemplateData.template_type === 'form'">
      <on-line />
      <div v-if="reportTemplateData.can_student_update" class="bottom">
        <a-button class="btn" type="parmary" @click="submitOfflineReport" :loading="saveLoading">提交报告</a-button>
      </div>
    </div>

    <!-- 离线报告 -->
    <div class="offlineReport" v-if="reportTemplateData && reportTemplateData.template_type === 'file'">
      <!-- src="/src/assets/sss.pdf"> -->
      <iframe
        class="iframe"
        v-if="reportTemplateData.pdf_url && !reportTemplateData.can_student_update"
        :src="reportTemplateData.pdf_url"
      >
      </iframe>
      <!-- <div v-if="reportTemplateData.json_content&&reportTemplateData.json_content.filename">{{reportTemplateData.json_content.filename}}</div> -->
      <div class="uploadReport" v-if="reportTemplateData.can_student_update">
        <div>实验报告</div>
        <div>
          <a-upload :showUploadList="false" class="upload-btn" :file-list="fileList" :before-upload="beforeUpload" accept=".doc, .docx">
            <a-button type="primary">上传文件</a-button>
          </a-upload>
          <span
            class="clickDownLoad pointer"
            @click="
              downLoadExperReport(
                reportTemplateData.report_word_url.replace(/\\/g, '/'),
                reportTemplateData.filename
              )
            "
          >
            实验报告模板
          </span>
        </div>
        <div class="file-list" v-if="fileList.length">
          <div class="file">
            <div class="type"><img :src="iconList['word']" alt="" srcset=""></div>
            <div class="name single_ellipsis" :title="fileList[0].name">{{fileList[0].name}}</div>
            <div class="pointer" @click="move"><span class="iconfont icon-shanchu"></span></div>
          </div>
        </div>
      </div>
      <div class="btns">
        <Submit @submit="handleOk" @cancel="cancel" :loading="saveLoading"></Submit>
      </div>
    </div>
  </div>
  <div v-else>
    <empty />
  </div>
</a-modal>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  onMounted,
  Ref,
  ref,
  inject,
  computed,
  watch,
  toRef,
  toRefs,
  provide,
} from "vue";
import request from "src/request/getRequest";
import OnLine from "./OnLine.vue";
import iconList from "src/utils/iconList";
// @ts-ignore 类型声明需要完善，此处先用注解压制错误
import {renderMarkdown} from  '@xianfe/antdv-markdown';
import Submit from "src/components/submit/index.vue";
interface experReportParam {
  csc_id: any;
}
const vmApi = request.vmApi;
var reportTemplateData: Ref<any> = ref(0);
provide("reportTemplateData", reportTemplateData);
var templateId: Ref<any> = ref();
const baseInfo: any = inject("baseInfo")
const reportId: any = ref(baseInfo?.current?.id || 0);
console.log(reportId, "reportId");
const fileList: Ref<any> = ref([]);
const saveLoading = ref(false)
watch(
  () => reportTemplateData,
  () => {
    console.log(reportTemplateData);
  },
  { deep: true }
);
const props = withDefaults(defineProps<{visible: boolean}>(), {
  visible: false,
});
const emit = defineEmits<{
  (e: "update:visible", key: boolean): void;
}>()
// 从地址栏获取id
function getUrlParam(name: string): string | null {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.href.split("?")[1].substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}
//离线模板内容
function experReport(params: experReportParam) {
  vmApi.experimentalReport({ param: params }).then((res:any) => {
    reportTemplateData.value = res?.data;
    if (reportTemplateData.value && reportTemplateData.value.template_type === 'file') {
      reportTemplateData.value.json_content?.filename ? fileList.value = [
        {id: reportTemplateData.value.id, name: reportTemplateData.value.json_content?.filename}
      ] : ''
    }
  });
}
function submitOfflineReport() {
  var formData: any = new FormData();
  formData.append("id", reportTemplateData.value.templatable_id);
  formData.append("csc_id", baseInfo.value.current.id);
  reportTemplateData.value.json_content.forEach((element:any,i:number) => {
          formData.append(`json_content[`+[i]+`][type]`,element.type);
          formData.append(`json_content`+[i]+`[toolbar]`,element.toolbar);
          // json_view_content
          formData.append(`json_view_content[`+[i]+`][type]`,element.type);
          formData.append(`json_view_content`+[i]+`[toolbar]`,element.toolbar);
          element.fields.forEach((item:any,j:any)=>{
            formData.append(`json_content[`+[i]+`][fields][`+[j]+`][name]`,item.name);
            formData.append(`json_content[`+[i]+`][fields][`+[j]+`][value]`,item.value);
            formData.append(`json_content[`+[i]+`][fields][`+[j]+`][placeholder]`,item.placeholder);
            formData.append(`json_content[`+[i]+`][fields][`+[j]+`][readonly]`,item.readonly);
            formData.append(`json_content[`+[i]+`][fields][`+[j]+`][align]`,item.align);
            formData.append(`json_content[`+[i]+`][fields][`+[j]+`][colspan]`,item.colspan);

            // json_view_content
            formData.append(`json_view_content[`+[i]+`][fields][`+[j]+`][name]`,item.name);
            // @ts-ignore
            formData.append(`json_view_content[`+[i]+`][fields][`+[j]+`][value]`,renderMarkdown(true,item.value))
            formData.append(`json_view_content[`+[i]+`][fields][`+[j]+`][placeholder]`,item.placeholder);
            formData.append(`json_view_content[`+[i]+`][fields][`+[j]+`][readonly]`,item.readonly);
            formData.append(`json_view_content[`+[i]+`][fields][`+[j]+`][align]`,item.align);
            formData.append(`json_view_content[`+[i]+`][fields][`+[j]+`][colspan]`,item.colspan);
          })
       });
  let htmltable: any = document.querySelector("#onlineReportTableEditable");
  formData.append("html_content", htmltable.outerHTML);
  vmApi.updateTemplateReport({ param: formData }).then((res:any) => {
    // reportTemplateData.value= res?.data
    emit("update:visible", false)
    experReport({ csc_id: baseInfo.value.current.id });
    saveLoading.value = false
  });
}
function beforeUpload(file: any) {
  // console.log(file);
  fileList.value = [file];
  // fileList.value = [...fileList.value, file];
  return false;
}
function handleUpload() {
  if (!fileList.value.length || fileList.value[0]?.id) {
    emit('update:visible', false)
    // message.warn('请选择上传文件')
    return
  }
  let formData: any = new FormData();
  formData.append("file", fileList.value[0]);
  formData.append("id", reportTemplateData.value.templatable_id);
  formData.append("csc_id", baseInfo.value.current.id);
  vmApi.updateTemplateReport({ param: formData }).then((res:any) => {
    reportTemplateData.value = res?.data;
    emit('update:visible', false)
    saveLoading.value = false
  });
}
function downLoadExperReport(fileurl: any, filename: any) {
  const dev_base_url = import.meta.env.VITE_APP_BASE_API || "";
  let url = `${dev_base_url}` + fileurl;
  fetch(url, {
    method: "get",
  }).then((res: any) => {
    const content = res;
    const blob = new Blob([content]); // 构造一个blob对象来处理数据
    const fileName = filename + "docx";

    // 对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
    // IE10以上支持blob但是依然不支持download
    if ("download" in document.createElement("a")) {
      // 支持a标签download的浏览器
      const link = document.createElement("a"); // 创建a标签
      link.download = fileName; // a标签添加属性
      link.style.display = "none";
      link.href = url;
      document.body.appendChild(link);
      link.click(); // 执行下载
      URL.revokeObjectURL(link.href); // 释放url
      document.body.removeChild(link); // 释放标签
    } else {
      // 其他浏览器
      (navigator as any).msSaveBlob(blob, fileName);
    }
  });
}
const cancel = () => {
  emit('update:visible', false)
}
const handleOk = () => {
  saveLoading.value = true
  if (reportTemplateData.value && reportTemplateData.value.template_type === 'form') {
    submitOfflineReport()
  } else if (reportTemplateData.value && reportTemplateData.value.template_type === 'file') {
    handleUpload()
  }
}
const move = () => {
  fileList.value.length = 0
}
onMounted(() => {
  //获取实验模板信息
  // experReport({csc_id:reportId.value})
  console.log(baseInfo.value?.current?.id)
  baseInfo.value?.current?.id ? experReport({ csc_id: baseInfo.value.current.id }) : "";
});
</script>
<style lang="less" scoped>
.emptypdf-wrap {
  text-align: center;
  padding-top: 100px;
  // background: url();
  .emptypdf-icon {
    font-size: 86px;
    color: var(--primary-color);
  }
  .emptypdf-text {
    font-size: 14px;
    color: var(--primary-color);
    margin-top: 18px;
  }
}
.report-action {
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  padding-right: 15px;

  > button {
    margin-top: 15px;
    margin-left: auto;
  }
}
.report-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 15px;
  word-break: break-all;
  white-space: normal;
  position: relative;
  z-index: 10;
}
.report-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .ant-input:placeholder-shown {
    border: none;
  }
  .ant-input:focus {
    border: none;
    box-shadow: 0 0 0 0 rgb(137 85 181 / 20%);
  }
  input:not([type="range"]),
  label,
  select,
  summary,
  textarea {
    border: none;
  }
  .mark__tool-bar {
    display: block;
  }
  .preview {
    .mark__tool-bar {
      display: block;
    }
    .editor {
      .mark__tool-bar {
        display: none;
      }
    }
  }
  .al-cen {
    text-align: center;
  }
  .al-lef {
    text-align: left;
  }
  .w2-box > div:nth-child(1) {
    border-right: none !important;
  }
  .w7-box {
    margin: -20px -17px;
    > div:nth-child(1) {
      border: none !important;
    }
  }
  th,
  td {
    border: 1px solid #d1d1d1;
    white-space: normal;
  }
  .w1-box {
    min-height: 50px;
  }
  .w2-box {
    min-height: 50px;
    display: flex;
    flex-direction: row;
    > div {
      min-height: 100%;
      &:nth-child(1) {
        width: 25%;
        border-right: 1px solid #d1d1d1;
      }
    }
  }
  .w3-box {
    min-height: 50px;
    display: flex;
    flex-direction: row;
    > div {
      min-height: 100%;
      width: 25%;
      padding: 15px;
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        border-right: 1px solid #d1d1d1;
      }
    }
  }
  .w4-box {
    display: flex;
    flex-direction: column;
    > div {
      min-height: 100%;
      padding: 15px;
      &:nth-child(1) {
        width: 100%;
        border-bottom: 1px solid #d1d1d1;
        min-height: 50px;
      }
      &:nth-child(2) {
        width: 100%;
        min-height: 100px;
      }
    }
  }
  .w5-box {
    min-height: 50px;
    display: flex;
    flex-direction: row;
    > div {
      min-height: 100%;
      &:nth-child(1) {
        width: 25%;
        // border-right: 1px solid #d1d1d1;
        border-right: 1px solid #d1d1d1;
        background-color: yellow;
        box-sizing: border-box;
      }
    }
  }
  .w6-box {
    display: flex;
    flex-direction: column;
    > div {
      min-height: 100%;
      padding: 15px;
      &:nth-child(1) {
        width: 100%;
        border-bottom: 1px solid #d1d1d1;
        min-height: 50px;
      }
      &:nth-child(2) {
        width: 100%;
        min-height: 100px;
      }
    }
  }
  .w8-box {
    display: flex;
    flex-direction: column;
    > div {
      padding: 15px;
      &:nth-child(1) {
        border-bottom: 1px solid #d1d1d1;
      }
    }
  }
  .w7-box {
    display: flex;
    flex-direction: row;
    > div {
      padding: 15px;
      &:nth-child(1) {
        border-right: 1px solid #d1d1d1;
        width: 25%;
      }
      &:nth-child(2) {
        width: 75%;
      }
    }
  }
}
.bottom {
  width: 100%;
  text-align: right;
  margin-top: 30px;
  .btn {
    background-color: var(--primary-color);
    color: white;
  }
}
// 离线报告
.offlineReport {
  width: 100%;
  height: 100%;
  .btns {
    margin-top: 24px;
  }
  .iframe {
    width: 100%;
    height: 100%;
  }
  .uploadReport {
    width: 100%;
    // height: 100px;
    .upload-btn {
      display: inline-block;
      margin-right: 10px;
      margin-top: 6px;
    }
    .clickDownLoad {
      color: var(--primary-color);
      border-bottom: 1px solid var(--primary-color);
    }
    .file-list {
      margin-top: 12px;
      .file {
        border: 1px solid #ddd;
        height: 64px;
        line-height: 64px;
        display: flex;
        padding: 0 15px 0 12px;
        .type {
          margin-right: 12px;
        }
        .name {
          flex: 1;
          padding-right: 8px;
        }
      }
    }
  }
}
</style>
