<template>
  <div v-layout-bg class="Achievement setScrollbar">
    <div class="row">
      <div class="row12" v-if="detaile && detaile.id">
        <div class="box box1">
          <div class="top-info flexCenter">
            <div class="title">{{detaile.name}}</div>
            <div>考试时间：{{started_at}} ~ {{closed_at}}</div>
          </div>
          <div class="flexCenter content">
            <div class="score-block">
              <span>总分</span>
              <strong>{{detaile.all_score}}</strong>
            </div>
            <div class="exam-details-info flexCenter">
              <div class="item">
                <strong>{{detaile.questions_count}}</strong>
                <div>试题</div>
              </div>
              <div class="item">
                <strong>{{detaile.pass_score}}</strong>
                <div>及格线</div>
              </div>
              <div class="item">
                <strong>{{hour_long}}</strong>
                <div>考试时长</div>
              </div>
              <div class="item">
                <strong>{{detaile.student_total}}</strong>
                <div>考试人数</div>
              </div>
              <div class="item">
                <strong class="huang">{{detaile.pass_rate*100}}%</strong>
                <div>及格率</div>
              </div>
              <div class="item ">
                <strong class="hong">{{detaile.highest_score}}</strong>
                <div>最高分</div>
              </div>
              <div class="item ">
                <strong class="lv">{{detaile.lowest_score}}</strong>
                <div>最低分</div>
              </div>
              <div class="item ">
                <strong class="lan">{{detaile.average_score}}</strong>
                <div>平均分</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row flexCenter chat-section">
      <div class="row6">
        <div class="box" id="distribution"></div>
      </div>
      <div class="row6">
        <div class="box" id="TypeStatistics"></div>
      </div>
    </div>
    <div class="row flexCenter correctRate">
      <div class="row12">
        <div class="box">
          <p class="subtitle">各试题正确率</p>
          <div>
            <div class="search">
                <div class="item custom_input">
                  <a-input-search v-model:value="ForumSearch.question" placeholder="请输入题目名称" @search="search" />
                </div>
                <div  class="item custom_select">
                    <a-select v-model:value="ForumSearch.type_id"  placeholder="请选择试题类型" :options="options"></a-select>
                </div>
                <div class="item">
                  <a-button type="primary" @click="search()">查询</a-button>
                  <a-button type="primary" @click="clearSearch()">清空</a-button>
                </div>
            </div>
            <a-config-provider :renderEmpty="customizeRenderEmpty">
              <a-table :columns="columns" :loading="loading" :data-source="list" :bordered="true"  row-key="id"
                :pagination="{pageSize:ForumSearch.limit,total:total,onChange:onChangePage,hideOnSinglePage:true}" 
                class="components-table-demo-nested">
              </a-table>
            </a-config-provider>
          </div>
        </div>
      </div>
    </div>
    <div class="row flexCenter achievementExport">
      <div class="row12">
        <div class="box">
          <p class="subtitle">学生成绩</p>
          <div>
            <div class="search export">
                <div class="item custom_input">
                  <a-input-search v-model:value="exportSearch.username" placeholder="请输入学生姓名关键字查询" @search="studentSearch" />
                </div>
                <a-button type="primary" @click="achievementExport()">成绩导出</a-button>
            </div>
            <a-config-provider :renderEmpty="exportRenderEmpty">
              <a-table :columns="exportcolumns" :loading="exportloading" :data-source="exportList" :bordered="true"  row-key="id"
                :pagination="{pageSize:exportSearch.limit,total:exportTotal,onChange:exportChangePage,hideOnSinglePage:true}" 
                class="components-table-demo-nested">
                <template #result="{record }">
                  <span :class="record.exam_result?'pass':'nopass'">{{record.exam_result?'及格':'不及格'}}</span>
                </template>
                <template #detaile="{record}">
                  <a  class="caozuo" @click="see(record.id)">查看</a>
                </template>
              </a-table>
            </a-config-provider>
          </div>
        </div>
      </div>
    </div>
  </div>
  <a-modal v-model:visible="Visible" title="成绩明细" :width="1413" class="modal-post" :destroyOnClose="true">
    <div class="info-box">
      <div class="base-info">
        <div class="top-info-item portrait">
          <div class="photo">
            <img :src="scoreDate.avatar?scoreDate.avatar:imgUrl" alt="个人头像">
          </div>
          <div class="student-cont-info">
            <span>账户：{{scoreDate.account}}</span>
            <span>名字：{{scoreDate.name}}</span>
          </div>
        </div>
        <div class="top-info-item">
          <i class="iconfont icon-kongshuju"></i>
          <div class="student-cont-info">
            <span>成绩</span>
            <span class="score">{{scoreDate.score}}<span>分</span></span>
          </div>
        </div>
        <div class="top-info-item">
          <i class="iconfont icon-shijian1"></i>
          <div class="student-cont-info">
            <span>考试用时</span>
            <span class="score">{{scoreDate.spend_time}}<span>分钟</span></span>
          </div>
        </div>
        <div class="top-info-item">
          <i class="iconfont icon-paiming"></i>
          <div class="student-cont-info">
            <span>班级排名</span>
            <span class="score">{{scoreDate.class_rank}}<span>名</span></span>
          </div>
        </div>
      </div>
      <div class="chart-info-cont">
        <div class="chart">
          <div class="border-title">成绩详情</div>
          <div id="gradeCanvas"></div>
        </div>
        <div class="chart">
          <div class="border-title">正确率</div>
          <div id="accuracyCanvas"></div>
        </div>
      </div>
      <div class="answer-info-cont">
        <div class="border-title">答案详情</div>
        <div class="question-index-cont setScrollbar">
          <span :class="['bg-greay','bg-pink','bg-truth'][v.answerState]" v-for="(v,k) in scoreDate.question_info" :key="v" @click="activeQuestion=Number(k)">{{Number(k)+1}}</span>
          <!-- <span class="bg-greay" v-for="v in 1" :key="v">2</span>
          <span class="bg-pink" v-for="v in 1" :key="v">2</span>
          <span class="bg-truth" v-for="v in 1" :key="v">3</span> -->
        </div>
        <div class="answer-info" v-if="scoreDate.question_info && scoreDate.question_info.length">
          <div class="top">
            <div class="title">{{`${activeQuestion+1}、${scoreDate.question_info[activeQuestion].question}`}}</div>
            <div class="legend ">
              <span><i class="legend-icon bg-truth"></i>正确</span>
              <span><i class="legend-icon bg-pink"></i>错误</span>
              <span><i class="legend-icon bg-greay"></i>空</span>
            </div>
          </div>
          <div class="chooseList" v-if="[1,2,3].includes(scoreDate.question_info[activeQuestion].type_id)">
            <div v-if="[1,2].includes(scoreDate.question_info[activeQuestion].type_id)">
              <div class="choose-span" v-for="(i,k) in scoreDate.question_info[activeQuestion].options" :key="i">{{`${AlphabeticOptions[Number(k)]}、${i.option}`}}</div>
              <!-- <div class="choose-span">B、选项一</div>
              <div class="choose-span">C、选项一</div>
              <div class="choose-span">D、选项一</div> -->
            </div>
            <div v-if="scoreDate.question_info[activeQuestion].type_id===3">
              <div class="choose-span" v-for="(i,k) in scoreDate.question_info[activeQuestion].options" :key="Number(k)">{{`${i.option}`}}</div>
              <!-- <div class="choose-span">错误</div> -->
            </div>
          </div>
          <div class="stu-answer" :class="['','error','correct'][scoreDate.question_info[activeQuestion].answerState]"> {{scoreDate.question_info[activeQuestion].wrongAnswer}} </div>
          <div class="stand-answer">标准答案：{{scoreDate.question_info[activeQuestion].standardAnswer}}</div>
        </div>
      </div>
    </div>
    <template #footer>
      <span></span>
    </template>
  </a-modal>
</template>
<script lang="tsx">
import { SelectTypes } from 'ant-design-vue/es/select';
import { defineComponent,ref, onMounted,reactive,Ref,inject, computed,toRefs,VNode,nextTick } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { Modal,message } from 'ant-design-vue';
import { distributionEcharts ,typeStatisticsEcharts,renderScoreBar,renderAccuracy} from "./echartsOption/index";
import imgUrl from '/src/assets/images/teacherExam/student.png'
interface ItdItems{
  title:string,
  type:string,
  creat:string,
  replyViews:string,
  reply:string,
  id:number,
}
interface Istate{
  activeQuestion:number;
  loading:boolean;
  ForumSearch:any;
  list:ItdItems[];
  total:number;
  exportList:any[]
  onChangePage: (v:number) => void;
  search: () => void;
  clearSearch: () => void;
  exportSearch:any;
  exportloading:boolean;
  achievementExport: () => void;
  exportTotal:number;
  exportChangePage: (v:number) => void;
  studentSearch: () => void;
  see: (v:number) => void;
  Visible:boolean;
  detaile:any;
  hour_long:number;
  started_at:string;
  closed_at:string;
  examName:string;
  scoreDate:any;
  AlphabeticOptions:any[]
}
const columns=[
  {
    title: '题目',
    dataIndex:"option",
    align:'center',
    width:460,
  },
  {
    title: '类型',
    dataIndex:"type_name",
    align:'center',
    // width:260,
  },
  {
    title: '正确人数',
    dataIndex:"correct_count",
    align:'center',
    // width:260,
  },
  {
    title: '正确率',
    dataIndex:"correct_rete",
    align:'center',
    // width:260,
  },
]
const exportcolumns=[
  {
    title: '学号',
    dataIndex:"username",
    align:'center',
    // width:260,
  },
  {
    title: '姓名',
    dataIndex:"name",
    align:'center',
    // width:260,
  },
  {
    title: '班级',
    dataIndex:"class_name",
    align:'center',
    // width:260,
  },
  {
    title: '考试时长',
    dataIndex:"spend_times",
    align:'center',
    // width:260,
  },
  {
    title: '成绩',
    dataIndex:"score",
    align:'center',
    // width:260,
  },
  {
    title: '考试结果',
    dataIndex:"exam_result",
    align:'center',
    slots: { customRender: 'result' },
    // width:260,
  },
  {
    title: '考试详情',
    dataIndex:"detaile",
    align:'center',
    // width:260,
    slots: { customRender: 'detaile' },
  },
]
export default defineComponent({
  name: '',
  components: {
    // dan
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const {Id}= route.query
    const http=(request as any).teacherExam
    var updata=inject('updataNav') as Function
    updata({showContent:false,navType:false,tabs:[],navPosition:'outside',backOff:true})
    async function  initData(){
      await http.getExaminationDetail({urlParams: {exam_id: Id}}).then((res:IBusinessResp)=>{
          // let data=res.data
          state.detaile=res.data.analysis
          state.hour_long=res.data.hour_long
          state.started_at=res.data.started_at
          state.closed_at=res.data.closed_at
          state.examName=res.data.name
        // console.log(state.formState)  examName
      })
    }
    // 各试题正确率
    function CorrectRate(){
      http.CorrectRate({urlParams: {exam_id: Id},param:{...state.ForumSearch}}).then((res:IBusinessResp)=>{
        state.list=res.data.list
        state.total=res.data.page.totalCount
        let list=  [{value: 1, label: '选择题'},{value: 2, label: '判断题'},{value: 3, label: '填空题'},{value: 4, label: '简答题'},{value: 5, label: '实操考核题'}]
        state.list.length?state.list.map((v:any)=>{
          v.type_name=list[v.type].label
          v.correct_rete=`${(v.correct_rete*100).toFixed(0)}%`
        }):''
      })
    }
    // 学生成绩 ×
    function achievement(){
      http.achievement({urlParams: {exam_id: Id},param:{...state.exportSearch}}).then((res:IBusinessResp)=>{
        state.exportList=res.data.list
        state.exportTotal=res.data.page.totalCount
      })
    }
    const options = ref<SelectTypes['options']>([{value: 1, label: '选择题'},{value: 2, label: '判断题'},{value: 3, label: '填空题'},{value: 4, label: '简答题'},{value: 5, label: '实操考核题'}])
    const state:Istate=reactive({
      activeQuestion:0,        // 当前展示的题目详情下标
      scoreDate:{
        question_info:[]
      },
      detaile:{},
      loading:false,
      ForumSearch:{
        question:'',
        type_id:undefined,
        page:1,
        limit:5
      },
      list:[],
      total:0,
      hour_long:0,
      started_at:'',
      closed_at:'',
      examName:'',
      onChangePage:(val:number)=>{
        state.ForumSearch.page=val
        CorrectRate()
      },
      search:()=>{
        // if(state.ForumSearch.question!=='' || state.ForumSearch.type_id!==undefined){
          state.ForumSearch.page=1
          CorrectRate()
        // }
      },
      clearSearch:()=>{
        if(state.ForumSearch.question || state.ForumSearch.type_id){
          state.ForumSearch.question=''
          state.ForumSearch.type_id=undefined
          state.ForumSearch.page=1
          CorrectRate()
        }
      },
      exportList:[],
      exportSearch:{
        page:1,
        limit:5,
        username:'',
      },
      studentSearch:()=>{
        // if(state.exportSearch.username!==''){
          state.exportSearch.page=1
          achievement()
        // }
      },
      exportloading:false,
      exportTotal:0,
      achievementExport:()=>{
        // http.achievementExport({param:{exam_id: Id}}).then((res:IBusinessResp)=>{

        // })
        const dev_base_url=(window as any).proxy_api
        let url=`${dev_base_url}/api/v1/question/exams/student-exam-score/export?exam_id=${Id}`
        fetch(url,{
            method: 'get',
        }).then((res:any) => {    
          //  const contentType = res.headers.get("content-disposition");
          //   console.log(contentType) 
            return res.arrayBuffer();
        }).then(arraybuffer => {
            let blob = new Blob([arraybuffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            let fileName = `${state.examName}学生成绩.xlsx`;
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
        })
      },
      exportChangePage:(val:number)=>{
        state.exportSearch.page=val
        achievement()
      },
      Visible:false,
      see:(id:number)=>{
        state.Visible=true
        http.scoreDetails({urlParams: {exam_id: Id,student_id:id}}).then((res:IBusinessResp)=>{
          // question_info
          let data=res.data
          data.question_info.length?data.question_info.map((v:any)=>{
            //  lajihouduan      answer_is_right=null 答案空   answer_is_right=false答错   answer_is_right=true 对
            if(v.answer_is_right===null){
              v.answerState=0
            }else{
              v.answerState=v.answer_is_right===false?1:2
            }
            // 错误答案
            v.wrongAnswer=''
            // 处理题目标准答案展示
            v.standardAnswer=''
            if([1,2,3].includes(v.type_id!)){
              let standardArr=v.answers.reduce((previous:any, current:any) => {
                previous.indexOf(current)===-1 && previous.push(current.answer)
                return previous
              }, [])
              let wrongArr=v.student_answer.length?v.student_answer.reduce((previous:any, current:any) => {
                previous.indexOf(current)===-1 && previous.push(current.answer)
                return previous
              }, []):[]

              v.options.forEach((i:any,k:number)=>{
                if(standardArr.includes(String(i.id))){
                  if(v.type_id===3){
                    v.standardAnswer=i.option
                  }else{
                    v.standardAnswer+=`${state.AlphabeticOptions[k]}、`
                  }
                }
                if(wrongArr.includes(String(i.id))){
                  if(v.type_id===3){
                    v.wrongAnswer=i.option
                  }else{
                    v.wrongAnswer+=`${state.AlphabeticOptions[k]}、`
                  }
                }
              })
            }else{
              v.standardAnswer=v.answers.reduce((previous:any, current:any) => {
                previous.indexOf(current)===-1 && previous.push(current.answer)
                return previous
              }, []).join('、')
              v.wrongAnswer=v.student_answer?v.student_answer.reduce((previous:any, current:any) => {
                previous.indexOf(current)===-1 && previous.push(current.answer)
                return previous
              }, []).join('、'):''
            }
            if(v.answerState===0){
                v.wrongAnswer=`提示：未作答`
             }else{
               let str=v.answerState===1?'回答错误':'回答正确'
               v.wrongAnswer=`${str}：${v.wrongAnswer}`
             }
          }):''
          // console.log(data.question_info)
          state.scoreDate=data
          // console.log(state.scoreDate.question_info)  standardAnswer
          nextTick(()=>{
            // console.log(document.getElementById("gradeCanvas"))
            renderScoreBar(document.getElementById("gradeCanvas") as HTMLDivElement,state.scoreDate.score_info)
            renderAccuracy(document.getElementById("accuracyCanvas") as HTMLDivElement,state.scoreDate.rate_info)
          })
        })
      },
      AlphabeticOptions:['A','B','C','D','E','F','G','H','I','J','K']
    })
   
    onMounted(async ()=>{
     CorrectRate()
     achievement()
     await initData();
    //  console.log(document.getElementById("distribution"))
     distributionEcharts(document.getElementById("distribution") as HTMLDivElement,state.detaile.score_distribution)
     typeStatisticsEcharts(document.getElementById("TypeStatistics") as HTMLDivElement,state.detaile.type_scores)
    })
    const customizeRenderEmpty =function (): VNode{
      if(state.loading){
        return <template></template>
      }else{
        let type=(state.ForumSearch.question || state.ForumSearch.type_id!==undefined)?'tableSearchEmpty':'tableEmpty'
        return <empty type={type} height={100} />
      }
    }
    const exportRenderEmpty =function (): VNode{
      if(state.exportloading){
        return <template></template>
      }else{
        let type=(state.exportSearch.question)?'tableSearchEmpty':'tableEmpty'
        return <empty type={type} height={100} />
      }
    }
    return {...toRefs(state),imgUrl,customizeRenderEmpty,exportRenderEmpty,columns,options,exportcolumns};
  },
})
</script>
<style  scoped lang="less">
.Achievement{
  width: @center-width;
  background-color: #edf0f5;
  margin: 0 auto;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .row{
    margin-right: -11px;
    margin-left: -10px;
    // padding: 0 15px;
    .row12,.row6{
      padding-right: 15px;
      padding-left: 15px;
    }
    .row12{
      width: 100%;
    }
    .row6{
      width: 50%;
    }
  }
}
.box{
  margin-bottom: 20px;
  padding: 20px 40px;
  box-shadow: 0 0 5px rgb(0 0 0 / 10%);
  border-radius: 10px;
}
.flexCenter{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.subtitle {
    font-size: 16px;
    font-weight: bold;
    color: rgba(89, 91, 90, 1);
    margin-bottom: 14px;
}
.box1{
  .top-info{
    font-size: 16px;
    line-height: 36px;
    padding-bottom: 10px;
    color: rgba(89, 91, 90, 1);
    .title{
      font-weight: bold;
    }
  }
  .content{
    height: 164px;
    .score-block{
      width: 377px;
      height: 100%;
      background: linear-gradient(0deg, rgb(146, 79, 202) 0%, rgb(170, 139, 255)100%);
      border-radius: 8px;
      position: relative;
      span{
        font-size: 18px;
        color: rgba(255, 255, 255, 1);
        display: block;
        position: absolute;
        top: 56px;
        left: 47px;
      }
      strong{
        font-size: 48px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        display: block;
        position: absolute;
        top: 82px;
        left: 47px;
      }
      &::after{
        content: '';
        display: block;
        width: 150px;
        height: 127px;
        // background: url(/images/exam-bg-score.png) no-repeat;
        background: url(src/assets/images/teacherExam/exam-bg-score.png) no-repeat;
        background-size: 90% 90%;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    .exam-details-info{
      flex: 1;
      flex-wrap: wrap;
      height: 100%;
      .item{
        width: 25%;
        height: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-right: 1px solid rgba(236, 236, 236, 1);
        text-align: center;
        strong{
          font-size: 30px;
          font-weight: 400;
          color: rgba(125, 125, 125, 1);
          line-height: 30px;
          height: 30px;
        }
        div{
          font-size: 18px;
          color: rgba(125, 125, 125, 1);
          line-height: 24px;
        }
        .huang{
          color: #FFC000;
        }
        .hong{
          color: #FF6766;
        }
        .lv{
          color: #00C99A;
        }
        .lan{
          color: #0E9CFF;
        }
      }
    }
  }
}
.chat-section{
  .box{
    height: 320px;
  }
}
// .correctRate{
  .search{
        flex: 1;
        display: flex;
        align-items: center;
        .item{
          display: flex;
          align-items: center;
          margin-right: 22px;
          :deep(.ant-select-selector){
            width: 240px;
            height: 35px;
            padding-left: 30px;
            align-items: center;
          }
          :deep(.ant-input){
              padding-left: 20px;
          }
        }
        .item:last-child{
          .ant-btn{
            margin: 0 10px;
          }
        } 
        
        .custom_select{
          :deep(.ant-select-selector)::before{
            content: '';
            position: absolute;
            left:8px;
            top:10px;
            background: url(src/assets/images/screenicon/Group3.png) no-repeat;
            width: 14px;
            height: 15px;
          }
        }
        .custom_input{
          position: relative;
          &::before{
              content: '';
              position: absolute;
              left:8px;
              top:10px;
              background: url(src/assets/images/screenicon/Group6.png) no-repeat;
              width: 16px;
              height: 16px;
              z-index: 10;
          }
        }
  }
// }
.achievementExport{
  .export{
    // display: flex;
    // align-items: center;
    justify-content: space-between;
    .item{
      width: 600px;
    }
  }
  .nopass{
    color: #FF6766;
  }
}
.modal-post{
  
  .info-box{
    padding: 11px 46px;
    min-height: 800px;
  }
  .base-info{
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .top-info-item{
      display: flex;
      width: max-content;
      // height: 70px;
      background: rgba(220, 230, 228, .5);
      justify-content: center;
      i{
        font-size: 40px;
        color: #C3CBD9;
      }
      .student-cont-info{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-left: 16px;
        color: #595B5A;
        font-size: 16px;
        .score{
          font-size: 24px;
          color: #FB767A;
          span{
             font-size: 16px;
             color: #595B5A;
          }
        }
      }
    }
    .portrait{
      .photo{
        width: 89px;
        height: 89px;
        // background: url(src/assets/images/teacherExam/student.png) no-repeat;
        // background-size: 100% 100%;
        img{
          width: 89px;
          height: 89px;
        }
      }
    }
    
  }
  .chart-info-cont{
    display: flex;
    justify-content: space-between;
    &>div{
      width: 49%;
      #gradeCanvas,#accuracyCanvas{
        width: 100%;
        height: 280px;
      }
    }
  }
}
.border-title{
  font-size: 15px;
  color: rgba(108, 110, 114, 1);
  border-left: 4px solid rgba(108, 110, 114, 1);
  text-indent: 10px;
  margin-bottom: 20px;
  &::after{
    content: '';
    width: 100%;
    height: 1px;
    margin-top: 4px;
    background-color: rgba(207, 213, 223, 1);
    display: block;
    transform: translate(-5px, 10px);
  }
}
.bg-truth {
  background: @theme-color;
}

.bg-pink {
  background: rgba(251,118,122,1);
}

.bg-greay {
  background: rgba(195,203,217,1);
}
.answer-info-cont{
  padding-top: 16px;
  .question-index-cont{
    width: 100%;
    overflow: auto;
    display: flex;
    padding-bottom: 9px;
    span{
      width: 66px;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      color: #fff;
      text-align: center;
      border: none;
      border-radius: 10px;
      display: block;
      margin-right: 20px;
      cursor: pointer;
      flex-shrink: 0;
    }
    
  }
  .answer-info{
    font-size: 14px;
    color: #838CA5;
    .top{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 5%;
      margin-bottom: 10px;
      .legend{
        display: flex;
        span{
          margin-left: 12px;
          .legend-icon{
            width: 30px;
            height: 10px;
            border-radius: 8px;
            display: inline-block;
            margin-right: 2px;
          }
        }
      }
    }
    .chooseList{
      .choose-span{
        margin-left: 20px;
        margin-bottom: 5px;
      }
    }
    .stu-answer{
      margin: 10px 0 10px 20px;
    }
    .error{
      color: #de2525;
    }
    .correct{
      // color:@theme-color;
      color: #2288fa;
    }
    .stand-answer{
      margin: 0px 0 10px 20px;
      color: #1db98f;
    }
  }
}
</style>