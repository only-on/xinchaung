<template>
  <div class="report-content" v-if="reportTemplateData">
    <!-- 在线报告 -->
    <div
      v-if="reportTemplateData && reportTemplateData.template_type === 'form'"
    >
      <on-line />
      <!-- <table id="onlineReportTableEditable" class="report-table">
        <tr
          v-for="(item, index) in reportTemplateData.json_content"
          :key="index.toString()"
        >
          <td
            v-for="(ctd, cid) in item.fields"
            :key="cid.toString()"
            :colspan="ctd.colspan?ctd.colspan:2"
            :class="ctd.align === 'center' ? 'al-cen' : 'al-lef'"
          >
            <div
              :class="ctd.align === 'center' ? 'al-cen' : 'al-lef'"
              v-if="item.type === 'w8' || item.type === 'w7'"
              style="width:1;height:100%"
            >
            <div v-if="cid === 1 || cid === 3">
              <antdv-markdown v-if="reportTemplateData.can_student_update"  v-model="ctd.value" />
              <antdv-markdown v-else :preview-only="true"  v-model="ctd.value" />
            </div>
            <div v-else>{{ ctd.value }}</div>
            </div>
            <div
              v-else
              :class="ctd.align === 'center' ? 'al-cen' : 'al-lef'"
            >
             <div v-if="reportTemplateData.can_student_update&&cid!==0">
                <a-input :placeholder='ctd.placeholder' v-model:value="ctd.value"></a-input>
            </div>
            <div v-else>{{ctd.value}}</div>
           
            </div>
          </td>
        </tr>
      </table> -->
      <div v-if="reportTemplateData.can_student_update" class="bottom">
        <a-button class="btn" type="parmary" @click="submitOfflineReport"
          >提交报告</a-button
        >
      </div>
    </div>

    <!-- 离线报告 -->
    <div
      class="offlineReport"
      v-if="reportTemplateData && reportTemplateData.template_type === 'file'"
    >
      <!-- src="/src/assets/sss.pdf"> -->
      <iframe
        class="iframe"
        v-if="
          reportTemplateData.pdf_url && !reportTemplateData.can_student_update
        "
        :src="reportTemplateData.pdf_url"
      >
      </iframe>
      <div
        v-if="
          !reportTemplateData.pdf_url && reportTemplateData.can_student_update
        "
      >
        <div class="uploadReport">
          <span>报告文件：</span>
          <a-upload :file-list="fileList" :before-upload="beforeUpload">
            <a-button> <a-icon type="upload" />选择</a-button>
          </a-upload>
          <a-button
            type="primary"
            style="margin-left: 16px"
            @click="handleUpload"
          >
            <a-icon type="upload" />
            上传
          </a-button>
        </div>
        <div class="uploadOnece">实验报告只能上传一次</div>
        <div
          class="clickDownLoad"
          @click="
            downLoadExperReport(
              reportTemplateData.report_word_url.replace(/\\/g, '/'),
              reportTemplateData.filename
            )
          "
        >
          点击下载实验报告模板
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <empty />
  </div>
</template>
<script lang="ts">
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
import empty from "src/components/Empty.vue";

interface experReportParam {
  csc_id: any;
}
export default defineComponent({
  name: "experReport",
  components: {
    "on-line": OnLine,
    empty,
  },
  setup(props, context) {
    const vmApi = request.vmApi;
    var reportTemplateData: Ref<any> = ref(0);
    provide("reportTemplateData", reportTemplateData);
    var templateId: Ref<any> = ref();
    var reportId: any = inject("reportId");
    console.log(reportId, "reportId");
    const fileList: Ref<any> = ref([]);
    watch(
      () => reportTemplateData,
      () => {
        console.log(reportTemplateData);
      },
      { deep: true }
    );
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
      vmApi.experimentalReport({ param: params }).then((res) => {
        reportTemplateData.value = res?.data;
      });
    }
    function submitOfflineReport() {
      var formData: any = new FormData();
      formData.append("id", reportTemplateData.value.templatable_id);
      formData.append("csc_id", reportId.value);
      reportTemplateData.value.json_content.forEach(
        (element: any, i: number) => {
          formData.append(`json_content[` + [i] + `][type]`, element.type);
          formData.append(`json_content` + [i] + `[toolbar]`, element.toolbar);
          element.fields.forEach((item: any, j: any) => {
            formData.append(
              `json_content[` + [i] + `][fields][` + [j] + `][name]`,
              item.name
            );
            formData.append(
              `json_content[` + [i] + `][fields][` + [j] + `][value]`,
              item.value
            );
            formData.append(
              `json_content[` + [i] + `][fields][` + [j] + `][placeholder]`,
              item.placeholder
            );
            formData.append(
              `json_content[` + [i] + `][fields][` + [j] + `][readonly]`,
              item.readonly
            );
            formData.append(
              `json_content[` + [i] + `][fields][` + [j] + `][align]`,
              item.align
            );
            formData.append(
              `json_content[` + [i] + `][fields][` + [j] + `][colspan]`,
              item.colspan
            );
          });
        }
      );
      let htmltable: any = document.querySelector("#onlineReportTableEditable");
      formData.append("html_content", htmltable.outerHTML);
      vmApi.updateTemplateReport({ param: formData }).then((res) => {
        // reportTemplateData.value= res?.data
        experReport({ csc_id: reportId.value });
      });
    }
    function beforeUpload(file: any) {
      console.log(file);
      fileList.value = [...fileList.value, file];
      return false;
    }
    function handleUpload() {
      let formData: any = new FormData();
      formData.append("file", fileList.value[0]);
      formData.append("id", reportTemplateData.value.templatable_id);
      formData.append("csc_id", reportId.value);
      vmApi.updateTemplateReport({ param: formData }).then((res) => {
        reportTemplateData.value = res?.data;
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
          link.href = URL.createObjectURL(blob);
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
    onMounted(() => {
      //获取实验模板信息
      // experReport({csc_id:reportId.value})
      reportId ? experReport({ csc_id: reportId.value }) : "";
    });
    return {
      provide,
      experReport,
      getUrlParam,
      submitOfflineReport,
      reportTemplateData,
      fileList,
      beforeUpload,
      handleUpload,
      reportId,
      downLoadExperReport,
    };
  },
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
  .iframe {
    width: 100%;
    height: 100%;
  }
  .uploadReport {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  .uploadOnece {
    width: 100%;
    color: red;
    display: flex;
    justify-content: center;
  }
  .clickDownLoad {
    display: flex;
    justify-content: center;
    color: var(--primary-color);
  }
  .clickDownLoad:hover {
    color: #a86cdc;
  }
}
</style>
