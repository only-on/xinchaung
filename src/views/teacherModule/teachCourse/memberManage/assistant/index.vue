<template>
  <div class="assistant">
    <div class="header">
      <div class="header-left">
        <a-form layout="inline">
          <a-form-item label="账号">
            <a-input></a-input>
          </a-form-item>
          <a-form-item label="姓名">
            <a-input></a-input>
          </a-form-item>
        </a-form>
      </div>
      <div class="header-right">
        <a-button type="primary">移除助教</a-button>
        <a-button type="primary" class="brightBtn right-btn1">添加助教</a-button>
      </div>
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
      :row-selection="{
        selectedRowKeys: tableData.selectedRowKeys,
        onChange: onSelectChange,
      }"
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
    title: "账号",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "姓名",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "性别",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "邮箱",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "电话",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "所属教师",
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
function onSelectChange(selectedRowKeys: any) {
  console.log(selectedRowKeys);
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .right-btn1 {
    margin-left: 16px;
  }
}
</style>
