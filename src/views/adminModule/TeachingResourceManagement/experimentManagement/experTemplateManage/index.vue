<template>
    <div>
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
    <a-table
      :columns="columns"
      :data-source="listdata"
      rowKey='id'
      :pagination="
        total > 10
          ? {
              hideOnSinglePage: false,
              showSizeChanger:false,
              total:total,
              current: params.page,
              pageSize: params.limit,
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
    <template #templateName='{record}'>
      <div class="detail" @click="detail(record.id,record.contentAttribute)">
        {{record.templateName}}
      </div>
    </template>
        <template #action="{record}">
            <span class="action action-delete">删除</span>
            <span class="action action-download">
                下载
            </span>
        </template>
    </a-table>
    </div>
</template>
<script lang="ts" setup>
    import { ref, toRefs, onMounted,inject, reactive} from "vue";
    import { message,Modal } from "ant-design-vue";
    import { useRouter, useRoute } from "vue-router";
    import request from "src/api/index";
    const router = useRouter();
    const route = useRoute();
    const ForumSearch:any=reactive({
        name:''
    })
    interface Props {
      listdata: any[]; 
      total:any;
    }
    const props = withDefaults(defineProps<Props>(), {
      listdata: () => [],
      total:()=>{}
    });
    const columns = [
        {
          title: '报告模版名称',
          key: 'templateName',
          dataIndex: 'templateName',
          slots: { customRender: 'templateName' },
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
          width:150,
          key: 'action',
          slots: { customRender: 'action' },
        }
      ];
    const data:any=ref([]) 
    const tableData:any=reactive({})
    const params:any=reactive({
      page:1
    })
        const emit = defineEmits<{
      (e: "updateData", val: any): void;
    }>();
    function search(){
      emit('updateData',{expername:ForumSearch.name,page:1})
    }
    function onChange(page:any,size:any){
        params.page=page
      emit('updateData',{expername:ForumSearch.name,page:params.page})
        
    }
    function onShowSizeChange(){

    }
    function onSelectChange(selectedRowKeys:any, selectedRows:any){
      tableData.selectedRowKeys=selectedRowKeys
    }
    function getCheckboxProps(record: any) {
    return {
      disabled: record.selected,
      defaultChecked: record.selected,
    };
}
function detail(id:any,i:any){
  // const type:any= currentTab=='私有实验'?0:1;
  // router.push("/teacher/teacherExperimentResourcePool/experimentDetail");
  router.push({
    path: "/teacher/teacherExperimentResourcePool/experimentDetail",
    query: {
      id,
      // currentTab:type,
    },
  });

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
        onOk: () => {}
      })
    }
</script>
<style lang="less" scoped>
 .search{
     display: flex;
     justify-content: space-between;
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
        color: rgba(var(--primary-color), 0.5);
    }
 }
 .action-download{
     margin-left:10px;
 }
</style>