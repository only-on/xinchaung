
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
         {"name": "AgglomerativeCluster", "value": 3938},
         {"name": "CommunityStructure", "value": 3812},
         
        ]
       },
       {
        "name": "节点31-2",
        "children": [
         {"name": "BetweennessCentrality", "value": 3534},
         {"name": "LinkDistance", "value": 5731},
         
        ]
       },
       {
        "name": "节点31-3",
        "value": 6416,
        "children": [
         {"name": "AspectRatioBanker",}
        ]
       }
      ]
     },
     {
      "name": "节点2-2",
      "children": [
       {"name": "节点32-1", "value": 17010},
       {"name": "节点32-2", "value": 5842},
       {
        "name": "节点32-3",
        "children": [
         {"name": "ArrayInterpolator", "value": 1983},
         {"name": "ColorInterpolator", "value": 2047},
         {"name": "DateInterpolator", "value": 1375},
        ]
       },
       {"name": "节点32-4", "value": 1041,"children":[{"name": "ArrayInterpolator", "value": 1983},]},
       {"name": "节点32-5", "value": 5176},
       {"name": "节点32-6", "value": 449},
       {"name": "节点32-7", "value": 5593},
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
export {
  Knowledge,
  HotWords,
}