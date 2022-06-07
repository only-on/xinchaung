<template>
    <div class="experManage">
        <div class="search">
          <div>
            <div class="item custom_input custom_input2">
        <span style="width:50px">实验名称</span>
        <a-input
          style="width:224px"
          v-model:value="ForumSearch.name"
          placeholder="请输入实验名称关键词搜索"
          @keyup.enter="search()"
        />
      </div>
      <div class="item custom_input custom_input2">
        <span style="width:50px">实验属性</span>
        <!-- <a-input
          style="width:224px"
          v-model:value="ForumSearch.type"
          placeholder="请输入搜索关键词"
          @keyup.enter="search()"
        /> -->
          <a-select
          v-model:value="ForumSearch.attribute"
          placeholder="请选择实验属性"
          @change="search()"
          style="width: 240px; margin-right: 16px"
        >
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="0">私有</a-select-option>
          <a-select-option value="1">公有</a-select-option>
        </a-select>
      </div>
      <div class="item custom_input custom_input2">
        <span style="width:50px">实验类型</span>
        <a-select
          v-model:value="ForumSearch.type"
          placeholder="请选择实验类型"
          @change="search()"
          style="width: 240px; margin-right: 16px"
        >
          <a-select-option v-for="(item,index) in allexperTypes" :value='item.type'>{{item.name}}</a-select-option>
        </a-select>
      </div>
          </div>
      <div class="item">
        <!-- <a-button type="primary" @click="search()">查询</a-button>
        <a-button type="primary" @click="clearSearch()">清空</a-button> -->
        <a-button type="primary" @click="batchDelete">批量删除</a-button>
      </div>
    </div>
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
        onChange: onSelectChange,
        getCheckboxProps: getCheckboxProps,
      }"
    >
    <!-- detail -->
    <template #contentName='{record}'>
      <div class="detail" @click="detail(record,record.contentAttribute)">
        {{record.contentName}}
      </div>
    </template>
    </a-table>
    
    </div>
</template>
<script lang="ts" setup>
import { message,Modal } from "ant-design-vue";
import { ref, toRefs, onMounted,inject, reactive} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
const http = (request as any).TeachingResourceManagement;
const router = useRouter();
const route = useRoute();
const allexperTypes:any=ref([
  {name:'全部',type:''},
  {name:'桌面实验',type:1},
  {name:'命令行实验',type:2},
  {name:'IDE实验',type:3},
  {name:'Jupyter实验',type:4},
  {name:'任务制实验',type:5},
  {name:'视频实验',type:6},
  {name:'文档实验',type:7},
])
    const ForumSearch:any=reactive({
    })
    interface Props {
      listdata: any[]; 
      total:any
    }
    const props = withDefaults(defineProps<Props>(), {
      listdata: () => [],
      total:()=>{}
    });
    const columns = [
        {
          title: '实验名称',
          key: 'contentName',
          dataIndex: 'contentName',
          slots: { customRender: 'contentName' },
        },
        {
          title: '实验属性',
          dataIndex: 'contentAttribute',
        },
        {
          title: '实验所属',
          dataIndex: 'contentGroup',
        },
        {
          title: '实验类型',
          dataIndex: 'contentType',
        },
        {
          title: '所属技术方向',
          dataIndex: 'contentTechnicalDirectionGroup',
        },
        {
          title: '课时',
          dataIndex: 'contentClassesCount',
        },
      ];
    const tableData:any=reactive({})
    const params:any=reactive({
      page:1,
      pageSize:10,
    })
    const emit = defineEmits<{
      (e: "updateData", val: any): void;
    }>();
    function search(){
        emit('updateData',{name:ForumSearch.name,page:1,pageSize:params.pageSize,type:ForumSearch.type,attribute:ForumSearch.attribute})
    }
    function onChange(page:any,size:any){
      params.page=page
      params.pageSize=size
      emit('updateData',{name:ForumSearch.name,page:params.page,pageSize:params.pageSize,type:ForumSearch.type,attribute:ForumSearch.attribute})
      
    }
    function onShowSizeChange(page:any,size:any){
      params.page=1
      params.pageSize=size
      emit('updateData',{name:ForumSearch.name,page:params.page,pageSize:params.pageSize,type:ForumSearch.type,attribute:ForumSearch.attribute})
    }
    function onSelectChange(selectedRowKeys:any, selectedRows:any){
      tableData.selectedRowKeys=selectedRowKeys
    }
    function getCheckboxProps(record: any) {
      return {
        disabled: record.selected,
        defaultChecked: record.selected,
      }
    }
    function batchDelete(){
      if(!tableData.selectedRowKeys?.length){
        message.warning('请至少选择一条数据！')
        return
      }
      Modal.confirm({
        title: "提示",
        content: "确定要删除吗？",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          http.experDelete({param:{content_ids:tableData.selectedRowKeys}}).then((res:any)=>{
            if(res.code){
              message.success('删除成功！')
              emit('updateData',{name:'',page:params.page,type:'',attribute:''})
              tableData.selectedRowKeys=[]
            }
          })
        }
      })
    }
  function detail(val: any,currentTab:any){
  const type:any= currentTab=='私有实验'?0:1;
  // router.push("/teacher/teacherExperimentResourcePool/experimentDetail");
  if(!val.is_authorize){
    message.success('该实验未授权，暂不能查看！')
    return
  }
  router.push({
    path: "/teacher/teacherExperimentResourcePool/experimentDetail",
    query: {
      id:val.id,
    },
  });
};
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
 .custom_input:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector){
   border-radius: 20px;
 }
 .detail{
   color: var(--primary-color);
 }
 .detail:hover{
   cursor: pointer;
   color: var(--primary-color);
 }
 .experManage{
   margin: 20px;
   margin-top:0px;
 }
  .item>.ant-btn{
   background: var(--brightBtn);
   border-color: var(--brightBtn);
 }
</style>