<template>
  <div class="demo__container">
    <antdv-markdown
      editor-name="content"
      :image-upload-url="
        env
          ? '/proxyPrefix/api/content/vnc/upload_mkfile'
          : '/api/content/vnc/upload_mkfile'
      "
      :image-upload-before-hook="handleBeforeUpload"
      :image-upload-data="imageUploadData"
      :image-upload-headers="imageUploadHeaders"
      :preview-only="preview"
      v-model="content"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref } from "vue";
export default defineComponent({
  name: "DemoMarkedEditor",
  components: {},
  props: ["modelValue", "preview"],
  setup(props, { emit }) {
    // const preview=props.preview
    const content = ref("");
    const env = process.env.NODE_ENV == "development" ? true : false;
    watch(
      () => props.modelValue,
      () => {
        content.value = props.modelValue;
      },
      { deep: true, immediate: true }
    );
    watch(
      () => content.value,
      () => {
        emit("update:modelValue", content.value);
      }
    );
    const handleBeforeUpload = (file: File, fileList: File[]) => {
      console.log(
        "[handleBeforeUpload] file: ",
        file,
        ", fileList: ",
        fileList
      );
      return true;
    };
    const imageUploadData = {
      // md_file: 'image/test',
    };
    const imageUploadHeaders = { "X-Auth": "xudjn82fh81gf0234..0" };
    return {
      // preview,
      content,
      handleBeforeUpload,
      imageUploadData,
      imageUploadHeaders,
      env,
    };
  },
});
</script>
<style lang="less" scoped>
:deep(code) {
  white-space: normal;
  word-break: break-all;
}
:deep(.mark__container) {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  border: 1px solid var(--gray-5);
}
</style>
