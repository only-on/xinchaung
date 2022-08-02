<template>
  <common-card title="学生">
    <template #right>
      <a-button type="primary" @click="batchDel">移除</a-button>
      <a-button type="primary">选择学生</a-button>
    </template>
    <template #content>
      <a-config-provider>
        <a-table
          :columns="columns"
          :data-source="listData"
          row-key="id"
          :row-selection="{ onChange: handleChange }"
          :pagination="false"
        >
          <template v-slot:bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'operation'">
              <a-button type="link" @click="handleDel(record, index)">移除</a-button>
            </template>
          </template>
        </a-table>
        <template #renderEmpty>
          <Empty type="tableEmpty" />
        </template>
      </a-config-provider>
      <Pagination
        v-model:page="pageInfo.page"
        v-model:size="pageInfo.size"
        :total="tableTotal"
        @page-change="pageChange"
      />
    </template>
  </common-card>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import CommonCard from "src/components/common/CommonCard.vue";
import Pagination from "src/components/Pagination.vue";
import { message } from "ant-design-vue";

const props = defineProps({
  data: Array,
  pageInfo: {
    type: Object,
    require: true,
    default: {},
  },
});
const emit = defineEmits<{
  (e: "delete", val: any): void;
  (e: "update:pageInfo", val: any): void;
}>();
var listData = reactive<any>([]); // 表格当前页展示的数据
var allData = reactive<any>([]); // 所有数据
const columns = [
  {
    title: "学号",
    dataIndex: "stu_no",
    key: "stu_no",
  },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "班级",
    dataIndex: "classname",
    key: "classname",
  },
  {
    title: "年级",
    dataIndex: "grade",
    key: "grade",
  },
  {
    title: "专业",
    dataIndex: "major",
    key: "major",
  },
  {
    title: "学院",
    dataIndex: "department",
    key: "department",
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
  },
];
var selectIds = ref<any>([]); // 批量选中的id
const tableTotal = ref();
// 处理分页数据
const getListData = () => {
  listData.length = 0;
  let showData = allData.filter(
    (item: any, index: any) =>
      index < props.pageInfo.page * props.pageInfo.size &&
      index >= props.pageInfo.size * (props.pageInfo.page - 1)
  );
  listData.push(...showData)
};
watch(
  () => props.data,
  (newVal:any) => {
    allData.length = 0;
    allData.push(...newVal)
    getListData();
  },
  { deep: true, immediate: true }
);

watch(
  () => props.pageInfo,
  (newVal) => {
    getListData();
    tableTotal.value = newVal.total;
  },
  { deep: true }
);
const handleChange = (selectedRowKeys: (string | number)[]) => {
  selectIds.value = selectedRowKeys;
};
const handlePage = (index: number) => {
  // 当前点击的下标
  let currentIndex = (props.pageInfo.page - 1) * props.pageInfo.size + index;
  // 当前页第一条数据的下标
  let startInedx = (props.pageInfo.page - 1) * props.pageInfo.size;
  // 当前点击的下标 === 表格的最后一条 并且是当前页的第一条
  if (
    currentIndex === props.pageInfo.total - 1 &&
    currentIndex === startInedx
  ) {
    return props.pageInfo.page === 1 ? 1 : props.pageInfo.page - 1;
  }
};
const handleDel = (record: any, index: any) => {
  // 当前点击的下标
  if (handlePage(index)) {
    props.pageInfo.page = handlePage(index);
  }
  emit("delete", [record.id]);
};
// 批量删除
const batchDel = () => {
  if (!selectIds.value.length) {
    message.warning('请选择要移除的学生')
    return
  }
  emit("delete", selectIds.value);
}
const pageChange = () => {
  emit("update:pageInfo", props.pageInfo);
};
</script>
<style lang="less" scoped>
.ant-table {
  .ant-btn {
    padding-left: 0;
  }
}
.ant-pagination{
  margin-top: 20px;
}
</style>
