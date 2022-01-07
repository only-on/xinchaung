<template>
  <div class="train-tab-box" v-if="currentShow === 'experiment'">
    <div class="note-book-tab-top">
      <div>
        <span class="experiment-name">{{ detailInfo.name }}</span>
        <div class="experiment-type-or-class-count">
          <span>类型：{{ detailInfo.task_type.name }}</span>
          <span>课时数：{{ detailInfo.class_cnt }}</span>
        </div>
      </div>
      <div v-if="know_points.length>0">
        <span v-for="(item, index) in know_points" :key="index">{{
          item
        }}</span>
      </div>
    </div>
    <tabs v-model:currentKey="currentKey" v-model:sum="experimentExerciseSum" @change="keyChange" />
    <template v-if="currentKey === 1">
      <div class="experiment-detail-box">
        <experiment-guide
          v-model="detailInfo.detail"
          class="init-experiment-guide-box"
          type="experiment"
        />
        <experiment-step
          v-if="detailInfo.step.length > 0"
          v-model="detailInfo.step"
          class="experiment-step-box"
          @look="lookStepDetail"
          type="experiment"
        />
      </div>
    </template>
    <template v-if="currentKey === 2">
      <report />
    </template>
    <template v-if="currentKey === 3">
      <experiment-exercise v-model:sum="experimentExerciseSum"/>
    </template>
  </div>
  <div
    v-if="currentShow === 'step'"
    class="experiment-step-detail-box scrollbar2"
  >
    <div class="step-top-box">
      <div>
        <span class="step-name">{{ stepDetail.name }}</span>
        <span class="icon-fanhui iconfont" @click="backToDetail"></span>
      </div>
      <div>
        <span v-for="(item, index) in stepKnowPoints" :key="index">{{
          item
        }}</span>
      </div>
    </div>
    <div class="step-detail-content">
      <step-intro v-model="stepDetail.summary" />
      <detail-step v-model="stepDetail.detail" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, inject, watch, ref } from "vue";
import tabs from "../tabs.vue";
import report from "./report.vue";
import experimentExercise from "./experimentExercise.vue";

import experimentGuide from "./experimentGuides.vue";
import experimentStep from "./experimentStep.vue";
import stepIntro from "./stepIntro.vue";
import detailStep from "./detailStep.vue";
type TreactiveData = {
  currentShow: "experiment" | "step";
  stepDetail: any;
};
export default defineComponent({
  components: {
    tabs,
    report,
    "experiment-exercise": experimentExercise,
    "experiment-step": experimentStep,
    "experiment-guide": experimentGuide,
    "step-intro": stepIntro,
    "detail-step": detailStep,
  },
  setup() {
    const reactiveData: TreactiveData = reactive({
      //   currentKey: 1,
      currentShow: "experiment",
      stepDetail: {},
    });
    const currentKey = ref(1);
    const detailInfo: any = inject("detailInfo");
    const course_id = inject("course_id") as number;
    const experiment_id: any = inject("experiment_id");
    const know_points = ref([]);
    const stepKnowPoints = ref([]);
    const experimentExerciseSum=ref(0)
    watch(
      () => detailInfo,
      () => {
        reactiveData.currentShow = "experiment";
        if (
          detailInfo.value.know_point &&
          detailInfo.value.know_point.knowledge_name
        ) {
          know_points.value =
            detailInfo.value.know_point.knowledge_name.split(",");
        }
      },
      { deep: true, immediate: true }
    );
    watch(
      () => reactiveData.stepDetail,
      () => {
        if (
          reactiveData.stepDetail &&
          reactiveData.stepDetail.knowledge_id &&
          reactiveData.stepDetail.knowledge_id.knowledge_name
        ) {
          stepKnowPoints.value =
            reactiveData.stepDetail.knowledge_id.knowledge_name.split(",");
        }
      },
      { deep: true }
    );
    function keyChange(key: number) {
      currentKey.value = key;
    }
    // 查看步骤详情
    function lookStepDetail(val: any) {
      stepKnowPoints.value = [];
      reactiveData.stepDetail = val;
      reactiveData.currentShow = "step";
    }
    // 返回详情
    function backToDetail() {
      reactiveData.currentShow = "experiment";
    }
    return {
      detailInfo,
      keyChange,
      ...toRefs(reactiveData),
      know_points,
      currentKey,
      lookStepDetail,
      backToDetail,
      stepKnowPoints,
      experimentExerciseSum
    };
  },
});
</script>

<style lang="less">
.train-tab-box {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.note-book-tab-top {
  background: linear-gradient(270deg, #d3ddff 0%, #e8f9ff);
  border-radius: 4px;
  box-shadow: 0px 3px 6px 0px undefined;
  padding: 27px 22px;
  flex-shrink: 0;
  > div {
    &:first-child {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;
      .experiment-name {
        font-size: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .experiment-type-or-class-count {
        flex-shrink: 0;
        span {
          margin-left: 35px;
        }
      }
    }
    &:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
      > span {
        background: rgba(var(--purpleblue-6), 0.2);
        border: 1px solid var(--purpleblue-6);
        border-radius: 15px;
        padding: 4px 20px;
        margin: 0 10px;
        color: #7b65fa;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
.experiment-report-box {
  flex: 1;
  background: @white;
}
.experiment-detail-box {
  flex: 1;
  background: @white;
  overflow-y: auto;
  .init-experiment-guide-box {
    min-height: 50%;
  }
  .experiment-step-box {
    min-height: 50%;
  }
}
.experiment-step-detail-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    .step-detail-content{
        flex: 1;
        padding-top: 15px;
        overflow-y: auto;
    }
  .step-top-box {
    background: linear-gradient(270deg, #d3ddff 0%, #e8f9ff);
    border-radius: 4px;
    box-shadow: 0px 3px 6px 0px undefined;
    height: 130px;
    padding: 22px;
    > div {
      &:first-child {
        display: flex;
        justify-content: space-between;
        .step-name {
          font-size: 20px;
          font-weight: 500;
        }
        .icon-fanhui {
          cursor: pointer;
          width: 38px;
          height: 38px;
          background: #ebeff8;
          border-radius: 50%;
          line-height: 38px;
          text-align: center;
          color: var(--purpleblue-6);
          &:hover {
            color: rgba(var(--purpleblue-6), 0.8);
          }
        }
      }
      &:nth-child(2) {
        display: flex;
        flex-wrap: wrap;
        margin-top: 12px;
        > span {
          background: rgba(var(--purpleblue-6), 0.2);
          border: 1px solid var(--purpleblue-6);
          border-radius: 15px;
          padding: 4px 20px;
          margin: 0 10px;
          color: #7b65fa;
          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
  }
}
</style>

