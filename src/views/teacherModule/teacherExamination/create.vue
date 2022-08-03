<template>
  <common-card title="基础信息">
    <template #content>
      <baseInfo ref="baseInfoRef"/>
    </template>
  </common-card>
  <!-- 手动创建 -->
  <questionTable v-if="!isRandom" :data="questionData" ref="questionTableRef"/>
  <!-- 随机创建 -->
  <div v-if="isRandom" class="random">
    <common-card title="题目范围">
      <template #tip>
        <span>可多选</span>
      </template>
      <template #content>
        <a-row>
          <a-col :span="10">
             
          </a-col>
          <a-col :span="14">
            <div class="title">题目类型及个数设置<span>（试题总数：{{topInfo.num}} 总分：{{topInfo.score}}）</span></div>
            <ul class="randomQuestion">
              <a-form :model="randomQuestion" ref="randomFormRef">
                <li v-for="(item,index) in randomQuestion" :key="index">
                  {{getTopicType[item.type].name}} <span>({{item.num}}道题可选)</span>
                  <a-form-item :name="[index, 'selectNum']" rules="">
                    <div>抽取 <a-input type="text" v-model:value="item.selectNum" @blur="handleBlur" :disabled="!item.num"></a-input>道题</div>
                  </a-form-item>
                  <a-form-item :name="[index, 'score']" rules="">
                    <div>每题<a-input type="text" v-model:value="item.score" @blur="handleBlur" :disabled="!item.num"></a-input>分</div>
                  </a-form-item>
                </li>
              </a-form>
            </ul>
          </a-col>
        </a-row>
      </template>
    </common-card>
  </div>
  <!-- 选择学生 -->
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
import getTopicType from "src/components/TopicDisplay/topictype.ts"
const route = useRoute();
const router = useRouter()
provide("type", "考试");
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const isRandom = ref<boolean>(route.query.type === "manual" ? false : true)
updata({
  tabs: [
    {
      name: `${isRandom.value ? "随机创建" : "手动创建"}`,
      componenttype: 0,
    },
  ],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const baseInfoRef = ref()
const questionTableRef = ref()
// 手动创建题目相关
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

// 随机创建题目范围-------
const topInfo = reactive({
  num: 0,
  score: 0
})
const randomQuestion = reactive([
  {
    type: 1,
    num: 10,
    selectNum: 0,
    score: 0,
  },
  {
    type: 2,
    num: 11,
    selectNum: 0,
    score: 0,
  }
])
const handleBlur = () => {
  topInfo.num = 0
  topInfo.score = 0
  randomQuestion.forEach((item:any) => {
    topInfo.num += Number(item.selectNum)
    topInfo.score += Number(item.score) * Number(item.selectNum)
  })
}
// 学生相关
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
// 题目范围表单验证
const randomFormRef = ref<any>()

const handleSave = async() => {
  await questionTableRef.value.tablefromValidate()
  console.log(baseInfoRef.value.formState)
  console.log(questionTableRef.value.listData)
}
const cancelSave = () => {
  router.go(-1)
}
</script>
<style lang="less" scoped>
.random{
  .title{
    position: relative;
    &::before{
      display: block;
      content: '*';
      position: absolute;
      left: -7px;
      top: -3px;
      color: var(--red-6);
      font-size: 20px;
    }
    span{
      color: #1CB2B3;
    }
  }
  .randomQuestion{
    li{
      display: flex;
      align-items: center;
      margin-top: 15px;
      >div{
        margin: 0 20px;
        &:first-of-type{
          margin-left: 40px;
        }
        .ant-input{
          width: 100px;
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
