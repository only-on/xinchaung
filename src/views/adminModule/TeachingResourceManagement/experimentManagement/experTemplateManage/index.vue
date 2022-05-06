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
                <a-button type="primary">批量删除</a-button>
            </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      rowKey='id'
      :pagination="
        tableData.total > 10
          ? {
              hideOnSinglePage: false,
              showSizeChanger: true,
              total: tableData.total,
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
    const ForumSearch:any=reactive({
        name:''
    })
    const columns = [
        {
          title: '报告模版名称',
          dataIndex: 'name',
          slots: { customRender: 'name' },
        },
        {
          title: '所属人',
          dataIndex: 'age',
        },
        {
          title: '类型',
          dataIndex: 'address',
        },
        {
          title: '创建时间',
          dataIndex: 'address',
        },
        {
          title: '操作',
          width:150,
          slots: { customRender: 'action' },
        }
      ];
    const data:any=ref([]) 
    const tableData:any=reactive({})
    const params:any=reactive({})
    function search(){

    }
    function onChange(){

    }
    function onShowSizeChange(){

    }
    function onSelectChange(){

    }
    function getCheckboxProps(record: any) {
    return {
      disabled: record.selected,
      defaultChecked: record.selected,
    };
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