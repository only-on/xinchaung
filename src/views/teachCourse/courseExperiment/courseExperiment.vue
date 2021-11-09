<template>
  <div class="course-experiment-box">
    <div class="course-experiment-left">
      <div class="action-top-box">
        <a-button type="primary" size="small">+自定义章节</a-button>
        <a-button type="primary" size="small" @click="openAddChapter">+添加章节</a-button>
        <a-button type="primary" size="small" @click="openAddExperiment">+添加实验</a-button>
      </div>
      <div class="bacGray">
        <span data-v-d3afaa76="" class="waring-icon">!</span
        >已添加的实验/章节可以拖动排序
      </div>
      <div class="course-menu-tree">
          <drag-tree :treeData="treeData" @selectChapter="selectChapter" @selectExperiment="selectExperiment" @editNode="editNode"></drag-tree>
      </div>
    </div>
    <div class="course-experiment-right">
        <chapterDetail v-if="rightTab==='chapterDetail'"/>
        <addChapter v-if="rightTab==='addChapter'"/>
        <addExperiment v-if="rightTab==='addExperiment'"/>
        <experimentDetail v-if="rightTab==='experimentDetail'"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent ,onMounted,reactive,toRefs,provide,ref} from "vue";
import DragTree from 'src/components/dragTree.vue'
import {getCourseTreeApi,updateChapterApi} from "./api"
import {useRoute} from "vue-router"
import chapterDetail from "./chapterDetail.vue"
import addChapter from "./addChapter.vue"
import addExperiment from "./addExperiment.vue"
import experimentDetail from "./experimentDetail.vue"

export default defineComponent({
    components:{
        "drag-tree":DragTree,
        chapterDetail,
        experimentDetail,
        addChapter,
        addExperiment
    },
  setup() {
      const route=useRoute();
      const course_id=route.query.course_id as any as number
      const chapter_id=ref("")
      const experiment_id=ref("")
      provide("course_id",course_id)
      provide("chapter_id",chapter_id)
      provide("experiment_id",experiment_id)
      const reactiveData=reactive({
          treeData:[],
          rightTab:"chapterDetail"
      })
      onMounted(()=>{
          getCourseTree()
      })
      function selectChapter(val:any) {
          console.log(val);
          chapter_id.value=val.id
          reactiveData.rightTab="chapterDetail"
      }
      function selectExperiment(val:any) {
        console.log(val);
        experiment_id.value=val.id
         reactiveData.rightTab="experimentDetail"
      }
      // 打开添加章节面板
      function openAddChapter() {
          reactiveData.rightTab="addChapter"
      }
      // 打开添加实验面板
      function openAddExperiment() {
          reactiveData.rightTab="experimentDetail"
      }
      // 获取课程实验树
      function getCourseTree() {
          getCourseTreeApi({course_id:course_id}).then((res:any)=>{
              console.log(res);
              reactiveData.treeData=res.data
          })
      }

      // 编辑课程实验
      function editNode(val:string, nodeId:number) {
          console.log(val,nodeId);
          updateChapterApi({course_id:course_id,chapter_id:nodeId},{chapter_name:val}).then((res:any)=>{
              console.log(res);
              getCourseTree()
          })
      }
      return {
          selectChapter,
          selectExperiment,
          editNode,
          ...toRefs(reactiveData),
          openAddChapter,
          openAddExperiment,
          provide
      }
  },
});
</script>

<style lang="less">
.course-experiment-box {
  display: flex;
  flex-direction: row;
  height: 100%;
  .course-experiment-left {
    width: 440px;
    flex-shrink: 0;
    height: 100%;
    background: @white;
    border-radius: @border-radius-base;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .action-top-box {
      padding: 15px;
      flex-shrink: 0;
      >button{
          margin-right: 15px;
          font-size: 14px;
      }
    }
    .bacGray {
      flex-shrink: 0;
      padding: 0 26px;
      color: rgba(5, 1, 1, 0.25);
      font-size: 12px;
      line-height: 30px;
      background: #fafafa;
      .waring-icon {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 0.5px solid rgba(5, 1, 1, 0.25);
        display: inline-block;
        line-height: 13px;
        text-align: center;
        margin-left: 5px;
      }
    }
    .course-menu-tree{
        flex: 1;
    }
  }
  .course-experiment-right {
    height: 100%;
    flex: 1;
    width: 200px;
    margin-left: 15px;
    // background: @white;
    border-radius: @border-radius-base;
  }
}
</style>
