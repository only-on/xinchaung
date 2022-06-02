<template>
  <div id="statistic-pie" style="width=100%;height: 100%;"></div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted,inject,reactive, watch} from "vue";
import * as echarts from "echarts"
import {getThemeData} from 'src/utils/theme'
const {systemColor} = getThemeData()
// console.log(systemColor)
interface IData {
  name: string
  value: number,
  color:string
}
const props = withDefaults(defineProps<{title: string;data: IData[]}>(), {
  title: '素材资源统计',
  data: () =>  [], // { value:10, name: '私有资源',color:'' }, { value:5, name: '公开资源',color:'' }
}); 
const data:any=reactive([
  { value:0, name: '私有',color:'#1cb2b3' }, { value:0, name: '公开',color:systemColor.primary }
])

const drawEcharts = () => {
  const option={
    color:[data[0].color,data[1].color,],
    title: {
      text: props.title,
      left: '0%',
      top:'0%', 
      textStyle: {
        color: 'rgba(0, 0, 0, 0.85)',
        fontWeight: 'normal',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      show: true,
      icon: "circle",
      top: "30%",
      left: "0%",
      width: 50,
      // padding: [0, 5],
      itemGap: 15,
      itemHeight: 6,
      orient: "vertical",
      // top: '35%',
      // left: '0%',
      formatter: function (name:any) {
        var data = option.series[0].data;
        var total = 0;
        var tarValue;
        for (var i = 0; i < data.length; i++) {
          total += data[i].value;
          if (data[i].name == name) {
            tarValue = data[i].value;
          }
        }
        var value = tarValue;
        return [
          `{name|${name}}`,
          `{value|${value}}`
        ].join('\n')
      },
      textStyle:{
        rich:{
          name:{
            fontSize:12,
            color:"#808294",
            // lineHeight:30,
          },
          value:{
            fontSize:20,
            color:"#102241",
            // lineHeight:20,
            fontWeight: "bold",
            padding: [5, 0],
          }
        }
      },
    },
    series: [
      {
        name: '',
        type: 'pie',
        center: ['68%', '50%'],
        radius: ['60%', '80%'],
        // roseType: 'radius',
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show:false,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  }
  const chartDom:any = document.getElementById("statistic-pie")
  const chart = chartDom && echarts?.init(chartDom)
  chart && chart.setOption(option);
}
onMounted(() => {
  drawEcharts()
})
watch(
  ()=> props.data, 
  () => {
    if(props.data.length){
      data[0].value=props.data[0].value?props.data[0].value:0
      data[1].value=props.data[1].value?props.data[1].value:0

      props.data[0].name?data[0].name=props.data[0].name:''
      props.data[1].name?data[1].name=props.data[1].name:''

      props.data[0].color?data[0].color=props.data[0].color:''
      props.data[1].color?data[1].color=props.data[1].color:''
    }
    drawEcharts()
  },{
    deep: true, immediate: true
  }
)
</script>