<template>
  <div class="courseExperiment">
    <div class="table-header">
      <div class="table-header-left">
        <h3>成绩详情</h3>
      </div>
      <div class="table-header-right">
        <div>实验最高分：100分</div>
        <div>实验最低分：90分</div>
      </div>
    </div>

    <a-table :columns="columns" :data-source="data" bordered size="middle">
      <template #check="{ text }">
        <span class="table-a-link" @click="clickFun('video', text)">录屏</span>
        <span class="table-a-link" @click="clickFun('report', text)">评阅</span>
      </template>
      <template></template>
      <template></template>
      <template></template>
      <template></template>
      <template></template>
      <template></template>
    </a-table>

    <div class="footer">
      <div class="footer-left">
        <div>图形统计</div>
        <div class="graphic-statistics" id="graphicStatistics"></div>
      </div>

      <div class="stu-info-bg">
        <div class="stu-info">
          <div class="stu-info-left">
            <div>姓名:</div>
            <div>学号:</div>
            <div>学习效率:</div>
            <div>当前排名:</div>
          </div>
          <div class="stu-info-right">
            <div>梁思成</div>
            <div>2202130213</div>
            <div>2.79</div>
            <div>NO.1</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { log } from "console";
import * as echarts from "echarts";
import { ref, toRefs, onMounted, Ref } from "vue";
const columns = [
  {
    title: "实验名称",
    width: 280,
    dataIndex: "examname",
    key: "examname",
  },
  {
    title: "开启时间",
    width: 130,
    dataIndex: "timestart",
  },
  {
    title: "学习时长",
    width: 100,
    dataIndex: "timelong",
  },
  {
    title: "完成时间",
    width: 130,
    dataIndex: "timeend",
  },
  {
    title: "评分项",
    children: [
      {
        title: "实验报告",
        width: 90,
        dataIndex: "examreport",
      },
      {
        title: "随堂测试",
        width: 90,
        dataIndex: "examtest",
      },
      {
        title: "自动评分",
        width: 90,
        dataIndex: "examcoding",
      },
    ],
  },
  {
    title: "查看",
    width: 110,
    dataIndex: "check",
    slots: { customRender: "check" },
  },
  {
    title: "最终成绩",
    width: 75,
    dataIndex: "final",
  },
];
const data = [...Array(5)].map((_, i) => ({
  key: i,
  examname: "人工智能直通车Python3教程及综",
  timestart: "2022/03/24 15:42",
  timelong: "40分钟57秒",
  timeend: "2022/03/24 15:42",
  examreport: "100",
  examtest: "100",
  examcoding: "--",
  // check: ".",
  final: "100",
}));
var option = {
  color: ["#eb7f65", "#ffc82a"],
  grid: {
    left: 1,
    top: 40,
    // bottom:20,
    right: 100,
    containLabel: true,
  },
  xAxis: {
    type: "category",
    name: "学生位置",
    nameTextStyle: {
      color: "#333333",
    },
    axisLable: {
      formatter: (val: any) => {
        var str = "";
        str = val;
        return str;
      },
    },
    axisLine: {
      lineStyle: {
        color: "#ccc",
      },
    },
  },
  yAxis: {
    type: "category",
    name: "学习效率",
    nameTextStyle: {
      color: "#333333",
    },
    data: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
    textStyle: {
      color: "black",
    },
    axisLable: {
      formatter: (val: any) => {
        var str = "";
        str = val.substring(0, 2) + " " + "\n" + val.substring(2, 6);
        return str;
      },
    },
    axisLine: {
      lineStyle: {
        color: "#ccc",
      },
    },
  },
  series: [
    {
      type: "bar",
      data: [],
      barWidth: "40%",
      itemStyle: {
        //柱形图圆角，初始化效果
        borderRadius: [0, 25, 25, 0],
        color: "pink",
      },
    },
  ],
};
// table操作
function clickFun(type: string, val: number) {
  console.log(val);
  // if (type.indexOf("update") != -1) {
  //   isEdit.value = true;
  // } else {
  //   isEdit.value = false;
  // }
  // if (["updateScore", "score"].includes(type)) {
  //   scoreVisible.value = true;
  // }
  if (["updateReport", "video"].includes(type)) {
    console.log('录屏click');
  }
  if (["updateReport", "report"].includes(type)) {
    console.log('评阅click');
  }
  // if (["updateCode", "code"].includes(type)) {
  //   codeVisible.value = true;
  // }
}
// 学习效率
function drawCharts() {
  var myChart = (echarts as any).init(
    document.getElementById("graphicStatistics")
  );
  myChart.setOption(option);
  return myChart;
}
onMounted(() => {
  drawCharts();
});
</script>

<style lang="less" scope>
.courseExperiment {
  padding: var(--padding-lg) 40px;
  background-color: var(--white-100);
  .table-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--margin-md);
    .table-header-left {
      display: flex;
      justify-content: space-between;
    }
    .table-header-right {
      display: flex;
      justify-content: space-between;
      color: var(--orangeyellow-6);
      > div {
        padding-left: var(--padding-lg);
      }
      > div:nth-child(1) {
        color: var(--brightBtn);
      }
    }
  }
  .ant-table-wrapper {
    .table-a-link {
      padding-right: var(--font-size-16);
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    height: 300px;
    .footer-left {
      font-size: var(--font-size-16);
      .graphic-statistics {
        width: 600px;
        height: 100%;
        // background: pink;
      }
    }
    .stu-info-bg {
      position: relative;
      width: 447px;
      opacity: 0.73;
      background: linear-gradient(167deg, #dae3fe 0%, #e9effd 100%);
      .stu-info {
        position: absolute;
        display: flex;
        left: 66px;
        top: 62px;
        font-size: 16px;
        font-weight: 400;
        color: var(--orangeyellow-6);
        // background-color: blue;
        .stu-info-left {
          padding-right: var(--padding-xs);
          > div:nth-child(-n + 2) {
            color: #1a0f91;
          }
        }
        .stu-info-right {
          > div:nth-child(-n + 2) {
            color: #1a0f91;
          }
        }
      }
    }
  }
}
</style>