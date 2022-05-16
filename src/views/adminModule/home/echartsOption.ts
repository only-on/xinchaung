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
            right: '5%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              name:'',
              // data: ['00:00', '03:00', '06:00', '09:00', '12:00','15:00','18:00','21:00','24:00']
              data:data.hours
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
              // data:[2,10,24,56,9,45,67,89,12]
              data:data.totalCount?data.totalCount:[]
            },
            {
              name: '学生',
              type: 'line',
              emphasis: {
                focus: 'series'
              },
              // data:[3,4,56,9,67,67,12,86,34]
              data:data.stuCount
            },
            {
              name: '教师',
              type: 'line',
              emphasis: {
                focus: 'series'
              },
              // data:[23,50,64,16,29,5,34,60,7]
              data:data.teacherCount
            }
          ]
    }
return options
}
function resourceOption(data:any,){
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
            right: '5%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              name:'',
              data:data.hours
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
              // data:[2,10,24,56,9,45,67,89,12]
              data:data.cpu
            },
            {
              name: '内存',
              type: 'line',
              emphasis: {
                focus: 'series'
              },
              data:data.mem
            },
            {
              name: 'GPU',
              type: 'line',
              emphasis: {
                focus: 'series'
              },
              data:data.gpu
            },
            {
                name: '磁盘',
                type: 'line',
                emphasis: {
                  focus: 'series'
                },
                data:data.disk
              }
          ]
    }
    return options
}

function dashboardResource(data:any,data1:any,type:any,color:any){
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
        length: "14%"
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
          show:true,
          offsetCenter: [0, "-10%"],
          fontSize:14
        },
        detail: {
          valueAnimation: true,
          fontSize:10,
          fontWeight: "bolder",
          offsetCenter: [0, '20%'],
          // formatter:function (value:any) {
          //   return `${value}G`
          // },
          // formatter: "{value}"+type,
          formatter: data+type,
          rich: {
            "<style_name>": {
              align: "left"
            }
          }
        },
        data: [
          { name:'剩余',
            value:data1
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
        name: "Indicator",
        type: 'gauge',
        startAngle:205,
        endAngle:-25,
        radicus:'10%',
        progress: {
          show: true,
          width:10
        },
        pointer: {
        show: true,
        showAbove:false,
        offsetCenter: [0,0],
        width:2,
        length: "49%",
        icon:'src/assets/images/admin/home/enter1.png'
        },
        axisLine: {
          lineStyle: {
            width: 10
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
          show: true,
          offsetCenter: [0,"40%"],
          color: "black", 
          fontSize: 20, 
        },
        detail: {
          valueAnimation:false,
          fontSize:16,
          fontWeight:400,
          color:'#999',
          offsetCenter: [0, '90%'],
          formatter:function (value:any) {
            return data.use?data.use:'--'+'/'+data.total?data.total:'--'+data.type
          }
        },
        // return params[0].name + '<br>收缩压 : '+params[0].data +' mmHg'+ '<br>舒张压 : '+params[1].data +' mmHg'
        data: [
          {
            value:data.rate,
            name:data.name
          }
        ]
      }
    ]
  }
  return options
}
export {activityOption,resourceOption,dashboardResource,dashboardService}