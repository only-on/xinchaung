<template>
  <h3 class="courseH3">知识点</h3>
  <div class="graphBox">
    <div id="graph"></div>
    <div class="magnifier" @click="viewAtlas()">
      <span class="iconfont icon-sousuo"></span>
    </div>
  </div>
  <a-modal v-model:visible="Visible" title="知识点" :width="1330" class="modal-post" :destroyOnClose="true">
    <div id="KnowledgePoints">

    </div>
    <template #footer>
      <span></span>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,nextTick} from "vue";
import { Knowledge,HotWords} from './echartsOption';
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
function viewAtlas(){
  Visible.value=true
  nextTick(()=>{
    let data={}
    Knowledge(document.getElementById("KnowledgePoints") as HTMLDivElement,data)
  })
}
const courseknowledge=()=>{
  // list.length=0
  http.courseknowledge({urlParams: {courseId:props.courseId}}).then((res: any) => {
    const {data}=res.data
    // list.push(...data)
  });
}
onMounted(() => {
  // initData() HotWords  courseknowledge
  nextTick(()=>{
    let data={}
    HotWords(document.getElementById("graph") as HTMLDivElement,data)
  })
  courseknowledge()
});
</script>

<style lang="less" scope>
  .courseH3{
    margin-bottom: 1rem;
    // color: var(--blue-6-2);
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
    }
  }
</style>