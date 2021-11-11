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
        <a-button class='btn' @click='onUpload'>上传</a-button>
        <a-button class="btn">恢复</a-button>
        <a-button class='btn'>暂停</a-button>
        <a-button class='btn'>删除</a-button>
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
import { APIModel } from './types';
import { FileChunk,
 OperateAction,
 staticMessage,
  request,
  createFileChunk,
  fileChunkIsUploaded,
  fileChunkUploaded,
  transformByte,
  getWorkerJsPath} from './UploadBreakpointContinuation'
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
chunkSize:number,
workerJsPath:any
}
export default defineComponent({
  components: {},
  props:['action','resumeAction','deleteAction','mergedAction'],
  setup(props,context) {
    const state:Istate=reactive({
    status:new UploadStatus(),
    uploadProgressDetailVisible:false,
    uploadPercent:0,
    chunkProgressPercent:0,
    requests:[],
    chunks:[],
    file:'',
    fileHash:'',
    chunkSize:8000000,
    workerJsPath:getWorkerJsPath()
    })
    const methods={
         onError(err: Error, type: OperateAction) {
          message.error(err.message)
          context.emit('error', err, type)
        },
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
        hasSelectableFile() {
          console.log(state.file&&state.chunks)
          return state.file && state.chunks
        },
        // 有文件输入
        beforeUpload(file:any){
            console.log(file)
            state.file=file
            state.chunkSize=file.size
            let fileType:any=file.name.split('.')[file.name.split('.').length-1]
            if(fileType==='qcow2'||fileType==='tar'){
              state.chunks=methods.createFileChunk(state.file,state.chunkSize)  
            }else{
               message.warning('请上传后缀为.qcow2或者.tar文件')  
            }
            return false;
        },
        // 上传
        onUpload(){
          methods.validateAndExecUpload('upload')
        },
          // 生成文件 hash（web-worker）
        calculateHash(fileChunks: FileChunk[]): Promise<{ hash: string; percent: number }> {
          return new Promise(resolve => {
            let worker:any = new Worker(state.workerJsPath)
            // worker.postMessage({chunks: fileChunks })
            console.log(fileChunks,'fileChunks')
            console.log(worker,'worker00000000')
            worker.onmessage = (e:any) => {
              const { hash, percent } = e.data
              if (hash) {
                resolve(e.data)
              }
              const chunkProgressPercent = percent
              state.chunkProgressPercent = parseInt(chunkProgressPercent)
            }
          })
        },
        emitModel(data: any) {
        // const modelData = Object.assign(
        //   {},
        //   state.param,
        //   {
        //     ostype: state.type,
        //     classify_id:state.osType,
        //   },
        //   data,
        // )
        // context.emit('image-uploaded', modelData)
  },
   calcUploadPercent() {
    if (!state.file) return
    let loaded = 0

    state.chunks.forEach(chunk => {
      if (fileChunkIsUploaded(chunk)) {
        loaded += chunk.size
      }
    })
    const uploadPercent: any = (loaded / state.file.size) * 100
    state.uploadPercent = parseInt(uploadPercent)
  },
         // 恢复上传
  handleResume(
    res: APIModel<{
      uploaded_size: []
      is_exist: boolean
      baseurl?: string
      name?: string
      size?: number
      url?: string
    }>,
    file: File,
  ) {
    if (res.code !== 1) {
      return false
    }

    if (res.data.is_exist) {
      const data = res.data

      methods.emitModel({
        image_name: file.name,
        file_path: data.baseurl,
        file_size: file.size,
      })
      return true
    }

    return res.data.uploaded_size
  },
        // 上传校验，检测文件有没有上传过
      resumeUpload(){
             return request({
          url:props.resumeAction,
          body: null,
          onBefore: xhr => {
            xhr.setRequestHeader('X-File-Hash', state.fileHash)
          },
        })
      .then((res:any) => {
        const resumed = methods.handleResume(res, state.file)

        console.log('resumeUpload => ', res)

        if (resumed === false) {
          throw new Error(staticMessage.resumeFailure)
        }
        if (resumed === true) {
          state.chunks.forEach(fileChunkUploaded)
          state.status.uploaded()
          methods.calcUploadPercent()
          // scheduler.emit('image-arrangement-upload-file-into-vm', 'end')
          return
        }
        if (Array.isArray(resumed)) {
          resumed.forEach(index => {
            fileChunkUploaded(state.chunks[index])
          })
        }

        state.status.uploading()
        // state.concurrent ? methods.parallelUpload() : methods.serialUpload() // 串行上传
      })
      .catch((err:any) => {
        state.status.detectingFailed()
        methods.onError(err, 'resume')
      })
        },
        // 上传前校验必选项目，并生成文件hash
        async  validateAndExecUpload(type:OperateAction){ 
          try {
              if(!methods.hasSelectableFile()){
                throw new Error(staticMessage.pleaseSelectFile)
            }

            const reg = /^[^\u4e00-\u9fa5]+$/
            if (state.file && !reg.test(state.file.name)) {
              throw new Error(staticMessage.fileNameHasChinese)
            }

            state.status.detecting()

            if(!state.fileHash){
              console.log(state.chunks,'chunks')
              const hash = await methods.calculateHash(state.chunks)
              state.fileHash = hash.hash
            }
            methods.resumeUpload().catch((err:any)=>{
              message.error(err)
            })
          } catch (error:any) {
            methods.onError(error,'validate')
          }
        }
    }
    onMounted(() => {
    });
    return {...methods,...toRefs(state)};
  },
});
</script>

<style lang="less">
.uploadImage{
  .icon-upload{
    font-size: 24px;
    color: @theme-color;
  }
    .uploadBtn{
      display: flex;
      margin-top:10px;
      .btn{
        margin-right: 10px;
      }
    }
    .upload{
      .ant-upload.ant-upload-drag .ant-upload-btn{
          padding: 40px;
      }
    }
}
</style>
