<template>
  <common-card title="基础信息">
    <template #content>
      <baseInfo ref="baseInfoRef" :type="type" :formState="baseForm"/>
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
             <div class="item">
              <div class="title">知识点</div>
             </div>
             <div class="item">
              <div class="title">难度系数</div>
              <div class="multiSelect">
                <span v-for="(item,index) in difficultyList" :key="index" :class="{'active': activeIndex['difficulty'].includes(item.value)}" @click="changeMultiSelect(item, 'difficulty')">
                  {{item.label}}
                </span>
              </div>
             </div>
             <div class="item">
              <div class="title">作业选择范围</div>
              <div class="multiSelect">
                <span v-for="(item,index) in rangeList" :key="index" :class="{'active': activeIndex['range'].includes(item.value)}" @click="changeMultiSelect(item, 'range')">
                  {{item.label}}
                </span>
              </div>
             </div>
          </a-col>
          <a-col :span="14">
            <div class="title">题目类型及个数设置<span>（试题总数：{{topInfo.num}} 总分：{{topInfo.score}}）</span></div>
            <ul class="randomQuestion">
              <a-form :model="randomQuestion" ref="randomFormRef">
                <li v-for="(item,index) in randomQuestion" :key="index">
                  {{getTopicType[item.type].name}} <span>({{item.num}}道题可选)</span>
                  <a-form-item :name="[index, 'selectNum']" :rules="validateNum">
                    <div>抽取 <a-input type="text" v-model:value="item.selectNum" @blur="handleBlur" :disabled="!item.num"></a-input>道题</div>
                  </a-form-item>
                  <a-form-item :name="[index, 'score']" :rules="validateNum">
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
  <studentTable :data="tableData" :courseId="baseForm.relation[0]" ref="studentTableRef"/>
  <Submit @submit="handleSave" @cancel="cancelSave"></Submit>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, provide, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import CommonCard from "src/components/common/CommonCard.vue";
import baseInfo from "./component/baseInfo.vue";
import questionTable from "./component/questionTable.vue";
import studentTable from "./component/studentTable.vue"
import Submit from "src/components/submit/index.vue";
import getTopicType from "src/components/TopicDisplay/topictype"
import {randomCreatScore} from 'src/utils/common'
import {validateNum} from "./utils"
const route = useRoute();
const router = useRouter()
const type = ref('考试')
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
const studentTableRef = ref()
const baseForm = reactive({
  name: '',
  date: [],
  note: '',
  relation: [0]
})
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
        difficulty: 1,
        score: "5",
      },
      {
        id: 21,
        stu_no: 722742,
        question: "第二题的题目",
        difficulty: 2,
        score: "6",
      },
      {
        id: 31,
        stu_no: 722742,
        question: "第三题的题目",
        difficulty: 3,
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
        difficulty: 1,
        score: "5",
      },
      {
        id: 23,
        stu_no: 722742,
        question: "第二题的题目",
        difficulty: 2,
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
        difficulty: 1,
        score: "5",
      },
      {
        id: 24,
        stu_no: 722742,
        question: "第二题的题目",
        difficulty: 1,
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
  const {selectNum,selectScore}=randomCreatScore(randomQuestion,'selectNum','score')
  console.log(selectNum,selectScore);
  topInfo.num=selectNum
  topInfo.score=selectScore
  
}
// 学生相关
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
}
// 题目范围表单验证
const randomFormRef = ref<any>()
const difficultyList= reactive([
  {
    value: 0,
    label: '简单'
  },
  {
    value: 1,
    label: '适中'
  },
  {
    value: 2,
    label: '困难'
  }
])
const rangeList = reactive([
  {
    value: 0,
    label: '公共题库'
  },
  {
    value: 1,
    label: '我的题库'
  },
])
const activeIndex = reactive({
  difficulty: [0],
  range: [0]
})
const changeMultiSelect = (item:any,type:any) => {
  let subscript = activeIndex[type].indexOf(item.value)
  if (subscript === -1) {
    activeIndex[type].push(item.value)
  } else {
    activeIndex[type].splice(subscript, 1)
  }
}
const randomFormValidate = () => {
  return new Promise((resolve:any)=>{
    randomFormRef.value.validate().then(()=>{
      resolve()
    })
  })
}
const handleSave = async() => {
  console.log(studentTableRef.value.studentIds)
  if (isRandom.value) {
    await randomFormValidate()
  } else {
    await questionTableRef.value.tablefromValidate()
    console.log(questionTableRef.value.listData)
  }
}
const cancelSave = () => {
  router.go(-1)
}
</script>
<style lang="less" scoped>
.random{
  .item{
    margin: 10px 0 30px;
  }
  .multiSelect{
    margin-top: 15px;
    span{
      padding: 8px 27px;
      border-radius: 18px;
      border: 1px solid #DFDFDF;
      margin-right: 10px;
      cursor: pointer;
      &.active{
        color: var(--primary-color);
        background: var(--primary-1);
        border: 1px solid var(--primary-color);
      }
    }
  }
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
      line-height: 32px;
      margin-top: 15px;
        color: var(--black-65);
      >span{
        color: var(--black-25);
      }
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
