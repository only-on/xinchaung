<template>
  <div class="uploadImage">
    <a-upload-dragger
        name="file"
        :multiple="true"
        :before-upload='beforeUpload'
        class="upload"
        >
        <p class="ant-upload-drag-icon">
            <span class="iconfont icon-upload"></span>
        </p>
        <p class="ant-upload-hint">选择要上传的镜像或将镜像拖拽到此处 仅支持tar和qcow2</p>
    </a-upload-dragger>
    <div class="uploadBtn">
        <a-button >上传</a-button>
        <a-button >恢复</a-button>
        <a-button >暂停</a-button>
        <a-button >删除</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  reactive,
  toRefs,
  onMounted,
} from "vue";
import { includes } from "lodash";
import { message } from "ant-design-vue";
import { UploadStatus } from './UploadStatus'
interface Istate {
status:any,
//    status = new UploadStatus()
uploadProgressDetailVisible: boolean,
uploadPercent: number,
chunkProgressPercent: number,
// status.prepared()
requests:any[],
chunks:any[],
file:any,
fileHash:any,
}
interface FileChunk {
  range: string,
  disposition: string,
  length: number,
  chunk: any,
  percent: number,
  size: number
  index: number
  key: string
  failed: boolean
}
export default defineComponent({
  components: {},
  setup() {
    const state:Istate=reactive({
    status:'',
    uploadProgressDetailVisible:false,
    uploadPercent:0,
    chunkProgressPercent:0,
    requests:[],
    chunks:[],
    file:'',
    fileHash:'',
    })
    const methods={
        // 文件拆分
        createFileChunk(file:any,size:number){
            let index:number=0;
            let chunkSize:number=0;
            const fileChunkList: FileChunk[] = [] 
            const length = file.size
            
            
            while (chunkSize < length) {
                const limit = chunkSize + size
                const chunk = file.slice(chunkSize, limit)

                fileChunkList.push({
                length,
                chunk,
                percent: 0,
                index,
                range: `bytes ${chunkSize}-${limit}/${length}`,
                disposition: `attachment; filename="${file.name}"`,
                size: chunk.size,
                key: `chunk-${index}`,
                failed: false,
                })

                index++
                chunkSize += size
            }
             return fileChunkList
        },
        // 重置
        resetUpload() {
            state.status = new UploadStatus()
            state.uploadProgressDetailVisible = false
            state.uploadPercent = 0
            state.chunkProgressPercent = 0
            state.status.prepared()
            state.requests = []
            state.chunks = []
            state.file = null
            state.fileHash = ''
        },
        beforeUpload(file:any){
            console.log(file)
            let fileType:any=file.name.split('.')[file.name.split('.').length-1]
            if(fileType!=='qcow2'||fileType!=='tar'){
                message.warning('请上传后缀为.qcow或者.tar文件')
            }else{
                methods.resetUpload()
            //    state.chunks=methods.createFileChunk(file,chunkSize)
            }
            return false;
        },
    }
    onMounted(() => {
    });
    return {...methods,...toRefs(state)};
  },
});
</script>

<style lang="less">
.uploadImage{
    .uploadBtn{
      display: flex;
    }
    .upload{
      .ant-upload.ant-upload-drag .ant-upload-btn{
          padding: 40px;
      }
    }
}
</style>
