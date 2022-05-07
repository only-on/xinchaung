import * as echarts from "echarts"
import 'echarts-wordcloud';
const colorList = ['#fe9956', ' #fed755', '#32d0db', '#708cf3']
function HotWords(id:any, data: any){
  console.log(id,data)
    const option = {
        // 图表标题
        title: {
          show:true,//显示策略，默认值true,可选为：true（显示） | false（隐藏）
          text: '技术方向',//主标题文本，'\n'指定换行
          left: '0%',
          top:'0%',
          //textAlign: null          // 水平对齐方式，默认根据x设置自动调整
          // backgroundColor: 'rgba(0,0,0,0)',
          // borderColor: '#ccc',    // 标题边框颜色
          // borderWidth: 0,         // 标题边框线宽，单位px，默认为0（无边框）
          // padding: 5,             // 标题内边距，单位px，默认各方向内边距为5，
          //                         // 接受数组分别设定上右下左边距，同css
          // itemGap: 10,            // 主副标题纵向间隔，单位px，默认为10，
          // textStyle: {
          //   fontSize: 18,
          //   fontWeight: 'bolder',
          //   color: '#333'        // 主标题文字颜色
          // },
          // subtextStyle: {
          //   color: '#aaa'        // 副标题文字颜色
          // }
        },
        grid: {
          left: "10%",
          top: "20%",
          right:'2%',
          bottom:'10%'
        },
        backgroundColor: '#fff',
        tooltip: {},
        // animationDurationUpdate: function(idx) {
            // 越往后的数据延迟越大
            //  return idx * 100;
        // },
        // animationEasingUpdate: 'bounceIn',
        color: ['#fff', '#fff', '#fff'],
        series: [{
          type: 'graph',
          layout: 'force',
          // force: {
          //   repulsion: 100,
          //   edgeLength: 10
          // },
          roam:true,
          label: {
            show:true,
            position: 'bottom',
            // padding:[0,0,0,0], //调整左右位置
            formatter: (params: any) => {
              // return params.name+'\n'+params.value
              return params.name
            }
          },
          // labelLine:{
          //     show:false,
          //     length:-10, //调整上下位置
          // },
          data:data,
        }]
      }
     
    document.getElementById(id)?.removeAttribute("_echarts_instance_");
    var chartDom:any=document.getElementById(id)
    const chart = echarts.init(chartDom)
    chart && chart.setOption(option);
  }
function echartsPie(id:any,data:any){
    const option={
      color:['#03C8BF','#9872EB'],
      title: {
       text: '实验统计',
       left: '0%',
       top:'0%',
     },
     tooltip: {
       trigger: 'item'
     },
     legend: {
        icon: "circle", 
        itemHeight: 7,
       orient: "vertical",
       top: '35%',
       left: '0%',
       formatter: function (name:any) {
        var data = option.series[0].data;
        var total = 0;
        var tarValue;
        for (var i = 0; i < data.length; i++) {
          total += data[i].value;
          if (data[i].name == name) {
            tarValue = data[i].value;
          }
        }
        var value = tarValue;
        return [
          `{name|${name}}`,
          `{value|${value}}`
      ].join('\n')
      },
      textStyle:{
          rich:{
              name:{
                  fontSize:14,
                  color:"#000",
                  lineHeight:30,
              },
              value:{
                  fontSize:20,
                  color:"#000",
                  lineHeight:20,
                  fontWeight: "bold"
              }
          }
      }
     },
     series: [
       {
         name: '',
         type: 'pie',
         center: ['65%', '55%'],
         radius: ['40%', '70%'],
         roseType: 'radius',
         avoidLabelOverlap: false,
         label: {
           show: false,
           position: 'center'
         },
         emphasis: {
           label: {
             show:false,
             fontSize: '16',
             fontWeight: 'bold'
           }
         },
         labelLine: {
           show: false
         },
         data: [
           { value:data.privateContentsCount, name: '私有实验' },
           { value:data.publicContentsCount, name: '公开实验' }
         ]
       }
     ]
    }
    document.getElementById(id)?.removeAttribute("_echarts_instance_");
    var chartDom:any=document.getElementById(id)
    const chart = echarts.init(chartDom)
      chart && chart.setOption(option);
}
function echartsBar(id:any,data:any){
  const option={
    color:new echarts.graphic.LinearGradient(0, 0, 0,1,[{offset:0,color:'#F57BB7'},{offset:1,color:'#EFB486'}]),
    title: {
      text: '实验类型',
      left: '0%',
      top:'0%',
    },
    grid: {
      left: "10%",
      top: "20%",
      right:'2%',
      bottom:'12%'
    },
    xAxis: {
      type: 'category',
      // data: ['视频实验', '桌面实验', '文档实验', '任务制实验', '命令行实验', 'IDE实验', 'Jupyter实验'],
      data:data.names,
      axisLabel: {
        interval:0,//横轴信息全部显示
        // rotate: 60,//60度角倾斜显示
        // formatter:function(val:any){
        // return val.split("").join("\n");} //横轴信息文字竖直显示
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        // data: [120, 200, 150, 80, 70, 110, 130],
        data:data.numbers,
        type: 'bar',
        barWidth:21,
        itemStyle: {
          normal: {
              //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
              barBorderRadius:[10, 10, 10, 10]
          }
      }
      }
    ]
  }
  document.getElementById(id)?.removeAttribute("_echarts_instance_");
  var chartDom:any=document.getElementById(id)
  const chart = echarts.init(chartDom)
    chart && chart.setOption(option);
}
  export {
    HotWords,echartsPie,echartsBar
  }