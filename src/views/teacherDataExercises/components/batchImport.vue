<template>
    <a-modal 
  :visible="isShowImport" 
  title="批量添加" 
  @ok="handleOk"
  @cancel="handleCancel"
  :width="800"
  :footer="null"
>
  <div>
      <div class="choiceDocument">
           <a-upload
            name="file"
            :multiple="true"
            @change="handleChange"
            >
               <span>选择文件：</span><a-input style="width:160px" v-model:value='filename'></a-input><a-button type="primary">浏览</a-button>
            </a-upload>
          <a-button type="primary" @click="detailExerUpload">上传</a-button><a-button type="primary" @click="closeModal">关闭</a-button>
          <div class="download" @click="dowmTemplate">
              下载试题模板
          </div>
      </div>
        <a-table v-if="data" :columns="columns" :data-source="data" rowKey='id'>
          <template #index='{record}'>
              <span>{{record.index}}</span>
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
    poolid:Number
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
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '难度',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '分数',
                key: 'tags',
                dataIndex: 'tags',
                scopedSlots: { customRender: 'tags' },
            },
            {
                title: '导入状态',
                dataIndex: 'action',
                key: 'action',
            },
            ], 
            data:[
            {
                index: 1,
                age: '的的耳朵',
                address: '简单',
                tags:'10',
                action:'导入成功'
            }
            ],
            uploadfile:null,
            filename:''
       })
      onMounted(()=>{
          console.log(document.querySelector(".downloadExam"))
          console.log(window.location.origin)+'proxyPrefix'
      })
      function handleOk(){
          emit('batchImportClose',false)
      } 
      function handleCancel(){
          emit('batchImportClose',false)
      }
      function closeModal(){
          emit('batchImportClose',false)
      }
      function handleChange(file:any){
          console.log(file,'file')
          state.uploadfile=file.file
          state.filename=file.file.name
      }
      function detailExerUpload(){
          teacherDataExerApi.detailExerBatchImport({urlParams:{pool_id:props.poolid},param:{csv_file:state.uploadfile}}).then((res:any)=>{
              console.log(res)
          })
      }
      function dowmTemplate(){ 
          let development=process.env.NODE_ENV == 'development' ? true : false;
          let url=development?'http://localhost:3000/proxyPrefix/api/v1/question/questions/import/demo':"api/v1/question/questions/import/demo"
        FileSaver.saveAs(url);
      }
      
      return {handleOk,handleCancel,closeModal,handleChange,detailExerUpload,dowmTemplate,...toRefs(state)}
  }
})
</script>
<style lang="less">
.choiceDocument{
    display: flex;
    justify-content:space-between;
}
.download{
    color: @theme-color;
}
.download:hover{
    color:@theme-light-color;
}
.ant-upload-list{
  display: none;
}
</style>