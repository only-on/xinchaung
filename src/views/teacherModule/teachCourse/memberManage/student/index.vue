<template>
  <div class="student">
    <div class="header">
      <div class="header-left">
        <div class="header-left-select">
          <span class="lableclass">班级</span>
          <a-select default-value="全部" style="width: 224px" @change="handleChange">
            <a-select-option v-for="item in option" :key="item.id"
              >{{ item.name }}
            </a-select-option>
          </a-select>
        </div>
        <a-input-search
          placeholder="请输入搜索关键字"
          style="width: 254px"
          @search="onSearch"
        />
      </div>
      <div class="header-right">
        <a-button type="primary">移除学生</a-button>
        <a-button class="brightBtn" type="primary" @click="addStudent">添加学生</a-button>
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
      :width="1200"
      cancelText="取消"
      okText="确定"
      title="添加学生"
      :visible="modalVisable"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div>
        <addstudent></addstudent>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, reactive } from "vue";
import addstudent from "./addStudent/index.vue";

const option: any = ref();
option.value = [
  { id: "", name: "全部" },
  { id: 1, name: "班级1" },
  { id: 2, name: "班级2" },
  { id: 3, name: "班级3" },
];
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
function addStudent() {
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
.student {
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .header-left {
      display: flex;
      :deep(.ant-select-selector) {
        height: 34px;
      }
      .header-left-select {
        margin-right: 20px;
        .lableclass {
          margin-right: 10px;
        }
      }
    }
    .header-right {
      .brightBtn {
        margin-left: 20px;
      }
    }
  }
}
</style>
