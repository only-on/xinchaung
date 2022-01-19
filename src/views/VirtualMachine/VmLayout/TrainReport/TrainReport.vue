<template>
 
  <div class="upload-report-box">
    <div class="uploadReport">
      <span>报告文件：</span>
      <a-upload :showUploadList="false" :before-upload="beforeUpload">
        <a-button class="upload-btn">
          <a-icon type="upload" />{{ fileName ? fileName : "选择" }}</a-button
        >
      </a-upload>
      <a-button type="primary" style="margin-left: 16px" @click="handleUpload">
        <a-icon type="upload" />
        上传
      </a-button>
    </div>
    <div class="down-template-box">
      <div class="uploadOnece">实验报告只能上传一次</div>
      <div
        class="clickDownLoad"
        @click="
          downLoadExperReport(
            '/template/reportTemplate.docx',
            '大数据专业综合实训报告模板'
          )
        "
      >
        点击下载实验报告模板
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, toRefs } from "vue";
import fileSaver from "file-saver";
import request from "src/api/index";
import { message } from "ant-design-vue";
type TreactiveData={
    fileList:any[],
    fileName:string
}
export default defineComponent({
  setup() {
    const vmApi = request.vmApi;
    const allInfo: any = inject("allInfo");
    const taskId: any = inject("taskId");
    const isDev = process.env.NODE_ENV == "development" ? true : false;
    console.log(allInfo.value);
    const reactiveData: TreactiveData = reactive({
      fileList: [],
      fileName: "",
    });

    function beforeUpload(files: File) {
      reactiveData.fileName = files.name;
      reactiveData.fileList = [files];

      return false;
    }
    function handleUpload() {
      if (allInfo.value.current.is_report === 1) {
        message.warn("已经上传过了报告！");
        return;
      }
      const body = new FormData();
      body.append("file", reactiveData.fileList[0]);
      body.append("type", "start");
      body.append("trainId", taskId);
      vmApi.uploadTrainReportApi({ param: body }).then((res: any) => {
        console.log(res);
        allInfo.value.current.is_report = 1;
      });
    }
    function downLoadExperReport(fileurl: any, filename: any) {
      const url = isDev ? fileurl : "/frontend" + fileurl;
      fileSaver.saveAs(url, filename);
    }
    return {
      allInfo,
      ...toRefs(reactiveData),
      handleUpload,
      beforeUpload,
      downLoadExperReport,
      isDev,
    };
  },
});
</script>


<style lang="less">
.upload-report-box {
  padding: 15px;
  .uploadReport {
    display: flex;
    .upload-btn {
      > span {
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .down-template-box {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    .uploadOnece {
      color: red;
    }
    .clickDownLoad {
      color: var(--purpleblue-6);
      cursor: pointer;
    }
  }
}
</style>