<template>
  <div class="experiment-step-box">
    <div class="line-bg"></div>
    <div style="padding: 15px">
      <div class="step-title">{{type==="experiment"?'实验步骤':'实训任务'}}</div>
      <div class="step-item" v-for="item in steps" :key="item.id">
        <span>{{ item.name }}</span>
        <span class="look-detail-btn" @click="look(item)">查看详情</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch,Ref } from "vue";

export default defineComponent({
  props: ["modelValue","type"],
  setup(props,{emit}) {
    const steps:Ref<any[]> = ref([]);
    watch(
      () => props.modelValue,
      () => {
        steps.value = props.modelValue;
      },
      {
        deep: true,
        immediate: true,
      }
    );
    function look(val:any) {
        emit("look",val)
    }
    return {
      steps,
      look
    };
  },
});
</script>

<style lang="less">
.experiment-step-box {
  .line-bg {
    height: 15px;
    width: 100%;
    background: #f7f7f7;
  }
  .step-title {
    font-size: 16px;
    font-weight: 600;
  }
  .step-item {
    width: 100%;
    // height: 44px;
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    margin-top: 16px;
    padding: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .look-detail-btn{
        color: var(--primary-color);
        &:hover{
            color: rgba(var(--primary-color),0.8);
            cursor: pointer;
        }
    }
  }
}
</style>
