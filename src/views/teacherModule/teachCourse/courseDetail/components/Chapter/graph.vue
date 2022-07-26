<template>
  <h3 class="graphTit">知识点</h3>
  <div class="graphBox">
    <div id="graph"></div>
    <div class="magnifier" @click="viewAtlas()">
      <span class="iconfont icon-fangda"></span>
    </div>
  </div>
  <a-modal v-model:visible="Visible" title="知识点" :width="1200" class="modal-post" :destroyOnClose="true">
    <div id="KnowledgePoints">

    </div>
    <template #footer>
      <span></span>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,nextTick, reactive} from "vue";
import { Knowledge,HotWords,Knowledge3} from './echartsOption';
import request from 'src/api/index'
const http=(request as any).teachCourse
interface Props {
  courseId: number;
}
const props = withDefaults(defineProps<Props>(), {
  // knowledge: ()=> [],  //  知识点
  // words: ()=> [],      // 热词
  courseId: 0,
});
var Visible:Ref<boolean>=ref(false)
var chartData:any=reactive({})
function viewAtlas(){
  Visible.value=true
  nextTick(()=>{
    Knowledge3('KnowledgePoints',chartData,28)
  })
}
const courseknowledge=()=>{
  // list.length=0
  http.courseknowledge({urlParams: {courseId:props.courseId}}).then((res: any) => {
    const {data}=res
    chartData={...data}
    // list.push(...data)
    nextTick(()=>{
      Knowledge3('graph',chartData,28)
    })
  });
}
onMounted(() => {
  // console.log(props.courseId)
  courseknowledge()
});
</script>

<style lang="less" scope>
  .graphTit{
    // margin-bottom: 1rem;
    // color: var(--blue-6-2);
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #dcdcdc;
  }
  .graphBox{
    width: 100%;
    height: 166px;
    margin-bottom: 2rem;
    position: relative;
    #graph{
      width: 100%;
      height: 100%;
      // border: 1px solid red;
    }
    .magnifier{
      position: absolute;
      right: 0;
      bottom: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.40);
      color: #ffffff;
      cursor: pointer;
      z-index: 999;
    }
  }
  .modal-post{
    #KnowledgePoints{
      height: 800px;
      width: 100%;
      padding: 40px;
    }
  }
</style>