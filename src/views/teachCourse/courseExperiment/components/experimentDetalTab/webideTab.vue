<template>
  <div class="webide-tab-box">
    <div class="note-book-tab-top">
      <div>
        <span class="experiment-name">{{ detailInfo.name }}</span>
        <div class="experiment-type-or-class-count">
          <span>类型{{ detailInfo.task_type.name }}</span>
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
      <experiment-guide v-model="detailInfo.detail"/>
    </template>
    <template v-if="currentKey === 2">
      <report />
    </template>
    <template v-if="currentKey === 3">
      <experiment-exercise v-model:sum="experimentExerciseSum"/>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, inject, watch, ref } from "vue";
import tabs from "../tabs.vue";
import report from "./report.vue";
import experimentExercise from "./experimentExercise.vue";

import experimentGuide from "./experimentGuides.vue"
export default defineComponent({
  components: {
    tabs,
    report,
    "experiment-exercise": experimentExercise,
   
    "experiment-guide":experimentGuide
  },
  setup() {
    const reactiveData = reactive({
    //   currentKey: 1,
    });
    const currentKey =ref(1)
    const detailInfo: any = inject("detailInfo");
    const course_id = inject("course_id") as number;
    const experiment_id: any = inject("experiment_id");
    const know_points = ref([]);
    const experimentExerciseSum=ref(0)
    watch(
      () => detailInfo,
      () => {
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
    function keyChange(key: number) {
      currentKey.value = key;
    }
    return {
      detailInfo,
      keyChange,
      ...toRefs(reactiveData),
      know_points,
      currentKey,
      experimentExerciseSum
    };
  },
});
</script>

<style lang="less">
.webide-tab-box {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.note-book-tab-top {
  background: linear-gradient(270deg, #d3ddff 0%, #e8f9ff);
  border-radius: 4px;
  box-shadow: 0px 3px 6px 0px undefined;
  padding: 27px 22px;
  font-size: 14px;
  color: rgba(@black,0.65);
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
        color: rgba(@black,1);
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
        background: rgba(@theme-color, 0.2);
        border: 1px solid @theme-color;
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
.init-experiment-guide-box {
  flex: 1;
  background: @white;
  padding: 16px 19px;
  .guide-title{
      font-size: 16px;
      font-weight: 600;
  }
  .mark__container {
    // height: 100%;
    .mark__body {
      .mark__preview {
        overflow-y: auto;
        border: none;
      }
    }
  }
}
</style>

