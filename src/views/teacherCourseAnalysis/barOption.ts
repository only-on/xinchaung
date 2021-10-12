let barOption = {
  title: {
		text: '实验得分比例柱状图',
		left: 10,
		textStyle: {
				color: 'rgba(0,0,0,0.85)',
				fontSize: '16px',
				fontWeight: '500'
		}
  },
  legend: {
    itemHeight: 8,
    itemWidth: 8,
    data: [
			{
				name: '用时得分',
				icon: 'rect',
				itemStyle: {
					color: '#8955b5'
				}
			},
			{
				name: '步骤得分',
				icon: 'rect',
				itemStyle: {
					color: '#ea775c'
				}
			},
			{
				name: '习题得分',
				icon: 'rect',
				itemStyle: {
					color: '#ffc719'
				}
			},
			{
				name: '报告得分',
				icon: 'rect',
				itemStyle: {
					color: '#6d7e9d'
				}
			},
    ]
  },
  toolbox: {
		feature: {
		}
  },
  tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow'
		},
			// formatter: '{b}<br />{a0}: {c0}%<br />{a1}: {c1}%'
			// formatter: function (params) {
				// console.log(params)
				// let result = ''
				// // params.forEach(v => {
				// 	var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:30px;height:30px;background-color:#F1E67F"></span>'
        // 	var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:30px;height:30px;background-color:#2BA8F1"></span>' 
				// 	result += params[0].value + "</br>" + dotHtml + ' 数据名称 ' + params[0].data + "</br>" + dotHtml2 + ' 数据名称 ' + params[1].data;
				// // })
				// return result
			// }
		formatter: function (params: any) {
			let str=params[0].name
			params.forEach((item: any,index: number)=>{
				// str=str+'<br/>'+ item.marker + item.seriesName + ' : ' + (item.value).toFixed(2)+'%'
				str=str+'<br/>'+ item.marker + item.seriesName + ' : ' + (item.value)+'%'
			})
			return str
		}
  },
  grid: {
    bottom: 90
  },
  dataZoom: [{
    type: 'inside'
  }, {
    type: 'slider'
  }],
  xAxis: {
		data: ['小花', '小明', '小白'],
		silent: false,
		splitLine: {
			show: false
		},
		splitArea: {
			show: false
		},
		axisLine: {
			show: false,
		},
		axisTick: {
			show: false
		},
		axisLabel: {
			show: true,
				// textStyle: {
			fontSize: '12px',
			color: 'rgba(0,0,0,0.45)'
				// }
		}
  },
  yAxis: {
		type: 'value',
		splitLine: {
			show: false
		},
		splitArea: {
			show: false
		},
		axisLabel: {
			show: true,
			interval: 'auto',
			formatter: '{value}%'
		}
  },
  series: [
    {
      name: '用时得分',
      type: 'bar',
      data: [30, 20, 10],
      // Set `large` for large data amount
    //   large: true,
      barWidth : 30,
      stack: '得分',
			itemStyle: {
				color: '#8955b5'
			}
    },
    {
      name: '步骤得分',
      type: 'bar',
      data: [30, 10, 30],
      // Set `large` for large data amount
    //   large: true,
      barWidth : 30,
      stack: '得分',
			itemStyle: {
				color: '#ea775c'
			}
    },
    {
      name: '习题得分',
      type: 'bar',
      data: [30, 10, 30],
      // Set `large` for large data amount
    //   large: true,
      barWidth : 30,
      stack: '得分',
			itemStyle: {
				color: '#ffc719'
			}
    },
    {
      name: '报告得分',
      type: 'bar',
      data: [10, 10, 30],
      // Set `large` for large data amount
    //   large: true,
      barWidth : 30,
      stack: '得分',
			itemStyle: {
				color: '#6d7e9d'
			}
    },
  ]
};
let pieOption = {
	color: ['#8955b5', '#ea775c', '#6d7e9d', '#ffc719', '#63baad', '#e3e6dd'],
	tooltip: {
		trigger: 'item',
		// formatter: "{b} <br/>人数占比: {d}%"
		formatter: function (params: any) {
			// console.log(params)
			// let str = params[0].name
			// params.forEach((item: any,index: number)=>{
			// 		str=str+'<br/>'+ item.marker + item.seriesName + ' : ' + (item.value).toFixed(2)+'%'
			// })
			return `${params.name}<br/>${params.marker} 人数占比：${params.percent}%`
		}
	},
	title:{
		text: [
			'{name|总人数}',
			'{value|1000}'+'{p|人}',
		].join('\n'),
		rich: {
			value: {
				color: 'rgba(0,0,0,0.85)',
				fontSize: 32,
				fontWeight: 'bold',
				lineHeight: 40,
			},
			name: {
				color: 'rgba(0,0,0,0.45)',
				fontSize: 12,
				lineHeight: 20
			},
			p: {
				color: 'rgba(0,0,0,0.45)',
				fontSize: 18,
			}
		},
		// subtext: '111',
		left:'40%',
		top:"40%",
		textAlign: 'center',
		textStyle:{
			rich: {
				value: {
					color: 'rgba(0,0,0,0.85)',
					fontSize: 32,
					fontWeight: 'bold',
					lineHeight: 40,
				},
				name: {
					color: 'rgba(0,0,0,0.45)',
					fontSize: 12,
					lineHeight: 20
				},
				p: {
					color: 'rgba(0,0,0,0.45)',
					fontSize: 18,
				}
			},
		}
	},
	// graphic:{
	// 		type:"text",
	// 		top:"40%",
	// 		left: "30%",
	// 		style:{
	// 				text:"总人数",
	// 				textAlign:"center",
	// 				top: '10%',
	// 				left: '10%',
	// 				fill:"rgba(0,0,0 ,.45)",
	// 				fontSize:12,
	// 				fontWeight:700
	// 		}
	// },
	legend: {
		icon: 'circle',
		top: '32%',
		right: 22,
		itemHeight: 8,
		itemWidth: 8,
		orient: 'vertical'
	},
	series: [
		{
			// name: '访问来源',
			type: 'pie',
			radius: ['45%', '75%'],
			center: [150, '50%'],
			// center: [130, 140],
			// radius: ['45%', '75%'],
			avoidLabelOverlap: false,
			hoverAnimation:false,
			fontSize: 12,
			label: {
				// normal: {
				show: false
				// }
			},
			emphasis: {
				scale: false,
				color: 'pink'
			},
			// label: {
			// 		show: false,
			// 		position: 'center',
			// 		color: 'rgba(0,0,0,.45)',
			// 		// formatter: "{a} <br/>{b}: {c} ({d}%)"
			// },
			// emphasis: {
			// 		label: {
			// 				show: true,
			// 				fontSize: '40',
			// 				fontWeight: 'bold'
			// 		}
			// },
			labelLine: {
				show: false
			},
			data: [
				{value: 1048, name: '搜索引擎'},
				{value: 735, name: '直接访问'},
				{value: 580, name: '邮件营销'},
				{value: 484, name: '联盟广告'},
				{value: 300, name: '视频广告'}
			]
		}
	]
}
let taskOption = {
	title: {
		show:false,
		text: '',
		x: 'center',
		y: '5%',
		textStyle: {
			fontWeight: 'normal',
			color: '',
			fontSize: 15
		}
	},
	color:['#8955B5','#E8684A','#FFC40D','#6D7E9D','#2ebec0'],
	tooltip : {
		trigger: 'axis',
		formatter: function(params: any) {
			// console.log(params)
			return params[0].marker + params[0].name + '：' + params[0].value
		},
		axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		}
	},
	toolbox: {
		show: false,
	},
	legend: {
		show:false,
		orient: 'vertical',
		x: 'left',
		top:'30%',
		left:'0%',
		data:['任务用时得分','任务步骤得分']
	},
	grid: {
		left: '10%',
		right: '10%',
		bottom: '5%',
		top:'5%',
		containLabel: true
	},
	xAxis : [
		{
			type : 'category',
			data : ['11','22'],
			axisTick: {
				show: false,
				alignWithLabel: true
			},
			axisLine: {
				lineStyle: {   // 轴线
					type: 'solid',
					color: '#ddd'
				}
			},
			splitLine: {
				show: false
			},
			axisLabel: {
				// textStyle: {   // 坐标值的颜色
				color: '#7c7c7c',
				// },
				formatter: function(params: any) {
					let arr = []
					let ii = 0
					for(let i = 0; i < Math.ceil(params.length/5); i++) {
						ii = i * 5
						arr.push(params.substring(ii, ii + 5))
					}
					return arr.join('\n')
				}
			},
		}
	],
	yAxis : [
		{
			type : 'value',
			axisTick: {
				show: true   // 显示刻度
			},
			axisLine: {
				show: true,
				lineStyle: {   // 轴线
					type: 'solid',
					color: '#ddd'
				}
			},
			axisLabel: {
				// textStyle: {   // 坐标值的颜色
				color: '#7c7c7c',
				// }
			},
      splitLine: {
        show: false, // 网格线
      },
		}
	],
	series : [
		{
			name:'',
			type:'bar',
			// barCategoryGap:'50%',  
			barWidth: 26,
			data:[20, 30],
			itemStyle: {
				// normal: {
				borderRadius: [4, 4, 4, 4],
				color: function(params: any) {
					let colorList = ['#8955B5','#efba1c']
					return colorList[params.dataIndex]
				}
				// }
			}
		}
	]
}

export { barOption, pieOption, taskOption }