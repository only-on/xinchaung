<template>
  <div>
    <a-upload-dragger
      v-model:fileList="fileList"
      name="file"
      :multiple="isMultiple"
      @remove='removeDoc'
      @change="handleChange1"
      @drop="handleDrop"
      :before-upload="beforeUpload"
      :customRequest="handleUpload"
    >
      <p class="ant-upload-drag-icon">
        <i class="iconfont icon-upload"></i>
      </p>
      <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
      <template #itemRender="{ file, actions }">
        <div class="file-info">
          <span :style="file.status === 'error' ? 'color: red' : ''">{{ file.name }}</span>
          <span class="iconfont icon-shanchu pointer" @click="actions.remove"></span>
        </div>
        <a-progress :percent="file.progress" size="small" v-if="file.status==='loading'" />
      </template>
    </a-upload-dragger>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  toRefs,
  onMounted,
  Ref,
  inject,
  computed,
  reactive,
  watch,
  toRaw,
} from "vue";
import { Modal, message, Upload } from "ant-design-vue";
import uploadFile from "src/request/uploadFile";
const env = process.env.NODE_ENV == "development" ? true : false;
interface Props {
  uploadData?: any;
  fileInfo: any
  isMultiple?: boolean;
  uploadPath?:string;
  fileType?: string[];
  fileSize?: number
}
const props = withDefaults(defineProps<Props>(), {
  uploadData: () => {},   // loading 
  fileInfo: () => {},
  isMultiple: true,
  uploadPath: 'createQues',
  fileType: () => [],   // 上传文件的类型限制  默认没有类型限制
  fileSize: 500,  // 上传文件的大小限制  默认上传上限是500M
});
const isMultiple = ref<boolean>(props.isMultiple)
const fileList: any = props.uploadData.fileAllList?.length ? ref(props.uploadData.fileAllList) : ref([]);
const infoList:any=ref([])
function handleChange1(info: any) {
  const status = info.file.status;
  if (status !== "uploading") {
    console.log(info.file, info.fileList);
  }
  if (status === "done") {
    message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === "error") {
    message.error(`${info.file.name} file upload failed.`);
  }
}
function handleDrop(e: any) {

}
const emit = defineEmits<{
  (e: "update:fileInfo", val: any): void;
}>();
watch(()=>props.isMultiple, newVal => {
  isMultiple.value = newVal
},{immediate:true})
// 上传前
function beforeUpload(file: any) {
  if (file.size / 1024 / 1024 >= props.fileSize) {
    message.warn(`上传文件不能超过${props.fileSize}MB`);
    return Upload.LIST_IGNORE;
  }
  if (props.fileType.length && !props.fileType.includes('.'+file.name.split('.').at(-1))) {
    message.warn(`请上传${props.fileType.join('、')}类型的文件`);
    return Upload.LIST_IGNORE
  }
  if(isMultiple.value) {
    fileList.value.push(file);
  } else {
    infoList.value = []
    fileList.value = [file];
  }
}
const handleUpload= (file:any) => {
  console.log(fileList.value)
  console.log(file)
  let i = fileList.value.findIndex((item: any) => {
    return item.uid === file.file.uid;
  });
  const body = {
    file: file.file,
    upload_path: props.uploadPath,
    default_name: 1,
  };
  fileList.value[i].upload = new uploadFile({
    url: env
      ? "/proxyPrefix/api/instance/uploads/file"
      : "/api/instance/uploads/file",
    body,
    success: (res: any) => {
      if (res.code == 1) {
        file.onSuccess(res, file.file)
        let suffix = res.data.name.slice(res.data.name.indexOf(".") + 1);
        const info = {
          file_name: res.data.name,
          file_url: res.data.url,
          size: res.data.size,
          suffix: suffix,
        };
        infoList.value.push(info);
        emit("update:fileInfo", infoList.value);
      } else {
        message.warn(res.msg);
      }
      // fileList.value.push({});
      // fileList.value.pop();
    },
    progress: (e: ProgressEvent) => {
      if (e.total > 0) {
        let prog: any = Number(
          Number((e.loaded / e.total) * 100).toFixed(2)
        ) as any;
        file.onProgress({percent: prog})
      }
    },
    abort: (xhr: XMLHttpRequest) => {
      console.log("终止上传成功", xhr);
    },
    error: (err) => {
      console.log(err);
    },
  });
  fileList.value[i].upload.request();
}
function removeDoc(file:any){
  if (file.upload) {
    file.upload.abortUpload();
  }
  infoList.value.forEach((item:any,index:any) => {
    if (file.url == item.file_url) {
      infoList.value.splice(index,1)
    }
  })
  emit("update:fileInfo",infoList.value);
}
// 终止所有上传
function cancelUpload() {
  let sign = false
  fileList.value.forEach((v: any) => {
    if (v.status === 'loading') {
      sign = true
    }
    if (v.upload) {
      v.upload.abortUpload();
    }
  })
  props.uploadData.loading = sign
}
// watch(
//   () => {
//     return props.fileInfo;
//   },
//   (val: any) => {
//     // type.value = val;
//     if(props.fileInfo!=='' && val){
//       const list:any=[]
//       props.fileInfo.forEach((item:any)=>{
//         list.push({
//           uid: '-1',
//           name:item.file_name,
//           status: 'done',
//           url:item.file_url
//         })
//       })
//     fileList.value=list;
//     }
//   },{
//     immediate:true
//   }
// );
watch(
  () => {
    return fileList.value;
  },
  (val: any) => {
    if (!val) {
      props.uploadData.loading = false
      return
    }
    let sign = false
    fileList.value.forEach((v: any) => {
      if (v.status === 'loading') {
        sign = true
      }
    })
    props.uploadData.loading = sign
  },{
    immediate:true,
    deep: true
  }
);
defineExpose({
  cancelUpload
})
</script>
<style lang="less" scoped>
.icon-upload {
  color: var(--primary-color);
  font-size: 24px;
}
.ant-upload.ant-upload-drag p.ant-upload-text {
  font-size: 16px;
  color: #bebebe;
}
.file-info {
  display: flex;
  justify-content: space-between;
  .iconfont{
    margin-right: 8px;
    &:hover {
      color: var(--primary-color);
    }
  }
}
</style>