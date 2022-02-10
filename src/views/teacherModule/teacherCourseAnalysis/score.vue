<template>
  <a-table 
  :dataSource="dataSource" 
  :columns="columns" 
  :pagination="false" 
  :rowKey="rowKey"
  />
  <!-- :rowKey="recode=>recode.no" -->
</template>
<script lang="ts">
  import { defineComponent, inject, onMounted, reactive, toRefs, ref } from 'vue'
  export default defineComponent({
    props: {
      dataSource: {
        type: Array
      }
    },
    setup(props) {
      const columns = [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            customRender: (record: {index: number}) => {
              return `${record.index+1}`
            },
          },
          {
            title: '学号',
            dataIndex: 'no',
            key: 'no',
          },
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '实验得分',
            dataIndex: 'taskScore',
            key: 'taskScore',
          },
        ]
        function rowKey(record: {}, index: number) {
          console.log(record) 
          return index
        }
      return {
        columns,
        rowKey
      };
    },
  })
</script>

<style lang="less" scoped>
:deep(.ant-table-body) {
  tr {
    td, th {
      border-bottom: 1px solid #e9e9e9;
      color: rgba(0,0,0,0.65);
      font-size: 14px;
    }
    td {
      font-weight: 400;
    }
  }
}
</style>