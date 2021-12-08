<template>
  <div class="experScore">
    <div class="getScoreItem">
      <a-table bordered :columns="columns" :data-source="data" :pagination="false">
        <template #scoreItem="{ record }">
          <div>
            {{ record.scoreItem }}
          </div>
        </template>
        <template #score="{ record }">
          <div>
            {{ record.score }}
          </div>
        </template>
      </a-table>
    </div>
    <div class="pieChart">
      <div id="pieChart"></div>
    </div>
    <div class="histogram">
      <div id="taskTime"></div>
      <div id="correctRate"></div>
    </div>
  </div>
</template>
<script lang="ts">
import * as echarts from "echarts";
import { options } from "src/views/teachCourse/evalute/components/public";
import { defineComponent, onMounted, ref, watch } from "vue";
export default defineComponent({
  name: "experScore",
  props: ["scoredata", "activeKey", "detailShowConfig"],
  setup: (props, context) => {
    var myChart: any = "";
    var myChart1: any = "";
    var myChart2: any = "";
    const columns = [
      {
        title: "得分项",
        dataIndex: "scoreItem",
        key: "scoreItem",
        width: 100,
        slots: { customRender: "scoreItem" },
      },
      {
        title: "分数",
        dataIndex: "score",
        key: "score",
        width: 70,
        slots: { customRender: "score" },
      },
    ];
    const columnData = [
      { key: "1", scoreItem: "用时得分", score: props.scoredata?.time_score },
      { key: "2", scoreItem: "习题得分", score: props.scoredata?.score },
      { key: "3", scoreItem: "报告得分", score: props.scoredata?.report_score },
      { key: "4", scoreItem: "步骤得分", score: props.scoredata?.auto_score },
      { key: "5", scoreItem: "总分", score: props.scoredata?.final_score },
    ];
    const data =
      props.detailShowConfig.indexOf("auto") === -1
        ? columnData.slice(0, 3).concat(columnData.slice(4, 5))
        : columnData;
    var option = ref({
      tooltip: {
        trigger: "item",
      },
      color:
        props.detailShowConfig.indexOf("auto") === -1
          ? ["#8955b5", "#eb7e64", "#f6bd16"]
          : ["#8955b5", "#eb7e64", "#f6bd16", "#5AD8A6"],
      legend: {
        orient: "vertical",
        bottom: "bottom",
        icon: "circle",
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: ["40%", "70%"],
          data:
            props.detailShowConfig.indexOf("auto") === -1
              ? [
                  { value: props.scoredata?.time_score, name: "用时得分" },
                  { value: props.scoredata?.score, name: "习题得分" },
                  { value: props.scoredata?.report_score, name: "报告得分" },
                ]
              : [
                  { value: props.scoredata?.time_score, name: "用时得分" },
                  { value: props.scoredata?.score, name: "习题得分" },
                  { value: props.scoredata?.report_score, name: "报告得分" },
                  { value: props.scoredata?.auto_score, name: "步骤得分" },
                ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.05)",
            },
          },
        },
      ],
    });
    var option1 = {
      title: {
        subtext: "任务用时(分钟)",
        subtextStyle: {
          fontSize: 16,
        },
        bottom: "80%",
      },
      color: ["#8955b4", "#ccb5de"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (param: any) => {
          return param[0].name + ":" + param[0].value;
        },
      },
      grid: {
        left: "0%",
        right: "20",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        axisLabel: {
          formatter: (val: any) => {
            return val;
          },
        },
      },
      yAxis: {
        type: "category",
        data: ["任务用时", "标准用时"],
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          formatter: (val: any) => {
            var str = "";
            str = val.substring(0, 2) + "\n" + val.substring(2, 6);
            return str;
          },
        },
      },
      series: [
        {
          name: "任务用时",
          type: "bar",
          data: [props.scoredata?.task_time, props.scoredata?.used_time],
          barWidth: 15,
          emphasis: {
            itemStyle: {
              borderRadius: 30,
            },
          },
          itemStyle: {
            //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
            // emphasis: {
            //     borderRadius: 30
            // },

            // normal: {
            //柱形图圆角，初始化效果
            borderRadius: [0, 25, 25, 0],
            color: function (params: any) {
              var colorList = ["#CCB5DF", "#8F5EB9"];
              return colorList[params.dataIndex];
              // }
            },
          },
        },
      ],
    };
    var option2 = {
      title: {
        subtext: "正确率(%)",
        subtextStyle: {
          fontSize: 16,
        },
        bottom: "80%",
      },
      color: ["#eb7f65", "#ffc82a"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (param: any) => {
          return param[0].name + ":" + param[0].value + "%";
        },
      },
      grid: {
        left: "0%",
        right: "5%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        axisLable: {
          formatter: (val: any) => {
            var str = "";
            str = val;
            return str;
          },
        },
      },
      yAxis: {
        type: "category",
        data: ["习题正确率", "步骤正确率"],
        axisLable: {
          formatter: (val: any) => {
            var str = "";
            str = val.substring(0, 2) + " " + "\n" + val.substring(2, 6);
            return str;
          },
        },
      },
      series: [
        {
          type: "bar",
          data: [props.scoredata?.question_accuracy, props.scoredata?.auto_accuracy],
          barWidth: "40%",
          itemStyle: {
            // normal: {
            //柱形图圆角，初始化效果
            borderRadius: [0, 25, 25, 0],
            color: function (params: any) {
              var colorList = ["#FFC719", "#EB7E64"];
              return colorList[params.dataIndex];
              //   }
            },
          },
        },
      ],
    };
    function drawChart1() {
      console.log("重新渲染echarts", option);
      //饼状图
      myChart = (echarts as any).init(document.getElementById("pieChart"));
      myChart.setOption(option.value, true);
      return myChart;
    }
    // 任务用时
    function drawCharts2() {
      myChart1 = (echarts as any).init(document.getElementById("taskTime"));
      myChart1.setOption(option1);
      return myChart1;
    }
    // 正确率
    function drawCharts3() {
      myChart2 = (echarts as any).init(document.getElementById("correctRate"));
      myChart2.setOption(option2);
      return myChart2;
    }
    watch(
      () => props.activeKey,
      (val: any) => {
        console.log(option.value);
      }
    );
    onMounted(() => {
      drawChart1();
      drawCharts2();
      drawCharts3();
    });
    return {
      columnData,
      echarts,
      columns,
      data,
      option,
      option1,
      option2,
      drawChart1,
      drawCharts2,
      drawCharts3,
      myChart,
      myChart1,
      myChart2,
    };
  },
});
</script>
<style lang="less">
.experScore {
  display: flex;
  justify-content: space-between;
  padding: 20px 10px;
  .getScoreItem {
    width: 174px;
  }
  .pieChart {
    width: 348px;
  }
  #pieChart {
    width: 348px;
    height: 300px;
  }
  .histogram {
    width: 350px;
    #taskTime {
      width: 318px;
      height: 200px;
    }
    #correctRate {
      width: 318px;
      height: 200px;
    }
  }
}
</style>
