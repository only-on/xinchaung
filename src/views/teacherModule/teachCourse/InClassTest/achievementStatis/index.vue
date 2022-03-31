<template>
  <div class="achievement">
    <div class="header">
      <div class="headerLeft">
        <span>已提交<span class="number">20</span>/40人</span>
        <span>最高得<span class="number">100</span>分</span>
        <span>最低得<span class="number">90</span>分</span>
        <span>平均得<span class="number">95</span>分</span>
      </div>
      <div class="headerRight">
        <span>共 <span class="number">4</span>题</span>
        <span>总分 <span class="number">100</span>分</span>
      </div>
    </div>
    <a-table :columns="columns" :data-source="data"> </a-table>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, toRef, inject, PropType, reactive, toRefs } from "vue";
const columns: any = ref("");
const data: any = ref("");
columns.value = [
  { title: "学号", dataIndex: "name", key: "name" },
  {
    title: "姓名",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "班级",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "成绩",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "答错",
    key: "action",
  },
];

data.value = [];
</script>
<style lang="less" scoped>
.achievement {
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .headerLeft > span {
      margin-right: 10px;
    }
    .headerRight > span {
      margin-left: 10px;
    }
    .number {
      color: var(--primary-color);
    }
  }
}
</style>
