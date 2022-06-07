<template>
  <div class="chartTerr">
    <div class="chartTerrLeft" :id="fromT==='CreateCourse'?'borBot':''" :class="((currentTab === '1' && (role === 3 || role===5)) || role === 4 || role ===2)?'chartTerrLeft2':''">
      <div class="myChapter textScrollbar">
        <ChapterList
          :ExternalOpen="ExternalOpen"
          @closeExternalOpen="Reselection"
          :courseId="props.courseId"
          :Editable="props.Editable"
          @selectChaptert="selectChaptert"
          @selectExperiment="selectExperiment" 
           />
      </div>
    </div>
    <div class="chartTerrRight" :id="fromT==='CreateCourse'?'borBot':''" v-if="currentTab === '0' && (role === 3 || role===5)" :class="state.activeExperimentObj.id?'':'flexCenter'">
      <template v-if="state.activeExperimentObj.id">
        <div class="title flexCenter">
          <h3 class="courseh3">{{`${!state.activeExperimentObj.TeachingAids?'实验指导':{5:'备课资料',6:'教学指导',3:'课件'}[state.activeExperimentObj.type]}`}}</h3>
          <a-button type="primary" @click="Reselection()" v-if="state.activeExperimentObj.TeachingAids">重新选择</a-button>
          <div class="reports flexCenter" v-if="!state.activeExperimentObj.TeachingAids">
            <div class="report flexCenter" @click="viewReport()">
              <span class="iconfont icon-timu"></span>
              <span>报告模板</span>
            </div>
            <div class="Lesson flexCenter" @click="lessonPreparation" v-if="!props.create" :class="currentState===2&&connectStatus===1 || currentState===3 ? 'none-event':''">
              <span class="iconfont icon-jitibeike"></span>
              <span>{{currentState===1||!connectStatus?'开始备课':currentState===2&&connectStatus===1?'准备中...':'进入'}}</span>
            </div>
          </div>
        </div>
        <a-spin :spinning="experimentGuideLoading" size="large" tip="Loading...">
          <div class="experimentGuide">
            <!-- 实验指导展示  chartLoading  textScrollbar  --> 
            <!-- {{`实验类型：${state.activeExperimentObj.type}`}} -->
            <template v-if="!experimentGuideLoading">
              <ExperimentalGuidance :activeExperimentObj="state.activeExperimentObj" />
            </template>
          </div>
        </a-spin>
      </template>
      <Empty v-else :text="'暂无实验数据'" />
    </div>
  </div>

  <!-- 模板预览 -->
  <a-modal :visible="TemplatePreview"  :title="`模板预览`" class="setupVisible" :width="1080"  @cancel="cancelViewReport">
    <div class="box" v-if="TemplatePreview">
      <!-- {{state.activeExperimentObj.Newguidance.content_template}} -->
      <viewTemplate :id="state.activeExperimentObj.Newguidance.content_template.template_id" />
    </div>
    <template #footer>
      <!-- <Submit @submit="SaveSetup()" @cancel="cancelSetup()" :loading="SetupLoading"></Submit> -->
      <span></span>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,reactive,nextTick, createVNode, computed} from "vue";
import { IBusinessResp } from "src/typings/fetch.d";
import { useRoute ,useRouter} from "vue-router";
import request from 'src/api/index'
import Submit from "src/components/submit/index.vue";
import ExperimentalGuidance from './ExperimentalGuidance.vue'
import ChapterList from './ChapterList.vue'
import extStorage from "src/utils/extStorage";
import { Modal, message } from "ant-design-vue";
import viewTemplate from "src/components/report/viewTemplate.vue"

import CreateTemplate from "src/views/teacherModule/teacherTemplate/createTemplate.vue";
import { toVmConnect, IEnvirmentsParam, prepareEnv, goToVm, connectEnv, inspectEnv } from "src/utils/vncInspect"; // 打开虚拟机

import { useStore } from "vuex";
const store = useStore()
let isWsConnect = computed({
  get: () => {
    return store.state.isWsConnect
  },
  set: val => {
    store.commit("setIsWsConnect",val)
  }
})
let connectStatus = computed({
  get: () => {
    return store.state.connectStatus
  },
  set: val => {
    store.commit('setConnectStatus', val)
  }
})
const env = process.env.NODE_ENV == "development" ? true : false;
const detailInfoUrl='/professor/classic/video/112/22/1523425771.mp4'
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
const route = useRoute();
const router = useRouter();
const routeQuery = route.query
const { currentTab,course_id } = route.query;
const fromT=route.path.indexOf('CreateCourse')!==-1?'CreateCourse':'Detail'
// console.log(fromT);

interface Props {
  // chapterList:any
  create?:boolean
  Editable?:string
  courseId:number
  // knowledge: any;
  // words:any
}
const props = withDefaults(defineProps<Props>(), {
  // knowledge: ()=> [],  //  
  // chapterList: ()=> [],      // 
  create:false,
  Editable:'readOnly',          //readOnly canStudy canEdit 是否可编辑
  courseId:0
});
console.log(props.Editable);

const http=(request as any).teachCourse
var state:any=reactive({
  chapterList:[],
  activeTab:{},
  activeExperiment:{
    title:'新建章节',
    type:1,     // 1新建章节 2编辑章节  3编辑素材  4编辑实验名称
    typeName:'章节'         
  },   // 章节树当前选中的实验类别
  activeExperimentObj:{      // 章节树当前选中的 实验
    id:0,
  },
  activeChapter:{},   // 当前操作的章节
})
/**
章节树操作
 */
var ExperimentsAndMaterialsObj=reactive<any>({
  activeExperiments:{},
  activeMaterials:[]
})
// 新建章节
//  编辑章节下素材、实验列表     保存/更新实验|实训|视频|文档到章节
const activeChapterId:Ref<number>=ref(0)
const selectChaptert=(val:any)=>{
  // console.log('选中的章节',val)
  ExperimentsAndMaterialsObj.activeExperiments={...val.contents}
  state.activeChapter={...val}
  activeChapterId.value=val.id
}
// 选中章节下实验
const selectExperiment=(val:any)=>{
  // console.log(val)
  currentState.value = 1
  connectStatus.value = 0
  state.activeExperimentObj={...val}
  experimentGuideLoading.value=false
  // 获取实验详情
  if(!val.TeachingAids && currentTab === '0' && (role === 3 || role===5) && val.id){
    // 教师端我的教学  才在右边展示实验指导
    getExperimentGuide(val.id)
  }
}
const getExperimentGuide=(id:number)=>{
  experimentGuideLoading.value=true
  state.activeExperimentObj.Newguidance={}
  http.getExperimentGuide({urlParams:{experimentId:id}}).then((res:IBusinessResp)=>{
    const {data}=res  
    state.activeExperimentObj.Newguidance=data
    if(data.task_type === 6){
      state.activeExperimentObj.Newguidance.file_url=data.content_task_files?data.content_task_files[0].file_url:''
    }
    console.log(state.activeExperimentObj.Newguidance)
    experimentGuideLoading.value=false
  }).catch((err:any)=>{
    experimentGuideLoading.value=false
  })
}
const experimentGuideLoading: Ref<boolean> = ref(false);
// 重新选择章节教辅
var ExternalOpen: Ref<boolean> = ref(false);
const Reselection=()=>{
  ExternalOpen.value=!ExternalOpen.value
}
var TemplatePreview: Ref<boolean> = ref(false);

const viewReport=()=>{
  // TemplatePreview.value=true
  if(state.activeExperimentObj.Newguidance.content_template){
    TemplatePreview.value=true
  }else{
    message.warning('该实验暂无报告模板')
  }
  
}
const cancelViewReport=()=>{
  TemplatePreview.value=false
}


// 开始备课
// 1未开始学习  2准备中   3准备完成 待进入
const currentState = ref(1)
const is_connect = ref(false)  // 当前ws是否连接成功
const lessonPreparation=()=>{
  
  let {task_type, id} = state.activeExperimentObj
  const param: any = {
    type: "course",  // 实验
    opType: "prepare",
    taskId: id,
    experType: task_type
  };
  // ide
  if (task_type === 3) {
    inspectEnv(param).then(() => {
      router.push({
        path: "/vm",
        query: {
          type: param.type,
          opType: param.opType,
          taskId: param.taskId,
          // routerQuery: JSON.stringify(routeQuery),
          experType: task_type
        },
      });
    })
    return
  }
  // 视频 文档
  if (task_type === 6 || task_type === 7) {
    router.push({
      path: "/vm",
      query: {
        type: param.type,
        opType: param.opType,
        taskId: param.taskId,
        routerQuery: JSON.stringify(routeQuery),
        experType: task_type
      },
    });
    return
  }

  if (currentState.value === 2&& connectStatus.value===2) {
    currentState.value = 3
    goToVm(router, routeQuery)
    return
  }
  connectStatus.value = 1
  // const {id} = state.activeExperimentObj
  // let task_type = state.activeExperimentObj.task_type
  // if (state.activeExperimentObj.is_webide && state.activeExperimentObj.type === 4) {
  //   task_type = 3
  // }
  // const param: any = {
  //   type: "course",  // 实验
  //   opType: "prepare",
  //   taskId: id,
  //   experType: task_type
  // };
  // if (task_type === 6 || task_type === 7 || task_type === 3) {
  //   isWsConnect.value = true
  //   connectStatus.value = 2
  // } else {
  //   isWsConnect.value = false
  // }
  // 准备环境
  if (currentState.value === 1) {
    // currentState.value = 2
    prepareEnv(param).then(() =>{
      currentState.value = 2
    }).catch(() => {
      currentState.value = 1
      connectStatus.value = 0
    })
    return
  }
}

onMounted(() => {
  // if(Number(currentTab) === 0) {
  //   connectEnv().then(() => {
  //     console.log('********************')
  //     // is_connect.value = true
  //   })
  // }
});
</script>

<style lang="less" scope>
  .chartTerr{
    display: flex;
    
    .chartTerrLeft{
      width: 470px;
      background: #ffffff;
      // border: 1px solid rgba(0,0,0,0.15);
      // flex: 1;
      // padding: 10px;
      // .title{
      //   padding: 10px;
      //   justify-content: space-between;
      //   // margin-bottom: 1rem;
      // }
      .myChapter{
        padding:0 24px;
        min-height:700px;
        max-height: 850px;
        overflow: auto;
        // padding-right: 10px;
      }
    }
    .chartTerrLeft2{
      width: 910px;
    }
    .chartTerrRight{
      // width: 674px;
      background: #ffffff;
      margin-left: 16px;
      // margin-right: 16px;
      flex: 1;
      padding:10px 22px 22px 30px;
      .title{
        justify-content: space-between;
        .report{
          color: var(--primary-color);
          cursor: pointer;
        }
        .Lesson{
          margin-left: 2rem;
          cursor: pointer;
          color: var(--brightBtn);
          &.none-event {
            pointer-events: none;
            cursor: not-allowed;
            // color: #5c5c5c;
            opacity: 0.6;
          }
        }
      }
      // .pdfBox{
      //   height: 630px;
      // }
      .experimentGuide{
        height: 800px;
        overflow: auto;
        // border: 1px solid rgba(0,0,0,0.15);
        padding: 24px 10px 20px 0px;
        // max-height: 500px;
        // overflow: auto;
        max-width: 646px;
      }
      
    }
    #borBot{
      // border: 1px solid rgba(0,0,0,0.15);
    }
  }
</style>