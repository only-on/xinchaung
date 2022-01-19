<template>
  <div class="ratio-distribution">
    <slot name="title"></slot>
    <div :id="id" style="width: 100%;height: 293px;"></div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs, ref, nextTick, watch } from 'vue'
  import * as echarts from 'echarts'
  import * as option from './barOption'
  import {theme} from "src/utils/theme"
  interface ISeriesData {
    value: any
    name: string
  }
  export default defineComponent({
    components: {},
    props: {
      id: {
        type: String,
        default: ''
      },
      achievement: {
        type: Array,
        default: []
      },
    },
    setup(props) {
      let echartsPie: any
      function drawEchartsPie() {
        option.pieOption.color = [theme.themeColor, '#ea775c', '#6d7e9d', '#ffc719', '#e3e6dd']
        let names = ['A', 'B', 'C', 'D']
        let arr:ISeriesData[] = []
        let num = 0
 
        if (props.id === 'echarts-pie1') {

        } else if (props.id === 'echarts-pie2') {
          names = ['优秀', '良好', '合格', '不合格', '未评价']
        } else if (props.id === 'echarts-pie3') {
          names = ['一星', '二星', '三星', '四星', '五星', '未评价']
          option.pieOption.color = [theme.themeColor, '#ea775c', '#6d7e9d', '#ffc719', '#63baad', '#e3e6dd']
        }

        props.achievement.forEach((v: any, i) => {
          arr.push({
            value: v,
            name: names[i]
          })
          num += v
        })
        option.pieOption.series[0].data = arr
        option.pieOption.title.text = [
          '{name|总人数}',
          '{value|'+num+'}'+' {p|人}',
        ].join('\n')
        echartsPie.setOption(option.pieOption)
      }
      onMounted(() => {
        nextTick(() => {
          echartsPie = (echarts as any).init(document.getElementById(props.id))
        })
      })
      watch(
        () => {return props.achievement}, 
        () => {
          setTimeout(() => {
            drawEchartsPie()
          }, 1)
        }, 
        {deep: true, immediate: true}, 
      )
      
      return {
        ...toRefs(props)
      }
    }
  })
  </script>

<style lang="less" scoped>
.ratio-distribution {
  height: 415px;
  width: 360px;
  border: 1px solid #dcc0f4;
  &:nth-child(2) {
    margin: 0 30px;
  }
}
</style>