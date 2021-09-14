<template>
    <div class="experScore">
        <div class="getScoreItem">
            <a-table bordered :columns="columns" :data-source="data" :pagination='false'></a-table>
        </div>
        <div class="pieChart">
            <div id="pieChart"></div>
        </div>
        <div class="histogram">
            <div id="taskTime"></div>
            <div id="correctRate"></div>
        </div>
    </div>
</template>
<script lang="ts">
import * as echarts from "echarts"
import {defineComponent, onMounted,ref} from 'vue'
export default defineComponent({
    name:'experScore',
    setup:(props,context)=>{
        const columns=[{
            title: '得分项',
            dataIndex: 'scoreItem',
            key: 'scoreItem',
            width:100,
        },{
            title: '分数',
            dataIndex: 'score',
            key: 'score',
            width:70,
        }]
        const data=[
            {key: '1',scoreItem:'用时得分',score: 10},
            {key: '2',scoreItem:'习题得分',score: 33},
            {key: '3',scoreItem:'报告得分',score: 33},
            {key: '4',scoreItem:'总分',score: 33},
            ]
        var option={
    tooltip: {
        trigger: 'item'
    },
    color:['#8955b5','#eb7e64','#f6bd16'],
    legend: {
        orient: 'vertical',
        bottom: 'bottom',
        icon: "circle",  
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            data: [
                {value: 1048, name: '用时得分'},
                {value: 735, name: '习题得分'},
                {value: 580, name: '报告得分'},
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
        }
        var option1={
            title: {
            subtext: '任务用时(分钟)',
            subtextStyle: {
            fontSize: 16,
            },
            bottom: "80%",
        },
        color: ["#8955b4","#ccb5de"],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter:(param:any)=>{
            return param[0].name+":"+param[0].value
      }
        },
        grid: {
        left: "0%",
        right: "20",
        bottom: "15%",
        containLabel: true,
    },
        xAxis: {
            axisLabel:{
          formatter:(val:any)=>{
            return val
          }
        }
        },
        yAxis: {
            type: 'category',
            data: ['任务用时', '标准用时' ],
             axisTick: {
          alignWithLabel: true,
        },
        axisLabel:{
          formatter:(val:any)=>{
            var str = ''
            str=val.substring(0,2)+'\n'+val.substring(2,6)
            return str
          }
        }
        },
        series: [
            {   name: "任务用时",
                type: 'bar',
                data: [18, 23],
                barWidth :15,
                itemStyle: {
                            //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
                            emphasis: {
                                barBorderRadius: 30
                            },

                            normal: {
                                //柱形图圆角，初始化效果
                                barBorderRadius:[0, 25, 25,0],
                                color: function(params:any) {
                                var colorList = [
                                    '#CCB5DF','#8F5EB9'
                                ];
                                return colorList[params.dataIndex]
                            }
                            }
                        },
            }
        ]
        }
        var option2={
              title: {
        subtext: '正确率(%)',
        subtextStyle:{
            fontSize:16,
        },
        bottom:'80%',
    },
    color:["#eb7f65","#ffc82a"],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter:(param:any)=>{
            return param[0].name+":"+param[0].value+'%'
        }
    },
    grid: {
        left: '0%',
        right: '5%',
        bottom: '15%',
        containLabel: true
    },
    xAxis: {
        axisLable:{
            formatter:(val:any)=>{
                var str=''
                str=val
                return str
            }
        }
    },
    yAxis: {
        type: 'category',
        data: ['习题正确率', '步骤正确率' ],
        axisLable:{
            formatter:(val:any)=>{
                 var str = ''
            str=val.substring(0,2)+' '+'\n'+val.substring(2,6)
            return str
            }
        }
    },
    series: [
        {
            type: 'bar',
            data: [18, 23],
            barWidth :'40%',
            itemStyle: {
                normal: {
                    //柱形图圆角，初始化效果
                    barBorderRadius:[0,25,25,0],
                    color: function(params:any) {
                    var colorList = [
                        '#FFC719','#EB7E64'
                    ];
                  return colorList[params.dataIndex]
              }
                }
            },
        }
    ]
        }
        function drawChart1(){
        //饼状图
            let chartDom:any = document.getElementById('pieChart');
            let myChart = echarts.init(chartDom);
            myChart.setOption(option);
            return myChart  
        }
        // 任务用时
        function drawCharts2(){
            let chartDom:any = document.getElementById('taskTime');
            let myChart = echarts.init(chartDom);
            myChart.setOption(option1);
            return myChart 
        }
        // 正确率
        function drawCharts3(){
            let chartDom2:any = document.getElementById('correctRate');
            let myChart2 = echarts.init(chartDom2);
            myChart2.setOption(option2);
            return myChart2  
        }
        onMounted(()=>{
            drawChart1()
            drawCharts2()
            drawCharts3()
        })
        return{echarts,columns,data,option,option1,option2,drawChart1,drawCharts2,drawCharts3}
    }
})
</script>
<style lang="less">
.experScore{
   display: flex;
   justify-content: space-between;
   padding: 20px 10px;
   .getScoreItem{
       width: 174px;
   }
   .pieChart{
       width:348px;
   }
   #pieChart{
       width:348px;
       height: 300px;
   }
   .histogram{
       width: 350px;
       #taskTime{
           width: 318px;
           height: 200px;
       }
       #correctRate{
           width: 318px;
           height: 200px;
       }
   }
}
</style>