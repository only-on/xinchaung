<template>
  <span class="tip">建议封面尺寸282*150px，支持格式png、jpg。</span>
  <img v-if="imageUrl" :src="imageUrl" alt="" srcset="">
  <a-upload
    v-model:file-list="fileList"
    list-type="picture"
    class="uploader"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    accept="image/png,image/jpeg"
  >
    <div class="upload">
      <div class="cover">
        <img :src="systemImages.uploadCoverImg" alt="上传封面">
      </div>
      <loading-outlined v-if="loading"></loading-outlined>
    </div>
  </a-upload>
</template>

<script lang="ts" setup>
import { defineComponent, Ref, ref, inject ,watch} from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue';
import { MessageApi } from "ant-design-vue/lib/message";
import {getThemeData} from 'src/utils/theme'
const {systemImages, systemColor} = getThemeData()
// console.log(systemImages)
const $message: MessageApi = inject("$message")!;

interface Props {
  coverUrl: any
  isUpload?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  coverUrl: {cover: ''},        // 具有cover属性的响应式对象
  isUpload: false,  // 是否需要上传接口
});
const emit = defineEmits<{
  (e: "uploadCoverHandle", obj: any): void;  // 上传文件的回调
}>();
const imageUrl = ref('')
watch(()=>{return props.coverUrl.cover},(val:any)=>{
  // console.log(val)
  imageUrl.value =val
  if ((imageUrl.value as any) instanceof Blob) {
    getBase64(imageUrl.value, (base64Url: string) => {
      imageUrl.value = base64Url;       // 
    });
  }
},{immediate:true})

// 上传封面图
const fileList:Ref<any>=ref([])
const loading = ref<boolean>(false)
const beforeUpload = (file:any) => {
  // console.log(file)
  const isJpgOrPng = ['image/jpeg','image/png'].includes(file.type)
  if (!isJpgOrPng) {
    $message.warn('图片类型不正确')
    return false
  }
  // props.coverUrl.cover = file
  if (props.isUpload) {
    emit("uploadCoverHandle", file)
    // return
  } else {
    props.coverUrl.cover = file
  }
  return false
}

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  type: string;
  size: number;
  originFileObj: any;
}
interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

function getBase64(img: any, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}
const handleChange = (info: FileInfo) => {
  // console.log(info)
  loading.value = true
  getBase64(info.file, (base64Url: string) => {
    imageUrl.value = base64Url;
    loading.value = false;
  });
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    getBase64(info.file, (base64Url: string) => {
      imageUrl.value = base64Url;
      loading.value = false;
    });
  }
};
const uploadCoverBorder = systemColor.uploadCoverBorder
const uploadCoverBg = systemColor.uploadCoverBg
</script>

<style scoped lang="less">
.tip {
  position: absolute;
  top: -27px;
  left: 50px;
  color: var(--black-25);
  font-size: var(--font-size-sm);
}
img {
  width: 162px;
  height: 90px;
  border-radius: 17px;
  margin-right: 16px;
}
.upload {
  width: 162px;
  height: 90px;
  background: v-bind(uploadCoverBg);
  border: 1px dashed v-bind(uploadCoverBorder);
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
      margin-right: 0;
    }
  }
}
</style>
