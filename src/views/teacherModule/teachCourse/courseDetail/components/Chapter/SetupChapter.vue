<template>
  <div class="chartTerr">
    <div class="chartTerrLeft" :class="((currentTab === '1' && role === 3) || role === 4)?'chartTerrLeft2':''">
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
    <div class="chartTerrRight" v-if="currentTab === '0'" :class="state.activeExperimentObj.id?'':'flexCenter'">
      <template v-if="state.activeExperimentObj.id">
        <div class="title flexCenter">
          <h3 class="courseh3">{{`${!state.activeExperimentObj.TeachingAids?'实验指导':{5:'备课资料',6:'教学指导',3:'课件'}[state.activeExperimentObj.type]}`}}</h3>
          <a-button type="primary" @click="Reselection()" v-if="state.activeExperimentObj.TeachingAids">重新选择</a-button>
          <div class="reports flexCenter" v-if="!state.activeExperimentObj.TeachingAids">
            <div class="report flexCenter" @click="viewReport">
              <span class="iconfont icon-timu"></span>
              <span>报告模板</span>
            </div>
            <div class="Lesson flexCenter" @click="lessonPreparation">
              <span class="iconfont icon-jitibeike"></span>
              <span>{{openVncState ? '准备中...' : '开始备课'}}</span>
            </div>
          </div>
        </div>
        <a-spin :spinning="experimentGuideLoading" size="large" tip="Loading...">
          <div class="pdfBox experimentGuide" v-if="(currentTab === '0' && role === 3)">
            <!-- 实验指导展示  chartLoading-->
            {{`${state.activeExperimentObj.type}`}}
            <ExperimentalGuidance :activeExperimentObj="state.activeExperimentObj" />
          </div>
        </a-spin>
      </template>
      <Empty v-else :text="'暂未选择实验'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,reactive,nextTick,createVNode} from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { IBusinessResp } from "src/typings/fetch.d";
import { useRoute ,useRouter} from "vue-router";
import request from 'src/api/index'
import ExperimentsAndMaterials from 'src/components/SelectDocOrMp4/ExperimentsAndMaterials.vue'
import Submit from "src/components/submit/index.vue";
import ExperimentalGuidance from './ExperimentalGuidance.vue'
import ChapterList from './ChapterList.vue'
import extStorage from "src/utils/extStorage";
import { Modal, message } from "ant-design-vue";
import Empty from "src/components/Empty.vue";
import PdfVue from "src/components/pdf/pdf.vue";
import { getTypeList } from 'src/views/teacherModule/teacherExperimentResourcePool/config'
import { toVmConnect, IEnvirmentsParam } from "src/utils/vncInspect"; // 打开虚拟机
const env = process.env.NODE_ENV == "development" ? true : false;
const detailInfoUrl='/professor/classic/video/112/22/1523425771.mp4'
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
const route = useRoute();
const router = useRouter();
const routeQuery = route.query
const { currentTab,course_id } = route.query;
interface Props {
  // chapterList:any
  Editable:string
  courseId:number
  // knowledge: any;
  // words:any
}
const props = withDefaults(defineProps<Props>(), {
  // knowledge: ()=> [],  //  
  // chapterList: ()=> [],      // 
  Editable:'readOnly',          //readOnly canStudy canEdit 是否可编辑
  courseId:0
});
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
var Visible: Ref<boolean> = ref(false);
//  编辑章节下素材、实验列表     保存/更新实验|实训|视频|文档到章节
const activeChapterId:Ref<number>=ref(0)
const selectChaptert=(val:any)=>{
  console.log('选中的章节',val)
  ExperimentsAndMaterialsObj.activeExperiments={...val.contents}
  state.activeChapter={...val}
  activeChapterId.value=val.id
}
// 选中章节下实验
const selectExperiment=(val:any)=>{
  console.log(val)
  state.activeExperimentObj={...val}
  // 获取实验详情
  if(!val.TeachingAids){
    getExperimentGuide(val.id)
  }
}
const getExperimentGuide=(id:number)=>{
  experimentGuideLoading.value=true
  http.getExperimentGuide({urlParams:{experimentId:id}}).then((res:IBusinessResp)=>{
    experimentGuideLoading.value=false
    const {data}=res  
    // state.activeExperimentObj.Newguidance=res.data
    // courseDirection.push(...data)
  })
}
const experimentGuideLoading: Ref<boolean> = ref(false);
// 重新选择章节教辅
var ExternalOpen: Ref<boolean> = ref(false);
const Reselection=()=>{
  ExternalOpen.value=!ExternalOpen.value
}

const viewReport=()=>{
  Visible.value=false
}

// 开始备课
const openVncState = ref(false)
const lessonPreparation=()=>{
  if (openVncState.value) return
  console.log(state.activeExperimentObj)
  const {id, task_type} = state.activeExperimentObj
  openVncState.value = true
  const param: any = {
    type: "course",  // 实验
    opType: "prepare",
    taskId: id,
    experType: task_type
  };
  // 文档视频实验
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
  // if (task_type === 3 && programing_type === 1) {
  if (task_type === 3) {
    // webide
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
  toVmConnect(router, param, routeQuery).then((res: any) => {
    openVncState.value = false
  })
}

onMounted(() => {

});
</script>

<style lang="less" scope>
  .chartTerr{
    display: flex;
    
    .chartTerrLeft{
      width: 470px;
      // flex: 1;
      // padding: 10px;
      // .title{
      //   padding: 10px;
      //   justify-content: space-between;
      //   // margin-bottom: 1rem;
      // }
      .myChapter{
        // padding: 10px;
        min-height:500px;
        max-height: 700px;
        overflow: auto;
      }
    }
    .chartTerrLeft2{
      width: 914px;
    }
    .chartTerrRight{
      // width: 674px;
      margin-right: 16px;
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
        }
      }
      // .pdfBox{
      //   height: 630px;
      // }
      .experimentGuide{
        height: 630px;
        // border: 1px solid rgba(0,0,0,0.15);
        padding: 10px 10px 20px 0px;
        // max-height: 500px;
        // overflow: auto;
      }
      
    }
  }
</style>