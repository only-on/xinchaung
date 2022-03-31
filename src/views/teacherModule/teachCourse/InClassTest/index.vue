<template>
  <div id="inClassTest">
    <div class="tree"></div>
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
    <a-modal
      :width="700"
      :cancelText="state.cancelText"
      :okText="state.okText"
      :title="state.modalTitle"
      :visible="state.visible"
      :okButtonProps="state.okButtonProps"
      :confirm-loading="state.confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <component :is="componentName.value" />
      <achievementStatis v-if="componentName == 'achievementStatis'"></achievementStatis>
      <choiceques v-if="componentName == 'choiceques'"></choiceques>
      <explainques v-if="componentName == 'explainques'"></explainques>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, toRef, inject, PropType, reactive, toRefs } from "vue";
import testList from "./testList/index.vue";
import achievementStatis from "./achievementStatis/index.vue";
import choiceques from "./choiceques/index.vue";
import explainques from "./explainques/index.vue";
interface Istate {
  visible: boolean;
  confirmLoading: boolean;
  modalTitle: string;
  cancelText: string;
  okText: string;
  okButtonProps: any;
}
const state: Istate = reactive({
  visible: false,
  confirmLoading: false,
  modalTitle: "",
  cancelText: "取消",
  okText: "确定",
  okButtonProps: { style: { display: "inlineblock" } },
});
const componentName: any = ref("");
// 出题弹框
function selectTuestion(type: any) {
  console.log(type);
  state.modalTitle = type == "ques" ? "出题-选择题" : "出题-问答题";
  state.visible = true;
  state.okButtonProps = { style: { display: "inlineblock" } };
  componentName.value = type == "ques" ? "choiceques" : "explainques";
}
//成绩统计弹框
function scoreStatistic() {
  state.modalTitle = "成绩统计";
  state.visible = true;
  state.cancelText = "关闭";
  state.okButtonProps = { style: { display: "none" } };
  componentName.value = "achievementStatis";
}
function handleOk() {
  state.visible = false;
}
function handleCancel() {
  state.visible = false;
}
function deleteQues(id: any) {
  console.log(id);
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
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 var(--black-0-7);
  background: var(--white-100);
}
.tree {
  width: 40%;
}
.test {
  width: 58%;
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
