<template>
  <a-spin :spinning="props.chartLoading" size="large" tip="Loading...">
    <div class="chapterList" v-for="(v,k) in list" :key="v.id">
      <div class="title flexCenter" @click.stop="v.openItem=!v.openItem">
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
          <div class="itemTit flexCenter" @click.stop="selectExperiment(a,v)" :class="state.activeTab.id === a.id?'ActiveItem':''">
            <div class="TitLeft flexCenter" :class="getTitLeftClass()">
              <div class="experimentType">
                <span v-if="!a.TeachingAids" :style="{ color: a.type_obj.color, background: a.type_obj.backgroundColor,}">{{a.type_obj.name}}</span>
                <span v-if="a.TeachingAids">教辅</span>
              </div>
              <div class="experimentTitle single_ellipsis" :class="a.TeachingAids?'TeachingAids':''">
                <span v-if="a.TeachingAids">{{`【${a.TeachingAidsName}】`}}&nbsp;</span>
                <span v-if="!a.TeachingAids">{{`${k+1}-${i+1}`}}&nbsp;&nbsp;</span>
                <span class="ItemExperimentTitle">{{a.name}}</span>
              </div>
            </div>
            <div class="TitRight">
              <div v-if="props.Editable === 'canStudy'">
                <!-- 准备完成变为 开始  按钮 -->
                <a-button v-if="a.type==='experiment'" type="primary" class="brightBtn" size="small" :loading="a.startup" @click.stop="prepare(a)">{{a.startup?'准备中':'开始学习'}}</a-button>
                <!-- 不以学生端还是教师端区分      “查看指导”用在实验上  “查看文档”用在教辅上 -->
                <span class="view" @click.stop="ViewExperiment(a)">{{`${a.openGuidance?'收起':'查看'}`}}指导</span>
              </div>
              <!-- <div v-if="props.Editable === 'canEdit'">
                
              </div> -->
              <div class="operation flexCenter" v-if="props.Editable === 'canEdit'">
                <span class="iconfont icon-bianji1" @click.stop="editExperiment(a)" v-if="!a.TeachingAids"></span>
                <span class="iconfont icon-shanchu" @click.stop="deleteExperiment(v,a)"></span>
              </div>
            </div>
          </div>
          <div class="experimentGuide" v-if="a.openGuidance">
            <div v-if="a.type==='experiment'" class="experiment">
              <div class="itemContentBox textScrollbar">
                <div class="itemContent" v-for="i in a.content" :key="i" :class="a.openGuidance?'itemContentHeight':''">
                  <h4 class="">{{i.title}}</h4>
                  <div class="text">{{i.text}}</div>
                </div>
              </div>
            </div>
            <div class="video-box" v-if="a.type==='mp4'">
              <video :src="env ? '/proxyPrefix' + detailInfoUrl : detailInfoUrl" :controls="true">
                您的浏览器不支持 video 标签
              </video>
            </div>
            <div class="pdfBox" v-if="a.type==='pptx'">
              <!-- <PdfVue :url="'/professor/classic/courseware/112/13/1638337036569.pdf'" /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,reactive,watch,computed} from "vue";
import { toVmConnect, IEnvirmentsParam } from "src/utils/vncInspect";
import { useRoute ,useRouter} from "vue-router";
import { getTypeList } from 'src/views/teacherModule/teacherExperimentResourcePool/config'
import { concat } from "lodash";
const route = useRoute();
const router = useRouter();
const routeQuery = useRoute().query;
const env = process.env.NODE_ENV == "development" ? true : false;
const detailInfoUrl='/professor/classic/video/112/22/1523425771.mp4'
interface Props {
  chapterList:any
  Editable:string
  chartLoading?:boolean   
  // knowledge: any;
  // words:any
}
const props = withDefaults(defineProps<Props>(), {
  chapterList: ()=> [],      // 
  Editable:'readOnly',          //readOnly canStudy canEdit 是否可编辑
  chartLoading:false          // 章节树加载中  loading状态
});
const ExperimentTypeList=['desktop','Jupyter','task','text','video','command','IDE']

var state:any=reactive({
  chapterList:[
    
  ],
  activeTab:{
    item:{},
    chapterId:''
  }
})
const list=computed(()=>{
  let obj={5:'备课资料',6:'教学指导',3:'课件'}
  let data=props.chapterList?props.chapterList:[]
  // let state.activeTab
  data.length?data.map((v: any) => {
    v.openItem=false
    v.list=[]
    v.resource.lenght?v.resource.forEach((i:any)=>{
      i.TeachingAids=true
      i.TeachingAidsName=obj[i.type]
      i.name=i.file_name
      v.list.push(i)
    }):''
    v.contents.length?v.contents.forEach((i:any)=>{
      i.TeachingAids=false
      i.task_type=i.type
      i.type_obj = Object.assign({}, getTypeList('90deg')[i.task_type]);
      v.list.push(i)
    }):''
    // v.list=concat(v.resource,v.contents)
    console.log(v.list)
    if(state.activeTab.chapterId === v.id){
      v.openItem=true
    }
  }):[]
  return data
})
const emit = defineEmits<{
  (e: "selectExperiment", val: any): void;

  (e: "establishChapter", val: any): void;
  (e: "editChapter", val: any): void;
  (e: "deleteChapter", val: any): void;

  (e: "editExperiment", val: any): void;
  (e: "deleteExperiment", val: any): void;
  
}>();

const getTitLeftClass=()=>{
  let str=''
  if(props.Editable === 'canStudy'){
    str='study'
  }
  if(props.Editable === 'canEdit'){
    str='edit'
  }
  return str
}
  // 选中章节下实验
function selectExperiment(v:any,chapter:any){
  state.activeTab.item=v
  state.activeTab.chapterId=chapter.id
  emit('selectExperiment',v)
  // pdf 视频 跳页面展示
  // const { href } = router.resolve({
  //   path: "/teacher/Workbench/open-jupyte",
  // });
  // window.open(href, "_blank");
}
function prepare(a:any) {
  a.startup=true
  // return
  let param: any = {
    type: "course",
    opType: "prepare",
    // taskId: experiment_id.value,
    taskId:500152
  };
  let task_type={
    type:4,
    programing_type:0
  }
  if (task_type.type === 4) {
    // webide
    if (task_type.programing_type === 1) {
      router.push({
        path: "/vm/ace",
        query: {
          type: param.type,
          opType: param.opType,
          taskId: param.taskId,
          routerQuery: JSON.stringify(routeQuery),
        },
      });
    } else {
      toVmConnect(router, param, routeQuery);
    }
  } else {
    toVmConnect(router, param, routeQuery);
  }
}
function ViewExperiment(a:any){
  a.openGuidance=!a.openGuidance
  // a.type 如果是pdf 或者MP4 新开页面播放
}
// 编辑章节下素材、实验列表
const establishChapter=(v:any)=>{
  state.activeTab.chapterId=v.id
  emit('establishChapter',v)
}
// 编辑章节名称
const editChapter=(v:any)=>{
  emit('editChapter',v)
}
// 删除章节
const deleteChapter=(v:any)=>{
  emit('deleteChapter',v)
}

// 编辑章节下实验名称
const editExperiment=(v:any)=>{
  // selectExperiment(v)
  //  悬浮编辑可加选中状态 
  emit('editExperiment',v)
}
// 删除章节下实验
const deleteExperiment=(v:any,a:any)=>{
  let obj={
    v:v,
    a:a
  }
  emit('deleteExperiment',obj)
}
</script>

<style lang="less" scope>
  .chapterList{
    // padding-bottom: 2rem;
    .title{
      justify-content: space-between;
      height: 46px;
      border-bottom: 1px dashed #e8e8e8;
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
        .titleItem2{
          // max-width: 50%;
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
        padding: 0 8px;
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
        // max-height: 500px;
        // overflow: auto;
        .experiment{
          border: 1px solid rgba(0,0,0,0.15);
          padding: 20px 10px 20px 30px;
          .itemContentBox{
            overflow: auto;
            max-height: 420px;
          }
          .itemContent{
            transition: all .5s;
            h4{
              margin-bottom: 1rem;
            }
            .text{
              height: 100%;
              white-space: pre-wrap;
              color: var(--black-65);
              margin-bottom: 1.5rem;
            }
          }
        }
        .video-box{
          height: 500px;
          width: 100%;
          video{
            width:100%;
            height:100%;
            object-fit: cover;
          }
        }
        .pdfBox{
          height: 500px;
          width: 100%;
        }
      }
    }
  }
  .operation{
    margin: 0 1rem;
    .iconfont{
      color: #1CB2B3;
      cursor: pointer;
      padding: 0 6px;
    }
  }
</style>