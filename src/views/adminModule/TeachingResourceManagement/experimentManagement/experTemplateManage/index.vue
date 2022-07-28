<template>
    <div class="experTemplate">
        <div class="search">
          <div>
            <div class="item custom_input custom_input2">
        <!-- <span style="width:50px">实验名称</span> -->
            <a-input-search 
            style="width:224px"
            v-model:value="ForumSearch.name"
            placeholder="请输入搜索关键字"
            @keyup.enter="search()"
            />
            </div>
          </div>
            <div class="item">
                <!-- <a-button type="primary" @click="search()">查询</a-button>
                <a-button type="primary" @click="clearSearch()">清空</a-button> -->
                <a-button type="primary" @click="batchDelete">批量删除</a-button>
            </div>
    </div>
    <a-spin :spinning="loading" size="large" tip="Loading...">
      <a-config-provider>
        <a-table
        :columns="columns"
        :data-source="listdata"
        rowKey='id'
        :pagination="
          total > 10
            ? {
                hideOnSinglePage: false,
                showSizeChanger:true,
                total:total,
                current: params.page,
                pageSize: params.pageSize,
                onChange: onChange,
                onShowSizeChange: onShowSizeChange,
              }
            : false
        "
        :row-selection="{
          selectedRowKeys: tableData.selectedRowKeys,
          onChange: onSelectChange
        }"
      >
       <!-- getCheckboxProps: getCheckboxProps, -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'templateName'">
           <div class="detail" :title="record.templateName" @click="detail(record.id,record.templateType,record.pdfPath)">
          {{record.templateName}}
        </div>
        </template>
        <template v-if="column.dataIndex === 'action'">
              <div class="flexCenter">
                <a-button type="link" @click="dleDelete(record)" :disabled="record.is_init">删除</a-button>
                <a-button type="link" @click="downLoad(record)" v-if="record.templateType=='离线'">下载</a-button>
              </div>
              <!-- <span class="action action-delete" @click="dleDelete(record)">删除</span> -->
              <!-- <span @click="downLoad(record)" v-if="record.templateType=='离线'" class="action action-download">
                  下载
              </span> -->
          </template>
      </template>
      </a-table>
        <template #renderEmpty>
            <div v-if="listdata?.length==0"><Empty :type="EmptyType" /></div>
        </template>
      </a-config-provider>
    </a-spin>
     <!-- 在线制作 预览实验模板 -->
    <a-modal :destroyOnClose="true" v-model:visible="template.templateVisble" :title="template.reportTitle" class="report" :width="1080" @cancel="cancelTemplate(1)">
      <div class="pdfBox" v-if="template.pdfUrl">
        <PdfVue style="height:550px" :url="template.pdfUrl" />
      </div>
      <viewTemplateShow v-else :id="template.Templateid" />
      <template #footer>
        <span class='closeBtn' @click="cancelTemplate(1)">关闭</span>
      </template>
    </a-modal>
    </div>
</template>
<script lang="ts" setup>
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
    import { ref, toRefs, onMounted,inject, reactive,createVNode, computed} from "vue";
    import PdfVue from "src/components/pdf/pdf.vue";
    import { downloadUrl } from "src/utils/download";
    import CreateTemplate from "src/views/teacherModule/teacherTemplate/createTemplate.vue";
    import viewTemplateShow from "src/components/report/viewTemplate.vue";
    import { message,Modal } from "ant-design-vue";
    import { useRouter, useRoute } from "vue-router";
    import {getFileSuffix} from 'src/utils/getFileType'
    import request from "src/api/index";
    const http1 = (request as any).teacherExperimentResourcePool;
    const http = (request as any).TeachingResourceManagement;
    const router = useRouter();
    const route = useRoute();
    const ForumSearch:any=reactive({
        name:''
    })
    interface Props {
      listdata: any[]; 
      total:any;
      loading:boolean;
    }
    const props = withDefaults(defineProps<Props>(), {
      listdata: () => [],
      total:()=>{},
      loading:false
    });
    const template:any=reactive({
      templateVisble:false,
      reportTitle:'实验模版',
      TemplateEditId:'',
      Templateid:'',
      TemplateViewType:'',
      pdfUrl:''
    })
    const columns = [
        {
          title: '报告模版名称',
          key: 'templateName',
          dataIndex: 'templateName'
        },
        {
          title: '所属人',
          key: 'ownerBy',
          dataIndex: 'ownerBy',
        },
        {
          title: '类型',
          key: 'templateType',
          dataIndex: 'templateType',
        },
        {
          title: '创建时间',
          key: 'createdAt',
          dataIndex: 'createdAt',
        },
        {
          title: '操作',
          // width:120,
          dataIndex: 'action',
          align:'center'
        }
      ];
    const data:any=ref([]) 
    const tableData:any=reactive({})
    const params:any=reactive({
      page:1,
      pageSize:10
    })
        const emit = defineEmits<{
      (e: "updateData", val: any): void;
    }>();
    const EmptyType:any=computed(()=>{
      let str=''
      if(ForumSearch.name == ''){
        str= 'tableEmpty'
      }else{
        str= 'tableSearchEmpty'
      }
      return str
    })
    function search(){
        params.page=1
      emit('updateData',{expername:ForumSearch.name,page:params.page,pageSize:params.pageSize})
    }
    function onChange(page:any,size:any){
      params.page=page
      params.pageSize=size
      emit('updateData',{expername:ForumSearch.name,page:params.page,pageSize:params.pageSize})
        
    }
    function onShowSizeChange(page:any,size:any){
      params.page=1
      params.pageSize=size
      emit('updateData',{expername:ForumSearch.name,page:params.page,pageSize:params.pageSize})
    }
    function onSelectChange(selectedRowKeys:any, selectedRows:any){
      tableData.selectedRowKeys=selectedRowKeys
    }
    const getCheckboxProps=(record: any) => ({
      disabled: record.is_init === true, // Column configuration not to be checked
      name: record.name,
    })
function detail(id:any,type:any,path:any){
  template.pdfUrl=''
  template.Templateid=''
  template.templateVisble=true
  if(type=='在线'){
    template.Templateid=id
    template.reportTitle='在线报告模版'
  }else{
    template.pdfUrl=path
    template.reportTitle='离线报告模版'
  }
}
function downLoad(item:any){
  const name=`${item.templateName}.${getFileSuffix(item.wordPath)}`
  downloadUrl(item.wordPath,name)
}
  // 删除模板
  function dleDelete(item: any){
        Modal.confirm({
          title: "提示",
          icon: createVNode(ExclamationCircleOutlined),
          content: "确定删除实验报告模板?删除后不可恢复",
          okText: "确定",
          cancelText: "取消",
          onOk() {
            http1.deleteTemplate({urlParams: {id: item.id}}).then((res:any) => {
              message.success(`删除成功！`)
              // getTemplateList()
              emit('updateData',{expername:ForumSearch.name,page:params.page,pageSize:params.pageSize})
            })
          },
        });
    };
function batchDelete(){
      if(!tableData.selectedRowKeys?.length){
        message.warning('请至少选择一条数据！')
        return
      }
      Modal.confirm({
        title: "提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: "确定要删除吗？",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          http.experTemplateDelete({param:{template_ids:tableData.selectedRowKeys}}).then((res:any)=>{
            if(res.code){
              emit('updateData',{expername:ForumSearch.name,page:params.page,pageSize:params.pageSize})
              tableData.selectedRowKeys=[]
            }
          })
        }
      })
    }
const cancelTemplate = (val: number) => {
  template.templateVisble=false
}
</script>
<style lang="less" scoped>
 .search{ 
     display: flex;
     justify-content: space-between;
      margin-bottom: 20px;
     >div:nth-child(1){
       display: flex;
       >div{
        margin-right: 20px;
         >span{
             margin-right: 10px;
         }
       }
     }
 }  
 :deep(.ant-input) {
    border-radius: 20px;
 }
 .action{
     color:var(--primary-color);
     cursor: pointer;
    &:hover {
      color:var(--primary-color);
    }
 }
 .action-download{
     margin-left:10px;
 }
 .detail{
   color: var(--primary-color);
   overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis;
 }
 .detail:hover{
   cursor: pointer;
 }
 .experTemplate{
   margin: 20px;
   margin-top: 0px;
 }
 .item>.ant-btn{
   background: var(--brightBtn);
   border-color: var(--brightBtn);
 }
 .closeBtn{
   display: inline-block;
   width:75px;
   height: 34px;
   border-radius:20px;
   background-color: #EEEEEE;
   line-height: 34px;
   margin-top: 15px;
 }
 .closeBtn:hover{
   cursor: pointer;
 }
//  .pdfBox{
//    min-height: 750px;
//    >div{
//      height: 100%;
//    }
//  }
</style>