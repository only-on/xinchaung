<template>
    <div>
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
        <span style="width:50px">实验类型</span>
        <a-input
          style="width:224px"
          v-model:value="ForumSearch.type"
          placeholder="请输入搜索关键词"
          @keyup.enter="search()"
        />
      </div>
      <div class="item custom_input custom_input2">
        <span style="width:50px">实验属性</span>
        <a-input
          style="width:224px"
          v-model:value="ForumSearch.nnn"
          placeholder="请输入搜索关键词"
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
    </a-table>
    </div>
</template>
<script lang="ts" setup>
    import { ref, toRefs, onMounted,inject, reactive} from "vue";
    const ForumSearch:any=reactive({
        name:''
    })
    interface Props {
      data: any[]; 
    }
    const props = withDefaults(defineProps<Props>(), {
      data: () => [],
    });
    const columns = [
        {
          title: '实验名称',
          dataIndex: 'name',
          slots: { customRender: 'name' },
        },
        {
          title: '实验属性',
          dataIndex: 'age',
        },
        {
          title: '实验所属',
          dataIndex: 'address',
        },
        {
          title: '实验类型',
          dataIndex: 'address',
        },
        {
          title: '所属技术方向',
          dataIndex: 'address',
        },
        {
          title: '课时',
          dataIndex: 'address',
        },
      ];
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
</style>