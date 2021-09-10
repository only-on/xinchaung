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
  interface ISeriesData {
    value: any
    name: string
  }
  export default defineComponent({
    components: {},
    props: {
      id: String,
      achievement: {
        type: Array,
        default: []
      },
      teacherEva: {
        type: Array,
        default: []
      },
      studentEva: {
        type: Array,
        default: []
      },
    },
    setup(props) {
  
      function drawEchartsPie1() {
        let echartsPie1 = (echarts as any).init(document.getElementById("echarts-pie1"))
        let names = ['A', 'B', 'C', 'D']
        let arr:ISeriesData[] = []
        props.achievement.forEach((v, i) => {
          arr.push({
            value: v,
            name: names[i]
          })
        })
        option.pieOption.series[0].data = arr
        echartsPie1.setOption(option.pieOption)
      }
  
      function drawEchartsPie2() {
        let echartsPie2 = (echarts as any).init(document.getElementById("echarts-pie2"))
        let names = ['优秀', '良好', '合格', '不合格', '未评价']
        let arr:ISeriesData[] = []
        props.teacherEva.forEach((v, i) => {
          arr.push({
            value: v,
            name: names[i]
          })
        })
        option.pieOption.color = ['#8955b5', '#ea775c', '#6d7e9d', '#ffc719', '#e3e6dd'],
        option.pieOption.series[0].data = arr
        echartsPie2.setOption(option.pieOption)
      }
  
      function drawEchartsPie3() {
        console.log(props.studentEva)
        let echartsPie3 = (echarts as any).init(document.getElementById("echarts-pie3"))
        let names = ['一星', '二星', '三星', '四星', '五星', '未评价']
        let arr:ISeriesData[] = []
        let num = 0
        props.studentEva.forEach((v: any, i) => {
          arr.push({
            value: v,
            name: names[i]
          })
          num += v
        })
        console.log(props.studentEva)
        console.log(arr)
        option.pieOption.color = ['#8955b5', '#ea775c', '#6d7e9d', '#ffc719', '#63baad', '#e3e6dd']
        // option.pieOption.title.text = num
        option.pieOption.series[0].data = arr
        echartsPie3.setOption(option.pieOption)
      }
      onMounted(() => {
        nextTick(() => {
          if (props.id === 'echarts-pie1') {
            drawEchartsPie1()
          } else if (props.id === 'echarts-pie2') {
            drawEchartsPie2()
          } else if (props.id === 'echarts-pie3') {
            drawEchartsPie3()
          }
        })
      })
      watch(() => {return props.achievement}, () => {
        drawEchartsPie1()
      }, {deep: true})
      
      watch(() => {return props.teacherEva}, () => {
        drawEchartsPie2()
      }, {deep: true})
      
      watch(() => {return props.studentEva}, () => {
        drawEchartsPie3()
      }, {deep: true})
      
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