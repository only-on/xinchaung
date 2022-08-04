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
                          作业
                        </div>
                        <div class="status">
                            <img :src="unStart">
                            <div class="status_word">{{item.status}}</div>
                        </div>
                    </div>
                    <div class="card_right_content">
                        <div class="course">{{item.course}}</div>
                        <div class="title">{{item.title}}</div>
                        <div class="time">起止时间:{{item.time}}</div>
                        <div class="teacher_info">
                            <img src="">
                            <span class="tea_name">{{item.teacher}}</span>
                            <span>
                                <span>提交量:</span>{{item.num}}
                            </span>
                        </div>
                    </div>
                    <div class="card_right_btn">
                        <span v-if="item.status=='进行中'" class="answer_ques" @click="toAnswer">答题</span>
                        <span v-if="item.status=='已结束'" class="lookScore" @click="lookScore">查看成绩</span>
                    </div>
                </div>
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
import unStart from 'src/assets/images/task/unstart.png'
import going from 'src/assets/images/task/going.png'
import over from 'src/assets/images/task/over.png'
const route = useRoute();
const router = useRouter();
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "作业", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav:false,
});
const typeList:any=ref([
    {
        title:'作业状态',value:0,keyName:'type',
        data:[ { "name": "全部", "value": 0 }, { "id": 35, "name": "未开始", "value": "未开始" },{ "id": 35, "name": "进行中", "value": "进行中" },]
    }
])
const ExperimentTypeList:any=[]
const isShowAdd:any=ref(false)
const resetKeyword:any=ref(false)
var loading:any=ref(false)
const cardlist:any=reactive([
    {
    status:'进行中',
    img:'',
    course:'课程名称写在这里课程名称写在这里…',
    title:'端SaaS的核心是放弃一部分个性化需求',
    time:'2022/08/10 15:20 - 2022/08/14 15:20',
    teacher:'空雅轩',
    num:'0/10',
    },
    {
    status:'进行中',
    img:'',
    course:'课程名称写在这里课程名称写在这',
    title:'端SaaS的核心是放弃一部分个性化需求',
    time:'2022/08/10 15:20 - 2022/08/14 15:20',
    teacher:'空雅轩',
    num:'0/10',
    },
    {
    status:'进行中',
    img:'',
    course:'课程名称写在这里课程名称写在这',
    title:'端SaaS的核心是放弃一部分个性化需求',
    time:'2022/08/10 15:20 - 2022/08/14 15:20',
    teacher:'空雅轩',
    num:'0/10',
    },
    {
    status:'已结束',
    img:'',
    course:'课程名称写在这里课程名称写在这',
    title:'端SaaS的核心是放弃一部分个性化需求',
    time:'2022/08/10 15:20 - 2022/08/14 15:20',
    teacher:'空雅轩',
    num:'0/10',
    },
    {
    status:'进行中',
    img:'',
    course:'课程名称写在这里课程名称写在这里哈啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
    title:'端SaaS的核心是放弃一部分个性化需求',
    time:'2022/08/10 15:20 - 2022/08/14 15:20',
    teacher:'空雅轩',
    num:'0/10',
    }
])
function classifyChange(obj: any){
    console.log(obj,'objobj')
    typeList.value.value=obj.type
}
function searchFn(){

}
function handleMenuClick(){

}
function toAnswer(){
    router.push({path:'./studentAssignment/answerQues',query:{name:'作业',type:'answer'}})
    sessionStorage.removeItem('examRelastTime')
}
function lookScore(){
      router.push({path:'./studentAssignment/answerQues',query:{name:'考试',type:'lookScore'}})
}
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
        background:linear-gradient(270deg,#ffffff, #ddefff);
        border-radius:10px 0px 0px 0px;
        width: 170px;
        height: 100%;
        display: flex;
        align-items: center;
        .label{
            width:22px;
            height:52px;
            background-color: #3094EF;
            color: white;
            text-align: center;
            margin-right: 20px;
        }
        .status{
            text-align: center;
           .status_word{
               color:#3094EF;
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
            color:#3094EF;
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
        .answer_ques:hover,.lookScore:hover{
            cursor: pointer;
        }
        .lookScore{
            color:var(--brightBtn);   
        }
    }
}
</style>