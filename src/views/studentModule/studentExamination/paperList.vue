<template>
  <div>
    <search-add
      @searchFn="searchFn"
      :isShowAdd="false"
      :isReset="resetKeyword"
    ></search-add>
    <classify :list="typeList" @change="classifyChange"></classify>
    <a-spin :spinning="loading" size="large" tip="Loading...">
      <div class="main_content">
        <div class="cardItem" v-for="(item,index) in cardlist" :key="index">
          <div class="card_left" :style="{background: typeInfo[props.type].bgColor}">
            <div class="label" :style="{backgroundColor: typeInfo[props.type].color}">
              {{typeInfo[props.type].text}}
            </div>
            <div class="status">
              <img :src="typeInfo[props.type].statusImg[item.status-1]">
              <div class="status_word" :style="{color: typeInfo[props.type].color}">{{typeInfo[props.type].statusState[item.status-1]}}</div>
            </div>
          </div>
          <div class="card_right_content">
            <div class="course" :style="{color: typeInfo[props.type].color}">关联课程：{{item.course_id ? item.course_info?.name : '无'}}</div>
            <div class="title">{{item.name}}</div>
            <div class="time">起止时间：{{item.started_at.replace(/-/g, '/').slice(0, 16)}} - {{item.closed_at.replace(/-/g, '/').slice(0, 16)}}</div>
            <div class="teacher_info">
              <div  class="info-left">
                <img :src="item.author.avatar?item.author.avatar:defaultAvatar">
                <span class="tea_name">{{item.user_profile?.name}}</span>
                <span>
                  <span>提交数量：</span>{{ item.submit_count }}/{{ item.questions_count }}
                </span>
              </div>
              <div class="info-right">
                <a-button v-if="item.status==3" @click="lookScore(item)" class="lookScore" type="link" :disabled="!item.can_view_result">查看成绩</a-button>
                <a-button v-else-if="isAssign" type="primary" size="small" @click="toAnswer(item)" :disabled="item.status !==1">答题</a-button>
                <a-button v-else type="primary" size="small" 
                  @click="toAnswer(item)" 
                  :disabled="(item.status !==1 || item.is_submit)"
                  >
                  {{item.is_submit?'已提交':'开始考试'}}
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination v-model:page="params.page" v-model:size="params.limit" :total="total" @page-change="getExamList"/>
      <Empty v-if="!cardlist.length && !loading" :type="EmptyType"/>
    </a-spin>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  toRefs,
  onMounted,
  Ref,
  inject,
  computed,
  reactive,
  watch,
  toRaw,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { Modal, message } from "ant-design-vue";
import classify from "src/components/classify/index.vue";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
import unexam from 'src/assets/images/task/unexam.png'
import examing from 'src/assets/images/task/examing.png'
import examed from 'src/assets/images/task/examed.png'
import unStart from 'src/assets/images/task/unstart.png'
import going from 'src/assets/images/task/going.png'
import over from 'src/assets/images/task/over.png'
import defaultAvatar from 'src/assets/images/user/admin_p.png'
import Pagination from 'src/components/Pagination.vue'
const http = (request as any).studentExamination;
const route = useRoute();
const router = useRouter();
const props = withDefaults(defineProps<{type?: number}>(), {
    type: 2
})
const isAssign = computed(() => {
  return props.type === 1
})
// 1-作业，2-考试
const typeInfo = {
  1: {
    text: '作业',
    statusState: ['进行中','未开始','已结束'],
    statusImg: [going, unStart, over],
    color: '#3094EF',
    bgColor: 'linear-gradient(270deg,#ffffff, #ddefff)'
  },
  2: {
    text: '考试',
    statusState: ['进行中','未开始','已结束'],
    statusImg: [examing, unexam, examed],
    color: '#5E7BE2',
    bgColor: 'linear-gradient(270deg,#ffffff, #deecff)'
  }
}
// 1-进行中;2-未开始;3-已结束
const typeList:any=ref([
  {
    title: (isAssign.value?'作业':'考试')+'状态', value: 0, keyName: 'status',
    data:[ 
      { "name": "全部", "value": 0 },
      { "name": "未开始", "value": 2 },
      { "name": "进行中", "value": 1 },
      { "name": "已结束", "value": 3 }
    ]
  }
])
const obj = reactive({})
console.log(typeList)
console.log(obj)
const resetKeyword:any=ref(false)
var loading:any=ref(false)
const EmptyType:any=computed(()=>{
  let str=''
  if(params.name === '' && params.status === ''){
    str= 'empty'
  }else{
    str= 'searchEmpty'
  }
  return str
})
const params:any=reactive({
  type:props.type,
  name:'',
  page:1,
  limit:12,
  state: 0,
})
const total = ref(0)
const cardlist:any=ref([])
function classifyChange(obj: any){
  Object.assign(params, obj)
  params.page = 1
  getExamList()
}
function searchFn(key: string){
  params.name = key
  params.page = 1
  getExamList()
}
function toAnswer(item:any){
  let path = isAssign.value ? '/student/studentAssignment/AssignmentAnswerques':'/student/studentExamination/Examinationanswerques'
  router.push({
    path: path,
    query: {
      name: typeInfo[props.type].text,
      purpose: 'IsStuAnswer',
      id: item.id,
      examResultId:item.exam_result_id,
      closedAt: item.closed_at   //2022-08-18 22:00:00   item.closed_at
    }
  })
  // router.push({path:'./studentAssignment/answerQues',query:{name:typeInfo[props.type].text,type:'answer'}})
  // sessionStorage.removeItem('examRelastTime')
}
function lookScore(item:any){
  const path = isAssign.value ? '/student/studentAssignment/AssignmentViewResults':'/student/studentExamination/ExaminationViewResults'
  router.push({
    path: path,
    query: {
      name:typeInfo[props.type].text,
      purpose:'achievement',
      id:item.id,
      examResultId:item.exam_result_id,
      uesr:item.user_profile.user_id,
      closedAt:item.closed_at   //2022-08-18 22:00:00   item.closed_at
    }
  })
}
function getExamList(){
  loading.value = true
  http.studentExamList({param:params}).then((res:any)=>{
    loading.value = false
    if (!res) return
    const {list, page} = res.data
    cardlist.value = list
    total.value = page.totalCount
  })
}
onMounted(() => {
  getExamList()
})
</script>
<style lang="less" scoped>
.main_content{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.cardItem{
  width: 49%;
  display: flex;
  background-color: var(--white-100);
  margin-bottom: 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 7%);
  .card_left{
    background:linear-gradient(270deg,#ffffff, #deecff);
    border-radius:10px 0px 0px 0px;
    width: 170px;
    height: 100%;
    display: flex;
    align-items: center;
    .label{
      width:22px;
      height:52px;
      background: #3094ef;
      border-radius: 0px 6px 6px 0px;
      color: white;
      text-align: center;
      margin-right: 20px;
      // writing-mode: vertical-rl;
      font-size: 12px;
      line-height: 16px;
      padding-top: 10px;
    }
    .status{
      text-align: center;
      .status_word{
        color:#5E7BE2;
        margin-top: 4px;
        font-size: 12px;
      }
    }
  }
  .card_right_content{
    padding: 10px;
    // display: flex;
    // flex-direction: column;
    // justify-content:space-between;
    flex:1;
    .course{
      color:#5E7BE2;
      width:300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      line-height: 22px;
      margin-bottom: 4px;
    }
    .title{
      font-size: 16px;  
      line-height: 22px;
      margin-bottom: 8px;
    }
    .time{
      font-size: 12px; 
      color:var(--black-45); 
      margin-bottom: 17px;
    }
    .teacher_info{
      font-size: 14px;
      color:var(--black-45); 
      display: flex;
      justify-content: space-between;
      .tea_name{
        margin-right: 20px;
      }
      .info-left {
        img {
          margin-right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 10px;
        }
      }

      .info-right {
        .lookScore{
          color:var(--brightBtn);   
        }
      }
    }
  }
}
</style>