let option:any= {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: ['成绩平均分', '成绩最高分']
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '',
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: ''
        }
      }
    ],
    dataZoom: [
      {
        type: 'slider',
        show:true,
        xAxisIndex: 0,
        bottom:30,
        filterMode: 'none',
        height:10,
      },
    ],
    series: [
      {
        name: '成绩平均分',
        type: 'bar',
        color:'#00CBC2',
        barWidth:10,
        itemStyle: {
          //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
          normal: {
           //柱形图圆角，初始化效果
           barBorderRadius: [5, 5, 5, 5],
          }
         },
        tooltip: {
          valueFormatter: function (value:any) {
            return value + ' ml';
          }
        },
        data: [
          2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
        ]
      },
      {
        name: '成绩最高分',
        type: 'line',
        color:'#FF9544',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value:any) {
            return value + ' °C';
          }
        },
        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
      }
    ]
  };
let option1:any = {
    title: {
      text: ''
    },
    legend: {
      data: ['']
    },
    radar: {
    center: ["55%", "43%"],
    radius: ["0%", "60%"],
      nameGap:15,
      indicator: [
        { name: '课程1', max: 6500 },
        { name: '课程2', max: 16000 },
        { name: '看echnology', max: 30000 },
        { name: 'Customer Support', max: 38000 },
        { name: 'Development', max: 52000 },
        { name: 'Marketing', max: 25000 }
      ],
      splitArea:{
        show:true,
        areaStyle:{
          // color:['#FF9544','']
        }
      }
    },
    series: [
      {
        name: '',
        type: 'radar',
        color:'#FF9544',
        backgroundColor:'red',
        data: [
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '111'
          }
        ]
      }
    ]
  };
let option2:any = {
    color:['#FF9A56','#33D0DB','#718CF3','#FF7B7B','#FFCE2B','#FF9A56'],
    series: [
      {
        type: 'treemap',
        data: [
          {
            name: 'nodeA',
            value: 10,
            children: [
              {
                name: 'nodeAa',
                value: 4
              },
              {
                name: 'nodeAb',
                value: 6
              }
            ]
          },
          {
            name: 'nodeB',
            value: 20,
            children: [
              {
                name: 'nodeBa',
                value: 20,
                children: [
                  {
                    name: 'nodeBa1',
                    value: 20
                  }
                ]
              }
            ]
          }
        ],
        top:'10',
        bottom:'70',
        breadcrumb: {
          show: false
        }
      }
    ]
  };
  let option3:any = {
    dataset: [
      {
        // prettier-ignore
        source: [
                  [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
                  [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
                  [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
                  [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
                  [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
              ]
      },
      {
        transform: {
          type: 'boxplot',
          config: { itemNameFormatter: 'expr {value}' }
        }
      },
      {
        fromDatasetIndex: 1,
        fromTransformResult: 1
      }
    ],
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top:'5%',
      left: '10%',
      right: '10%',
      bottom: '30%'
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    dataZoom: [
      {
        type: 'slider',
        show:true,
        xAxisIndex: 0,
        top:'80%',
        filterMode: 'none',
        height:10,
      },
    ],
    yAxis: {
      type: 'value',
      name: '',
      splitArea: {
        show: true
      }
    },
    series: [
      {
        name: 'boxplot',
        color:'#FF9544',
        type: 'boxplot',
        datasetIndex: 1
      },
      {
        name: 'outlier',
        color:'#1CB2B3',
        type: 'scatter',
        datasetIndex: 2
      }
    ]
  };
 function setTagData(knowledge_map: any,size:number) {
  let links: any[] = []
  let data: any[] = []
  if (Object.keys(knowledge_map).length == 0) {
    return { data, links }
  }
  data.push(
    {
      name: knowledge_map.parentNode,
      id: String(knowledge_map.parentNode),
      symbolSize: size,
      draggable: true,
      itemStyle: {
        // borderColor: theme.themeColor,
        // borderWidth: 6,
        // shadowBlur: 10,
        // shadowColor: theme.themeColor,
        color: '#FF9544'
        // color: function () {
        //   // Random color        橙 #FF9544    绿 #1CB2B3    蓝紫  #758AEE
        //   let arr=['#FF9544','#1CB2B3','#758AEE']
        //   return arr[Math.round(Math.random() * 2)]
        // }
      },
      category: 0,
    }
  )
  knowledge_map.childNodes.forEach((item: any) => {
    item.content_id=String(item.content_id)
    if (item.contentvia) {
      item.contentvia.id=String(item.contentvia.id)
      data.push({
        name: item.contentvia.name,
        id: String(item.contentvia.id),
        symbolSize: size,
        draggable: true,
        itemStyle: {
          // borderColor: theme.themeColor,
          // borderWidth: 6,
          // shadowBlur: 10,
          // shadowColor: theme.themeColor,
          color: '#1CB2B3 '
          // color: 'red'
        },
        category: 1,
      })
      links.push({
        source: knowledge_map.parentNode,
        target: item.contentvia.id,
      })
      item.contentvia.knowledages.length?item.contentvia.knowledages.forEach((knowledage: any) => {
        const {knowledge_map_name,id}=knowledage.knowledge_map
        data.push({
          name: knowledge_map_name,
          id: String(item.contentvia.id + "->" +id),
          symbolSize: size,
          draggable: true,
          itemStyle: {
            // borderColor: theme.themeColor,
            // borderWidth: 6,
            // shadowBlur: 10,
            // shadowColor: theme.themeColor,
            color: '#758AEE'
            // color: 'red'
          },
          category: 1,
        })
        links.push({
          source: item.contentvia.id,
          target: item.contentvia.id + "->" + id,
        })
      }):''
    }
  })
  return { data, links}
}
function setOption4(data:any){
  let datas = setTagData(data,50)
  let option:any = {
    tooltip: {
      formatter: function (val: any) {
        return val.name
      }
    },
    grid: {
      left: "10%",
      top: "20%",
      right:'2%',
      bottom:'40%'
    },
    color:['#FE8020','#FFB354','#00CBC2','#6AC8F4'],
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'force',
        smooth: true,
        force: {
          repulsion: 1000,
          edgeLength: 50
        },
        roam: true,
        label: {
          show:true,
          position: 'bottom',
          // padding:[0,0,0,0], //调整左右位置
          formatter: (params: any) => {
            // return params.name+'\n'+params.value
            return params.name
          }
        },
        data: datas?.data,
        links: datas?.links,
        lineStyle: {
          width:1,
          curveness: 0.1,
          color:'source'
        },
        aria: {
          // 下面几行可以不写，因为 label.enabled 默认 true
          // label: {
          //     enabled: true
          // },
          // enabled: true
          decals:{
            symbolSize:0.5,
          },
      },
        categories: [
          { name: '0' },
          { name: '1' },
          { name: '2' }
        ]
      }
    ]
  }
  return option
}

let option5:any= {
  color:['#FF9A56','#33D0DB','#718CF3','#FF7B7B','#FFCE2B','#FF9A56'],
    series: {
      type: 'sankey',
      bottom: '15%',
      left: '5%',
      top: '5%',
      right: '10%',
      layout: 'none',
      emphasis: {
        focus: 'adjacency'
      },
      data: [
        {
          name: 'a'
        },
        {
          name: 'b'
        },
        {
          name: 'a1'
        },
        {
          name: 'a2'
        },
        {
          name: 'b1'
        },
        {
          name: 'c'
        }
      ],
      links: [
        {
          source: 'a',
          target: 'a1',
          value: 5
        },
        {
          source: 'a',
          target: 'a2',
          value: 3
        },
        {
          source: 'b',
          target: 'b1',
          value: 8
        },
        {
          source: 'a',
          target: 'b1',
          value: 3
        },
        {
          source: 'b1',
          target: 'a1',
          value: 1
        },
        {
          source: 'b1',
          target: 'c',
          value: 2
        }
      ],
      lineStyle: {
        color: 'source',
        curveness: 0.5
      },
    }
  };
  export {option,option1,option2,option3,setOption4,option5}