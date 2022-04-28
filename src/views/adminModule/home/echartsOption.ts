import * as echarts from 'echarts';
function activityOption(data:any){
    const options:any={
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
            x:'3%',
            data: ['总数', '学生', '教师']
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
              name:'',
              data: ['00:00', '03:00', '06:00', '09:00', '12:00','15:00','18:00','21:00','24:00']
            }
          ],
          yAxis: [
            {
              name:'',
              type: 'value'
            }
          ],
          series: [
            {
              name: '总数',
              type: 'line',
              emphasis: {
                focus: 'series'
              },
              data:[2,10,24,56,9,45,67,89,12]
            },
            {
              name: '学生',
              type: 'line',
              emphasis: {
                focus: 'series'
              },
              data:[3,4,56,9,67,67,12,86,34]
            },
            {
              name: '教师',
              type: 'line',
              emphasis: {
                focus: 'series'
              },
              data:[23,50,64,16,29,5,34,60,7]
            }
          ]
    }
return options
}
function resourceOption(data:any){
    const options:any={
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
            x:'3%',
            data: ['cpu', '内存', 'GPU','磁盘']
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
              name:'',
              data: ['00:00', '03:00', '06:00', '09:00', '12:00','15:00','18:00','21:00','24:00']
            }
          ],
          yAxis: [
            {
              name:'',
              type: 'value'
            }
          ],
          series: [
            {
              name: 'cpu',
              type: 'line',
              emphasis: {
                focus: 'series'
              },
              data:[2,10,24,56,9,45,67,89,12]
            },
            {
              name: '内存',
              type: 'line',
              emphasis: {
                focus: 'series'
              },
              data:[3,4,56,9,67,67,12,86,34]
            },
            {
              name: 'GPU',
              type: 'line',
              emphasis: {
                focus: 'series'
              },
              data:[23,50,64,16,29,5,34,60,7]
            },
            {
                name: '磁盘',
                type: 'line',
                emphasis: {
                  focus: 'series'
                },
                data:[8,41,7,16,22,5,33,44,5]
              }
          ]
    }
    return options
}

function dashboardResource(data:any,color:any){
  const options:any={
    color:color,
    series: [
      {
        type: 'gauge',
        startAngle:90,
        endAngle:-270,
        progress: {
          show: true,
          width:20
        },
        pointer: {
        show: true,
        showAbove:false,
        width:8,
        offsetCenter: [-3, -24],
        length: "20%"
        },
        axisLine: {
          lineStyle: {
            width: 18
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
          length:15,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          show: false,
          distance: 25,
          color: '#999',
          fontSize: 20
        },
        anchor: {
          show:true,
          showAbove: true,
          size:50,
          itemStyle: {
            borderWidth: 1,
            borderColor:'white',
            width:30,
            shadowColor:'#999',
            shadowOffsetY:2,
            shadowOffsetX:2,
            shadowBlur: 10
          }
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize:10,
          offsetCenter: [0, '0%'],
          formatter:function (value:any) {
            return '剩余'+`\n`+value+'G'
          }
        },
        data: [
          {
            value: 70
          }
        ]
      }
    ]
  }
  return options
}
function dashboardService(data:any,color:any){
  const options:any={
    color:color,
    series: [
      {
        type: 'gauge',
        startAngle:205,
        endAngle:-25,
        progress: {
          show: true,
          width:20
        },
        pointer: {
        show: true,
        showAbove:false,
        width:1,
        offsetCenter: [0,0],
        length: "52%"
        },
        axisLine: {
          lineStyle: {
            width: 18
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
          length:15,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          show: false,
          distance: 25,
          color: '#999',
          fontSize: 2
        },
        anchor: {
          show:true,
          showAbove: true,
          size:5,
          itemStyle: {
            borderWidth: 1,
            borderColor:color,
            width:3
          }
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation:false,
          fontSize:10,
          offsetCenter: [0, '0%'],
          formatter:function (value:any) {
            return ''
          }
        },
        data: [
          {
            value: 70
          }
        ]
      }
    ]
  }
  return options
}
export {activityOption,resourceOption,dashboardResource,dashboardService}