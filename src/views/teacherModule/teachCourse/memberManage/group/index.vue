<template>
  <div class="group">
    <div class="header">
      <a-button class="btn1" type="primary" @click="autoGroup">自动分组</a-button>
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
    <a-modal
      :width="540"
      cancelText="取消"
      okText="分组"
      :visible="modalVisable"
      @ok="handleOk"
      @cancel="handleCancel"
      title="学生分组"
    >
      <div>
        <span>分组方式</span>
        <a-select
          class="select"
          v-model:value="selectValue"
          style="width: 120px"
          @focus="focus"
          @change="handleChange"
        >
          <a-select-option value="jack">小组人数</a-select-option>
          <a-select-option value="lucy">小组数</a-select-option>
        </a-select>
        <a-input v-model:value="number" style="width: 265px" />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, reactive } from "vue";
const columns: any = ref();
const data: any = ref([]);
const modalVisable: any = ref(false);
const selectValue: any = ref("");
const number: any = ref("");
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
function focus() {
  console.log("focus");
}
function handleChange(value: string) {
  console.log(`selected ${value}`);
}
function onSearch(value: any) {
  console.log(value);
}
function onChange(page: any, pageSize: any) {}
function onShowSizeChange(current: any, size: any) {}
function autoGroup() {
  modalVisable.value = true;
}
function handleOk() {
  modalVisable.value = false;
}
function handleCancel() {
  modalVisable.value = false;
}
</script>

<style lang="less" scoped>
.header {
  margin-bottom: 20px;
  .btn1 {
    margin-right: 16px;
  }
}
.select {
  margin-left: 10px;
  margin-right: 4px;
}
</style>
