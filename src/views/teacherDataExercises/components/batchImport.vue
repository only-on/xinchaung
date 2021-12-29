<template>
    <a-modal 
    class="modal"
  :visible="isShowImport" 
  title="批量添加" 
  @ok="closeModal"
  @cancel="closeModal"
  :width="800"
  :footer="null"
>
  <div>
      <div class="choiceDocument">
           <a-upload
            name="file"
            :multiple="true"
            :show-upload-list='false'
            :before-upload='beforeUpload'
            >
               <span>选择文件：</span><a-input class="selectFile" v-model:value='filename'></a-input><a-button class="browse" type="primary">浏览</a-button>
            </a-upload>
          <a-button type="primary" class="upload" @click="detailExerUpload">上传</a-button><a-button type="primary" class="close" @click="closeModal">关闭</a-button>
          <div class="download" @click="dowmTemplate">
              下载试题模板
          </div>
      </div>
        <a-table v-if="data.length" :columns="columns" :data-source="data" rowKey='id'>
          <template #index>
              <span>1</span>
          </template>
          <template #action>
              <span>导入成功</span>
          </template>
        </a-table>
         <div v-else  class="importNone">
            导入情况：无
        </div>
  </div>
</a-modal>
</template>
<script lang="ts">
import { defineComponent,onMounted,reactive, toRefs} from 'vue';
import request from "src/api";
import { number } from 'echarts';
import FileSaver from 'file-saver'
import { message } from 'ant-design-vue';
interface State{
    columns:any[],
    uploadfile:any;
    data:any,
    filename:string
}
export default defineComponent({
    name:'batchImport',
    props: {
    isShowImport: Boolean,
    poolid:Number,
    selectedId:Number
  },
  setup(props,{emit}){
       const teacherDataExerApi = (request as any).teacherDataExercises
       const state:State=reactive({
           columns:[
           {
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                slots: { customRender:'index'},
            },
            {
                title: '题目',
                dataIndex: 'question',
                key: 'question',
                ellipsis:true
            },
            {
                title: '难度',
                dataIndex: 'level',
                key: 'level',
            },
            {
                title: '分数',
                key: 'origin_score',
                dataIndex: 'origin_score',
            },
            {
                title: '导入状态',
                dataIndex: 'action',
                key: 'action',
                slots: { customRender:'action'},
            },
            ], 
            data:[],
            uploadfile:null,
            filename:''
       })
      onMounted(()=>{
          console.log(document.querySelector(".downloadExam"))
          console.log(window.location.origin)+'proxyPrefix'
      })
      function closeModal(){
          emit('batchImportClose',false)
          state.filename=''
          state.uploadfile=''
          state.data=[]
      }
      function beforeUpload(file:any){
          state.uploadfile=file
          state.filename=file.name
      }
      function detailExerUpload(){
        const formdata=new FormData()
        const typeid:any=props.selectedId
        formdata.append('file',state.uploadfile)
        formdata.append('type_id',typeid)
          teacherDataExerApi.detailExerBatchImport({urlParams:{pool_id:props.poolid},param:formdata}).then((res:any)=>{
              console.log(res)
              message.success("文件上传成功")
              state.filename=''
              state.uploadfile=''
              state.data=res.data
          })
      }
      function dowmTemplate(){ 
          let development=process.env.NODE_ENV == 'development' ? true : false;
          let url=development?'http://localhost:3000/proxyPrefix/api/v1/question/questions/import/demo':"/api/v1/question/questions/import/demo"
          FileSaver.saveAs(url);
      }
      
      return {closeModal,beforeUpload,detailExerUpload,dowmTemplate,...toRefs(state)}
  }
})
</script>
<style lang="less">
.choiceDocument{
    display: flex;
    // justify-content:space-between;
    .selectFile{
        width:160px;
    }
    .browse{
        margin-left: 20px;
    }
    .upload{
        margin-left: 20px;
    }
    .close{
        margin-left: 20px;
        margin-right: 20px;
    }
}
.download{
    color: @theme-color;
}
.download:hover{
    color:@theme-light-color;
}
.importNone{
    margin-top:30px;
}
.modal{
    .ant-upload-list{
  display: none;
}
    .ant-modal-body{
    min-height: 200px;
    }
}
</style>