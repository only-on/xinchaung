<template>
  <div class="courseExperiment">
    <div class="table-header">
      <div class="table-header-left">
        <h3>成绩详情</h3>
      </div>
      <div class="table-header-right">
        <div>实验最高分：{{allData?.max_min_score?.max_score?allData?.max_min_score?.max_score:'--'}}分</div>
        <div>实验最低分：{{allData?.max_min_score?.min_score?allData?.minx_min_score?.max_score:'--'}}分</div>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="tableData"
      bordered
      size="middle"
      :pagination="false"
    >
      <template #check="{ text }">
        <span :class="text?.report_url?'table-a-link':'no-link'" @click="clickFun('video', text)">录屏</span>
        <span :class="text?.report_url?'table-a-link':'no-link'" @click="clickFun('report', text)">评阅</span>
      </template>
      <template></template>
      <template></template>
      <template></template>
      <template></template>
      <template></template>
      <template></template>
    </a-table>
    <a-pagination :total="allData?.all?.page?.totalCount" class="page-wrap" @Change='onChangePage' :hideOnSinglePage='true'>
      <template #itemRender="{ page, type, originalElement }">
        <a v-if="type === 'prev'">上一页</a>
        <a v-else-if="type === 'next'">下一页</a>
        <renderVNode v-else :vnode="originalElement"></renderVNode>
      </template>
    </a-pagination>

    <div class="footer">
      <div class="footer-left">
        <div class="statisTit">图形统计</div>
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
import { ref, toRefs, onMounted} from "vue";
import request from "src/api/index";
import { useRouter ,useRoute } from 'vue-router';
const http = (request as any).studentScore;
const route=useRoute()
const courseId:any=route.query.courseId  //课程id
const columns = [
  {
    title: "实验名称",
    dataIndex: "content_name",
    key: "content_name",
    width:180,
  },
  {
    title: "开启时间",
    dataIndex: "start_time",
    key: "start_time",
    width:180,
  },
  {
    title: "学习时长",
    dataIndex: "used_time",
    key: "used_time",
  },
  {
    title: "完成时间",
    dataIndex: "finish_time",
    key: "finish_time",
    width:180,
  },
  {
    title: "评分项",
    children: [
      {
        title: "实验报告",
        dataIndex: "report_score",
        key: "report_score",
      },
      {
        title: "随堂测试",
        dataIndex: "question_score",
        key: "question_score",
      },
      {
        title: "自动评分",
        dataIndex: "auto_score",
        key: "auto_score",
      },
    ],
  },
  {
    title: "查看",
    dataIndex: "check",
    slots: { customRender: "check" }
  },
  {
    title: "最终成绩",
    dataIndex: "score",
    key: "score",
  },
];
// table数据
const data = ref([
  {
    key: 0,
    content_name: "人工智能直通车Python3教程及综",
    start_time: "2022/03/24 15:42",
    used_time: "40分钟57秒",
    finish_time: "2022/03/24 15:42",
    report_score: "100",
    question_score: "100",
    auto_score: "--",
    // check: ".",
    score: "100",
  },
]);
const tableData = ref([]);
const datapage:any=ref('')
const allData:any=ref({})
var option = {
  color: ["#FF9544"],
  grid: {
    left: 1,
    top: 40,
    // bottom:20,
    right: 100,
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    name: "实验",
    nameTextStyle: {
      color: "#333333",
    },
    axisLine: {
      lineStyle: {
        color: "#ccc",
      },
    },
    axisTick: {
      show: false,
    },
    data: ["实验名称", "实验名称", "实验名称", "实验名称"],
  },
  yAxis: {
    type: "value",
    name: "学习效率",
    nameTextStyle: {
      color: "#333333",
    },
    textStyle: {
      color: "black",
    },
    axisLine: {
      lineStyle: {
        color: "#ccc",
      },
    },
    axisLabel: {
      formatter: "{value}",
    },
  },
  series: [
    {
      name: "Highest",
      type: "line",
      symbol: "circle",
      symbolSize: 10,
      data: [3, 3, 2, 3.5],
      markLine: {
        data: [
          {
            type: "average",
            name: "Avg",
            label: {
              position: "end", // 表现内容展示的位置
              formatter: "平均线", // 标线展示的内容
              color: "#1CB2B3", // 展示内容颜色
              fontSize: 14,
            },
            lineStyle: {
              type: "solid",
              color: "#1CB2B3",
            },
          },
        ],
        symbol: ["none", "none"],
      },
    },
  ],
};
// 分页渲染dom
function renderVNode(_: any, { attrs: { vnode } }: any) {
  return vnode;
}
// table操作
function clickFun(type: string, val: number) {
  console.log(val);
  if (["updateReport", "video"].includes(type)) {
    console.log("录屏click");
  }
  if (["updateReport", "report"].includes(type)) {
    console.log("评阅click");
  }
}
// 学习效率
function drawCharts() {
  document.getElementById('graphicStatistics')?.removeAttribute("_echarts_instance_");
  var myChart = (echarts as any).init(
    document.getElementById("graphicStatistics")
  );
  myChart.setOption(option);
  return myChart;
}
// 获取成绩列表
function getallScoreList() {
  console.log('111111')
  http.allScoreList({ param: { course_id: courseId,page:datapage.value,limit:10} }).then((res: any) => {
    // console.log("allScoreList成功！！！");
    tableData.value = res.data.all.list;
    allData.value=res.data
  });
}
function onChangePage(page:any){
  console.log(page)
  datapage.value=page
    getallScoreList()
}
onMounted(() => {
  drawCharts();
  getallScoreList();
});
</script>

<style lang="less" scope>
.courseExperiment {
  padding: var(--padding-lg) var(--padding-lg);
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
      cursor: pointer;
    }
    .table-a-link:nth-last-child(1){
      margin-left: var(--font-size-16);
    }
    .no-link{
      color:var(--black-45);
      cursor:not-allowed;
    }
    .no-link:nth-last-child(1){
      margin-left: var(--font-size-16);
    }
  }
  .page-wrap {
    margin: var(--margin-lg) 0 var(--margin-lg) 0;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    height: 300px;
    .footer-left {
      font-size: var(--font-size-16);
      .statisTit{
        margin-top: 20px;
        font-weight: 400;
      }
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
      background:url(src/assets/images/learning-efficiency.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-top: 40px;
      .stu-info {
        position: absolute;
        display: flex;
        left: 66px;
        top: 62px;
        font-size: var(--font-size-16);
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