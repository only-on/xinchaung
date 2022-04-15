<template>
  <div id="inClassTest">
    <div class="tree">
      <!-- <chapterTree
          :chartLoading="chartLoading"
          :chapterList="ChaptersTreeList"
          :Editable="props.Editable"
          @deleteChapter="deleteChapter"
          @editExperiment="editExperiment"
          @editChapter="editChapter"
          @selectExperiment="selectExperiment" 
          @establishChapter="establishChapter" /> -->
    </div>
    <div class="test">
      <div class="inTestHeader">
        <div class="inclass-header-left">
          <span
            >共发布
            <span class="number">{{statisTic.all_type_count}}</span>
            道题</span
          >
          <span>
            <span class="number">{{statisTic.choice_type_count}}</span>
            道选择题</span
          >
          <span><span class="number">{{statisTic.questioning_type_count}}</span> 道问答题</span>
        </div>
        <div class="inclass-header-right">
          <span class="statistic" @click="scoreStatistic">
            <span class="icon iconfont icon-shijian"></span>
            <span>成绩统计</span>
          </span>

          <a-dropdown>
            <a-button type="primary">出题</a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <div @click="selectTuestion('ques')">选择题</div>
                </a-menu-item>
                <a-menu-item>
                  <div @click="selectTuestion('answer')">问答题</div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="testList">
        <testList @deleteQues="deleteQues" :datalist='datalist'></testList>
      </div>
    </div>
    <achievementStatis
      v-if="componentName == 'achievementStatis'"
      :modalVisable="state.visible"
      @updateVisable="updateVisable"
    ></achievementStatis>
    <choiceques
      v-if="componentName == 'choiceques'"
      :modalVisable="state.visible"
      @updateVisable="updateVisable"
    ></choiceques>
    <explainques
      v-if="componentName == 'explainques'"
      :modalVisable="state.visible"
      @updateVisable="updateVisable"
    ></explainques>
  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  ref,
  toRef,
  inject,
  reactive,
  toRefs,
  nextTick,
onMounted,
} from "vue";
import { Modal, message } from "ant-design-vue";
import testList from "./testList/index.vue";
import achievementStatis from "./achievementStatis/index.vue";
import choiceques from "./choiceques/index.vue";
import explainques from "./explainques/index.vue";
import chapterTree from "../courseDetail/components/Chapter/ChapterList.vue";
import request from 'src/api/index'
const http = (request as any).teacherInclassTest;
interface Istate {
  visible: boolean;
}
const state: Istate = reactive({
  visible: false,
});
const datalist:any=ref('')
const statisTic:any=ref('')
const componentName: any = ref("");
// 出题弹框
function selectTuestion(type: any) {
  console.log(type);

  // componentName.value = type === "ques" ? "choiceques" : "explainques";
  if (type === "answer") {
    state.visible = true;
    // componentName.value = "achievementStatis";
    componentName.value = "explainques";
  }
  if (type === "ques") {
    componentName.value = "choiceques";
  }
  state.visible = true;
}
//成绩统计弹框
function scoreStatistic() {
  state.visible = true;
  componentName.value = "achievementStatis";
}
function updateVisable(value: any,addok:any) {
  console.log(value, "value");
  state.visible = value;
  if(addok){
    inclassTestList()
  }
}
function deleteQues(id: any) {
  http.deleteInclassTestItem({urlParams:{question_id:id}}).then((res:any)=>{
    inclassTestList()
  })
}
// 选择tree章节
function selectExperiment(val: any) {
  console.log(val);
}
function inclassTestList(){
  http.inClasstestList({urlParams:{content_id:500001}}).then((res:any)=>{
    datalist.value=res.data.list
    statisTic.value=res.data.analysis
  })
}
onMounted(()=>{
  inclassTestList()
})
</script>
<style lang="less" scoped>
#inClassTest {
  display: flex;
  justify-content: space-between;
}
.tree,
.test {
  height: 714px;
  overflow-y: auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 var(--black-0-7);
  background: var(--white-100);
}
.tree {
  width: 470px;
}
.test {
  width: 714px;
  padding: 24px;
  .inTestHeader {
    display: flex;
    justify-content: space-between;
    .inclass-header-left {
      & > span {
        margin-right: 16px;
        .number {
          color: var(--primary-color);
        }
      }
    }

    .statistic {
      margin-right: 16px;
      .iconfont {
        color: var(--primary-color);
      }
    }
    .statistic:hover {
      cursor: pointer;
    }
  }
  .testList {
    margin-top: 23px;
  }
}
</style>
