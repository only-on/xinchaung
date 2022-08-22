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
                    <div class="card_left">
                        <div class="label">
                          考试
                        </div>
                        <div class="status">
                            <img :src="statusImg[item.status-1]">
                            <div class="status_word">{{statusState[item.status-1]}}</div>
                        </div>
                    </div>
                    <div class="card_right_content">
                        <div class="course">关联课程：{{item.course_id ? item.course_info?.name : '无'}}</div>
                        <div class="title">{{item.name}}</div>
                        <div class="time">起止时间：{{item.started_at.replace(/-/g, '/').slice(0, 16)}} - {{item.closed_at.replace(/-/g, '/').slice(0, 16)}}</div>
                        <div class="teacher_info">
                            <div  class="info-left">
                                <img :src="defaultAvatar">
                                <span class="tea_name">{{item.author_name}}</span>
                                <span>
                                    <span>提交量：</span>{{item.is_publish}}
                                </span>
                            </div>
                            <div class="info-right">
                                <span v-if="item.status==3" class="lookScore pointer" @click="lookScore">查看成绩</span>
                                <a-button v-else type="primary" size="small" @click="toAnswer" :disabled="item.status==1">开始考试</a-button>
                                <!-- <span v-else class="answer_ques" @click="toAnswer">开始考试</span> -->
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
import defaultAvatar from 'src/assets/images/user/admin_p.png'
import Pagination from 'src/components/Pagination.vue'
const http = (request as any).studentExamination;
const route = useRoute();
const router = useRouter();
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "考试", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav:false,
});
// 1-进行中;2-未开始;3-已结束
const typeList:any=ref([
    {
        title:'考试状态',value:0,keyName:'status',
        data:[ { "name": "全部", "value": 0 }, { "name": "未开始", "value": 2 }, {  "name": "进行中", "value": 1 }, { "name": "已结束", "value": 3 }]
    }
])
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
    type:2,
    name:'',
    page:1,
    limit:12,
    state: 0,
})
const total = ref(0)
const statusState:any=['进行中','未开始','已结束']
const statusImg:any=[examing, unexam, examed]
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
function toAnswer(){
    router.push({path:'./studentAssignment/answerQues',query:{name:'考试',type:'answer'}})
    sessionStorage.removeItem('examRelastTime')
}
function lookScore(){
      router.push({path:'./studentAssignment/answerQues',query:{name:'考试',type:'lookScore'}})
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
            background-color:#5E7BE2;
            color: white;
            text-align: center;
            margin-right: 20px;
        }
        .status{
            text-align: center;
           .status_word{
               color:#5E7BE2;
               margin-top: 10px;
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