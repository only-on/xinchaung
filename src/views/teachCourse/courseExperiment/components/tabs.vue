<template>
  <div class="experiment-tabs">
    <span :class="currentKey === 1 ? 'active' : ''" @click="keyChange(1)"
      >详情</span
    >
    <span :class="currentKey === 2 ? 'active' : ''" @click="keyChange(2)"
      >报告</span
    >
    <span :class="currentKey === 3 ? 'active' : ''" @click="keyChange(3)"
      >习题({{ experimentExerciseSum }})</span
    >
    <a-button type="primary" v-role="[tab]" @click="prepare">备课</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { toVmConnect, IEnvirmentsParam } from "src/utils/vncInspect"; // 打开虚拟机
import { getContentExerciseAnalysisApi } from "../api";
export default defineComponent({
  props: ["currentKey","sum"],
  setup(props, { emit }) {
    const router = useRouter();
    const currentKey: any = ref(1);
    const detailInfo: any = inject("detailInfo");
    const experiment_id: any = inject("experiment_id");
    const tab: any = inject("tab");
    const routeQuery = useRoute().query;
    const experimentExerciseSum = ref(0);
    watch(
      () => props.sum,
      () => {
        experimentExerciseSum.value = props.sum;
      }
    );
    watch(
      () => experiment_id,
      () => {
        emit("update:currentKey",1)
      },{deep:true}
    );
    watch(
      () => props.currentKey,
      () => {
        currentKey.value = props.currentKey;
      }
    );
    onMounted(()=>{
      getContentExerciseAnalysis();
    })
    function prepare() {
      let param: any = {
        type: "course",
        opType: "prepare",
        taskId: experiment_id.value,
      };
      if (detailInfo.value.task_type.type === 4) {
        // webide
        if (detailInfo.value.task_type.programing_type === 1) {
          router.push({
            path: "/vm/ace",
            query: {
              type: param.type,
              opType: param.opType,
              taskId: param.taskId,
              routerQuery: JSON.stringify(routeQuery),
            },
          });
        } else {
          // note
          //   router.push({
          //   path:'/vm/notebook',
          //   query:{
          //     type:param.type,
          //     opType:param.opType,
          //     taskId:param.taskId,
          //     routerQuery: JSON.stringify({detailId:detailId,course_id:course_id})
          //   }
          // })
          toVmConnect(router, param, routeQuery);
        }
      } else {
        toVmConnect(router, param, routeQuery);
      }
    }
    function keyChange(key: number) {
      emit("update:currentKey", key);
      emit("change", key);
    }
    // 获取习题统计
    function getContentExerciseAnalysis() {
      getContentExerciseAnalysisApi({ content_id: experiment_id.value }).then(
        (res: any) => {
          emit("update:sum",res.data.question_total)
        }
      );
    }
    return {
      keyChange,
      currentKey,
      prepare,
      tab,
      experimentExerciseSum,
    };
  },
});
</script>

<style lang="less">
.experiment-tabs {
  background: var(--black-100);
  margin: 16px 0;
  height: 40px;
  display: flex;
  padding: 0 15px;
  align-items: center;
  font-size: 14px;
  color: var(--black-45);
  > span {
    margin-right: 50px;
    position: relative;
    line-height: 40px;
    padding: 0 15px;
    cursor: pointer;

    &.active {
      color: var(--purpleblue-6);
      transition: 0.5s;
      &::after {
        position: absolute;
        content: "";
        width: 100%;
        height: 2px;
        background: var(--purpleblue-6);
        bottom: 0;
        left: 0;
        transition: 0.5s;
      }
    }
  }
  button {
    margin-left: auto;
  }
}
</style>
