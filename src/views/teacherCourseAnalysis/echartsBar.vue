<template>
  <div class="echarts-bar">
    <div id="echartsBar" style="width: 100%;height: 100%;"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref, watch, PropType } from 'vue'
import * as echarts from 'echarts'
import * as option from './barOption'
import { IExperimentScore } from './typings'
export default defineComponent({
  components: {},
  props: {
    experimentScore: {
      type: Object as PropType<IExperimentScore>,
      default: {
        studentList: [],
        scoreList: {
          time: [],
          question: [],
          reports: [],
          step: []
        }
      }
    }
  },
  setup(props) {
    let echartsBar:any
    function drawEchartsBar() {
      echartsBar = (echarts as any).init(document.getElementById("echartsBar"))
    }
    onMounted(() => {
      drawEchartsBar()
    })
    watch(() => {return props.experimentScore}, () => {
      option.barOption.xAxis.data = props.experimentScore.studentList
      option.barOption.series[0].data = props.experimentScore.scoreList.time
      option.barOption.series[1].data = props.experimentScore.scoreList.step
      option.barOption.series[2].data = props.experimentScore.scoreList.question
      option.barOption.series[3].data = props.experimentScore.scoreList.reports
      echartsBar.setOption(option.barOption)
    }, {deep: true})
  
    return {

    }
  }
})
</script>

<style lang="less" scoped>
  .echarts-bar {
    height: 380px;
    margin-top: 40px;
  }
</style>