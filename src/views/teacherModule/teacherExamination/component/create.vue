<template>
  <common-card title="基础信息">
    <template #content>
      <baseInfo ref="baseInfoRef" :type="type" v-model:formState="baseForm"/>
    </template>
  </common-card>
  <!-- 手动创建 -->
  <questionTable v-if="!isRandom" :data="baseForm.questions_info" ref="questionTableRef"/>
  <!-- 随机创建 -->
  <div v-if="isRandom" class="random">
    <common-card title="题目范围">
      <template #tip>
        <span>可多选</span>
      </template>
      <template #content>
        <a-row>
          <a-col :span="10">
           <!-- knowledgesArr----- {{knowledgesArr.data}} -->
            <div style="width:400px">
              <knowLedge v-model:knowledgePoints="knowledgesArr.data" :maxNum="6" @close="closeKnowledge"/>
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
                  <span class="label">
                    {{getTopicType[item.type].name}} 
                    <span>({{item.num}}道题可选)</span>
                  </span>
                  <a-form-item :name="[index, 'selectNum']" :rules="validateInput">
                    <div>抽取 <a-input type="text" v-model:value="item.selectNum" @blur="handleBlur(item.num)" :disabled="!item.num"></a-input>道题</div>
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
  <studentTable :courseId="baseForm.relation[baseForm.relation.length-1]" ref="studentTableRef" :data="baseForm.students_info"/>
  <Submit @submit="handleSave" @cancel="cancelSave" :loading="saveLoading"></Submit>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, provide, inject, onMounted} from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import CommonCard from "src/components/common/CommonCard.vue";
import baseInfo from "./baseInfo.vue";
import questionTable from "./questionTable.vue";
import studentTable from "./studentTable.vue";
import knowLedge from 'src/components/knowLedge/index.vue'
import Submit from "src/components/submit/index.vue";
import getTopicType from "src/components/TopicDisplay/topictype"
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import {randomCreatScore} from 'src/utils/common'
import {validateNum, formatTime} from "../utils"
import { levelTypeList } from 'src/components/TopicDisplay/configType'
import { json } from "stream/consumers";
interface Props {
  type: number;
}
const props = withDefaults(defineProps<Props>(), {
  type: 1
})
const route = useRoute();
const router = useRouter()
const httpAssignment = (request as any).teacherAssignment;
const httpExam = (request as any).teacherExamination;
const httpObj = {
  // 作业
  1: {
    'add': httpAssignment.addAssignment,
    'detail': httpAssignment.assignmentDetail,
    'questionsMaxLimit': httpAssignment.questionsMaxLimit
  },
  // 考试
  2: {
    'add': httpExam.addExam,
    'detail': httpExam.examDetail,
    'questionsMaxLimit': httpExam.questionsMaxLimit
  }
}
const type = ref(props.type == 1 ? '作业' :'考试')
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const isRandom = ref<boolean>(route.query.type === "manual" ? false : true)
const editId = ref(route.query?.id)
const modelType = ref<any>(props.type)
updata({
  tabs: [
    {
      name: `${isRandom.value ? "随机创建" : editId.value ? `复用${type.value}信息编辑`:"手动创建"}`,
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
const baseForm = reactive<any>({
  name: '',
  date: [],
  note: '',
  relation: [0],
  students_info: [],
  questions_info: []
})
// 随机创建题目相关
const searchInfo = reactive({
  type: modelType.value,
  is_public: '1',
  difficulty: '',
  knowledges: ''
})
const knowledgesArr = reactive<any>({
  data: []
})
const closeKnowledge = () => {
  let arr:any = []
  knowledgesArr.data.forEach((item:any) => {
    arr.push(item[item.length -1])
  })
  searchInfo.knowledges = arr.join()
  getQuestionMaxLimit()
}
watch(()=>knowledgesArr.data, newVal => {
  if(!newVal.length) {
    closeKnowledge()
  }
})
const topInfo = reactive({
  num: 0,
  score: 0
})
const randomQuestion = reactive<any>([])
const currentMaxnum = ref(0)
const handleBlur = (maxNum: number) => {
  currentMaxnum.value = maxNum
  const {selectNum,selectScore}=randomCreatScore(randomQuestion,'selectNum','score')
  topInfo.num=selectNum
  topInfo.score=selectScore
}
const validateInput = reactive(
  {
    validator: async (rule: any, value: string) => {
      let validateor = /^([1-9]{1}[0-9]*|0)$/;
      if (!validateor.test(value)) {
        return Promise.reject("请输入正整数");
      } else if (Number(value) > currentMaxnum.value) {
        return Promise.reject(`最多可选${currentMaxnum.value}道题`);
      }else {
        return Promise.resolve();
      }
  },trigger: "blur",}
)
const randomFormRef = ref<any>()
const difficultyList= reactive<any>([])
const rangeList = reactive([
  {
    value: 1,
    label: '公共题库'
  },
  {
    value: 0,
    label: '我的题库'
  },
])
const activeIndex = reactive<any>({
  difficulty: ['easy'],
  range: [1]
})
const changeMultiSelect = (item:any,type:any) => {
  let subscript = activeIndex[type].indexOf(item.value)
  if (subscript === -1) {
    activeIndex[type].push(item.value)
  } else {
    let data = JSON.parse(JSON.stringify(activeIndex[type]))
    if (data.length === 1) return
    activeIndex[type].splice(subscript, 1)
  }
  getQuestionMaxLimit()
}
// 获取可选择题目的题目数量
const getQuestionMaxLimit = () => {
  searchInfo.is_public = activeIndex.range.join()
  searchInfo.difficulty = activeIndex.difficulty.join()
  randomQuestion.length = 0
  httpObj[modelType.value].questionsMaxLimit({param:searchInfo}).then((res:IBusinessResp) => {
    for (let i in res.data) {
      randomQuestion.push({
        type: i,
        num: res.data[i],
        selectNum: 0,
        score: 0,
      })
    }
  })
}
const randomFormValidate = () => {
  return new Promise((resolve:any)=>{
    randomFormRef.value.validate().then(()=>{
      resolve()
    })
  })
}
const saveLoading = ref<boolean>(false)
const handleSave = async() => {
  console.log(baseForm)
  // 基础信息
  await baseInfoRef.value.fromValidate()
  let params:any = {
    course_id: baseForm.relation.length > 1 ? baseForm.relation[baseForm.relation.length - 1] : '',
    name: baseForm.name,
    started_at: formatTime(baseForm.date[0]),
    closed_at: formatTime(baseForm.date[1]),
    note: baseForm.note
  }
  // 随机创建题目信息
  if (isRandom.value) {
    await randomFormValidate()
    let question_random = {
      ...searchInfo,
      questions: {}
    }
    randomQuestion.forEach((item:any) => {
      question_random.questions[item.type] = {
        number: item.selectNum,
        score: item.score
      }
    })
    Object.assign(params,{question_random: question_random} )
  } else {
    // 手动创建题目信息
    await questionTableRef.value.tablefromValidate()
    Object.assign(params,{question_ids: questionTableRef.value.questions_ids})
  }
  if (isRandom.value && !topInfo.num) {
    message.warning('请选择题目')
    return
  }
  if (!isRandom.value && !params.question_ids.length) {
    message.warning('请选择题目')
    return
  }
  if (!studentTableRef.value.studentIds.length) {
    message.warning('请选择学生')
    return
  }
  // 学生信息
  Object.assign(params,{student_ids: studentTableRef.value.studentIds})
  console.log(params)
  saveLoading.value = true
  httpObj[modelType.value].add({param: params}).then((res:IBusinessResp) => {
    saveLoading.value = false
    message.success(route.query.isCopy ? '复用成功' : '添加成功')
    router.go(-1)
  }).catch(()=>{
    saveLoading.value = false
  })
}
const cancelSave = () => {
  router.go(-1)
}
// 获取详情
const getExamDetail = () => {
  httpObj[modelType.value].detail({urlParams:{ID: editId.value}}).then((res:IBusinessResp) => {
    let result = res?.data
    if(!result) return
    let questionData = []
    if (Object.keys(result.questions_info).length) {
      for (let i  in result.questions_info) {
        questionData.push({
          id: questionData.length,
          type: i,
          data: result.questions_info[i]
        })
      }
    }
    Object.assign(baseForm,{
      name: result.name,
      date: [result.started_at, result.closed_at],
      note: result.note,
      course_id: result.course_id,
      relation: result.course_id ? [1, result.course_direction.name, result.course_info.name] : [0],
      students_info: result.students_info,
      questions_info: questionData
    })
  })
}

onMounted(()=>{
  for (let i in levelTypeList) {
    difficultyList.push(
      {
        value: i,
        label: levelTypeList[i].name
      }
    )
  }
  // 随机创建----获取可选题目的最大数量
  if (isRandom.value) {
    getQuestionMaxLimit()
  }
  if (editId.value) {
    getExamDetail()
  }
})
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
        background: var(--primary-2);
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
      .label{
        display: inline-block;
        width: 150px;
        >span{
          color: var(--black-25);
        }
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
