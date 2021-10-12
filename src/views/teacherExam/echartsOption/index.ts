import { options } from './../../teachCourse/evalute/components/public';
import * as echarts from "echarts"
function distributionEcharts(el: HTMLDivElement, data: Array<any>) {
  var max_num:number= 2
  let indicatorData:Array<any>=[{name:'A(90% ~100%)',max:max_num},{name: "B(80% ~90%)",max:max_num},{name: "C(70%~80%)",max:max_num},{name: "D(60% ~70%)",max:max_num},{name: "E(0 ~60%)",max:max_num}]
  const seriesData:Array<number>=[0,0,0,0,2]
  const chart = echarts.init(el)
  // let options={}
  var options = {
		backgroundColor: '#fff',
		color: ['rgba(137,85,181,1)'],
		tooltip: {},
    title: {
      text: '考试成绩分布',
			color: '#595b5a',
			fontSize:'16',
    },
		grid: {
			top: '12%',
			left: '3%',
			right: '4%',
			bottom: '0%',
			containLabel: true
		},
		radar: {
			shape: 'polygon',
			center: ['50%', '60%'],
			radius: '80%',
			triggerEvent: true,
			axisName: {
				color: '#333',
					fontSize: '16',
					borderRadius: 3,
					padding: [3, 5]
			},
			axisNameGap: '2',
			indicator: indicatorData,
			splitArea: {
				areaStyle: {
					color: '#fff'
				}
			},
			axisLabel: { //展示刻度
				show: true
			},
			axisLine: { //指向外圈文本的分隔线样式
				lineStyle: {
					color: 'rgba(0,0,0,0)'
				}
			},
			splitLine: {
				lineStyle: {
					width: 1,
					color: '#ccc'
				}
			},
		},
		series: [{
			name: '成绩区间分布人数',
			type: 'radar',
			//  areaStyle: {normal: {}},
			areaStyle: {
        color: 'rgba(137,85,181,.5)'
				// normal: {
				// 	color: 'rgba(137,85,181,.5)'
				// }
			},
			symbolSize: 5,
			lineStyle: {
        color: 'rgba(137,85,181,1)',
        width: 2
				// normal: {
				// 	color: 'rgba(137,85,181,1)',
				// 	width: 2
				// }
			},
			data: [{
				value: seriesData,
				name: '成绩区间分布人数(人)',
			}]
		}]
	};
  chart.setOption(options)
  return chart;
}
function typeStatisticsEcharts(el: HTMLDivElement, data: Array<any>) {
  let res=[
    {name: "选择题", max: 0, min: 0, average: 0},
    {name: "判断题", max: 0, min: 0, average: 0},
    {name: "填空题", max: 0, min: 0, average: 0},
    {name: "简答题", max: 0, min: 0, average: 0},
    {name: "实操考核题", max: 0, min: 0, average: 0}
  ]
  var maxData = [],
		minData = [],
		averageData = [],
		xAxisLabeData = [];
	for (var i = 0; i < res.length; i++) {
		maxData.push(res[i].max)
		minData.push(res[i].min)
		averageData.push(res[i].average)
		xAxisLabeData.push(res[i].name)
	}
  const chart = echarts.init(el)
  // let options={}
  var options = {
		backgroundColor: '#fff',
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
    title: {
      text: '各类型试题统计',
			color: '#595b5a',
			fontSize:'16',
    },
		grid: {
			top: '12%',
			left: '3%',
			right: '4%',
			bottom: '0%',
			containLabel: true
		},
		legend: {
			data: ['最高分', '最低分', '平均分'],
			borderRadius: [5, 5, 0, 0],
			itemWidth: 35,
			itemHeight: 11,
			top: 0,
			right: '4%',
			color: '#333333',
		},
		xAxis: {
			type: 'category',
			data: xAxisLabeData,
			axisTick: {
				show: false
			},
			axisLine: {
				show: true,
				lineStyle: {
					type: 'dashed',
					color: '#ccc',
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					type: 'dashed',
					color: '#ccc ',
				}
			},
			axisLabel: {
				color: '#333',
				fontWeight: 'normal',
				fontSize: '12',
			},
		},
		yAxis: {
			type: 'value',
			// max:'{value}+20',

			axisTick: {
				show: false
			},
			axisLine: {
				show: true,
				lineStyle: {
					type: 'dashed',
					color: '#ccc',
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					type: 'dashed',
					color: '#ccc ',
				}
			},
			axisLabel: {
				color: '#333',
				fontWeight: 'normal',
				fontSize: '12',
			},
		},
		series: [{
				name: '最高分',
				type: 'bar',
				barWidth: '10px',
				barGap: '100%',
				itemStyle: {
					color: '#FF6766',
					borderRadius: 12,
				},
				data: maxData
			},
			{
				name: '最低分',
				type: 'bar',
				barWidth: '10px',
				barGap: '100%',
				itemStyle: {
					color: '#00C99A',
					borderRadius: 11,

				},
				data: minData
			},
			{
				name: '平均分',
				type: 'bar',
				barWidth: '10px',
				barGap: '100%',
				itemStyle: {
					color: '#0E9CFF',
					borderRadius: 11,
				},
				data: averageData
			}
		]
	};
  chart.setOption(options)
  return chart;
}
export {
  distributionEcharts,
  typeStatisticsEcharts
}