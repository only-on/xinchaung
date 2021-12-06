<template>
  <!-- 离线报告 -->
  <div></div>
  <!-- <div
    class="offlineReport"
    v-if="reportTemplateData && reportTemplateData.template_type === 'file'"
  >
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
  </div> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
});
</script>
