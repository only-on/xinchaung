import { option } from "./../../adminModule/systemMaintenance/diskManagement/option";
import * as echarts from "echarts";
import { prepareBoxplotData } from "echarts/extension/dataTool";
// 课程成绩对比
let courseScoreOption = (data: any) => {
  let option = {
    tooltip: {
      trigger: "axis",
      // axisPointer: {
      //   type: "cross",
      //   crossStyle: {
      //     color: "#999",
      //   },
      // },
    },
    legend: {
      data: ["成绩平均分", "成绩最高分"],
    },
    xAxis: [
      {
        type: "category",
        data: data.name,
        axisPointer: {
          type: "shadow",
        },
        axisLabel: {
          formatter: function (params: any) {
            var newParamsName = "";
            var paramsNameNumber = params.length;
            var provideNumber = 8; //一行显示几个字
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
              for (var p = 0; p < rowNumber; p++) {
                var tempStr = "";
                var start = p * provideNumber;
                var end = start + provideNumber;
                if (p == rowNumber - 1) {
                  tempStr = params.substring(start, paramsNameNumber);
                } else {
                  tempStr = params.substring(start, end) + "\n";
                }
                newParamsName += tempStr;
              }
            } else {
              newParamsName = params;
            }
            return newParamsName;
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "",
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: {
          formatter: "{value}",
        },
      },
      {
        type: "value",
        name: "",
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: {
          formatter: "",
        },
      },
    ],
    dataZoom: [
      {
        type: "slider",
        show: true,
        start: 0,
        end: 30,
        xAxisIndex: 0,
        bottom: 30,
        filterMode: "none",
        height: 10,
      },
    ],
    series: [
      {
        name: "成绩平均分",
        type: "bar",
        color: "#00CBC2",
        barWidth: 10,
        itemStyle: {
          //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
          //柱形图圆角，初始化效果
          borderRadius: [5, 5, 5, 5],
        },
        tooltip: {
          valueFormatter: function (value: any) {
            return value + " 分";
          },
        },
        data: data.average_score,
      },
      {
        name: "成绩最高分",
        type: "line",
        color: "#FF9544",
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value: any) {
            return value + " 分";
          },
        },
        data: data.max_score,
      },
    ],
  };
  return option;
};

// 岗位能力分析
let jobAbilityOption = (data: any) => {
  let option = {
    title: {
      text: "",
    },
    tooltip: {},
    radar: {
      shape: "polygon",
      center: ["55%", "43%"],
      radius: ["0%", "60%"],
      axisNameGap: 15,
      indicator: data.name,
      splitArea: {
        show: true,
        areaStyle: {
          color: "transparent",
        },
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: "#FFE4CE", // 设置网格的颜色
        },
      },
    },
    series: [
      {
        name: "",
        type: "radar",
        color: "#FF9544",
        lineStyle: {
          width: 2,
        },
        data: [
          {
            value: data.value,
            name: "岗位能力分析",
          },
        ],
      },
    ],
  };
  return option;
};
// 知识点错误率
let knowledageErrorOption = (data: any) => {
  let option = {
    tooltip: {},
    color: ["#FF9A56", "#33D0DB", "#718CF3", "#FF7B7B", "#FFCE2B", "#FF9A56"],
    series: [
      {
        type: "treemap",
        data: data,
        // [
        //   {
        //     name: 'nodeA',
        //     value: 10
        //   },
        //   {
        //     name: 'nodeB',
        //     value: 20,
        //   },
        //   {
        //     name: 'nodeC',
        //     value: 20
        //   }
        // ],
        top: "10",
        bottom: "70",
        breadcrumb: {
          show: false,
        },
      },
    ],
  };
  return option;
};
// 实验成绩分布
function formatterTip(params: any) {
  let txt = "";
  txt +=
    params.seriesName +
    "<br>" +
    params.marker +
    "最高分：" +
    params.data[5] +
    "分" +
    "<br>" +
    params.marker +
    "上四分位数：" +
    params.data[4] +
    "分" +
    "<br>" +
    params.marker +
    "中位数：" +
    params.data[3] +
    "分" +
    "<br>" +
    params.marker +
    "下四分位数：" +
    params.data[2] +
    "分" +
    "<br>" +
    params.marker +
    "最低分：" +
    params.data[1] +
    "分" +
    "<br>";
  return txt;
}
let gradeDistributionOption = (data: any) => {
  let handledData = prepareBoxplotData(data.score);
  let option = {
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      top: "5%",
      left: "10%",
      right: "10%",
      bottom: "30%",
    },
    xAxis: {
      type: "category",
      boundaryGap: true,
      nameGap: 30,
      data: data.name,
      splitArea: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(0,0,0,0.14)",
        },
      },
      axisLabel: {
        color: "rgba(0,0,0,0.45)",
        formatter: "{value}",
      },
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: 0,
        top: "80%",
        filterMode: "none",
        height: 10,
      },
    ],
    yAxis: {
      type: "value",
      name: "",
      min: 0,
      max: 100,
      interval: 20,
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(0,0,0,0.14)",
        },
      },
      axisLabel: {
        color: "rgba(0,0,0,0.45)",
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "实验成绩分布",
        color: "#FF9544",
        type: "boxplot",
        datasetIndex: 1,
        data: handledData.boxData,
        tooltip: {
          formatter: formatterTip,
        },
      },
      {
        name: "实验成绩分布",
        color: "#1CB2B3",
        type: "scatter",
        datasetIndex: 2,
        data: handledData.outliers,
      },
    ],
  };
  return option;
};
// 知识图谱
let links: any[] = [];
let data: any[] = [];
let categorys: any[] = [0];
let itemCategory = 0
let colorList = ['#FE8020', '#FFB354', '#00CBC2', '#6AC8F4', '#748ADE']
function handleGraphData(knowledge_map: any,  pid?:any) {
  if (!knowledge_map) {
    return { data, links, categorys };
  }
  // itemCategory += 1;
  if (itemCategory !== 0) {
    // itemCategory += 1
  }
  knowledge_map.forEach((item: any) => {
    let s = {
      name: item.knowledge_map_name,
      id: String(item.id),
      symbolSize: item.error_rate ? item.error_rate : 50,
      value: item.error_rate,
      draggable: true,
      itemStyle: {
        color: colorList[itemCategory % 5],
      },
      category: itemCategory,
    }
    data.push(s);
    console.log(itemCategory,'第一层级')
    console.log(s)
    if (itemCategory !== 0) {
      links.push({
        source: pid ? pid : String(item.id),
        target: String(item.id),
      });
    }
  });
  knowledge_map.forEach((item:any) => {
    if (item.child && item.child.length) {
      itemCategory += 1;
      item.child.forEach((itemChild: any) => {
        let s = {
          name: itemChild.knowledge_map_name,
          id: String(itemChild.id),
          symbolSize: itemChild.error_rate ? itemChild.error_rate : 50,
          value: item.error_rate,
          draggable: true,
          itemStyle: {
            color: colorList[itemCategory % 5],
          },
          category: itemCategory,
        }
        data.push(s);
        console.log(itemCategory,'第二层级')
        console.log(s)
        links.push({
          source: String(item.id),
          target: String(itemChild.id),
        });
      });
    }
  })
  knowledge_map.forEach((item:any) => {
    if (item.child && item.child.length) {
      itemCategory += 1;
      item.child.forEach((itemChild:any) => {
        handleGraphData(itemChild.child, String(itemChild.id));
      })
    }
  })
  return { data, links, categorys };
}
function setOption4(data: any) {
  let datas = handleGraphData(data);
  setTimeout(()=>{
    for (let i = 0; i < itemCategory; i++) {
      categorys.push({ name: i });
    }
  },400)
  console.log(datas)
  let option: any = {
    tooltip: {},
    grid: {
      left: "10%",
      top: "20%",
      right: "2%",
      bottom: "40%",
    },
    color: ["#FE8020", "#FFB354", "#00CBC2", "#6AC8F4"],
    animationDurationUpdate: 1500,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        type: "graph",
        layout: "force",
        smooth: true,
        force: {
          repulsion: 1000,
          edgeLength: 50,
        },
        roam: true,
        label: {
          show: true,
          position: "bottom",
          // padding:[0,0,0,0], //调整左右位置
          formatter: (params: any) => {
            // return params.name+'\n'+params.value
            return params.name;
          },
        },
        data: datas?.data,
        links: datas?.links,
        lineStyle: {
          width: 1,
          curveness: 0.1,
          color: "source",
        },
        aria: {
          // 下面几行可以不写，因为 label.enabled 默认 true
          // label: {
          //     enabled: true
          // },
          // enabled: true
          decals: {
            symbolSize: 0.5,
          },
        },
        categories: categorys,
      },
    ],
  };
  return option;
}
// 高频易错点梳理
let combOption = (data: any) => {
  let option = {
    tooltip: {
      trigger: "item",
    },
    series: {
      type: "sankey",
      bottom: "15%",
      left: "5%",
      top: "5%",
      right: "10%",
      layout: "none",
      emphasis: {
        focus: "adjacency",
      },
      data: data.data,
      links: data.links,
      lineStyle: {
        color: "source",
        curveness: 0.5,
      },
    },
  };
  return option;
};
export {
  courseScoreOption,
  jobAbilityOption,
  knowledageErrorOption,
  gradeDistributionOption,
  setOption4,
  combOption,
};
