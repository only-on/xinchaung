<template>
  <div class="evalute" v-layout-bg="{bg, size:'234px'}">
    <div class="top">
      <course-detail-top :courseInfo="courseInfo"/>
    </div>
    <div class="content">
      <div class="left">
        <drag-tree :treeData="treeData" @selectChapter="selectChapter" @selectExperiment="selectExperiment"></drag-tree>
      </div>
      <div class="right">
         <evalute-content v-show="showChapterContent" :chapterId="chapterId" :courseId="courseId" :show="showChapterContent"></evalute-content>
         <evalute-project v-show="!showChapterContent" :contentId="contentId" :chapterId="chapterId" :courseId="courseId"></evalute-project>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import bg from 'src/assets/images/studentcourse/course-detail_bg.jpg'
import { defineComponent,reactive, Ref, ref, onMounted, provide, watch  } from 'vue'
import EvaluteContent from './components/evaluteContent.vue'
import EvaluteProject from './components/evaluteProject.vue'
import courseDetailTop from '../teacherCourseAnalysis/courseDetailTop.vue'
import DragTree from 'src/components/dragTree.vue'
import request from "src/api/index";
import { Ihttp } from "./typings";
import { IBusinessResp } from "src/typings/fetch.d";
interface ICourseInfo{
  type: string,
  courseType: number,
  courseId: number
}
export default defineComponent({
  components: {
    EvaluteContent,
    DragTree,
    EvaluteProject,
    courseDetailTop
  },
  setup() {
    const http = (request as Ihttp).teachCourse
    var treeData = reactive<any[]>([])
    var chapterId:Ref<number> = ref(0)
    // 501287:成绩 501195:评价 501737
    var courseId:Ref<number> = ref(501234)
    var contentId:Ref<number> = ref(0)
    var showChapterContent:Ref<boolean> = ref(true)
    var courseInfo = reactive<ICourseInfo>({
      type: 'course',
      courseType: 1,
      courseId: courseId.value,
    })
    function getTreeData () {
      treeData.length = 0
      http.getTreeList({urlParams:{courseId: courseId.value}}).then((res:IBusinessResp) => {
        if (res) {
          treeData.push(...res.data)
        }
      })
    }
    // 点击章节
    function selectChapter (val:any) {
      chapterId.value = val.id
      showChapterContent.value = true
    }
    // 点击实验
    function selectExperiment (val:any) {
      contentId.value = val.id
      showChapterContent.value = false
    }
    onMounted(() => {
      getTreeData()
    })
    return {
      bg,
      treeData,
      chapterId,
      courseId,
      showChapterContent,
      contentId,
      courseInfo,
      selectChapter,
      selectExperiment
    }
  },
})
</script>
<style lang="less" scoped>
.evalute{
  width: @center-width;
  margin: 0 auto;
  min-height: 750px;
  .top{
    height: 203px;
  }
  .content{
    margin-top: 20px;
    display: flex;
    height: 600px;
    .left{
      width: 320px;
      background: #fff;
      margin-right: 20px;
      flex-shrink: 0;
      overflow: auto;
    }
    .right{
      flex: 1;
      background: #fff;
      overflow: auto;
    }
  }
  
}
</style>
