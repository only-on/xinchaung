<template>
    <div class="exerciseDetail" v-layout-bg>
        <div class="exam-basic">
            <div class="exam-basic-title">
                <div class="title">{{exambasic.name}}</div><div class="edit"><span class="iconfont icon-bianji1"></span><span class="editText">编辑</span></div>
            </div>
             <div class="exam-basic-content">
                <div>题库名称：{{exambasic.name}}</div>
                <div>题库描述：{{exambasic.description}}</div>
            </div>
        </div>
        <div class="exam-question-type">
            <div class="question-type-item" v-bind="{class:selectedId===item.id?'selected':''}" v-for="(item,index) in examtype" :key="index.toString()" @click="switchExer(item.id)"> 
                <div v-if="item.id===1" class="icon icon1"><span class="iconfont icon-danxuan1"></span></div>
                <div v-if="item.id===2" class="icon icon2"><span class="iconfont icon-danxuan1"></span></div>
                <div v-if="item.id===3" class="icon icon3"><span class="iconfont icon-danxuan1"></span></div>
                <div v-if="item.id===4" class="icon icon4"><span class="iconfont icon-danxuan1"></span></div>
                <div v-if="item.id===5" class="icon icon5"><span class="iconfont icon-danxuan1"></span></div>
                <div>
                    <div>{{numExercises(item.id)}}</div>
                    <div>{{item.name}}</div>
                </div>
            </div>
            <!-- <div class="question-type-item"></div> -->
        </div>
        <div class="exam-question-content">
             <!-- <keep-alive>
                <component :is="currentView"></component>
            </keep-alive> -->
            <ques-comon-table :selectedId='selectedId'></ques-comon-table>
        </div>
    </div>
</template>
<script lang="ts">
import { number } from 'echarts';
import {defineComponent,inject,onMounted,reactive,toRefs} from 'vue'
import { useRouter } from 'vue-router';
import request from "../../../api";
import singleChoice from '../components/singleChoice.vue'
import multipleChoice from '../components/multipleChoice.vue'
import judge from '../components/judge.vue'
import fillBlanks from '../components/fillBlanks.vue'
import answer from '../components/answer.vue'
import quesComonTable from '../components/quesComonTable/index.vue'
interface examBasic{
    name:string,
    description:string,
}
interface examType{
    id?:number,
    name?:string,
}
interface quesType{
    type_id:number,
    type_name:string,
    count:number,
}
interface stateData{
    exambasic:examBasic,
    examtype:examType[],
    componentNames:any[],
    currentView:string,
    question_info:quesType[],
    selectedId:number
}
export default defineComponent({
    name:'exerciseDetail',
    components: {singleChoice,multipleChoice,judge,fillBlanks,answer,quesComonTable},
     setup:(props,context)=>{
        const router = useRouter();
        const teacherDataExerApi = (request as any).teacherDataExercises
        var updata=inject('updataNav') as Function
        updata({tabs:[],navPosition:'outside',navType:false,showContent:true,componenttype:0,backOff:true})
        const state:stateData=reactive({
            exambasic:{
                name:'',
                description:''
            },
            examtype:[],
            componentNames:['singleChoice','multipleChoice','judge','fillBlanks','answer'],
            currentView:'singleChoice',
            question_info:[],
            selectedId:1
        })
        const methods = {
          exerciseDetail(){
              const item:any=router.currentRoute.value.query.item
              state.question_info=item.question_info?item.question_info:[]
              const id:any=JSON.parse(item).id;
              teacherDataExerApi.detailExercise({urlParams:{pool_id:id}}).then((res:any)=>{
                  state.exambasic=res.data
              })
          },
          exerciseType(){
              teacherDataExerApi.typeExercise().then((res:any)=>{
                  console.log(res)
                  let arr=res.data
                  arr.sort((a:any, b:any) => {
                    return (a.id + '') > (b.id + '')? 1 : -1;
                })
                state.examtype=arr
              })
          },   
        switchExer(id:any){
              state.selectedId=id
              switch(id){
                  case 1:
                  return state.currentView=state.componentNames[0];
                  case 2:
                  return state.currentView=state.componentNames[1];
                  case 3:
                  return state.currentView=state.componentNames[2];
                  case 4:
                  return state.currentView=state.componentNames[3];
                  case 5:
                  return state.currentView=state.componentNames[4];
              }
          },
          numExercises(id:any){
            let i:any= state.question_info?.findIndex((item)=>{
                return item.type_id===id
            })
            if (i!=-1) {
                return (state.question_info as any)[i].count
            }else{
               return 0
            }
          },
          exerciseDetailList(){
              const item:any=router.currentRoute.value.query.item
              const id:any=JSON.parse(item).id;
              teacherDataExerApi.getDetailExerciseList({urlParams:{pool_id:id}}).then((res:any)=>{
                  console.log(res)
              })
          },
       }
       onMounted(()=>{
           methods.exerciseDetail() 
           methods.exerciseType()
           methods.exerciseDetailList()
       })
        return {...toRefs(state),...methods}
     }
})
</script>
<style lang="less" scoped>
.exerciseDetail{
    .exam-basic-title{
        display: flex;
        justify-content:space-between;
        border-bottom: 1px solid #B2B2B2;
        padding: 10px 0;
        .title{
            font-size: 18px;
            font-weight: 400;
            color: #333333;
            line-height: 24px;
        }
        .edit{
            color: @theme-color;
        }
        .iconfont{
            font-size: 16px;
        }
        .editText{
            font-size: 14px;
            margin-left:5px;
        }
    }
    .exam-basic-content{
        padding: 20px 0;
    }
    .exam-question-type{
        display: flex;
        .selected{
            background-color: #f2f2f2;
        }
        .question-type-item{
        display: flex;
        align-items: center;
        width: 170px;
        height: 60px;
        justify-content: center;
        .iconfont{
            color: white;
        }
        .icon{
            width: 34px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            border-radius: 50%;
            margin-right: 10px;
        }
        .icon1{
            background-color: #38c2eb;
        }
        .icon2{
            background-color: #ff7500;
        }
        .icon3{
            background-color: #06cf63;
        }
        .icon4{
            background-color: #5892ff;
        }
        .icon5{
            background-color: #ffcc2e;
        }
    }
    }
    .question-content-operate{
        display: flex;
        justify-content:space-between;
        padding: 20px 0;
        .question-btn{
            .ant-btn{
                margin-left: 10px;
            }
        }
    }
   
}
</style>