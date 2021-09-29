<template>
    <div class="exerciseDetail" v-layout-bg>
        <div class="exercise">
            <div class="exam-basic">
                <div class="eaxm-basic-left">
                 <div class="titleinfo">
                      <div class="exam-basic-left-title">{{exambasic.name}}</div>
                      <div class="datainfo"><span class="createdate">创建日期:{{exambasic.created_at?.split(' ')[0]}}</span><span>修改日期:{{exambasic.updated_at?.split(' ')[0]}}</span></div>
                 </div>
                <div class="desc">
                    描述
                </div>
            </div>
            <div class="exam-basic-right">
                <watermark-icon title='102个' description="习题个数" background="#5e68DA"/>
            </div>
            </div>
            <div class="exam-descript">
                {{exambasic.description}}
            </div> 
        </div>
        <div class="exam-question-type">
            <a-tabs class="exercise-tab" default-active-key="1" @change="switchExer">
                <a-tab-pane key="1" tab="单选题"></a-tab-pane>
                <a-tab-pane key="2" tab="多选题" force-render></a-tab-pane>
                <a-tab-pane key="3" tab="判断题"></a-tab-pane>
                <a-tab-pane key="4" tab="填空题"></a-tab-pane>
                <a-tab-pane key="5" tab="解答题"></a-tab-pane>
             </a-tabs>
        </div>
        <div class="exam-question-content">
             <!-- <keep-alive>
                <component :is="currentView"></component>
            </keep-alive> -->
            <ques-comon-table @finish-create="finishCreate" :tabledata="tabledata" :selectedId='selectedId' :poolid='poolid'></ques-comon-table>
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
import WatermarkIcon from 'src/components/common/WatermarkIcon.vue';
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
    selectedId:any,
    poolid:number,
    tabledata:any[]
}
export default defineComponent({
    name:'exerciseDetail',
    components: {singleChoice,multipleChoice,judge,fillBlanks,answer,quesComonTable, WatermarkIcon},
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
            selectedId:'1',
            poolid:0,
            tabledata:[]
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
        switchExer(key:any){
              state.selectedId=key
              switch(key){
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
              teacherDataExerApi.getDetailExerciseList({urlParams:{pool_id:id},param:{initial:false,include:'answers'}}).then((res:any)=>{
                  console.log(res)
                  state.tabledata=res.data.list
              })
          },
          finishCreate(val:any){
              methods.exerciseDetailList()
          }
       }
       onMounted(()=>{
           methods.exerciseDetail() 
        //    methods.exerciseType()
           methods.exerciseDetailList()
        const item:any=router.currentRoute.value.query.item
        const id:any=JSON.parse(item).id;
           state.poolid=id
       })
        return {...toRefs(state),...methods}
     }
})
</script>
<style lang="less">
.exerciseDetail{
    color: #777777;
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
.exam-basic{
    display: flex;
    justify-content:space-between;
    border-bottom: 1px solid #B2B2B2;
    padding-bottom: 10px;
    .eaxm-basic-left{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .desc{
            font-weight:500;
        }
    }
    .exam-basic-left-title{
        font-size: 24px;
    }
    .datainfo{
        margin-top: 10px;
        font-size: 14px;
        .createdate{
            display: inline-block;
            margin-right:20px;
        }
    }
}
.exam-descript{
    padding: 18px 0;
}
.exam-question-type .ant-tabs{
    width: 100%;
}
.exercise-tab .ant-tabs-nav .ant-tabs-tab{
    padding: 7px 0px;
    margin-right: 35px;
}
</style>