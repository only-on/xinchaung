<template>
  <div class="group">
    <div class="header">
      <a-button class="btn1" type="primary" @click="autoGroup">自动分组</a-button>
      <a-button type="primary" @click="handGroup">手动分组</a-button>
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
      :width="groupType=='auto'?540:900"
      cancelText="取消"
      okText="分组"
      :visible="modalVisable"
      @ok="handleOk"
      @cancel="handleCancel"
      title="学生分组"
    >
        <autoGroupCom v-if="groupType=='auto'"></autoGroupCom>
        <handGroupCom v-if="groupType=='hand'"></handGroupCom>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted,reactive } from "vue";
import handGroupCom from './handGroupCom/index.vue'
import autoGroupCom from './autoGroupCom/index.vue'
const columns: any = ref();
const data: any = ref([]);
const modalVisable: any = ref(false);
const selectValue: any = ref("");
const number: any = ref("");
const groupType:any=ref('');
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
  groupType.value='auto';
  modalVisable.value = true;
}
function handGroup(){
  groupType.value='hand';
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
