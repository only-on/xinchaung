<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" type="card">
      <a-tab-pane key="1" tab="实验得分">
        <score-chart :data="scoreData" type="first"></score-chart>
      </a-tab-pane>
      <a-tab-pane key="2" tab="重修得分" forceRender v-if="scoreData.again && Object.keys(scoreData.again).length > 0">
        <score-chart :data="scoreData" type="again"></score-chart>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch, onMounted } from "vue";
import ScoreChart from "./scoreChart.vue";

export default defineComponent({
  components: {
    ScoreChart,
  },
  props: ["scoreData"],
  setup(props) {
    var activeKey = ref<string>("1");
    var scoreData = ref<any>({});
    onMounted(()=>{
      setTimeout(()=>{
        scoreData.value = props.scoreData
        console.log(scoreData.value)
      }, 400)
    })
    return {
      activeKey,
      scoreData,
    };
  },
});
</script>
<style lang="less" scoped>
:deep(.ant-tabs.ant-tabs-card ) {
  .ant-tabs-card-bar {
    .ant-tabs-tab{
      border-radius: 0;
    }
    .ant-tabs-tab-active {
      border-top: 2px solid @theme-color !important;
    }
  }
  .ant-tabs-top-content {
    padding: 0 40px;
  }
}
</style>
