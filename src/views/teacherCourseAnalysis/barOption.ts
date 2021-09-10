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
			formatter: '{b}<br />{a0}: {c0}%<br />{a1}: {c1}%'
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
          textStyle: {
            fontSize: '12px',
            color: 'rgba(0,0,0,0.45)'
          }
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
		formatter: "{a} <br/>{b}: {c} ({d}%)"
	},
	title:{
			text:"1330人",
			// subtext: '111',
			left:'28%',
			top:"45%",
			textStyle:{
					color:"rgba(0,0,0,0.85)",
					fontSize:32,
					fontWeight:500,
					align:"center",
			}
	},
	graphic:{
			type:"text",
			top:"40%",
			left: "30%",
			style:{
					text:"总人数",
					textAlign:"center",
					top: '10%',
					left: '10%',
					fill:"rgba(0,0,0 ,.45)",
					fontSize:12,
					fontWeight:700
			}
	},
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
				center: [130, 140],
				radius: ['45%', '75%'],
				avoidLabelOverlap: false,
				fontSize: 12,
				label: {
					normal: {
						show: false
					}
				},
				emphasis: {
					scale: false
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

export { barOption, pieOption }