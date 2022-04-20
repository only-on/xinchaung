<template>
    <div>
       <div class="statistic">
           实验成绩分布图
           <span class="score">
               <span class="max">(最高分:{{statisData?.maxScore}}</span>
               <span class="min">最低分:{{statisData?.minScore}}</span>
               <span class="average">平均分:{{statisData?.avgScore}})</span>
           </span>
       </div>
       <div class="chart">
        <div id="line-chart"></div>
        <div id="pie-chart">
            <div class="pie-chart-row">
                <div class='pie-item'>
                <div class="title">
                    实验报告提交率
                </div>
                <Progress type="circle" :percent='statisData?.ExperimentalReportSubmissionRate' :width='100' :strokeWidth='10' strokeColor='#00C8Bf' />
            </div>
            <div class='pie-item'>
                <div class="title">
                    随测正确率
                </div>
                <Progress type="circle" :percent='statisData?.inClassTestAccuracyRate' :width='100' :strokeWidth='10' strokeColor='#f6bc3a' />
            </div>
            </div>
            <div class='pie-item'>
                <div class="title">
                    自动评分率
                </div>
                <Progress type="circle" :percent='statisData?.automaticScoringCorrectRate' :width='100' :strokeWidth='10' strokeColor='#6791fb' />
            </div>
        </div>
       </div>
    </div>
</template>
<script lang="ts" setup>
import distributionOfResults from './distributionOfResults/index.vue'
import * as echarts from 'echarts';
import { Progress } from 'ant-design-vue';
import { onMounted } from '@vue/runtime-core';
import leftPanelVue from 'src/views/shareModule/VirtualMachine/VmLayout/leftPanel.vue';

interface Props {
  statisData:any
}
const props = withDefaults(defineProps<Props>(), {
  statisData: () => {},
})
var option:any={};
option = {
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  color:['#FF9544','#00CBC2','#6993FE','#FFC33D'],
  legend: {
    x:leftPanelVue,
    icon:'circle',
    data: ['最终成绩', '实验报告', '自动评分', '随测']
  },
  grid: {
    left: '3%',
    right: '14%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      name:'分数段',
      data: ['0-60', '60-70', '7-80', '80-90', '90-100']
    }
  ],
  yAxis: [
    {
      name:'人数',
      type: 'value'
    }
  ],
  series: [
    {
      name: '最终成绩',
      type: 'line',
      stack: 'Total',
      areaStyle: {
        color:new echarts.graphic.LinearGradient(0, 0, 0,1,[{offset:0,color:'#ff954433'},{offset:1,color:'#ff954400'}]),
      },
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '实验报告',
      type: 'line',
      stack: 'Total',
      areaStyle: {
        color:new echarts.graphic.LinearGradient(0, 0, 0,1,[{offset:0,color:'#00cbc233'},{offset:1,color:'#00cbc200'}]),
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: '自动评分',
      type: 'line',
      stack: 'Total',
      areaStyle: {
        color:new echarts.graphic.LinearGradient(0, 0, 0,1,[{offset:0,color:'#6993fe33'},{offset:1,color:'#6993fe00'}]),
      },
      emphasis: {
        focus: 'series'
      },
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: '随测',
      type: 'line',
      stack: 'Total',
      areaStyle: {
        color:new echarts.graphic.LinearGradient(0, 0, 0,1,[{offset:0,color:'#fac85866'},{offset:1,color:'#fac85800'}]),
      },
      emphasis: {
        focus: 'series'
      },
      data: [320, 332, 301, 334, 390, 330, 320]
    }
  ]
};
onMounted(()=>{
    var chartDom:any = document.getElementById('line-chart');
    var myChart = echarts.init(chartDom);
    option && myChart.setOption(option);
})

</script>
<style lang="less" scoped>
    .score{
        margin-left: 10px;
        .max,.min,.average{
            color: var(--gray-6);
            margin-right: 16px;
        }
    }
    .chart{
        display: flex;
    }
    #line-chart{
        width: 500px;
        height: 300px;
    }
    .pie-chart-row{
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    #pie-chart{
        flex: 1;
        .title{
            text-align: center;
            margin-bottom: 10px;
        }
        .pie-item{
            text-align: center;
            width:45%;
        }
    }
</style>