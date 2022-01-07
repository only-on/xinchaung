<template>
  <div class="upload-data-set-file-box">
    <before-icon :icon="group12">
    <a-select
      style="width: 250px"
      v-model:value="dataset_id"
      placeholder="请选择目录"
    >
      <a-select-option
        v-for="(val, key) in selfDataSetList"
        :value="key"
        :key="key"
        >{{ val }}</a-select-option
      >
    </a-select>
    </before-icon>
    <a-upload
      :show-upload-list="false"
      :before-upload="beforeUpload"
      class="avatar-uploader"
      :accept="accept"
      :remove="remove"
    >
      <div class="upload-box">
        <span class="icon-upload iconfont"></span>
        <p class="hint-handle-type">点击或将文件拖拽这里上传</p>
        <p class="hint-file-type">支持文件类型：{{accept}}</p>
        <p class="hint-file-size" v-if="fileSize">支持文件大小：{{fileSize}}</p>
      </div>
    </a-upload>
    <div v-if="uploadFileList.file_name" class="progress-box">
        <div class="file-base-info"><span>文件名称：{{uploadFileList.file_name}}</span><span class="icon-shanchu-copy iconfont" @click="remove"></span></div>
        <a-progress :percent="progress" />
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs ,watch} from "vue";
import { getDataSetListApi } from "../api";
import uploadFile from "src/request/uploadFile";
import { message } from "ant-design-vue";
import beforeIcon from "src/components/aiAnt/beforeIcon.vue"
import group12 from "src/assets/images/screenicon/Group12.png"
type TreactiveData = {
  selfDataSetList: Record<string, unknown>;
  dataset_id: undefined | string;
  uploadFileList: any;
  progress:number,
  upload:null|any
};

export default defineComponent({
  components:{
    "before-icon":beforeIcon
  },
  props: ["type","value","dataset_id","accept","fileSize"],
  setup(props,{emit}) {
    const env = process.env.NODE_ENV == "development" ? true : false;
    // 获取数据集列表
    let type = -1
    watch(()=>props.type,()=>{
      type=props.type
      getDataSetList();
    },{deep:true,immediate:true})
    
    const reactiveData: TreactiveData = reactive({
      selfDataSetList: {},
      dataset_id: undefined,
      uploadFileList: {},
      progress:0,
      upload:""
    });
    // onMounted(() => {
    //   getDataSetList();
    // });
    watch(()=>props.value,()=>{
       reactiveData.uploadFileList=props.value
    },{deep:true})
    // watch(()=>props.dataset_id,()=>{
    //    reactiveData.dataset_id=props.dataset_id
    // },{deep:true})
    watch(()=>reactiveData.uploadFileList,()=>{
        emit("update:value",reactiveData.uploadFileList)
    },{deep:true})
    watch(()=>reactiveData.dataset_id,()=>{
        emit("update:dataset_id",reactiveData.dataset_id)
    },{deep:true})
    function getDataSetList() {
      getDataSetListApi({ type: type, name: "" }).then((res: any) => {
        reactiveData.selfDataSetList = res.data.self;
        loop: for (const key in reactiveData.selfDataSetList) {
          if (
            Object.prototype.hasOwnProperty.call(
              reactiveData.selfDataSetList,
              key
            )
          ) {
            reactiveData.dataset_id = key;
            break loop;
          }
        }
      });
    }
    function beforeUpload(file: any) {
      const body = {
        dataset: file,
        pageType: type,
        dataId: reactiveData.dataset_id,
      };

      (reactiveData.uploadFileList as any).file_name=file.name
      reactiveData.upload = new uploadFile({
        url: env
          ? "/proxyPrefix/dataset/data/upload-file"
          : "/dataset/data/upload-file",
        body,
        success: (res: any) => {
          if (res.status === 1) {
            reactiveData.uploadFileList = res.data;
          } else {
            message.error("上传失败");
          }
          reactiveData.upload = "";
        },
        progress: (e: ProgressEvent) => {
          if (e.total > 0) {
            reactiveData.progress= Number(Number(e.loaded / e.total * 100).toFixed(2));   
          }
        },
        abort: (xhr: XMLHttpRequest) => {
          console.log("终止上传成功", xhr);
        },
        error: (err) => {
          console.log(err);
        },
      });
      reactiveData.upload.request();
      return false;
    }
    // 终止上传
    function abort() {
      if (reactiveData.upload) {
        reactiveData.upload.abortUpload();
      }
    }
    // 移除
    function remove() {
      abort()
      reactiveData.uploadFileList={}
      reactiveData.progress=0
    }
    return {
      ...toRefs(reactiveData),
      beforeUpload,
      abort,
      remove,
      group12
    };
  },
});
</script>

<style lang="less">
.upload-data-set-file-box {
  .ant-upload.ant-upload-select {
    margin-top: 20px;
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    background: #fafafa;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 0.3s;
    &:hover {
      border: 1px dashed var(--purpleblue-6);
    }
    > span {
      width: 100%;
      height: 100%;
      display: block;
      .upload-box {
        width: 100%;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .iconfont {
          font-size: 24px;
          color: var(--purpleblue-6);
        }
        .hint-handle-type {
          font-size: 14px;
          color: rgba(@black,0.45);
        }
        .hint-file-type,.hint-file-size {
          font-size: 12px;
          color: #b4b4b4;
        }
      }
    }
  }
  .progress-box{
      margin-top: 10px;
      .file-base-info{
          display: flex;
          justify-content: space-between;
          &:hover{
              cursor: pointer;
              color: var(--purpleblue-6);
          }
      }
  }
}
</style>
