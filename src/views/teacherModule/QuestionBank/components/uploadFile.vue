<template>
<div>
  <!-- 比赛上传文件 卡片上传-->
  <div class="competitionUpload" v-if="uploadType==='card'">
    <a-upload-dragger
    v-show="fileList.length === 0"
    :file-list="fileList"
    name="file"
    :showUploadList="false"
    :customRequest="handleUpload"
    @change="handleFileChange"
    >
      <p class="ant-upload-drag-icon">
        <i class="iconfont icon-upload"></i>
      </p>
      <p class="ant-upload-text">点击选择文件或将文件拖拽到此处</p>
    </a-upload-dragger>
    <template v-if="fileList.length !== 0">
      <div v-for="(item,index) in fileList" :key="item.id" class="file-item">
        <a-spin v-show="item.status === 'uploading'" size="small" />
        <div class="file-info">
          <div class="file-name">
            <span :title="item.name">{{item.name}}</span>
            <i class="iconfont icon-guanbi" @click="handleRemove(index)"></i>
          </div>
          <a-progress :percent="item.percent" :format="formatProgress"/>
        </div>
      </div>
    </template>
  </div>
  <!-- 赛题上传文件 按钮上传 -->
  <div class="problemUpload" v-else>
    <a-upload
    :file-list="fileList"
    name="file"
    :showUploadList="false"
    :customRequest="handleUpload"
    @change="handleFileChange"
    >
      <div class="uploadContent">
        <a-button type="primary">{{uploadText}}</a-button>
      </div>
    </a-upload>
    <div class="flie-list">
      <div v-for="(item,index) in fileList" :key="item.id" class="file-item">
        <template v-if="item.status === 'uploading'">
          <LoadingOutlined/>
          <div class="file-info">
            <span :title="item.name">{{item.name}}</span>
            <a-progress size="small" :percent="item.percent" :format="formatProgress"/>
          </div>
        </template>
        <template  v-if="uploadUrlType !== 'data' && item.status !== 'uploading'">
          <div class="file-info">
            <span :title="item.name ? item.name : item.file_name">{{item.name ? item.name : item.file_name}}</span>
            <i class="iconfont icon-shanchu-copy" @click="handleRemove(item.id ? item.id :index)"></i>
          </div>
        </template>
      </div>
    </div>
  </div>
</div>
</template>
<script lang="ts">
import { defineComponent, reactive, watch, ref } from 'vue'
import {LoadingOutlined } from '@ant-design/icons-vue'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import Upload from "src/request/uploadFile";
const uploadUrl = process.env.NODE_ENV == "development" ? '/proxyPrefix/api/instance/uploads/file' : '/api/instance/uploads/file'
const uploadParams = {
  // 赛题封面
  cover: {
    upload_path: 'competition/question/cover'
  },
  // 赛题脚本
  script: {
    upload_path: 'competition/question/script'
  },
  // 数据文件
  data: {
    upload_path: 'competition/question/data'
  },
  // 结果文件
  result: {
    upload_path: 'competition/competition/result'
  },
  // 过程文件
  process: {
    upload_path: 'competition/competition/process'
  }
}
export default defineComponent({
  components: {
    LoadingOutlined
  },
  props: {
    file:{
      type: Array,
      default: []
    },
    type: {
      type: String,
      default: 'card'
    },
    btnText: {
      type: String,
      default: '上传文件'
    },
    // 上传文件保存路径的类型
    urlType: {
      type: String,
      default: ''
    }
  },
  emits: ['success','delete'],
  setup(props,{emit}) {
    const fileList = ref<any>()
    var uploadType = ref<string>(props.type)
    var uploadText = ref<string>(props.btnText)
    var uploadUrlType = ref<string>(props.urlType)
    let upload:any =null
    var currFileOption = ref<any>(null)
    const handleFileChange = (info:any) => {
      console.log(info.fileList)
      fileList.value = info.fileList
    }
    
    watch(()=>[props.type,props.btnText], ([newType, newText]) => {
      uploadType.value = newType
      uploadText.value = newText
    })
    watch(()=>props.file, newVal => {
      fileList.value = newVal
    },{deep:true, immediate: true})

    watch(()=>props.urlType, newVal => {
      uploadUrlType.value = newVal
    })
    const handleUpload =(file:any) =>{
      console.log(file.file)
      let obj = {
        uploadFiled: file.file,
        upload_path: uploadParams[uploadUrlType.value].upload_path
      }
      currFileOption.value = file
      upload = new Upload({
        url: uploadUrl,
        body: obj,
        success: uploadSuccess,
        progress: uploadProgress,
        abort: (xhr: XMLHttpRequest) => {
          console.log("终止上传成功", xhr);
        },
        error: (err: Error) => {
          console.log(err);
        }
      })
      upload.request();
    }
    const uploadProgress = (e: ProgressEvent) => {
      if (e.total > 0) {
        let num = Number(Number((e.loaded / e.total) * 100).toFixed(2))
        currFileOption.value.onProgress({percent: num})
      }
    }
    const uploadSuccess = (res:any) => {
      if (res.status === 1) {
        currFileOption.value.onSuccess(res,currFileOption.value.file)
        let suffix = res.data.name.slice(res.data.name.indexOf('.')+1)
        let obj = {
          file_name: res.data.name,
          file_url: res.data.url,
          size: res.data.size,
          suffix: suffix
        }
        emit('success', obj)
      }
    }
    const handleRemove = (index:any) => {
      fileList.value.splice(index, 1)
      emit('delete', index)
    }
    const formatProgress = (percent: number) => percent + '%'
    return {
      fileList,
      handleFileChange,
      handleUpload,
      handleRemove,
      uploadType,
      uploadText,
      formatProgress,
      uploadUrlType
    }
  },
})
</script>
<style lang="less" scoped>
.competitionUpload{
  .ant-spin-spinning{
    width: auto;
    min-height: auto;
  }
  :deep(.ant-upload){
    &-drag{
      border-color: #BEBEBE;
      background: var(--white-100);
      border-radius: 10px;
      .ant-upload{
        padding: 36px 0;
      }
    }
    .ant-upload-drag-icon{
      margin-bottom: 0;
      i{
        font-size: 24px;
        color: var(--primary-color);
      }
    }
    .ant-upload-text{
      font-size: 14px;
    }
  }
&>.file-item{
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i{
      font-size: 24px;
    }
    .file-info{
      flex: 1;
      margin-left: 10px;
      .file-name{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: var(--black-5);
        span{
          display: inline-block;
          max-width: 200px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        i{
          cursor: pointer;
          font-size: 14px;
        }
      }
      .ant-progress-status-success{
        .ant-progress-text {
          color: var(--primary-color);
        }
        .ant-progress-bg{
          background: var(--primary-color);
        }
      }
    }
  }

}
.problemUpload{
    display: flex;
    margin-bottom: 10px;
  .uploadContent{
    .ant-btn{
      margin-right: 20px;
    }
  }
  .file-item{
    width: 450px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:not(:last-child){
      margin-bottom: 10px;
    }
    i{
      font-size: 18px;
      margin-left: 20px;
      cursor: pointer;
    }
    .file-info{
      display: flex;
      align-items: center;
      :deep(.ant-progress){
        .ant-progress-text {
          color: var(--primary-color);
        }
        .ant-progress-bg{
          background: var(--primary-color);
          height: 4px !important;
        }
      }
    }
  }
}
</style>
