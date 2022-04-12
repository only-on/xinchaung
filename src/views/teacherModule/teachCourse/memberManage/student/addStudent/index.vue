<template>
  <div class="addstudent">
    <div class="header">
      <div class="header-left">
        <a-form layout="inline">
          <a-form-item label="姓名">
            <a-input></a-input>
          </a-form-item>
          <a-form-item label="班级">
            <a-input></a-input>
          </a-form-item>
          <a-form-item label="专业">
            <a-input></a-input>
          </a-form-item>
        </a-form>
      </div>
      <div class="header-right">
        <a-button type="primary" class="brightBtn" @click="batchImport"
          >批量导入</a-button
        >
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
    <a-modal
      :width="540"
      cancelText="返回"
      :visible="modalVisable"
      @ok="handleOk"
      @cancel="handleCancel"
      :okButtonProps="okButtonProps"
    >
      <template #title>
        <span><span class="icon iconfont icon-fanhui1"></span>批量导入</span>
      </template>
      <div>
        <batchImportStu></batchImportStu>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, reactive } from "vue";
import batchImportStu from "../batchImportStudent/index.vue";
const columns: any = ref();
const data: any = ref([]);
const modalVisable: any = ref(false);
const okButtonProps: any = ref("");
okButtonProps.value = { style: { display: "none" } };
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
    title: "班级",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "专业",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "学院",
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
];
const tableData: any = reactive({
  total: 0,
  page: 1,
  limit: 10,
});
const emit = defineEmits<{ (e: "updateSelectStuVisable", val: any): void }>();

function handleChange() {}
function onSearch(value: any) {
  console.log(value);
}
function onChange(page: any, pageSize: any) {}
function onShowSizeChange(current: any, size: any) {}
function onSelectChange(selectedRowKeys: any) {
  console.log(selectedRowKeys);
}
function batchImport() {
  modalVisable.value = true;
  emit("updateSelectStuVisable", false);
}
function handleOk() {
  modalVisable.value = false;
}
function handleCancel() {
  modalVisable.value = false;
}
</script>

<style lang="less" scoped>
.addstudent {
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}
.icon-fanhui1 {
  color: var(--primary-color);
}
</style>
