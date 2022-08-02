<template>
  <common-card title="基础信息">
    <template #content>
      <baseInfo ref="baseInfoRef"/>
    </template>
  </common-card>
  <questionTable :data="questionData" ref="questionTableRef"/>
  <studentTable :data="tableData" :pageInfo="studentPageInfo" @delete="delStudent"/>
  <Submit @submit="handleSave" @cancel="cancelSave"></Submit>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, provide, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import CommonCard from "src/components/common/CommonCard.vue";
import baseInfo from "./component/baseInfo.vue";
import questionTable from "./component/questionTable.vue";
import studentTable from "./component/studentTable.vue"
import Submit from "src/components/submit/index.vue";
const route = useRoute();
provide("type", "考试");
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    {
      name: `${route.query.type === "manual" ? "手动创建" : "随机创建"}`,
      componenttype: 0,
    },
  ],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const baseInfoRef = ref()
const questionTableRef = ref()
const questionData = ref([
  {
    id: 1,
    type: "choice",
    name: "1选择题",
    num: 3,
    score: 17,
    data: [
      {
        id: 11,
        stu_no: 715293,
        question: "第一题的题目",
        difficulty: "中等",
        score: "5",
      },
      {
        id: 21,
        stu_no: 722742,
        question: "第二题的题目",
        difficulty: "中等",
        score: "6",
      },
      {
        id: 31,
        stu_no: 722742,
        question: "第三题的题目",
        difficulty: "中等",
        score: "6",
      },
    ],
  },
  {
    id: 2,
    type: "complete",
    name: "填空",
    num: 2,
    score: "11",
    data: [
      {
        id: 13,
        stu_no: 715293,
        question: "第一题的题目",
        difficulty: "中等",
        score: "5",
      },
      {
        id: 23,
        stu_no: 722742,
        question: "第二题的题目",
        difficulty: "中等",
        score: "6",
      },
    ],
  },
  {
    id: 3,
    type: "judge",
    name: '判断',
    num: 2,
    score: "11",
    data: [
      {
        id: 14,
        stu_no: 715293,
        question: "第一题的题目",
        difficulty: "中等",
        score: "5",
      },
      {
        id: 24,
        stu_no: 722742,
        question: "第二题的题目",
        difficulty: "中等",
        score: "6",
      },
    ],
  },
]);

const studentPageInfo = reactive({
  page: 1,
  size: 1,
  total: 2
})
const tableData = reactive([
  {
    id: 1,
    stu_no: 1111,
    name: '张三',
    classname: '三年二班',
    grade: '一年级',
    major: '计算机',
    department: '计算机专业'
  },
  {
    id: 2,
    stu_no: 22222,
    name: '里斯',
    classname: '三年二班',
    grade: '一年级',
    major: '计算机',
    department: '计算机专业'
  }
])
const delStudent = (ids:number[]) => {
  tableData.forEach((item:any, index:number) => {
    ids.includes(item.id) && tableData.splice(index,1)
  })
  studentPageInfo.total = tableData.length
}
const handleSave = () => {
  console.log(baseInfoRef.value.formState)
  console.log(questionTableRef.value.listData)
}
const cancelSave = () => {
}
</script>
<style lang="less" scoped></style>
