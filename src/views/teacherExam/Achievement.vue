<template>
  <div v-layout-bg class="Achievement setScrollbar">
    <div class="row">
      <div class="row12">
        <div class="box box1">
          <div class="top-info flexCenter">
            <div class="title">测试考试</div>
            <div>考试时间：2021-06-07 16:20:00 ~ 2021-06-07 16:25:00</div>
          </div>
          <div class="flexCenter content">
            <div class="score-block">
              <span>总分</span>
              <strong>1</strong>
            </div>
            <div class="exam-details-info flexCenter">
              <div class="item">
                <strong>1</strong>
                <div>试题</div>
              </div>
              <div class="item">
                <strong>1</strong>
                <div>及格线</div>
              </div>
              <div class="item">
                <strong>5</strong>
                <div>考试时长</div>
              </div>
              <div class="item">
                <strong>1</strong>
                <div>考试人数</div>
              </div>
              <div class="item">
                <strong class="huang">1%</strong>
                <div>及格率</div>
              </div>
              <div class="item ">
                <strong class="hong">1</strong>
                <div>最高分</div>
              </div>
              <div class="item ">
                <strong class="lv">1</strong>
                <div>最低分</div>
              </div>
              <div class="item ">
                <strong class="lan">1</strong>
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
                  <a-input-search v-model:value="ForumSearch.title" placeholder="请输入题目名称" @search="search" />
                </div>
                <div  class="item custom_select">
                    <a-select v-model:value="ForumSearch.type"  placeholder="请选择试题类型" :options="options"></a-select>
                </div>
                <div class="item">
                  <a-button type="primary" @click="search()">查询</a-button>
                  <a-button type="primary" @click="clearSearch()">清空</a-button>
                </div>
            </div>
            <a-config-provider :renderEmpty="customizeRenderEmpty">
              <a-table :columns="columns" :loading="loading" :data-source="list" :bordered="true"  row-key="id"
                :pagination="{pageSize:ForumSearch.pageSize,total:total,onChange:onChangePage,hideOnSinglePage:true}" 
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
                  <a-input-search v-model:value="exportSearch.title" placeholder="请输入学生姓名关键字查询" @search="studentSearch" />
                </div>
                <a-button type="primary" @click="achievementExport()">成绩导出</a-button>
            </div>
            <a-config-provider :renderEmpty="exportRenderEmpty">
              <a-table :columns="exportcolumns" :loading="exportloading" :data-source="exportList" :bordered="true"  row-key="id"
                :pagination="{pageSize:exportSearch.pageSize,total:exportTotal,onChange:exportChangePage,hideOnSinglePage:true}" 
                class="components-table-demo-nested">
                <template #result="{record }">
                  <span :class="record.result" style="color: #FF6766;">{{'不及格'}}</span>
                </template>
                <template #detaile="{record, text }">
                  <a @click="see(record.id)">{{ text }}</a>
                </template>
              </a-table>
            </a-config-provider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="tsx">
import { SelectTypes } from 'ant-design-vue/es/select';
import { defineComponent,ref, onMounted,reactive,Ref,inject, computed,toRefs,VNode } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { Modal,message } from 'ant-design-vue';
import { distributionEcharts ,typeStatisticsEcharts} from "./echartsOption/index";
interface ItdItems{
  title:string,
  type:string,
  creat:string,
  replyViews:string,
  reply:string,
  id:number,
}
interface Istate{
  data:any;
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
}
const columns=[
  {
    title: '题目',
    dataIndex:"title",
    align:'center',
    width:460,
  },
  {
    title: '类型',
    dataIndex:"title",
    align:'center',
    // width:260,
  },
  {
    title: '正确人数',
    dataIndex:"title",
    align:'center',
    // width:260,
  },
  {
    title: '正确率',
    dataIndex:"title",
    align:'center',
    // width:260,
  },
]
const exportcolumns=[
  {
    title: '学号',
    dataIndex:"hao",
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
    dataIndex:"ban",
    align:'center',
    // width:260,
  },
  {
    title: '考试时长',
    dataIndex:"time",
    align:'center',
    // width:260,
  },
  {
    title: '成绩',
    dataIndex:"ji",
    align:'center',
    // width:260,
  },
  {
    title: '考试结果',
    dataIndex:"result",
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
    var updata=inject('updataNav') as Function
    updata({showContent:false,navType:false,tabs:[],navPosition:'outside',backOff:true})
    function initData(){

    }
    const options = ref<SelectTypes['options']>([{value: 1, label: '选择题'},{value: 2, label: '判断题'},{value: 3, label: '填空题'},{value: 4, label: '简答题'},{value: 5, label: '实操考核题'}])
    const state:Istate=reactive({
      data:{},
      loading:false,
      ForumSearch:{
        title:'',
        type:undefined,
        page:1,
        pageSize:5
      },
      list:[],
      total:0,
      onChangePage:(val:number)=>{
        state.ForumSearch.page=val
        initData()
      },
      search:()=>{
        if(state.ForumSearch.title!=='' || state.ForumSearch.type!==undefined){
          state.ForumSearch.page=1
          initData()
        }
      },
      clearSearch:()=>{
        if(state.ForumSearch.title || state.ForumSearch.type){
          state.ForumSearch.title=''
          state.ForumSearch.type=undefined
          state.ForumSearch.page=1
          // initData()
        }
      },
      exportList:[],
      exportSearch:{
        page:1,
        pageSize:5,
        title:'',
      },
      studentSearch:()=>{
        if(state.exportSearch.title!==''){
          state.exportSearch.page=1
          // initData()
        }
      },
      exportloading:false,
      exportTotal:0,
      achievementExport:()=>{

      },
      exportChangePage:(val:number)=>{
        state.exportSearch.page=val
        initData()
      },
      see:(id:number)=>{}
    })
   
    onMounted(async ()=>{
     await initData();
     distributionEcharts(document.getElementById("distribution") as HTMLDivElement,state.data)
     typeStatisticsEcharts(document.getElementById("TypeStatistics") as HTMLDivElement,state.data)
    })
    const customizeRenderEmpty =function (): VNode{
      if(state.loading){
        return <template></template>
      }else{
        let type=(state.ForumSearch.title || state.ForumSearch.type!==undefined)?'tableSearchEmpty':'tableEmpty'
        return <empty type={type} height={100} />
      }
    }
    const exportRenderEmpty =function (): VNode{
      if(state.exportloading){
        return <template></template>
      }else{
        let type=(state.exportSearch.title)?'tableSearchEmpty':'tableEmpty'
        return <empty type={type} height={100} />
      }
    }
    return {...toRefs(state),customizeRenderEmpty,exportRenderEmpty,columns,options,exportcolumns};
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
}
</style>