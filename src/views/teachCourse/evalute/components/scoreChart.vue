<template>
  <div class="scoreChart">
    <a-row>
      <a-col :span="5">
        <table class="scoreTable">
          <tr>
            <td>得分项</td>
            <td>分数</td>
          </tr>
          <tr>
            <td>用时得分</td>
            <td>{{ scoreData.time_score }}</td>
          </tr>
          <tr>
            <td>习题得分</td>
            <td>{{ scoreData.question_score }}</td>
          </tr>
          <tr>
            <td>报告得分</td>
            <td>{{ scoreData.report_score }}</td>
          </tr>
          <tr>
            <td>步骤得分</td>
            <td>{{ scoreData.auto_score }}</td>
          </tr>
          <tr>
            <td>总分</td>
            <td>{{ scoreData.score }}</td>
          </tr>
        </table>
      </a-col>
      <a-col :span="10">
        <div :id="'pie' + type"></div>
      </a-col>
      <a-col :span="9">
        <div :id="'bar1' + type"></div>
        <div :id="'bar2' + type"></div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, watch, ref, reactive } from "vue";
import * as echarts from "echarts";
import { theme } from 'src/utils/theme';
interface Idata {
  time_score: any;
  question_score: any;
  report_score: any;
  auto_score: any;
  auto_accuracy: any;
  question_accuracy: any;
  task_time: any;
  used_time: any;
  score: any;
}
export default defineComponent({
  props: ["data", "type"],
  setup(props) {
    var themeColor = ref<string>(theme.themeColor)
    var type = ref<string>(props.type);
    var scoreData = reactive<Idata>({
      time_score: 0,
      question_score: 0,
      report_score: 0,
      auto_score: 0,
      auto_accuracy: 0,
      question_accuracy: 0,
      task_time: 0,
      used_time: 0,
      score: 0,
    });
    function setPie(param: any) {
      let eleChart = (echarts as any).init(document.getElementById(param.ele));
      var option = {
        color: [themeColor, "#FF805D", "#ECB736", "#1AB095"],
        legend: {
          bottom: "20%",
          icon: "circle",
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          itemGap: 20,
          data: param.legend,
        },
        series: [
          {
            type: "pie",
            radius: [60, 88],
            label: {
                show: true,
                position: 'outside',
                formatter: function (params:any) {
                  return '{name|' + params.name + '}\n{value|' + params.value + '}';
                },
                rich: {
                    name: {
                      padding: [5,0]
                    },
                    value: {
                      align: 'center'
                    }
                }
            },
            center: ["50%", "25%"],
            data: param.data,
          },
        ],
      };
      eleChart.setOption(option);
    }
    function setBar(param: any) {
      let eleChart = (echarts as any).init(document.getElementById(param.ele));
      let option = {
        title: {
          text: param.title,
          textStyle: {
            fontSize: 16,
            color: "#B7B7B7",
            fontWeight: "normal",
          },
        },
        tooltip: {
          trigger: "item",
        },
        grid: {
          left: '21%'
        },
        xAxis: [
          {
            type: "value",
            splitLine: {
              show: true,
            },
            axisLine: {
              show: true,
            },
          },
        ],
        yAxis: [
          {
            type: "category",
            name: "",
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            // axisLabel: {
            //   formatter: function (params: any) {
            //     return params.length % 2 === 0 ? params.substr(0, 2) + "\n" + params.substr(2) : params;
            //   },
            // },
            data: param.yData,
          },
        ],
        series: [
          {
            type: "bar",
            barWidth: 15,
            itemStyle: {
              borderRadius: [0, 6, 6, 0],
              color: function (params: any) {
                return param.colorList[params.dataIndex];
              },
            },
            data: param.xData,
          },
        ],
      };
      eleChart.setOption(option);
    }
    onMounted(() => {
      setTimeout(() => {
        Object.assign(scoreData, props.data[type.value]);
        let pie = {
          ele: "pie" + type.value,
          data: [
            { value: scoreData.time_score, name: "用时得分" },
            { value: scoreData.question_score, name: "习题得分" },
            { value: scoreData.report_score, name: "报告得分" },
          ],
          legend: ["用时得分", "习题得分", "报告得分"]
        };
        let bar1 = {
          ele: "bar1" + type.value,
          title: "任务用时(分钟)",
          yData: ["标准用时", "任务用时"],
          xData: [scoreData.task_time, scoreData.used_time],
          colorList: ["#C9B8D8", themeColor]
        };
        let bar2 = {
          ele: "bar2" + type.value,
          title: "正确率(%)",
          yData: ["习题正确率"],
          xData: [scoreData.question_accuracy],
          colorList: ["#f0937c", "#FF805D"]
        };
        if (props.data[type.value].show.includes('auto')) {
        // 显示步骤得分
          pie.data.push({
            value: scoreData.auto_score, name: "步骤得分"
          })
          pie.legend.push('步骤得分')
          // 步骤正确率
          bar2.yData = ["步骤正确率", "习题正确率"]
          bar2.xData = [scoreData.auto_accuracy, scoreData.question_accuracy]
        }
        setPie(pie);
        setBar(bar1);
        setBar(bar2);
      }, 600);
    });
    return {
      type,
      scoreData,
    };
  },
});
</script>
<style lang="less" scoped>
.scoreChart {
  height: 100%;
  .ant-row {
    height: 100%;
  }
  .scoreTable {
    border: 1px solid var(--black-15);
    color: #14191e;
    font-size: 14px;
    tr:first-child {
      background: var(--descriptions-bg);
      td {
        border: none;
      }
    }
    td {
      padding: 5px 20px;
      border: 1px solid var(--black-15);
      text-align: center;
    }
  }
  #piefirst,
  #pieagain {
    width: 100%;
    height: 400px;
  }
  #bar1first,
  #bar2first,
  #bar1again,
  #bar2again {
    width: 100%;
    height: 200px;
    // background: pink;
  }
}
</style>
