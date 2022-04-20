<template>
  <img v-if="imageUrl" :src="imageUrl" alt="" srcset="">
  <a-upload
    v-model:file-list="fileList"
    list-type="picture"
    class="uploader"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
    accept="image/*"
  >
    <div class="upload">
      <div class="cover">
        <img src="src/assets/images/teacherMaterialResource/cover.png" alt="">
      </div>
      <loading-outlined v-if="loading"></loading-outlined>
    </div>
  </a-upload>
</template>

<script lang="ts" setup>
import { defineComponent, Ref, ref, inject } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue';
import { MessageApi } from "ant-design-vue/lib/message";
const $message: MessageApi = inject("$message")!;

interface Props {
  coverUrl: any
  isUpload?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  coverUrl: '',
  isUpload: false,
});
const emit = defineEmits<{
  (e: "uploadCoverHandle", obj: any): void;
}>();

const imageUrl = ref(props.coverUrl.cover)
// 上传封面图
const fileList:Ref<any>=ref([])
const loading = ref<boolean>(false)
const beforeUpload = (file:any) => {
  console.log(file)
  const isJpgOrPng = ['image/jpeg','image/png'].includes(file.type)
  if (!isJpgOrPng) {
    $message.warn('图片类型不正确')
    return false
  }
  props.coverUrl.cover = file
  if (props.isUpload) {
    emit("uploadCoverHandle", file)
    // return
  }
}

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  type?: string;
  size: number;
  originFileObj: any;
}
interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}
const handleChange = (info: FileInfo) => {
  console.log(info)
  loading.value = true
  getBase64(info.file.originFileObj, (base64Url: string) => {
    imageUrl.value = base64Url;
    loading.value = false;
  });
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (base64Url: string) => {
      imageUrl.value = base64Url;
      loading.value = false;
    });
  }
};
</script>

<style scoped lang="less">
img {
  width: 162px;
  height: 90px;
  border-radius: 17px;
  margin-right: 16px;
}
.upload {
  width: 162px;
  height: 90px;
  background: #fffdfb;
  border: 1px dashed #ffdcc1;
  border-radius: 17px;
  img {
    width: 100%;
    height: 100%;
  }
  .cover {
    text-align: center;
    cursor: pointer;
    img {
      width: 70px;
    }
  }
}
</style>
