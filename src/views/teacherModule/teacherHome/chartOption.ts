import { theme } from 'src/utils/theme'
import {getThemeData} from 'src/utils/theme'
const {systemColor} = getThemeData()
// console.log(systemColor)
export interface IpieData {
  done: number,
  undone: number
}
interface IknowledgeMap {
  parentNode: string,
  childNodes: IchildNodes[]
}
interface IchildNodes {
  content_id: string,
  contentvia: any[],
  type: string
}
// 课程完成率
export const pieOptions = (data: IpieData) => {
  const {systemColor} = getThemeData()
  let options = {
    color: data.done === 0 && data.undone === 0 ? [systemColor.Tcolor1] : [systemColor.Tcolor2, systemColor.Tcolor1],
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
        data: data.done === 0 && data.undone === 0 ? [
          { value: data.undone, name: '未完成' }
        ] : [{ value: data.done, name: '已完成' },
        { value: data.undone, name: '未完成' }]
      }
    ]
  }
  return options
}
// 课程成绩分布
export const radarOptions = (data: any) => {
  const {systemColor} = getThemeData()
  // console.log(systemColor)
  // let datas: any[] = [data["0"], data.D, data.C, data.B, data.A]
  let datas: any[] = [data["0"], data.D, data.C, data.B, data.A]
  var assmax = Math.max.apply(null, datas);
  var indicator = assmax === 0 ? [
    { name: '未完成', min: assmax },
    { name: 'D', min: assmax },
    { name: 'C', min: assmax },
    { name: 'B', min: assmax },
    { name: 'A', min: assmax }]
    : [
      { name: '未完成', max:assmax},
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
          shadowColor: systemColor.Tcolor3,
          shadowBlur: 10
        }
      },
      splitLine: {
        lineStyle: {
          color: systemColor.Tcolor3
        }
      },
      axisLine: {
        lineStyle: {
          color: systemColor.Tcolor3  //半径线条
        },
        symbolSize: [0, 1]
      },
      axisTick: {
        length: 1
      },
      nameGap:20,
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
            color: systemColor.Tcolor2,
            // formatter:'{c}人',
            position: 'top',
            formatter: function (params: any) {
              const unit=params.value?'人':''
              const num=params.value?params.value:''
              var type = ['a', 'b', 'c', 'd', 'e'];
              var index = params.data.value.indexOf(params.value);
              // return '{' + type[index] + '|' + params.value + '人}';
              return '{' + type[index] + '|' + num +unit +'}';
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
            color: systemColor.Tcolor4,
          },
          lineStyle: {
            color: systemColor.Tcolor4,
          },
          areaStyle: {
            color: systemColor.Tcolor4,
            // color: 'rgba(255, 149, 68,.25)',
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
  const {systemColor} = getThemeData()
  var seriesData: any[] = [];
  var taskNameLength: any[] = []
  var xNames: any[] = []
  var markLines: any[] = []
  let rowTextLength = Object.keys(data).length > 20 ? 6 : 10
  Object.keys(data).forEach(function (taskid, ind) {
    markLines.push({ xAxis: ind })
    taskNameLength.push(Math.ceil(data[taskid]["time"][0]?.name.length / rowTextLength))
    xNames.push(taskid);
    Object.keys(data[taskid])?.forEach(function (key) {
      if (type == 1) {
        data[taskid]["time"]?.forEach(function (item: any) {
          seriesData.push([ind, item['list'][0] && item['list'][0]['usedtime'] && item['list'][0]['usedtime'] !== null ? Number(item['list'][0]['usedtime']) : '', item['list']]);
        })
      } else {
        data[taskid]["score"]?.forEach(function (item: any) {
          seriesData.push([ind, item['list'][0] && item['list'][0]['score'] && item['list'][0]['score'] !== null ? Number(item['list'][0]['score']) : '', item['list']]);
        })
      }
    })
  });
  let options = {
    color: [systemColor.Tcolor2],
    tooltip: {
      position: 'right',
      formatter: function (params: any) {
        if (params.componentType === 'markLine') {
          return null;
        }
        var tips = ''
        if (type == 1) {
          params['data'][2]?.forEach(function (item: any) {
            tips = tips + item['username'] + " " + item['usedtime'] + "分钟" + "<br>"
          })
        } else {
          params['data'][2]?.forEach(function (item: any) {
            tips = tips + item['username'] + " " + item['score'] + "分" + "<br>"
          })
        }
        return tips;
      }
    },
    grid: {
      left: 40,
      bottom: 30,
      right: 40,
      containLabel: true
    },
    dataZoom: [{
      // type: 'inside',
      type: Object.keys(data).length>30?'slider':'inside',
      show: true,
      startValue: 1,
      endValue:Object.keys(data).length>30?30:Object.keys(data).length,
      // end: data.name.length && data.name.length > 4 ? (4 / data.name.length) * 100 : 100 ,
      xAxisIndex: 0,
      bottom: 30,
      filterMode: "none",
      height: 10,
      // show: Object.keys(data).length <= 7 ? false : true,
      // show:true,
      
      // end: Object.keys(data).length >= 7 ? 30 : 100,
      // backgroundColor: '', //组件的背景颜色
      fillerColor: systemColor.Tcolor2, //选中范围的填充颜色
      // handleSize: 10,//滑动条的 左右2个滑动条的大小
      // showDetail: false,
      // height: 10,//组件高度
      // handleColor: '#fff',//h滑动图标的颜色
      // handleStyle: {
      //   borderColor: systemColor.Tcolor2,
      //   borderWidth: "1",
      //   shadowBlur: 2,
      //   background: "#ddd",
      //   shadowColor: "#ddd",
      // }
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
          show:true
          // show: false
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
      name: type == 1 ? '时长（分钟）' : '分数',
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
  const {systemColor} = getThemeData()
  let links: any[] = []
  let data: any[] = []
  if (Object.keys(knowledge_map).length == 0) {
    return { data, links }
  }
  data.push(
    {
      name: knowledge_map.parentNode,
      id: knowledge_map.parentNode,
      symbolSize: 50,
      draggable: true,
      itemStyle: {
        borderColor: systemColor.Tcolor2,
        borderWidth: 6,
        shadowBlur: 20,
        shadowColor: systemColor.Tcolor2,
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
          borderColor: systemColor.Tcolor2,
          borderWidth: 6,
          shadowBlur: 20,
          shadowColor: systemColor.Tcolor2,
          color: '#384A67'
        },
        category: 1,
      })
      links.push({
        source: knowledge_map.parentNode,
        // target: item.contentvia.id,
        target: item.contentvia.id,
      })
      item.contentvia.knowledages.forEach((knowledage: any) => {
        if(knowledage?.length>0&&knowledage!==null){
          data.push({
            name: knowledage.knowledgeMap.knowledge_map_name,
            id: item.contentvia.id + "->" + knowledage.knowledgeMap.id,
            symbolSize: 15,
            draggable: true,
            itemStyle: {
              borderColor: systemColor.Tcolor2,
              borderWidth: 6,
              shadowBlur: 20,
              shadowColor: systemColor.Tcolor2,
              color: '#b0ccfe'
            },
            category: 1,
          })
          links.push({
            source: item.contentvia.id,
            // target: item.contentvia.id + "->" + knowledage.knowledgeMap.id,
            target: item.contentvia.name + "->" + knowledage.knowledgeMap.name,
          })
        }
      })
    }
  })
  return { data, links}
}
export const graphOptions = (data: any) => {
  let datas = setTagData(data)
  let options = {
    tooltip: {
      formatter: function (val: any) {
        if(val.dataType=="edge"){
          const filterdata=datas.data.filter((item:any)=>{
            return item.id==val.data.target
          })
          const chiName=filterdata[0].name
          return val.data.source+'>'+chiName
        }else{
          return val.name
        }
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