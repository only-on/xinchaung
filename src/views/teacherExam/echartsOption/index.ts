// import { options } from './../../teachCourse/evalute/components/public';
import * as echarts from "echarts"
function distributionEcharts(el: HTMLDivElement, data: Array<any>) {
  var max_num:number= 2
  // let indicatorData:Array<any>=[{name:'A(90% ~100%)',max:max_num},{name: "B(80% ~90%)",max:max_num},{name: "C(70%~80%)",max:max_num},{name: "D(60% ~70%)",max:max_num},{name: "E(0 ~60%)",max:max_num}]
  let seriesData:Array<number>=[]
	let indicatorData:Array<any>=[]
	data.map((v:any)=>{
		v.max=2
		delete v.value
		seriesData.push(v.value)
	})
	// console.log(data);
	indicatorData=data
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
	let res=["选择题","判断题","填空题","简答题","实操考核题",];
	var maxData:Array<any> = [],
		minData:Array<any> = [],
		averageData:Array<any> = [],
		xAxisLabeData:Array<any> = [];
	data.forEach((v:any)=>{
		maxData.push(v.highest_score)
		minData.push(v.lowest_score)
		averageData.push(v.average_score)
		xAxisLabeData.push(res[v.type_id-1])
	})
  
  const chart = echarts.init(el)
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
// 成绩明细-成绩详情
import choice from '/src/assets/images/teacherExam/choice.png'
import judgement from '/src/assets/images/teacherExam/judgement.png'
import completion from '/src/assets/images/teacherExam/completion.png'
import shortAnswer from '/src/assets/images/teacherExam/shortAnswer.png'
import shicao from '/src/assets/images/teacherExam/shicao.png'

function renderScoreBar(el: HTMLDivElement, data: Array<any>){
	// {type_id: 1, type_name: "单选题", avg_score: 0, my_score: 0}
	// let data=[
	// 	{avg_score: 2, my_score: 3, type_name: "选择题"},
	// 	{avg_score: 0, my_score: 0, type_name: "判断题"},
	// 	{avg_score: 1, my_score: 2, type_name: "填空题"},
	// 	{avg_score: 0, my_score: 0, type_name: "简答题"},
	// 	{avg_score: 10, my_score: 8, type_name: "实操考核题"}
	// ]
	//成绩详情柱状图
	let chartDatas:any = {
		typeArr:[],
		avarageScore: [],
		personalScore: []
	}
	for (var i = 0; i < data.length; i++) {
		chartDatas.typeArr.push(data[i].type_name)
		chartDatas.avarageScore.push(data[i].avg_score)
		chartDatas.personalScore.push(data[i].my_score)
	}
	var max_num = function () {
		var maxNum:number=0;
		var arr = chartDatas.avarageScore.concat(chartDatas.personalScore)
		var maxNum = Math.max.apply(null, arr)
		return maxNum + maxNum*0.1
	}
	let option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			},
			extraCssText: 'width:160px;height:90px;'
		},
		legend: {
			top: 0,
			right: '40%',
			itemWidth: 28,
			itemHeight: 13,
			color: '#6C6E72',
			data: ['我的成绩', '平均分']
		},
		grid: {
			top: '12%',
			left: '0%',
			right: '0%',
			bottom: '0%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				inside: false,
				color: '#6c6e72',
				fontSize: '14',
				// height:30
			},
			data: chartDatas.typeArr
		}],
		yAxis: {
			show: false,
			max: max_num()
		},
		series: [{
			name: '我的成绩',
			type: 'bar',
			itemStyle: {
				show: true,
				color: '#8955b5',
				borderRadius: 5
			},
			zlevel: 2,
			barWidth: 28,
			label: {
				color: '#8955b5',
				show: true,
				position: ['0', '-20'],
				distance: 5,
				formatter: '{c}' + '分'
			},
			data: chartDatas.personalScore,
		}, {
			name: '平均分',
			type: 'bar',
			itemStyle: {
				show: true,
				color: '#e3c3fd',
				borderRadius: 5
			},
			zlevel: 1,
			barWidth: 28,
			label: {
				show: true,
				color:'#6C6E72',
				position: ['0', '-20'],
				formatter: '{c}' + '分'
			},
			data: chartDatas.avarageScore,
		}]
	};
	const chart = echarts.init(el)
	// chart.dispose()
	chart.setOption(option)
  return chart;

}
//成绩明细数据温度计图
function renderAccuracy(el: HTMLDivElement, datas: Array<any>) {
	// var AccuracyChart = echarts.init(document.getElementById('accuracy-canvas'));
	// let datas=[
	// 	{rate: 0, name: "选择题"},
	// 	{rate: 0.1, name: "判断题"},
	// 	{rate: 0.2, name: "填空题"},
	// 	{rate: 0.3, name: "简答题"},
	// 	{rate: 0.6, name: "实操考核题"}
	// ]
	//成绩明细数据温度计图
	var chartsDatas = datas

	var xAxisData = []; //坐标轴文字
	var rightData = []; //正确题数

	for (var i = 0; i < chartsDatas.length; i++) {
		xAxisData.push(chartsDatas[i].type_name)
		rightData.push(chartsDatas[i].rate * 100+16)
	}
	var series = [{
			name: '条',
			type: 'bar',
			xAxisIndex: 0,
			data: rightData,
			barWidth: 12,
			label: {
				show: true,
				position: ['8', '-12'],
				distance: 5,
				formatter: function (parms:any) {
					// console.log(parms.value)
					return '{b|}' + '{d|>}' + (parms.value-16) + '%'
				},
				rich: {
					d: { //箭头
						color: '#8955B5',
					},
					c: {
						color: '#07a387',
						align: 'left',
					},
					b: { //横线
						width: 20,
						height: 0,
						borderWidth: 1,
						borderColor: '#8955B5',
						align: 'left'
					},
				},
				color: '#8955B5',
			},
			itemStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					offset: 0,
					color: '#8955b5  ' // 0% 处的颜色
				}, {
					offset: 1,
					color: '#8955b5 ' // 100% 处的颜色
				}], false),
				borderRadius: [10, 10, 0, 0],
			},
			z: 2
		},
		{
			name: '外框',
			type: 'bar',
			xAxisIndex: 2,
			barGap: '-100%',
			data: [130,130,130,130,130],
			barWidth: 28,
			itemStyle: {
				color: '#e0d4ff',
				borderRadius: [30, 30, 0, 0],
			},
			z: 0
		},
		{
			name: '圆',
			type: 'scatter',
			// hoverAnimation: false,
			data: [0,0,0,0,0],
			xAxisIndex: 0,
			symbolSize: 48,
			itemStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#8955b5'
					},
					{
						offset: 1,
						color: '#c3c4fd'
					}
				]),
				opacity: 1,
			},
			label:{
				show:true,
				formatter:function(params:any){
					switch(params.name){
						case '选择题':return '{a|}';
						case '判断题':return '{b|}';
						case '填空题':return '{c|}';
						case '简答题':return '{d|}';
						case '实操考核题':return '{e|}';
					}
				},
				rich: {
					a: {
						backgroundColor: {
							image:  choice
						},
						height: 24
					},
					b: {
						backgroundColor: {
							image: judgement
						},
						height: 20
					},
					c: {
						backgroundColor: {
							image: completion
						},
						height: 24
					},
					d: {
						backgroundColor: {
							image: shortAnswer
						},
						height: 24
					},
					e: {
						backgroundColor: {
							image: shicao
						},
						height: 24
					}
				}
			},
			z: 2
		},
		{
			name: '外圆',
			type: 'scatter',
			// hoverAnimation: false,
			data: [0,0,0,0,0],
			xAxisIndex: 2,
			symbolSize: 60,
			itemStyle: {
				color: '#c3c4fd',
				opacity: 1,
			},
			z: 0
		}
	];

	var options = {
		backgroundColor: 'transparent',
		boundaryGap: false,
		grid: {
			left: '-10%',
			right: '0%',
			bottom: '0%',
			top: '0%',
			containLabel: true
		},
		tooltip: {
			show: false,
			trigger: 'item',
			padding: [8, 10], //内边距
			formatter: '{b}<br />正确率: {c0}%',
		},
		xAxis: [{
				type: 'category',
				axisTick: {
					show: false
				},
				axisLine: {
					show: false,
				},
				axisLabel: {
					color: '#6c6e72',
					fontSize: '14',
					margin:40
				},
				data: xAxisData
			},
			{
				type: 'category',
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				splitArea: {
					show: false
				},
				splitLine: {
					show: false
				},
				data: xAxisData
			},
			{
				type: 'category',
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				splitArea: {
					show: false
				},
				splitLine: {
					show: false
				},
				data: xAxisData
			},{
				show: false,
				min: -110,
				max: 100,

			}],
		yAxis:[{
			show: false,
			min: 0,
			max: 130,
		}, {
			show: false,
			data: [],
			min: 0,
			max: 130,
		}],
		series: series

	};
	const chart = echarts.init(el)
	// chart.dispose()
	chart.setOption(options);
}
export {
  distributionEcharts,
  typeStatisticsEcharts,
	renderScoreBar,
	renderAccuracy
}