<template>
    <a-modal 
  :visible="isShowImport" 
  title="批量添加" 
  @ok="handleOk"
  @cancel="handleCancel"
  :width="600"
  :footer="null"
>
  <div>
      {{poolid}}poolid
      <div class="choiceDocument">
           <a-upload
            name="file"
            :multiple="true"
            @change="handleChange"
            >
               <a-button> <a-icon type="upload" /> Click to Upload </a-button>
            </a-upload>
          <a-button type="primary">浏览</a-button><a-button type="primary" @click="detailExerUpload">上传</a-button><a-button type="primary" @click="closeModal">关闭</a-button>
          <div class="download" @click="dowmTemplate">
              下载试题模板
          </div>
      </div>
        <a-table v-if="data" :columns="columns" :data-source="data" rowKey='id'></a-table>
         <div v-else  class="importNone">
            导入情况：无
        </div>
  </div>
</a-modal>
</template>
<script lang="ts">
import { defineComponent,reactive, toRefs} from 'vue';
import request from "src/api";
import { number } from 'echarts';
interface State{
    columns:any[],
    uploadfile:any;
    data:any
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
                dataIndex: '序号',
                key: 'id',
                slots: { title: 'customTitle' },
                scopedSlots: { customRender: 'name' },
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
                key: 'action',
                scopedSlots: { customRender: 'action' },
            },
            ], 
            data:[
            {
                name: '1',
                age: '的的耳朵',
                address: '简单',
                tags:'10',
                action:'导入成功'
            }
            ],
            uploadfile:null,
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
          state.uploadfile=file
      }
      function detailExerUpload(){
          teacherDataExerApi.detailExerBatchImport({urlParams:{pool_id:props.poolid},param:{csv_file:state.uploadfile}}).then((res:any)=>{
              console.log(res)
          })
      }
      function dowmTemplate(){
          teacherDataExerApi.detailExerDownLoad({urlParams:{pool_id:props.poolid}}).then((res:any)=>{
              console.log(res)
          })
      }
      return {handleOk,handleCancel,closeModal,handleChange,detailExerUpload,dowmTemplate,...toRefs(state)}
  }
})
</script>
<style lang="less" scoped>
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




.opPanel {
  margin-top: 10px;
}
.opPanel .inputBox {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
}




.settingPaperContentBox tbody tr td:first-child {
  text-align: center;
}
.innerBox {
  padding: 20px 10px;
}
.settingPaperContentBoxSystem {
  display: none;
  text-align: center;
}
.settingPaperContentBoxSystem select {
  width: 100px;
}
.settingPaperContentBoxSystem > div {
  padding: 10px 0;
}
.fileUploadBox input[type='text'] {
  width: 125px;
}
.settingPaperContentBoxSystem .spanWidth {
  display: inline-block;
  width: 250px;
  text-align: right;
}
.spanPos {
  position: absolute;
  top: 5px;
  right: -145px;
}
.chooseContentPanel .chooseItemWrap table td {
  padding: 5px;
}
.chooseContentPanel .chooseItemWrap table td input {
  padding: 3px;
}
.chooseContentPanel .pagination {
  margin: 0 auto;
}

</style>