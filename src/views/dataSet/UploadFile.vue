<template>
  <div>
    <a-modal class="upload-model-box" :visible="true" @cancel="closeUpload" @ok="closeUploadOk" :width="1000">
      <template v-slot:title>上传数据集文件</template>
      <div class="uplaod-box">
        <div class="uplaod-input-left">
          <div>
            <a-upload-dragger
              name="file"
              :multiple="true"
              :before-upload="beforeUpload"
              :show-upload-list="false"
              @change="handleChange"
            >
              <div class="upload-bg">
                <div>点击选择文件或将文件拖拽到此处</div>
              </div>
            </a-upload-dragger>
          </div>
        </div>
        <div class="uplaod-right-list">
          <p class="upload-hint" v-if="Unfinished">文件上传中,请勿关闭弹窗或浏览器</p>
          <div class="chunk-list">
            <div v-for="(v, k, i) in ChunkStatus" :key="i">
              <span class="name">文件名称：{{ v.name }}</span>
              <span class="chunks">计算md5进度：{{ v.chunks + '/' + v.currentChunk }}</span>
            </div>
          </div>
          <div class="upload-file-list scroll-bar-customize">
            <div v-for="(value, key, index) in form.uploadFileList" :key="index">
              <div class="upload-file-item">
                <span class="img" :class="getFileType(value.name)" :style="`background-image: url(${iconList[getFileType(value.name)]});`">
                  <!-- <img :src="iconList[getFileType(value.name)]" alt=""> -->
                </span>
                <div>
                  <div class="info">
                    <span class="name">{{ value.name }}</span>
                    <div class="iconfontbox">
                      <span class="deleteicon icon-guanbi iconfont" v-if="value.status !== 'end'" @click="deleteFile(value, key)"></span>
                      <span v-if="value.status === 'end'" class="icon-shanchu iconfont" @click="removeFile(value, key)"></span>
                    </div>
                  </div>
                  <div>
                    <p class="size">{{ size(value.size) }}</p>
                    <a-progress :percent="value.progress" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref, computed} from 'vue'
import SetList from './SetList.vue'
import {useStore} from "vuex"
import extStorage from "src/utils/extStorage";
import request from 'src/api/index'
const http=(request as any).dataSet
import { getFileType,getFileSuffix } from 'src/utils/getFileType'
import iconList from 'src/utils/iconList'
import Upload from 'src/utils/MoreUpload'
import { UUID } from "src/utils/uuid";
import { Modal,message } from 'ant-design-vue';
export default defineComponent({
  name: '',
  components: {
   SetList
  },
  props:['data_id'],
  emits:['getDataFile','closeUpload'],
  setup: (props,{emit}) => {
    
    
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    var ChunkStatus:any= reactive({})
    const uploadFileUuid = ref(UUID.uuid4())
    
    const beReady = ref<boolean>(false);
    const readyFileList:any=reactive({})
    const form:any=reactive({
      uploadFileList:{}
    })
    const Unfinished=computed(()=>{
      let sign=false
      Object.keys(form.uploadFileList).forEach((v:any)=>{
        if(form.uploadFileList[v].status!=='end' && form.uploadFileList[v].progress!==100){
          sign=true
        }
      })
      return sign
    })
    function closeUpload(){
      if(Unfinished.value===false){
        emit('closeUpload')
      }else{
        message.warn('文件正在上传，请勿关闭！')
      }
    }
    function closeUploadOk(){
      if(Unfinished.value===false){
        emit('closeUpload')
      }else{
        message.warn('文件正在上传，请勿关闭！')
      }
    }
    function handleChange(){

    }
    function deleteFile(file:any,key:any){
      if (file.files.length > 0) {
        file.files.forEach((item: any) => {
          if (item.xhr) {
            console.log(item)

            item.xhr.abort()
          }
        })
      }
      delete form.uploadFileList[key]
    }
    function removeFile(item:any,key:any){
      const deleteParam = {
        file_id:item.uid,
        file_name: item.name,
      }
      http.deleteFile({param:{...deleteParam}}).then((res:any)=>{
        message.success('删除成功')
        emit('getDataFile')
      })
    }
    function size(size:any){
      let num=Number(size)
      console.log(num)
      if (num < 1024 * 1024) {
        return (num / 1024).toFixed(2) + 'kb'
      } else {
        return (num / 1024 / 1024).toFixed(2) + 'Mb'
      }
    }
    function beforeUpload(file:any){
      if (file && file.size === 0) {
         message.warn('文件大小不能为空')
          return false
        }
      if (getFileSuffix(file.name) === 'flv') {
        message.warn('不允许上传flv视频文件')
        return false
      }
        Upload({
          startUploadURL: '/dmc/v1.0/create_multi_part',
          multiUploadURL: '/dmc/v1.0/multi_part_upload',
          mergeUploadUrl: '/dmc/v1.0/compose_part',
          data_set_id: props.data_id, //this.data_id
          file: file,
          chunkSize: 5242880, // 2096963
          processFun: processFun,
          startUploadFun: startUploadFun,
          endUploadFun: endUploadFun,
          chunkFun: chunkFun,
          eruptNum: 6,
        })
        return false

    }
    function chunkFun(name: string, chunks: number, currentChunk: number, key: string) {
      Object.assign(ChunkStatus, { [key]: { name: name, chunks: chunks, currentChunk: currentChunk } })
      if (chunks === currentChunk) {
        delete ChunkStatus[key]
      }
    }
    function startUploadFun(v: any, file_name: string, file_size: number) {
      Object.assign(form.uploadFileList, {
        [v]: { name: file_name, status: 'start', progress: 0, files: [], data: {}, open: false, size: file_size },
      })
    }
    function processFun(e: any, v: any, length: number) {
      // console.log(e, v, length)
      if (!form.uploadFileList[v.fileMd5]?.status) {
        return
      }
      Object.assign(
        typeof form.uploadFileList[v.fileMd5].files[v.index] === 'object'
          ? form.uploadFileList[v.fileMd5].files[v.index]
          : (form.uploadFileList[v.fileMd5].files[v.index] = {}),
        {
          xhr: v.xhr,
          progress: Number(((e.loaded / e.total) * 100).toFixed(2)),
          upload_status: e.loaded > e.total ? 'loading' : 'end',
        },
      )
      let progress = 0
      form.uploadFileList[v.fileMd5].files.forEach((item: any) => {
        progress += item.progress
      })

      form.uploadFileList[v.fileMd5].progress =Number((progress / length).toFixed(2)) !== 100 ? Number((progress / length).toFixed(2)) : 99
    }
    function endUploadFun(v: any, d: any) {
      form.uploadFileList[v].status = 'end'
      form.uploadFileList[v].progress = 100
      form.uploadFileList[v].data = d
      emit('getDataFile',true)
    }
    onMounted(()=>{
     
    })
    return {props,iconList,getFileType,closeUpload,closeUploadOk,beforeUpload,handleChange,form,ChunkStatus,beReady,Unfinished,deleteFile,removeFile,size};
  },
})
</script>
<style scoped lang="less">
.upload-model-box {
    .ant-modal-footer {
        border: none;
        text-align: center;
        padding-bottom: 30px;

        button {
            margin-right: 20px;
        }
    }

    .uplaod-box {
        display: flex;
        flex-direction: row;

        .uplaod-input-left {
            width: 50%;

            >div {
                max-width: 100%;
                width: 512px;
                margin: auto;
            }

            .upload-bg {
                position: relative;
                width: 512px;
                height: 500px;
                background-image: url("src/assets/images/dateSet/upload_bg.png");
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: center;

                >div {
                    color: #404040;
                    font-weight: 400;
                    font-size: 16px;
                    position: absolute;
                    bottom: 60px;
                    left: 45%;
                    transform: translateX(-50%);
                }
            }
        }

        .uplaod-right-list {
            width: 50%;
            padding: 0px 30px;

            .upload-hint {
                color: #eb3030;
                letter-spacing: 1px;
                font-size: 14px;
            }

            .upload-file-list {
                margin-top: 20px;
                height: 500px;
                overflow-y: auto;
                overflow-x: hidden;

                >div {
                    background: #ffffff;
                    box-shadow: 0px 0px 40px 0px var(--black-0-7);
                }

                .upload-file-item {
                    display: flex;
                    flex-direction: row;

                    border-radius: 20px;

                    padding: 20px 20px;
                    margin-bottom: 20px;
                    padding-bottom: 0px;

                    .img {
                        width: 42px;
                        height: 42px;
                        flex-shrink: 0;
                        margin-right: 16px;
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        
                    }
                    .info{
                      line-height: 28px;
                      .iconfontbox{
                        padding: 0 6px;
                      }
                      .name{
                        padding: 0 6px;
                        flex: 1;
                        word-wrap: break-word;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        display: -webkit-box;
                        overflow: hidden;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                      }
                    }
                    >div {
                        width: 100%;

                        .icon-shanchu {
                            // display: none;
                        }

                        span.deleteicon {
                            text-align: center;
                            // display: none;
                        }

                        p.size {
                            color: #000000;
                            letter-spacing: 1px;
                            font-size: 12px;
                            opacity: 0.5;
                        }

                        >div:nth-child(1) {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            margin-bottom: 6px;

                            .name {
                                color: #404040;
                                font-size: 14px;
                                font-weight: 700;
                                word-break: break-word;
                            }
                        }
                    }

                    &:hover {
                        .icon-shanchu {
                            display: block;
                            // font-size: 14px;
                            cursor: pointer;
                        }

                        .deleteicon {
                            display: block;
                            cursor: pointer;
                        }

                    }
                }

                .detail-box {
                    padding: 0 16px 0px 16px;
                    transition: 0.5s;
                    overflow: hidden;

                    .detail-name {
                        color: rgba(64, 64, 64, 0.45);
                        font-size: 12px;
                    }

                    .ant-progress-status-success {
                        .ant-progress-bg {
                            background-color: rgba(var(--purpleblue-6), 1);
                        }
                    }

                    .ant-progress-bg {
                        background-color: rgba(var(--purpleblue-6), 0.4);
                        height: 4px !important;
                    }


                }

                .look-detail-btn {
                    cursor: pointer;

                    .iconfont {
                        margin-left: 10px;
                    }
                }
            }
        }
    }


    .chunk-list {
        >div {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .chunks{
              width: max-content;
            }
            .name{
              padding: 0 6px;
              flex: 1;
              word-wrap: break-word;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              overflow: hidden;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
        }
    }
    .ant-progress-outer{
        width: 90%;
    }
}
</style>

