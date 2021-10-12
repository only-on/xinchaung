<template>
  <div class="experiment-ratio">
    <slot name="title"></slot>
    <div :id="id" style="width: 100%;height: 211px;"></div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs, ref, nextTick, watch } from 'vue'
  import * as echarts from 'echarts'
  import * as option from './barOption'
  export default defineComponent({
    props: {
      id: {
        type: String,
        default: 'echarts-bar1'
      },
      experimentRatioTable: {
        type: Object,
        default: {
          names: ['1', '2'],
          values: [1, 2]
        }
      }
    },
    setup(props) {
      let echartsbar:any
      onMounted(() => {
        nextTick(() => {
          echartsbar = (echarts as any).init(document.getElementById(props.id))
          // option.taskOption.xAxis[0].data = props.experimentRatioTable.names
          // option.taskOption.series[0].data = props.experimentRatioTable.values
          // echartsbar.setOption(option.taskOption)
        })
      })
      
      watch(
        () => {return props.experimentRatioTable}, 
        () => {
        // let echartsbar = (echarts as any).init(document.getElementById(props.id))
          setTimeout(() => {
            option.taskOption.xAxis[0].data = props.experimentRatioTable.names
            option.taskOption.series[0].data = props.experimentRatioTable.values
            echartsbar.setOption(option.taskOption)
          }, 1)
        }, 
        {deep: true, immediate: true}
      )
      return {

      }
    }
  })
</script>

<style lang="less" scoped>
.experiment-ratio  {
  width: 252px;
  height: 377px;
  border: 1px solid #dcc0f4;
  &:last-child {
    margin-left: 44px;
  }
  &:nth-child(2) {
    margin: 0 44px;
  }
}
</style>