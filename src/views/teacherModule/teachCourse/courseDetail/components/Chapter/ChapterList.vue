<template>
  <div class="chapterListBox">
    <div class="title3 flexCenter" v-if="props.Editable !== 'readOnly'">
      <h3 class="courseh3">章节目录</h3>
      <div>
        <a-button class="brightBtn" type="primary" @click="createChart()" v-if="(currentTab === '0' && role === 3 && props.Editable === 'canEdit')">新建章节</a-button>
      </div>
    </div>
    <a-spin :spinning="chartLoading" size="large" tip="Loading...">
      <div class="chapterList" v-for="(v,k) in ChaptersTreeList" :key="v.id">
        <div class="title flexCenter" @click.stop="selectChaptert(v),v.openItem=!v.openItem">
          <div class="flexCenter titleBox" :class="props.Editable === 'readOnly'?'noEdit':''">
            <div class="titleItem titleItem1">{{`第${k+1}章`}}</div>
            <div class="titleItem titleItem2 single_ellipsis">{{v.name}}</div>
          </div>
          <div class="titleBoxRight flexCenter">
            <div class="operation flexCenter" v-if="props.Editable === 'canEdit'">
              <span  class="iconfont icon-chuangjian" @click.stop="establishChapter(v)"></span>
              <span class="iconfont icon-bianji1"  @click.stop="editChapter(v)"></span>
              <span class="iconfont icon-shanchu"  @click.stop="deleteChapter(v)"></span>
            </div>
            <span class="collect">{{v.openItem?'收起':'展开'}}</span>
          </div>
        </div>
        <div class="listBox" v-if="v.openItem">
          <div class="list" v-for="(a,i) in v.list" :key="a">
            <div class="itemTit flexCenter" @click.stop="selectExperiment(a,v)" :class="state.activeExperimentObj.id === a.id?'ActiveItem':''">
              <div class="TitLeft flexCenter" :class="getTitLeftClass()">
                <div class="experimentType">
                  <span v-if="a.TeachingAids">教辅</span>
                  <span v-else :style="{ color: a.type_obj.color, background: a.type_obj.backgroundColor,}">{{a.type_obj.name}}</span>
                </div>
                <div class="experimentTitle single_ellipsis" :class="a.TeachingAids?'TeachingAids':''">
                  <span v-if="a.TeachingAids">{{`【${a.TeachingAidsName}】`}}&nbsp;</span>
                  <span v-if="!a.TeachingAids">{{`${k+1}-${i+1-v.orderNuumber}`}}&nbsp;&nbsp;</span>
                  <span class="ItemExperimentTitle">{{a.name}}</span>
                </div>
              </div>
              <div class="TitRight"> 
                <!-- 管理端是直接进入详情查看了，没有传参数通过 role判断 -->
                <div v-if="['canStudy','noStudy'].includes(props.Editable) || role ===2">
                  <!-- status 1 开始学习 topoinst_id有值 进入 status 2 学习结束 -->
                  <span v-if="!a.TeachingAids && ['canStudy'].includes(props.Editable) && role !==2">
                    <a-button  v-if="a.studys&&a.studys.length&&Number(a.studys[0].status)>=2" type="primary" class="brightBtn" size="small" :disabled="true">学习结束</a-button>
                    <a-button  v-else-if="a.task_type===3||a.task_type===6||a.task_type===7" type="primary" class="brightBtn" size="small" @click="openVm(a, 'start')">开始学习</a-button>
                    <a-button  v-else-if="a.studys&&a.studys.length&&Number(a.studys[0].status)===1&&a.studys[0].topoinst_id" type="primary" class="brightBtn" size="small" @click="openVm(a, 'continue')">进入</a-button>
                    <a-button v-else type="primary" class="brightBtn" size="small" :loading="a.startup===2&&connectStatus===1 || a.startup===3" 
                    @click.stop="prepare(a, i)">{{a.startup===1 || !connectStatus?'开始学习':(a.startup===2&&connectStatus===1&&(currentClickIndex===i)?'准备中...':'进入')}}</a-button>
                  </span>
                  <!-- <a-button  v-if="!a.TeachingAids" type="primary" class="brightBtn" size="small" @click="rebuild(a)">重修</a-button> -->
                  <!-- 不以学生端还是教师端区分      “查看指导”用在实验上  “查看文档”用在教辅上 -->
                  <span class="view" @click.stop="ViewExperiment(a,v)" v-if="a.power">
                    {{`${a.openGuidance?'收起':'查看'}${a.TeachingAids?'文档':'指导'}`}}
                  </span>
                </div>
                <div class="operation flexCenter" v-if="props.Editable === 'canEdit'">
                  <span class="iconfont icon-bianji1" @click.stop="editExperiment(a)" v-if="!a.TeachingAids"></span>
                  <span class="iconfont icon-shanchu" @click.stop="deleteExperiment(v,a)"></span>
                </div>
              </div>
            </div>
            <div class="experimentGuide" v-if="a.openGuidance">
              <a-spin  :spinning="a.experimentGuideLoading" size="large" tip="Loading..." class="experimentGuideContnet">
                <template v-if="!a.experimentGuideLoading">
                  <ExperimentalGuidance :activeExperimentObj="a.activeExperimentObj" />
                </template>
              </a-spin>
            </div>
          </div>
        </div>
      </div>
      <Empty v-if="!ChaptersTreeList.length && !chartLoading" :text="'暂无章节'" />
    </a-spin>
  </div>
  <!-- 编辑章节的实验名称 -->
  <a-modal v-model:visible="Visible"  :title="state.activeExperiment.title" class="setupVisible" :width="500">
    <a-form :layout="'vertical'" :rules="rules" :model="formState" ref="formRef">
      <a-form-item :label="`${state.activeExperiment.typeName}名称`" name="name">
        <a-input v-model:value="formState.name" :placeholder="`请输入${state.activeExperiment.typeName}名称`" />
      </a-form-item>
    </a-form>
    <template #footer>
      <Submit @submit="Save" @cancel="cancel"></Submit>
    </template>
  </a-modal>
  <!-- 选择实验或者素材 -->
  <ExperimentsAndMaterials 
    :visible="editChartVisible" 
    :activeFile="state.activeExperimentObj" 
    :selectList="ExperimentsAndMaterialsObj.activeExperiments" 
    @closeDrawerDoc="closeDrawerDoc" 
    @selectDocOrMp4File="selectFile" 
  />
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,reactive,watch,computed,nextTick,createVNode} from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import Submit from "src/components/submit/index.vue";
import ExperimentalGuidance from './ExperimentalGuidance.vue'
import { Modal, message } from "ant-design-vue";
import ExperimentsAndMaterials from 'src/components/SelectDocOrMp4/ExperimentsAndMaterials.vue'
import { toVmConnect, IEnvirmentsParam, prepareEnv, goToVm, connectEnv, inspectEnv } from "src/utils/vncInspect";
import { useRoute ,useRouter} from "vue-router";
import { getTypeList } from 'src/views/teacherModule/teacherExperimentResourcePool/config'
import request from 'src/api/index'
import extStorage from "src/utils/extStorage";
import { IBusinessResp } from "src/typings/fetch.d";
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
const http=(request as any).teachCourse
const studentHttp=(request as any).studentCourse
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
const route = useRoute();
const router = useRouter();
const { currentTab} = route.query;
const routeQuery = useRoute().query;
const { course_student_id,from} = route.query;
const env = process.env.NODE_ENV == "development" ? true : false;
const detailInfoUrl='/professor/classic/video/112/22/1523425771.mp4'
var chartLoading: Ref<boolean> = ref(false);
var ChaptersTreeList:any=reactive([])
interface Props {
  ExternalOpen?:boolean
  Editable?:string
  courseId?:number  
  Environment?:boolean
  // knowledge: any;
  // words:any
}
const props = withDefaults(defineProps<Props>(), {
  courseId:0,                 // 课程id
  Editable:'readOnly',          // canEdit可编辑  readOnly可学习   canStudy只展示   noStudy学生端已结束的课程不能学习
  ExternalOpen:false,         // 父组件打开教辅选择抽屉
  Environment:false       // 只筛选有环境的实验，去除文档和视频类型
});
// const ExperimentTypeList=['desktop','Jupyter','task','text','video','command','IDE']
var editChartVisible: Ref<boolean> = ref(false);
var state:any=reactive({
  chapterList:[
    
  ],
  activeTab:{
    item:{},
    chapterId:''
  },
  activeExperiment:{
    title:'新建章节',
    type:1,     // 1新建章节 2编辑章节  3编辑素材  4编辑实验名称
    typeName:'章节'         
  },   // 章节树当前选中的实验类别
  activeExperimentObj:{      // 章节树当前选中的 实验
    id:0,
  },
  activeChapter:{}     // 当前章节
})
// 已选的实验和教辅资源
var ExperimentsAndMaterialsObj=reactive<any>({
  activeExperiments:[],
  activeMaterials:{}
})

const emit = defineEmits<{
  (e: "selectChaptert", val: any): void;
  (e: "selectExperiment", val: any): void; 

  (e: "establishChapter", val: any): void;
  (e: "editChapter", val: any): void;
  (e: "deleteChapter", val: any): void;

  (e: "editExperiment", val: any): void;
  (e: "deleteExperiment", val: any): void;

  (e: "closeExternalOpen"): void;
}>();
const getTitLeftClass=()=>{
  let str=''
  if(['canStudy','noStudy'].includes(props.Editable)){
    str='study'
  }
  if(props.Editable === 'canEdit'){
    str='edit'
  }
  return str
}
watch(()=>{return props.ExternalOpen},(val)=>{
  // console.log(val)
  if(val === true){
    establishChapter(state.activeChapter)
    emit('closeExternalOpen')
  }
},{immediate:true})
const closeDrawerDoc = () => {
  // 调保存到章节的接口
  editChartVisible.value = false;
};
const selectFile=(val:any)=>{
  console.log(val)
  editChartVisible.value = false;
  
  let  Pro=null
  if(val.type===1){   // 1实验  2教辅
    let obj={
      type:val.type,    
      content_ids:val.list
    }
    Pro = http.addCoursesChapter({urlParams: {courseId:props.courseId,chapterId:state.activeTab.chapterId},param:{...obj}})
  }else{
    let obj={
      item_id:[val.item.id]
    }
    Pro = http.addCoursesChapterAids({urlParams: {courseId:props.courseId,chapterId:state.activeTab.chapterId},param:{...obj}})
  }
  Pro.then((res: any) => {
    message.success("操作成功");
    getChaptersTree()
  });
}
var Visible: Ref<boolean> = ref(false);
const formRef = ref();
const rules = {
  name: [
    { required: true, message: `请输入名称`, trigger: "blur" },
    { max: 30, message: `名称最多30个字符`, trigger: "blur" },
  ],
}
const formState=reactive<any>({
  name:''
})
const createChart=()=>{
  state.activeExperiment.title='新建章节'
  state.activeExperiment.type=1
  state.activeExperiment.typeName='章节'
  Visible.value=true
}
//  编辑章节名称   实验名称公用
const EditCreateChapterName=(id:number)=>{
  formRef.value.validate().then(()=>{ 
      http.EditCreateChapterName({param:{chapter_name:formState.name},urlParams:{courseId:props.courseId,chapterId:id}}).then((res: any)=>{
        message.success('操作成功')
        formState.name=''
        Visible.value=false
        getChaptersTree()
    })
  })
}
const Save=()=>{
  if(state.activeExperiment.type === 1){ // 新建章节
  console.log(props.courseId)
    formRef.value.validate().then(()=>{ 
        http.createChapter({param:{chapter_name:formState.name},urlParams:{courseId:props.courseId}}).then((res: any)=>{
          message.success('操作成功')
          formState.name=''
          Visible.value=false
          getChaptersTree()
      })
    })
  }
  if(state.activeExperiment.type === 2 || state.activeExperiment.type === 4){  // 1新建章节 2编辑章节  3编辑素材  4编辑实验名称
    EditCreateChapterName(state.activeTab.chapterId)
  }
}
const cancel=()=>{
  formRef.value.resetFields()
  Visible.value=false
}
// 选中章节
const selectChaptert=(val:any)=>{
  console.log('章节',val)
  // if(){

  // }
  state.activeChapter=val
  state.activeTab.chapterId=val.id
  ExperimentsAndMaterialsObj.activeExperiments=val.contents
  emit('selectChaptert',val)
}
  // 选中章节下实验
function selectExperiment(a:any,v:any){
  console.log('实验',a)
  state.activeTab.chapterId=v.id
  state.activeExperimentObj=a
  emit('selectExperiment',a)
  // pdf 视频 跳页面展示
  // const { href } = router.resolve({
  //   path: "/teacher/Workbench/open-jupyte",
  // });
  // window.open(href, "_blank");
}

// 备课 开始学习
let currentClickIndex = ref(-1)
const isOpen = ref(false)
function prepare(a:any, i: number) {
  currentClickIndex.value = i
  const { id } = a
  const task_type = a.is_webssh ? 2 : a.is_webide ? 3 : a.task_type
  const param: any = {
    type: "course",  // 实验
    opType: role === 3 ? "prepare" : 'start',
    taskId: id,
    experType: task_type
  };
  if (a.startup === 2 && connectStatus.value===2) {
    // 视频、文档类实验不显示Loading
    if (!(task_type === 6 || task_type === 7)) {
      a.startup = 3
    }
    goToVm(router, routeQuery)
    return
  } else {
    a.startup = 1
  }

  isWsConnect.value = false
  console.log(task_type)
  // 准备环境
  if (a.startup === 1) {
    // a.startup=2
    prepareEnv(param).then(() =>{
      connectStatus.value = 1
      // 视频 文档 webide
      if (task_type === 6 || task_type === 7 || task_type === 3) {
        connectStatus.value = 2
        isWsConnect.value = true
        isOpen.value = true
      } else {
        // isWsConnect.value = false
      }
      ChaptersTreeList.forEach((v: any) => {
        v.list.forEach((vv: any) => {
          vv.startup = 1
        });
      });
      a.startup=2
      state.activeExperimentObj={...a}
    }).catch(() => {
      a.startup=1
      connectStatus.value = 0
      isWsConnect.value = false
    })
    return
  }
}
watch(
  () => connectStatus.value,
  (val) => {
    if (val === 2 && role === 4&&!isOpen.value) {
      StudentChaptersTree(Number(course_student_id))
    }
  },
  {deep:true,immediate:true}
)
// 进入
const openVm = (a: any, opType: string) => {
  isOpen.value = true
  const { id } = a
  const task_type = a.is_webssh ? 2 : a.is_webide ? 3 : a.task_type
  const param: any = {
    type: "course",  // 实验
    opType: opType,
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
          routerQuery: JSON.stringify(routeQuery),
          experType: task_type
        },
      });
    })
    return
  }
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
  toVmConnect(router, param, routeQuery).then((res: any) => {
    // a.startup=3
  })
}

function ViewExperiment(a:any,v:any){
  console.log(a)
  a.openGuidance=!a.openGuidance
  state.activeExperimentObj={...a}
  a.activeExperimentObj={...a}
  a.activeExperimentObj.is_webide = a.content_type==="webide"
  if(a.openGuidance){
    if(!a.TeachingAids){
      selectExperiment(a,v)
      getExperimentGuide(a.content_id,a)
    }else{
      console.log('教辅')
      a.experimentGuideLoading=false
    }
  }
  // if(role===3 && Number(currentTab) === 1){
  //   a.activeExperimentObj={...a}
  // }
}
// const experimentGuideLoading: Ref<boolean> = ref(false);
const getExperimentGuide=(id:number,a:any)=>{
  a.experimentGuideLoading=true
  http.getExperimentGuide({urlParams:{experimentId:id}}).then((res:IBusinessResp)=>{
    console.log(res)
    var {data}=res  
    if(data.task_type === 6){
      // state.activeExperimentObj.Newguidance.file_url=data.content_task_files?data.content_task_files[0].file_url:''
      data.file_url=data.content_task_files?data.content_task_files[0].file_url:''
    }
    state.activeExperimentObj.Newguidance=data
    // if(role===3 && Number(currentTab) === 1){
    //   a.activeExperimentObj.Newguidance=data
    // }
    a.activeExperimentObj.Newguidance=data
    a.experimentGuideLoading=false
  })
}
// 编辑章节下素材、实验列表
const establishChapter=(v:any)=>{
  selectChaptert(v)
  editChartVisible.value=true
  emit('establishChapter',v)
}
// 编辑章节名称
const editChapter=(val:any)=>{
  selectChaptert(val)
  console.log('编辑章节名称',val)
  state.activeTab.chapterId=val.id
  formState.name=val.name
  state.activeExperiment.title='编辑章节名称'
  state.activeExperiment.type=2
  state.activeExperiment.typeName='章节'
  Visible.value=true
  // emit('editChapter',val)
}
// 删除章节
const deleteChapter=(val:any)=>{
  selectChaptert(val)
  state.activeTab.chapterId=val.id
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.DeleteCourseChapter({urlParams: {courseId:props.courseId,chapterId:val.id}}).then((res: any) => {
        message.success("删除成功");
        state.activeExperimentObj={}
        getChaptersTree()
      });
    },
  });
  // emit('deleteChapter',val)
}

// 编辑章节下实验名称
const editExperiment=(val:any)=>{
  // selectExperiment(v)
  //  悬浮编辑可加选中状态
  console.log('编辑实验名称',val)
  // 区分是否是素材
  // 3编辑素材  4编辑实验名称
  state.activeExperiment.title=val.TeachingAids?'编辑教辅名称':'编辑实验名称'
  state.activeExperiment.type=val.TeachingAids?3:4
  state.activeExperiment.typeName=val.TeachingAids?'教辅':'实验'
  if(state.activeExperiment.type === 4){
    state.activeTab.chapterId=val.id
    formState.name=val.name
  }
  Visible.value=true 
  // emit('editExperiment',val)
}
// 删除章节下实验
const deleteExperiment=(v:any,a:any)=>{
  let obj={
    v:v,
    a:a
  }
  console.log(v)
  console.log('删除实验',a)
  // return 
  // state.activeTab.chapterId=v.id
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      let  Pro=null
      if(!a.TeachingAids){   // TeachingAids教辅    非-实验 
        Pro = http.DeleteCourseChapter({urlParams: {courseId:props.courseId,chapterId:a.id}})
      }else{
        Pro = http.DeleteChapterAids({urlParams: {courseId:props.courseId,chapterId:v.id,itemId:a.id}})
      }
      Pro.then((res: any) => {
        message.success("删除成功");
        getChaptersTree()
      });;
    },
  });
  // emit('deleteExperiment',obj)
}
const ProcessingData=(data:any)=>{
    let obj= {3:'课件',5:'备课资料',6:'教学指导'}
    if(data.length){
      let item:any=data[0]
      let index:number=0
      data.forEach((v:any,k:number)=>{
        v.openItem=false
        v.list=[]
        v.orderNuumber=v.resource && v.resource.length?v.resource.length:0
        v.resource.length?v.resource.forEach((i:any)=>{
          i.power=true
          i.TeachingAids=true   // TeachingAids是教辅
          i.TeachingAidsName=obj[i.type]
          i.name=i.file_name
          if(props.Editable !== 'readOnly' && obj[i.type]){
            v.list.push(i)
          }
        }):''
        v.contents.length?v.contents.forEach((i:any)=>{
          i.power=true
          i.startup=1     // 公开  加载开始学习  1未开始学习  2准备中   3准备完成 待进入
          i.openGuidance=false //公开 展开实验指导
          i.experimentGuideLoading=false  // 公开课程加载实验指导
          i.TeachingAids=false
          // i.task_type=i.type
          if (i.is_webide&&i.type===4 || i.content_type==="webide") {
            i.task_type = 3
          } else if (i.is_webssh&&i.type===1 || i.content_type==="webssh") {
            i.task_type = 2
          } else {
            i.task_type = i.type
          }
          i.type_obj = Object.assign({}, getTypeList('90deg')[i.task_type]);
          if(i.task_type === 5){
            i.is_show_task_step=true
          }
          if(props.Environment){
            if(i.type!==6 && i.type!==7){
              v.list.push(i)
            }
          }else{
            v.list.push(i)
          }
        }):''
        if(state.activeTab.chapterId && state.activeTab.chapterId === v.id){
          item={...v}
          index=k
        }
        // 学生端根据教师端的课程设置是否展示实验指导     // 
        if(role === 4){
          v.list.length?v.list.forEach((i:any)=>{
            //  教辅的展示 教师端设置后  后端已经过滤
            if(!i.TeachingAids){
              if([1,2,3].includes(i.task_type)){
                // console.log(i.type_obj.name+'实验指导')
                i.power=v.course_setting['is_show_content_guidance']===1?true:false 
              }
              if(i.task_type === 5){
                // console.log(i.type_obj.name+'任务制')
                // i.power=v.course_setting['is_show_task_step']===1?true:false
                i.is_show_task_step=v.course_setting['is_show_task_step']===1?true:false
              }
              if([6,7].includes(i.task_type)){
                // console.log(i.type_obj.name+'文档视频')
                i.power=true
              }
            }

          }):''
        }
      })
      // console.log(item)
      selectChaptert(item)
      if(item.list.length){
        selectExperiment(item.list[0],item)
      }else{
        selectExperiment({},{})
      }
      data[index].openItem=true
    }else{
      selectChaptert({})
      selectExperiment({},{})
    }
    ChaptersTreeList.push(...data)
}
const getChaptersTree=()=>{
  chartLoading.value=true
  ChaptersTreeList.length=0
  http.getChaptersTree({urlParams:{courseId:props.courseId}}).then((res:any)=>{
    const {data}=res
    chartLoading.value=false
    ProcessingData(data)
  })
}
var course_setting:any=reactive({})
function StudentChaptersTree(course_student_id:number){
  ChaptersTreeList.length=0
  studentHttp.StudentChaptersTree({urlParams:{course_student_id:course_student_id}}).then((res:IBusinessResp)=>{
    if (!res) return
    const {data}=res
    course_setting=data.length?{...data[0].course_setting}:{}
    ProcessingData(data)
    console.log(course_setting)
  })
}
onMounted(() => {
  console.log(props.courseId)
  // const { course_student_id,from} = route.query;
  if((props.courseId && role === 3) || (from && from === 'courseManagement' && role===2)){
    getChaptersTree()
  }
  if(role === 4){
    // console.log(course_student_id)
    StudentChaptersTree(Number(course_student_id))
  }
  // if(Number(currentTab) === 1) {
  //   connectEnv().then(() => {
  //     console.log('********************')
  //     // isWsConnect.value = true
  //   })
  // }
});
</script>

<style lang="less" scope>
  .chapterListBox{
    min-height: 300px;
    text-align: center;
    // justify-content: center;
    .title3{
      padding: 10px 0;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0,0,0,0.15);
    }
  }
  .chapterList{
    text-align: left;
    // padding-bottom: 2rem;
    .title{
      justify-content: space-between;
      height: 46px;
      border-bottom: 1px dashed #e8e8e8;
      // padding: 0 8px;
      padding-right: 10px;
      &:hover{
        background: #fff7e6;
        cursor: pointer;
      }
      .titleBox{
        width: calc(100% - 140px);
        // flex-grow: 1;
        .titleItem{
          color: var(--black-85);
          // margin-right: 1rem;
        }
        .titleItem1{
          width: 60px;
        }
      }
      .noEdit{
         width: calc(100% - 40px);
      }
      .titleBoxRight{
        .collect{
          color: var(--primary-color);
          cursor: pointer;
          width: 28px;
        }
        .operation{
          width: 84px;
          span{
            display: none;
          }
        }
      }
      &:hover{
        .operation{
          span{
            display: flex;
          }
        }
      }
    }
    .listBox{
      transition: all .3s;
      padding: 1rem 0;
    }
    .list{
      .itemTit{
        justify-content: space-between;
        height: 40px;
        padding-right: 10px;
        .TitLeft{
          width: 100%;
          
          .experimentType{
            color: #1CB2B3;
            width: 60px;
            justify-content: center;
            span{
              // height: 24px;
              // line-height: 24px;
              padding: 4px 6px;
              border-radius: 10px;
            }
          }
          .experimentTitle{
            width: calc(100% - 60px);
            .ItemExperimentTitle{
              color: var(--black-65);
              width: calc(100% - 60px);
            }
            &.TeachingAids{
              color: #1CB2B3;
            }
          }
        }
        .TitRight{
          .environment{
            justify-content: center;
            padding: 0;
            width: 100px;
            height: 24px;
            background-color:var(--brightBtn);
            color: var(--white);
            border-radius: 12px;
            &:hover{
              background-color:var(--brightBtn);
              border: 1px solid transparent;
            }
          }
          .view{
            color: var(--primary-color);
            margin-left: 24px;
            cursor: pointer;
          }
          .operation{
            span{
              display: none;
            }
          }
        }
        .study{
          width: calc(100% - 200px);
        }
        .edit{
          width: calc(100% - 100px);
        }
        &:hover{
          background: #fff7e6;
          cursor: pointer;
          .operation{
            span{
              display: flex;
            }
          }
        }
      }
      .ActiveItem{
        background: #fff7e6;
        .TitLeft .ItemExperimentTitle{
          color: var(--primary-color);
        }
      }
      .experimentGuide{
        height: 400px;
        max-height: 500px;
        // overflow: auto;
        :deep(.ant-spin-nested-loading){
          height: 100%;
        }
        :deep(.ant-spin-container){
          height: 100%;
        }
      }
    }
  }
  .operation{
    // margin: 0 1rem;
    .iconfont{
      color: #1CB2B3;
      cursor: pointer;
      padding: 0 6px;
    }
  }
</style>