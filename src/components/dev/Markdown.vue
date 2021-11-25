<template>
  <div class="marked__demo">
    <div class="row">
      <div class="editor">
        <antdv-markdown v-model="content" class="markdown__editor" />
      </div>
      <div class="textarea">
        <textarea v-model="content"></textarea>
      </div>
    </div>
    <a-divider></a-divider>
    <div class="row">
      <div class="editor">
        <antdv-markdown
          v-model="content2"
          :tool-buttons="[
            ['bold', 'italic', 'heading'],
            '||',
            ['bars', 'eyeSlash', 'arrowsAlt', 'windowMaximize'],
            ['source', 'questionCircle'],
          ]"
          class="markdown__editor"
        />
      </div>
      <div class="textarea">
        <textarea v-model="content2"></textarea>
      </div>
    </div>
    <a-divider></a-divider>
    <div class="row">
      <div class="editor">
        <antdv-markdown
          v-model="content3"
          :preview-only="previewOnly"
          :image-upload-url="'/proxyPrefix/api/instance/uploads/file'"
          :image-upload-before-hook="handleBeforeUpload"
          :image-upload-data="imageUploadData"
          :image-upload-headers="imageUploadHeaders"
          class="markdown__editor"
        />
      </div>
      <div class="operation">
        <a-button type="primary" @click="togglePreview">切换仅预览</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
import readme from "@xianfe/antdv-markdown/README.md";

export default defineComponent({
  name: "Markdown",
  components: {
    AntdvMarkdown,
  },
  setup() {
    const content = ref(readme);
    const content2 = ref(
      '#demo\n不标准的markdown语法，支持html\n<center>第一个居中</center><center>\n第二个居中</center><center>第三个居中\n</center>\n<p style="background: blue; color: white">来一段蓝色背景文字</p>'
    );
    const content3 = ref("#仅预览模式");
    const previewOnly = ref(false);
    const imageUploadData = {
      upload_path: 'image/test', default_name: 0
    };
    const imageUploadHeaders = {'X-Auth': 'xudjn82fh81gf0234..0'}

    watch(content, (newVal) => {
      console.log("[markdown] content changed");
    });

    const togglePreview = () => {
      previewOnly.value = !previewOnly.value;
    };

    const handleUpload = (file: object) => {
      // console.log("uploading...", file);
      // const fd = new FormData();
      // fd.append("file", file.file);
      // fd.append("upload_path", props.uploadPathName);
      // fd.append("default_name", "1");
      // await http.uploadsFile({ param: fd }).then((res: IBusinessResp) => {
      //   let html = `<img src="${dev_base_url}${res.data.url}" alt="">`;
      //   // let html= `<img src="${res.data.url}" alt="">`
      //   //  console.log(html);
      //   insertHtml(html);
      // });
    };

    const handleBeforeUpload = (file: File, fileList: File[]) => {
      console.log(
        "[handleBeforeUpload] file: ",
        file,
        ", fileList: ",
        fileList
      );
      return true;
    };
    return {
      content,
      content2,
      content3,
      previewOnly,
      imageUploadData,
      imageUploadHeaders,
      togglePreview,
      handleUpload,
      handleBeforeUpload
    };
  },
});
</script>
<style lang="less" scoped>
.marked__demo {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

  .row {
    display: flex;

    .editor {
      width: 70%;

      .markdown__editor {
        height: 700px;
      }
    }

    .textarea {
      width: 30%;

      textarea {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
