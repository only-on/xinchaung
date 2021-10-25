<template>
  <div class="course_info" v-layout-bg="{bg,size:'234px'}">
    <div class="header">
      <div class="title">
        <div class="left">
          <div>{{info.name}}</div>
          <span>{{info.course_status}}</span>
        </div>
        <span class="iconfont icon-fanhui" @click="goBack"></span>
      </div>
      <div class="info">
        <div class="left">
          <div class="item">
            <span>{{info.chapters}}</span>
            <span>章节</span>
          </div>
          <div class="line"></div>
          <div class="item">
            <span>{{info.contents}}</span>
            <span>实验</span>
          </div>
          <div class="line"></div>
          <div class="item dir">
            <span>{{info.category}}</span>
            <span>课程方向</span>
          </div>
          <div class="line"></div>
          <div class="item dir">
            <span>{{info.direction}}</span>
            <span>职能方向</span>
          </div>
          <div class="line"></div>
          <div class="item dir">
            <span>{{info.between_time}}</span>
            <span>课程时间</span>
          </div>
        </div>
        <span class="iconfont icon-xiangmu1" @click="Resources" title="课程资源"></span>
      </div>
    </div>
    <div class="coursemain">
      <div class="mainLeft setScrollbar">
        <!-- <Drag-tree :tree="tree" /> -->
        <DragTree :treeData="tree" @selectChapter="selectChapter" @selectExperiment="selectExperiment" />
      </div>
      <div class="mainRight">
        <!-- <component v-if="type === 1 || type === 2" :is="componentName" :chapter_id="chapter_id" :experimentalId="experimentalId" :taskid="taskid" :note_id="note_id" :experimentName="experimentName" /> -->
        <StuChapter v-if="componentName === 'StuChapter'" :chapter_id="chapter_id" />
        <ChapterExperiment v-if="componentName === 'ChapterExperiment'" :experimentalId="experimentalId" :taskid="taskid" :note_id="note_id" :experimentName="experimentName" />
        <div v-if="type === 3">
          <div class="videofu" style="height: 100%; padding: 20px">
            <video style="width: 100%; height: 576px" controls="true" :src="videoUrl"></video>
          </div>
        </div>
        <div style="height: 100%" v-if="type === 4">
          <div style="height: 100%; padding: 20px">
            <iframe :src="pptUrl" id="customViewPdf" class="'+classes+'" name="customViewPdf" width="100%" height="100%" frameborder="0"></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import bg from '../../assets/images/studentcourse/course-detail_bg.jpg'
import { defineComponent,ref, onMounted,inject,reactive, toRefs,Ref,provide} from 'vue'
import { useRouter,useRoute } from 'vue-router';
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch.d';
import StuChapter from './component/StuChapter1.vue'
import ChapterExperiment from './component/ChapterExperiment.vue'
import DragTree from '../../components/dragTree.vue'
import { resolve } from 'path/posix';
import { log } from 'console';

interface IdetailObj{
  info:any;
  tree:any[];
}
export default defineComponent({
  name: 'ContinueDetail',
  components: {
    StuChapter,
    ChapterExperiment,
    DragTree
  },
  setup (props,{emit}){
    const router = useRouter();
    const http=(request as any).studentCourse
    var componentName:Ref<string>=ref('')      // ChapterExperiment   StuChapter type
    var updata=inject('updataNav') as Function
    updata({showContent:false,tabs:[],navPosition:'outside',navType:false})
    
    const route = useRoute();
    var chapter_id:Ref<number>=ref(0)
    var experimentalId:Ref<number>=ref(0)
    var taskid:Ref<number>=ref(0)
    var note_id:Ref<string>=ref('')
    var experimentName:Ref<string>=ref('')
    var type:Ref<number>=ref(0)            // 实验类型 videoUrl   pptUrl
    var videoUrl:Ref<string>=ref('')
    var pptUrl:Ref<string>=ref('')
    var controls='controls'
    const {DetailId,course_id}= route.query
    provide('course_id',course_id)
    provide('detailId',DetailId)
    const detail:IdetailObj=reactive({
      info:{},
      tree:[]
    })
    onMounted(()=>{
      initData()
    })
    function initData(){
     
     http.coursesInfo({param:{id:DetailId}}).then((res:IBusinessResp)=>{
        let data=res.data
        let tree=data.tree
        tree.length?tree.map((v:any)=>{
          v.name=v.chapter_name
          v.contents=v.task_list
          v.contents.length?v.contents.map((i:any)=>{
            i.id=(i.type===1 || i.type===2)?i.tid:i.id
          }):''
        }):''
        detail.info=data
        detail.tree=tree
      })
    }
    function selectChapter(val:any) {
      // console.log(val)
      chapter_id.value=val.id
      componentName.value='StuChapter'
    }
    function selectExperiment(val:any) {
      //  console.log(val)
       componentName.value=''
      //  const dev_base_url=import.meta.env.VITE_APP_BASE_API || ''
       const dev_base_url=(window as any).proxy_api
       type.value=val.type
      if(val.type ===1 || val.type === 2){
        taskid.value=val.tid
        experimentName.value=val.name
        note_id.value=String(val.notes_id)
        experimentalId.value=val.id
        componentName.value='ChapterExperiment'
      }else if (val.type === 3) {
        videoUrl.value = `${val.dataset.file_url}`
      } else if (val.type === 4) {
        pptUrl.value = `/v0.1.0/pdfjs-2.5.207/web/viewer.html?file=${encodeURI(val.dataset.file_path)}`
        // pptUrl.value = `http://192.168.101.150:80/v0.1.0/pdfjs-2.5.207/web/viewer.html?file=${encodeURI(val.dataset.file_path)}`  
  
        // pptUrl.value = `proxyPrefix2/v0.1.0/pdfjs-2.5.207/web/viewer.html?file=${encodeURI(val.dataset.file_path)}`
      }
      
    }
    function Resources(){
      router.push('/studentSideCourse/Resources?course_id='+course_id)
    }
    function goBack(){
      router.go(-1)
    }
    return {...toRefs(detail),bg,controls,type,pptUrl,videoUrl,componentName,experimentName,taskid,note_id,chapter_id,experimentalId,goBack,Resources,selectChapter,selectExperiment};
  },
})
</script>

<style scoped lang="less">
  .course_info{
    height:100%;
    width: @center-width;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    .header{
      color:@white;
      .title{
        // margin-bottom: 20px;
        position: relative;
      }
      .title,.info,.title>.left{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .title .icon-fanhui{
        background-color: @theme-color;
        color: @white;
        font-size: 16px;
        padding: 8px 10px;
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 10px;
      }
      .title .left{
        height: 57px;
        div{
          font-size: 24px;
        }
        span{
          margin-left: 24px;
          padding: 3px 16px;
          border-radius: 11px;
          font-size: 12px;
          background-color: #00d06a;
        }
      }
      .info{
        .left{
          display: flex;
          align-items: center;
          .line{
            width: 1px;
            height: 15px;
            background-color: hsla(0,0%,100%,.75);
            margin-right: 25px;
          }
          .item{
            height: 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            text-align: center;
            span:nth-child(1){
              font-size: 14px;
              font-weight: 500;
              // width: 200px;
            }
            span:nth-child(2){
              font-size: 12px;
              font-weight: 400;
              color: hsla(0,0%,100%,.75);
            }
          }
          .dir{
            span:nth-child(1){
              width: 200px;
            }
          }
        }
        .icon-xiangmu1{
          background-color: #ff8f00;
          color: #fff;
          font-size: 16px;
          padding: 6px 10px;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }
    .coursemain{
      background-color: transparent;
      display: flex;
      justify-content: center;
      padding-top: 44px;
      height: calc(100% - 160px);
      // flex: 1;
      // overflow: auto;
      .mainLeft{
        width: 378px;
        background-color: #fff;
        overflow-y: auto;
        text-align: left;
        margin-right: 10px;
        flex-shrink: 0;
        border-radius: 4px;
      }
      // .mainLeft::-webkit-scrollbar-thumb {
      //   border-radius: 3px;
      //   background: #e3d9ff;
      // }
      // .mainLeft::-webkit-scrollbar{
      //   width: 8px;
      // }
      .mainRight{
        background-color: #fff;
        border-radius: 4px;
        flex: 1;
        height: 100%;
        overflow: hidden;
      }
    }
  }
</style>
