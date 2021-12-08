<template>
  <a-config-provider>
    <a-table :columns="columns" :data-source="data">
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
    </a-table>
    <template #renderEmpty>
      <div><empty type="tableEmpty"></empty></div>
    </template>
  </a-config-provider>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Empty from "src/components/Empty.vue";
const columns = [
  {
    title: "学号",
    dataIndex: "name",
  },
  {
    title: "姓名",
    dataIndex: "age",
  },
  {
    title: "性别",
    dataIndex: "address",
  },
  {
    title: "院系",
    dataIndex: "address",
  },
  {
    title: "班级",
    dataIndex: "address",
  },
];

const data: any = [];

export default defineComponent({
  components: { Empty },
  setup() {
    return {
      data,
      columns,
    };
  },
});
</script>
