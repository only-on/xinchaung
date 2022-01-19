import { theme } from 'src/utils/theme'
export interface IpieData {
  done: number,
  undone: number
}
interface IknowledgeMap {
  parentNode: string,
  childNodes: IchildNodes[]
}
interface IchildNodes{
  content_id: string,
  contentvia: any[],
  type: string
}
// 课程完成率
export const pieOptions = (data: IpieData) => {
  let options = {
    color: [theme.themeColor, theme.nextThemeColor],
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '15',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: data.done, name: '已完成' },
          { value: data.undone, name: '未完成' }
        ]
      }
    ]
  }
  return options
}
// 课程成绩分布
export const radarOptions = (data: any) => {
  let datas:any[] = [data["0"], data.D, data.C, data.B, data.A]
  var assmax = Math.max.apply(null, datas) * 1.5;
  var indicator = assmax === 0 ? [
    { name: '未完成', min: assmax },
    { name: 'D', min: assmax },
    { name: 'C', min: assmax },
    { name: 'B', min: assmax },
    { name: 'A', min: assmax }]
    : [
      { name: '未完成', max: assmax },
      { name: 'D', max: assmax },
      { name: 'C', max: assmax },
      { name: 'B', max: assmax },
      { name: 'A', max: assmax }
    ]
  let options = {
    tooltip: {},
    radar: {
      indicator: indicator,
      center: ['50%', '55%'],
      axisName: {
        color: '#666'
      },
      splitArea: {
        areaStyle: {//内区块
          color: 'transparent',
          shadowColor: theme.nextThemeColor,
          shadowBlur: 10
        }
      },
      splitLine: {
        lineStyle: {
          color: theme.themeColor
        }
      },
      axisLine: {
        lineStyle: {
          color: theme.themeColor  //半径线条
        },
        symbolSize: [0, 1]
      },
      axisTick: {
        length: 1
      }
    },
    series: [{
      type: 'radar',
      areaStyle: { type: 'default' },
      data: [
        {
          value: datas,
          name: "成绩分布",
          label: {
            show: true,
            color: theme.themeColor,
            // formatter:'{c}人',
            position: 'top',
            formatter: function (params: any) {
              var type = ['a', 'b', 'c', 'd', 'e'];
              var index = params.data.value.indexOf(params.value);
              return '{' + type[index] + '|' + params.value + '人}';
            },
            rich: {
              a: {
                padding: [0, 0, 0, 0],
              },
              b: {
                padding: [0, 35, 0, 0],
              },
              c: {
                padding: [0, 30, 0, 0],
              },
              d: {
                padding: [0, 0, 0, 0],
              },
              e: {
                padding: [0, 0, 0, 35],
              }
            }
          },
          itemStyle: {
            color: theme.themeColor,
          },
          lineStyle: {
            color: theme.themeColor,
          },
          areaStyle: {
            color: theme.nextThemeColor,
          }
        }
      ]
    }]
  }
  return options
}
// 截取字符串
function stringToArray(val: string, number: number) {
  var len = val.length / number
  var si = 0
  let arr = []
  for (let i = 0; i < len; i++) {
    si = i * number
    arr.push(val.substring(si, si + number))
  }
  return arr
}
// 实验成绩分布
export const scaterOptions = (type: number, data: any) => {
  var seriesData: any[] = [];
  var taskNameLength: any[] = []
  var xNames: any[] = []
  var markLines: any[] = []
  let rowTextLength = Object.keys(data).length > 20 ? 6 : 10
  Object.keys(data).forEach(function (taskid, ind) {
    markLines.push({ xAxis: ind })
    taskNameLength.push(Math.ceil(data[taskid]["time"][0].name.length / rowTextLength))
    xNames.push(taskid);
    Object.keys(data[taskid]).forEach(function (key) {
      if (type == 1) {
        data[taskid]["time"].forEach(function (item: any) {
          seriesData.push([ind, Number(item['list'][0]['usedtime']), item['list']]);
        })
      } else {
        data[taskid]["score"].forEach(function (item: any) {
          seriesData.push([ind, Number(item['list'][0]['score']), item['list']]);
        })
      }
    })
  });
  let options = {
    color: [theme.themeColor],
    tooltip: {
      position: 'top',
      formatter: function (params: any) {
        if (params.data.length > 0) {
          let tips = ''
          if (type == 1) {
            params['data'][2].forEach(function (item: any) {
              tips = tips + item['username'] + " " + item['usedtime'] + "分钟" + "<br>"
            })
          } else {
            params['data'][2].forEach(function (item: any) {
              tips = tips + item['username'] + " " + item['score'] + "分" + "<br>"
            })
          }
          return tips;
        }
      }
    },
    grid: {
      left: 20,
      bottom: 30,
      right: 40,
      containLabel: true
    },
    dataZoom: [{
      type: 'inside'
    }, {
      type: 'slider',
      show: Object.keys(data).length <= 7 ? false : true,
      start: 0,
      end: Object.keys(data).length >= 7 ? 30 : 100,
      backgroundColor: theme.nextThemeColor, //组件的背景颜色
      fillerColor: theme.themeColor, //选中范围的填充颜色
      handleSize: 10,//滑动条的 左右2个滑动条的大小
      showDetail: false,
      height: 10,//组件高度
      handleColor: '#fff',//h滑动图标的颜色
      handleStyle: {
        borderColor: theme.themeColor,
        borderWidth: "1",
        shadowBlur: 2,
        background: "#ddd",
        shadowColor: "#ddd",
      }
    }],
    xAxis: [
      {
        show: true,
        type: 'category',
        boundaryGap: true,
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          formatter: function (value: any, index: any) {
            let valArray = stringToArray(data[xNames[value]][type == 1 ? 'time' : 'score'][0].name, rowTextLength)
            let str = valArray.join('\n')
            return str
          }
        }
      }
    ],
    yAxis: [{
      show: true,
      name: type == 1 ? '分钟' : '分数',
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#eee',
          type: 'solid'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#000',
          type: 'solid'
        }
      },
    }],
    series: [{
      name: 'Punch Card',
      type: 'scatter',
      symbolSize: 20,
      markLine: {
        symbol: ['none', 'none'],
        label: { show: false },
        data: markLines
      },
      data: seriesData
    }]
  }
  return options
}
// 知识图谱
function setTagData(knowledge_map: IknowledgeMap) {
  let links:any[] = []
  let data:any[] = []
  if(Object.keys(knowledge_map).length ==0) {
    return {data,links}
  }
  data.push(
    {
      name: knowledge_map.parentNode,
      id: knowledge_map.parentNode,
      symbolSize: 50,
      draggable: true,
      itemStyle: {
        borderColor: theme.themeColor,
        borderWidth: 6,
        shadowBlur: 20,
        shadowColor: theme.themeColor,
        color: '#000'
      },
      category: 0,
    }
  )
  knowledge_map.childNodes.forEach((item: any) => {
    if (item.contentvia) {
      data.push({
        name: item.contentvia.name,
        id: item.contentvia.id,
        symbolSize: 30,
        draggable: true,
        itemStyle: {
          borderColor: theme.themeColor,
          borderWidth: 6,
          shadowBlur: 20,
          shadowColor: theme.themeColor,
          color: '#384A67'
        },
        category: 1,
      })
      links.push({
        source: knowledge_map.parentNode,
        target: item.contentvia.id,
      })
      item.contentvia.knowledages.forEach((knowledage: any) => {
        data.push({
          name: knowledage.knowledgeMap.knowledge_map_name,
          id: item.contentvia.id + "->" + knowledage.knowledgeMap.id,
          symbolSize: 15,
          draggable: true,
          itemStyle: {
            borderColor: theme.themeColor,
            borderWidth: 6,
            shadowBlur: 20,
            shadowColor: theme.themeColor,
            color: '#b0ccfe'
          },
          category: 1,
        })
        links.push({
          source: item.contentvia.id,
          target: item.contentvia.id + "->" + knowledage.knowledgeMap.id,
        })
      })
    }
  })
  return {data,links}
}
export const graphOptions = (data: any) => {
  let datas = setTagData(data)
  let options = {
    tooltip: {
      formatter: function (val: any) {
        return val.name
      }
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: 1000,
          edgeLength: 50
        },
        roam: true,
        label: {
          show: true
        },
        data: datas.data,
        links: datas.links,
        lineStyle: {
          width: 5,
          curveness: 0
        },
        categories: [
          { name: '0' },
          { name: '1' },
          { name: '2' }
        ]
      }
    ]
  }
  return options
}