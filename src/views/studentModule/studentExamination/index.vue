<template>
    <div>
        <search-add
        @searchFn="searchFn"
        @handleMenuClick="handleMenuClick"
        :TypeList="ExperimentTypeList"
        :isShowAdd="isShowAdd"
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
                            <img :src="unexam">
                            <div class="status_word">{{statusState[item.status-1]}}</div>
                        </div>
                    </div>
                    <div class="card_right_content">
                        <div class="course">{{item.name}}</div>
                        <div class="title">{{item.title}}</div>
                        <div class="time">起止时间:{{item.started_at}}-{{item.closed_at}}</div>
                        <div class="teacher_info">
                            <img src="">
                            <span class="tea_name">{{item.author_name}}</span>
                            <span>
                                <span>提交量:</span>{{item.is_publish}}
                            </span>
                        </div>
                    </div>
                    <div class="card_right_btn">
                        <span v-if="item.status==3" class="lookScore" @click="lookScore">查看成绩</span>
                        <span v-else :class="item.status==2?'notAllow':'answer_ques'" @click="toAnswer">开始考试</span>
                    </div>
                </div>
                <a-pagination :hideOnSinglePage='true' v-model:current="params.page" :pageSize='params.limit' :total="total" />
                <Empty v-if="!cardlist.length && loading===false"/>
            </div>
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
const typeList:any=ref([
    {
        title:'作业状态',value:0,keyName:'type',
        data:[ { "name": "全部", "value":0}, { "id": 35, "name": "未开始", "value":2},{ "id": 35, "name": "进行中", "value":1},{ "id": 35, "name": "已结束", "value":3}]
    }
])
const ExperimentTypeList:any=[]
const isShowAdd:any=ref(false)
const resetKeyword:any=ref(false)
var loading:any=ref(false)
const total:any=ref(0)
const params:any=reactive({
    type:2,
    name:'',
    page:1,
    status:0,
    limit:12,
})
const statusState:any=['进行中','未开始','已结束']
const cardlist:any=ref([])
function classifyChange(obj: any){
    params.status=obj.type
    getExamList()
}
function searchFn(key:any){
    params.name=key
    getExamList()
}
function handleMenuClick(){

}
function toAnswer(){
    router.push({path:'./studentAssignment/answerQues',query:{name:'考试',type:'answer'}})
    sessionStorage.removeItem('examRelastTime')
}
function lookScore(){
      router.push({path:'./studentAssignment/answerQues',query:{name:'考试',type:'lookScore'}})
}
function getExamList(){
    loading.value=true
    http.studentExamList({param:params}).then((res:any)=>{
        loading.value=false
        console.log(res,'哈哈哈哈哈哈嘻嘻嘻嘻休息洗洗休息休息')
        cardlist.value=res.data.list
        total.value=res.data.page.totalCount
    })
}
onMounted(()=>{
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
        display: flex;
        flex-direction: column;
        justify-content:space-between;
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
            .tea_name{
                margin-right: 20px;
            }
        }
    }
    .card_right_btn{
        width:77px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        .answer_ques{
            display: inline-block;
            width: 73px;
            height: 24px;
            background:var(--brightBtn);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 12px;
        }
        .notAllow{
            display: inline-block;
            width: 73px;
            height: 24px;
            background:#f0f3f6;
            color:#b4b6b8;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 12px;
            border: 1px solid #b4b6b8;
            pointer-events:none;
        }
        .answer_ques:hover,.lookScore:hover{
            cursor: pointer;
        }
        .lookScore{
            color:var(--brightBtn);   
        }
    }
}
</style>