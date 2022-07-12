
import * as echarts from "echarts"
import 'echarts-wordcloud';
import {theme} from 'src/utils/theme'

function HotWords(el: HTMLDivElement, data: any){
  const chart = echarts.init(el)
  let option={
    series:[
      {
        type:'wordCloud',
        shape: 'circle',
        // maskImage: maskImage,
        left: 'center',
        top: 'center',
        width: '70%',
        height: '80%',
        right: null,
        bottom: null,
        sizeRange: [12, 40],
        rotationRange: [0, 0],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        layoutAnimation: true,
        textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: function () {
                // Random color        橙 #FF9544    绿 #1CB2B3    蓝紫  #758AEE
                let arr=['#FF9544','#1CB2B3','#758AEE']
                // return 'rgb(' + [
                //     Math.round(Math.random() * 3),
                //     Math.round(Math.random() * 3),
                //     Math.round(Math.random() * 3)
                // ].join(',') + ')';
                return arr[Math.round(Math.random() * 2)]
            }
        },
        emphasis: {
            // focus: 'self',
            // textStyle: {
            //     textShadowBlur: 10,
            //     textShadowColor: '#333'
            // }
        },
        data: [
            {
                name: '热词1',
                value: 1,
            },
            {
              name: '热词2',
              value: 2,
            },
            {
              name: '热词3',
              value: 3,
            },
            {
              name: '热词4',
              value: 65,
            },
            {
              name: '热词5',
              value: 15,
            },
            {
              name: '热词6',
              value: 35,
            },
            {
              name: '热词7',
              value: 47,
            },
        ]
      }
    ]
  }
	chart && chart.setOption(option);
}
function Knowledge(el: HTMLDivElement, data2: any){
  let data=[{
    "name": "节点1",
    "children": [
     {
      "name": "节点2-1",
      "children": [
       {
        "name": "节点31-1",
        "children": [
         {"name": "AgglomerativeCluster", "value": 1},
         {"name": "CommunityStructure", "value": 10},
         
        ]
       },
       {
        "name": "节点31-2",
        "children": [
         {"name": "BetweennessCentrality", "value": 20},
         {"name": "LinkDistance", "value": 50},
         
        ]
       },
       {
        "name": "节点31-3",
        "value": 40,
        "children": [
         {"name": "AspectRatioBanker",}
        ]
       }
      ]
     },
     {
      "name": "节点2-2",
      "children": [
       {"name": "节点32-1", "value": 102},
       {"name": "节点32-2", "value": 58},
       {
        "name": "节点32-3",
        "children": [
         {"name": "ArrayInterpolator", "value": 19},
         {"name": "ColorInterpolator", "value": 20},
         {"name": "DateInterpolator", "value": 13},
        ]
       },
       {"name": "节点32-4", "value": 10,"children":[{"name": "ArrayInterpolator", "value": 19},]},
       {"name": "节点32-5", "value": 51},
       {"name": "节点32-6", "value": 44},
       {"name": "节点32-7", "value": 55},
      ]
     }
    ],
    
   }]
  // data.children.forEach(function (datum:any, index:any) {
  //   // index % 2 === 0 && (datum.collapsed = true);
  // });
  let option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'tree',
        data: data,
        top: '1%',
        left: '7%',
        bottom: '1%',
        right: '20%',
        symbolSize: 14,
        label: {
          position: 'top',
          verticalAlign: 'middle',
          align: 'left',
          fontSize: 12
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        emphasis: {
          // focus: 'descendant'
          textStyle: {
              textShadowBlur: 10,
              textShadowColor: '#1CB2B3'
          }
        },
        tooltip:{
          // trigger:'Item',
          formatter: '{b0}'
        },
        // textStyle: {
        //     fontFamily: 'sans-serif',
        //     fontWeight: 'bold',
        //     color: function () {
                
        //     }
        // },
        expandAndCollapse: false, //  是否展开全部子节点
        animationDuration: 550,
        animationDurationUpdate: 750
      }
    ]
  }
  const chart = echarts.init(el)
  chart && chart.setOption(option);
}
let graph:any={
    "nodes": [
      {
        "id": "0",
        "name": "Myriel",
        "symbolSize": 19.12381,
        "x": -266.82776,
        "y": 299.6904,
        "value": 28.685715,
        "category": 0
      },
      {
        "id": "1",
        "name": "Napoleon",
        "symbolSize": 2.6666666666666665,
        "x": -418.08344,
        "y": 446.8853,
        "value": 4,
        "category": 0
      },
      {
        "id": "2",
        "name": "MlleBaptistine",
        "symbolSize": 6.323809333333333,
        "x": -212.76357,
        "y": 245.29176,
        "value": 9.485714,
        "category": 1
      },
      {
        "id": "3",
        "name": "MmeMagloire",
        "symbolSize": 6.323809333333333,
        "x": -242.82404,
        "y": 235.26283,
        "value": 9.485714,
        "category": 1
      },
      {
        "id": "4",
        "name": "CountessDeLo",
        "symbolSize": 2.6666666666666665,
        "x": -379.30386,
        "y": 429.06424,
        "value": 4,
        "category": 0
      },
      {
        "id": "5",
        "name": "Geborand",
        "symbolSize": 2.6666666666666665,
        "x": -417.26337,
        "y": 406.03506,
        "value": 4,
        "category": 0
      },
      {
        "id": "6",
        "name": "Champtercier",
        "symbolSize": 2.6666666666666665,
        "x": -332.6012,
        "y": 485.16974,
        "value": 4,
        "category": 0
      },
      {
        "id": "7",
        "name": "Cravatte",
        "symbolSize": 2.6666666666666665,
        "x": -382.69568,
        "y": 475.09113,
        "value": 4,
        "category": 0
      },
      {
        "id": "8",
        "name": "Count",
        "symbolSize": 2.6666666666666665,
        "x": -320.384,
        "y": 387.17325,
        "value": 4,
        "category": 0
      },
      {
        "id": "9",
        "name": "OldMan",
        "symbolSize": 2.6666666666666665,
        "x": -344.39832,
        "y": 451.16772,
        "value": 4,
        "category": 0
      },
      {
        "id": "10",
        "name": "Labarre",
        "symbolSize": 2.6666666666666665,
        "x": -89.34107,
        "y": 234.56128,
        "value": 4,
        "category": 1
      },
      {
        "id": "11",
        "name": "Valjean",
        "symbolSize": 66.66666666666667,
        "x": -87.93029,
        "y": -6.8120565,
        "value": 100,
        "category": 1
      },
      {
        "id": "12",
        "name": "Marguerite",
        "symbolSize": 4.495239333333333,
        "x": -339.77908,
        "y": -184.69139,
        "value": 6.742859,
        "category": 1
      },
      {
        "id": "13",
        "name": "MmeDeR",
        "symbolSize": 2.6666666666666665,
        "x": -194.31313,
        "y": 178.55301,
        "value": 4,
        "category": 1
      },
      {
        "id": "14",
        "name": "Isabeau",
        "symbolSize": 2.6666666666666665,
        "x": -158.05168,
        "y": 201.99768,
        "value": 4,
        "category": 1
      },
    ],
    "links": [
      {
        "source": "1",
        "target": "0"
      },
      {
        "source": "2",
        "target": "0"
      },
      {
        "source": "3",
        "target": "0"
      },
      {
        "source": "3",
        "target": "2"
      },
      {
        "source": "4",
        "target": "0"
      },
      {
        "source": "5",
        "target": "0"
      },
      {
        "source": "6",
        "target": "0"
      },
      {
        "source": "7",
        "target": "0"
      },
      {
        "source": "8",
        "target": "0"
      },
      {
        "source": "9",
        "target": "0"
      },
      {
        "source": "11",
        "target": "0"
      },
      {
        "source": "11",
        "target": "2"
      },
      {
        "source": "11",
        "target": "3"
      },
      {
        "source": "11",
        "target": "10"
      },
      {
        "source": "12",
        "target": "11"
      },
      {
        "source": "13",
        "target": "11"
      },
      {
        "source": "14",
        "target": "11"
      },
    ],
    "categories": [
      {
        "name": "A"
      },
      {
        "name": "B"
      },
      {
        "name": "C"
      },
      {
        "name": "D"
      },
      {
        "name": "E"
      },
      {
        "name": "F"
      },
      {
        "name": "G"
      },
      {
        "name": "H"
      },
      {
        "name": "I"
      }
    ]
  }
graph.nodes.forEach((node:any)=>{
  node.label = {
    show: node.symbolSize > 30
  };
});
function Knowledge2(id: any, data2: any){
  let option:any = {
    title: {
      text: '',
      subtext: '',
      top: 'bottom',
      left: 'right'
    },
    tooltip: {},
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    color:['#6AC8F4','#FFB354','#FF9A56','#00CBC2','#FF7B7B'],
    series: [
      {
        name: '',
        type: 'graph',
        layout: 'none',
        data: graph.nodes,
        links: graph.links,
        categories: graph.categories,
        roam: true,
        label: {
          position: 'right',
          formatter: '{b}'
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 10
          }
        },
        bottom: '15%',
        left: '5%',
        top: '5%',
        right: '10%',
      }
    ]
  };
  document.getElementById(id)?.removeAttribute("_echarts_instance_");
  var chartDom:any=document.getElementById(id)
  const chart = echarts.init(chartDom)
  chart && chart.setOption(option);
}

let data2={
  "parentNode": "我的课程添加课程15",
  "childNodes": [
    {
      "type": 1,
      "content_id": 500032,
      "contentvia": {
        "knowledages": [],
        "id": 500032,
        "name": "vncvnc"
      }
    },
    {
      "type": 1,
      "content_id": 500033,
      "contentvia": {
        "knowledages": [],
        "id": 500033,
        "name": "tasktask"
      }
    },
    {
      "type": 1,
      "content_id": 500048,
      "contentvia": {
        "knowledages": [],
        "id": 500048,
        "name": "document1234567890"
      }
    },
    {
      "type": 1,
      "content_id": 500052,
      "contentvia": {
        "knowledages": [
          {
            "id": 1,
            "knowledge_map_id": 50006,
            "relate_id": 500052,
            "knowledge_map": {
              "id": 50006,
              "knowledge_map_name": "ddddd"
            }
          }
        ],
        "id": 500052,
        "name": "lmm测试jupyter实验"
      }
    },
    {
      "type": 1,
      "content_id": 500058,
      "contentvia": {
        "knowledages": [
          {
            "id": 2,
            "knowledge_map_id": 50009,
            "relate_id": 500058,
            "knowledge_map": {
              "id": 50009,
              "knowledge_map_name": "四级"
            }
          },
          {
            "id": 3,
            "knowledge_map_id": 50005,
            "relate_id": 500058,
            "knowledge_map": {
              "id": 50005,
              "knowledge_map_name": "111"
            }
          }
        ],
        "id": 500058,
        "name": "video1234567890"
      }
    },
    {
      "type": 1,
      "content_id": 500085,
      "contentvia": {
        "knowledages": [
          {
            "id": 4,
            "knowledge_map_id": 50002,
            "relate_id": 500085,
            "knowledge_map": {
              "id": 50002,
              "knowledge_map_name": "node2"
            }
          },
          {
            "id": 5,
            "knowledge_map_id": 50005,
            "relate_id": 500085,
            "knowledge_map": {
              "id": 50005,
              "knowledge_map_name": "111"
            }
          },
          {
            "id": 6,
            "knowledge_map_id": 50006,
            "relate_id": 500085,
            "knowledge_map": {
              "id": 50006,
              "knowledge_map_name": "ddddd"
            }
          }
        ],
        "id": 500085,
        "name": "测试视频实验"
      }
    },
    {
      "type": 1,
      "content_id": 500078,
      "contentvia": {
        "knowledages": [],
        "id": 500078,
        "name": "文档实验1"
      }
    },
    {
      "type": 1,
      "content_id": 500082,
      "contentvia": {
        "knowledages": [],
        "id": 500082,
        "name": "jupyter实验"
      }
    }
  ]
}

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
  knowledge_map.childNodes.forEach((item: any,k:number) => {
    item.content_id=String(item.content_id)
    if (item.contentvia) {
      item.contentvia.id=String(item.contentvia.id)+k
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
      item.contentvia.knowledages.length?item.contentvia.knowledages.forEach((knowledage: any,key:number) => {
        // console.log(knowledage.knowledge_map);
        const knowledge_map_name=knowledage.knowledge_map?knowledage.knowledge_map.knowledge_map_name:''
        const id=knowledage.knowledge_map?knowledage.knowledge_map.id:''
        // const {id}=knowledage.knowledge_map
        // knowledage.id=content_id
        // var id=knowledage.id
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
export const graphOptions = (data: any,size:number) => {
  let datas = setTagData(data,size)
  // console.log(data)
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
          width: 2,
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
function Knowledge3(id: any, data: any,size:number){
  let option:any=graphOptions(data,size)
  document.getElementById(id)?.removeAttribute("_echarts_instance_");
  var chartDom:any=document.getElementById(id)
  const chart = echarts.init(chartDom)
  chart && chart.setOption(option);
}






export {
  Knowledge,
  HotWords,
  Knowledge2,
  Knowledge3
}