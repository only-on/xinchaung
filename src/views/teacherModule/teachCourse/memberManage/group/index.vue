<template>
  <div class="group">
    <div class="header">
      <a-button class="btn1" type="primary">自动分组</a-button>
      <a-button type="primary">手动分组</a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="
        tableData.total > 10
          ? {
              hideOnSinglePage: false,
              showSizeChanger: true,
              total: tableData.total,
              current: tableData.page,
              pageSize: tableData.limit,
              onChange: onChange,
              onShowSizeChange: onShowSizeChange,
            }
          : false
      "
    >
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, reactive } from "vue";
const columns: any = ref();
const data: any = ref([]);
const modalVisable: any = ref(false);
columns.value = [
  {
    title: "小组名称",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "小组人数",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "姓名",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
const tableData: any = reactive({
  total: 0,
  page: 1,
  limit: 10,
});
function handleChange() {}
function onSearch(value: any) {
  console.log(value);
}
function onChange(page: any, pageSize: any) {}
function onShowSizeChange(current: any, size: any) {}
</script>

<style lang="less" scoped>
.header {
  margin-bottom: 20px;
  .btn1 {
    margin-right: 16px;
  }
}
</style>
