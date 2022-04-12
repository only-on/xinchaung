<template>
  <div id="inClassTest">
    <div class="tree">
      <chapterTree @selectExperiment="selectExperiment"> </chapterTree>
    </div>
    <div class="test">
      <div class="inTestHeader">
        <div class="inclass-header-left">
          <span
            >共发布
            <span class="number">3</span>
            道题</span
          >
          <span>
            <span class="number">2</span>
            道选择题</span
          >
          <span><span class="number">1</span> 道问答题</span>
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
        <testList @deleteQues="deleteQues"></testList>
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
  PropType,
  reactive,
  toRefs,
  nextTick,
} from "vue";
import { Modal, message } from "ant-design-vue";
import testList from "./testList/index.vue";
import achievementStatis from "./achievementStatis/index.vue";
import choiceques from "./choiceques/index.vue";
import explainques from "./explainques/index.vue";
import chapterTree from "../courseDetail/components/Chapter/ChapterList.vue";
interface Istate {
  visible: boolean;
}
const state: Istate = reactive({
  visible: false,
});
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
function updateVisable(value: any) {
  console.log(value, "value");
  state.visible = value;
}
function deleteQues(id: any) {
  console.log(id);
}
// 选择tree章节
function selectExperiment(val: any) {
  console.log(val);
}
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
