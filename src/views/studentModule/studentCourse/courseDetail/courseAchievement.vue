<template>
  <div class="courseExperiment">
    <div class="table-header">
      <div class="table-header-left">
        <h3>成绩详情</h3>
      </div>
      <div class="table-header-right">
        <div>实验最高分：{{allData?.max_min_score?.max_score||allData?.max_min_score?.max_score==0?allData?.max_min_score?.max_score:'--'}}分</div>
        <div>实验最低分：{{allData?.max_min_score?.min_socre||allData?.max_min_score?.min_socre==0?allData?.max_min_score?.min_socre:'--'}}分</div>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="tableData"
      bordered
      size="middle"
      :pagination="false"
      rowKey='content_name'
    >
      <template #check="{ record }">
        <span class='recordScreen' :class="record?.video?.length?'table-a-link':'no-link'" @click="record?.video?.length?clickFun(record.video, 'video'):''">录屏</span>
        <span :class="record?.remark!=='--'?'table-a-link':'no-link'" @click="record?.remark!=='--'?clickFun(record.remark, 'remark'):''">评语</span>
      </template>
      <!-- 报告 -->
      <!-- <template #report_score='{record}'>
        <span :class="record?.report_score?'table-a-link':'no-link'" @click="record?.remark!=='--'?clickFun(record.report?.pdf_path, 'report',record.report):''" v-if="record?.report_score">
          {{record?.report_score}}
        </span>
        <span class='no-link' v-else-if="!record?.report_score&&record?.report?.length">
          未评分
        </span>
        <span class='no-link' v-else>
          未提交
        </span>
      </template> -->
      <template #report_score='{record}'>
        <div>
          <span :class="['未提交','未评阅','--'].includes(record?.report_score)?'no-link':'table-a-link'" @click="['未提交','未评阅','--'].includes(record?.report_score)?'':clickFun(record.report?.pdf_path, 'report',record.report)">
          {{record?.report_score}}
        </span>
        </div>
      </template>
      <!-- //随测 -->
      <!-- <template #question_score='{record}'>
        <span class='no-link' v-if="record?.question_score==null">
          未提交
        </span>
        <span class='table-a-link' v-else @click="clickFun(record.exper, 'exper')">
          {{record?.question_score}}
        </span>
      </template> -->
      <template #question_score='{record}'>
        <div>
          <span :class="['未提交','未评阅','--'].includes(record?.question_score)?'no-link':'table-a-link'" @click="['未提交','未评阅','--'].includes(record?.question_score)?'':clickFun(record.exper, 'exper')">
          {{record?.question_score}}
        </span>
        </div>
      </template>
      <!-- //自动评分 -->
      <!-- <template #auto_score='{record}'>
        <span class='no-link' v-if="record?.auto_score==null">
          待提交
        </span>
        <span v-else>
          {{record?.auto_score}}
        </span>
      </template>
      -->
       <template #auto_score='{record}'>
        <div>
          <span :class="['未提交','未评阅','--'].includes(record?.auto_score)?'no-link':'table_black'">
          {{record?.auto_score}}
        </span>
        </div>
      </template>
      <!-- //最终成绩 -->
      <template #score='{record}'>
        <span :class="['未提交','未评阅','--'].includes(record?.auto_score)?'no-link':'table_black'">
          {{record?.score}}
        </span>
      </template>
     
    </a-table>
    <a-pagination :total="allData?.all?.page?.totalCount" class="page-wrap" @Change='onChangePage' :hideOnSinglePage='true'>
      
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
            <div>{{grandsData?.profile?.name}}</div>
            <div>{{grandsData?.profile?.username}}</div>
            <div>{{grandsData?.avg}}</div>
            <div>NO.{{grandsData?.rank}}</div>
          </div>
        </div>
      </div>
    </div>
    <a-modal
        :title="modaldata.title"
        :footer="null"
        :visible="modaldata.visableDetail"
        @ok="detailOk"
        @cancel="detailCancel"
        width="1000px"
      >
        <div>
          <cvideo v-if="modaldata.componentName=='cvideo'" :detailInfo="modaldata.detailInfo" :baseInfo="modaldata.baseInfo"></cvideo>
          <exper v-if="modaldata.componentName=='exper'" :detailInfo="modaldata.detailInfo" :baseInfo="modaldata.baseInfo"></exper>
          <report v-if="modaldata.componentName=='report'" :detailInfo="modaldata.detailInfo" :baseInfo="modaldata.baseInfo"></report>
          <remark v-if="modaldata.componentName=='remark'" :detailInfo="modaldata.detailInfo" :baseInfo="modaldata.baseInfo"></remark>
        </div>
      </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { log } from "console";
import * as echarts from "echarts";
import { ref, toRefs, onMounted,reactive} from "vue";
import request from "src/api/index";
import { useRouter ,useRoute } from 'vue-router';
import exper from "../courseDetail/components/exper.vue";
import report from "../courseDetail/components/report.vue";
import cvideo from "../courseDetail/components/video.vue";
import remark from "../courseDetail/components/remark.vue";
const http = (request as any).studentScore;
const route=useRoute()
const courseId:any=route.query.courseId  //课程id
const studyEffectData:any=reactive({
    names:[],
    datas:[]
})
const grandsData:any=ref()
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
    width:150,
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
        slots: { customRender: "report_score" },
        align:'center'
        // report为空为未提交 report-score为空 未评分
      },
      {
        title: "随堂测试",
        dataIndex: "question_score",
        key: "question_score",
        slots: { customRender: "question_score" },
        align:'center'
      },
      {
        title: "自动评分",
        dataIndex: "auto_score",
        key: "auto_score",
        slots: { customRender: "auto_score" },
        align:'center'
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
    slots: { customRender: "score" },
    align:'center'
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
const modaldata:any=reactive({

})
function setChart(data:any){
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
      data:data.names,
      // ["实验名称", "实验名称", "实验名称", "实验名称"],
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
        data:data.datas,
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
  return option
}

// 分页渲染dom
function renderVNode(_: any, { attrs: { vnode } }: any) {
  return vnode;
}
function noclick(){

}
// table操作
function clickFun(resultData: any, type: any, report?: any) {
  // console.log(val);
  // if (["updateReport", "video"].includes(type)) {
  //   console.log("录屏click");
  // }
  // if (["updateReport", "report"].includes(type)) {
  //   console.log("评阅click");
  // }
  // function lookResult(resultData: any, type: any, report?: any) {
    modaldata.componentName = type === "video" ? "cvideo" : type;
    
      const types = {
        exper: "随堂测试详情",
        video: "操作视频",
        report: "报告",
        remark:'评语'
      };
      modaldata.title = types[type];
      modaldata.detailInfo = resultData;
      modaldata.baseInfo = report;
      modaldata.visableDetail = true;
}
function detailOk(){
  modaldata.visableDetail= false;
}
function detailCancel(){
  modaldata.visableDetail= false;
}
// 学习效率
function drawCharts() {
  document.getElementById('graphicStatistics')?.removeAttribute("_echarts_instance_");
  var myChart = (echarts as any).init(
    document.getElementById("graphicStatistics")
  );
  myChart.setOption(setChart(studyEffectData));
}
// 获取成绩列表
function getallScoreList() {
  console.log('111111')
  // courseId
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
function studyChart(){
  http.statisTicChart({param:{course_id:courseId}}).then((res:any)=>{
      studyEffectData.names=res.data.content_name
      studyEffectData.datas=res.data.log
      grandsData.value=res.data
      drawCharts();
  })
}
onMounted(() => {
  getallScoreList();
  studyChart()
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
      color: var(--primary-color);
    }
    .recordScreen{
      margin-right:10px;
    }
    // .table-a-link:nth-last-child(1){
    //   margin-left: var(--font-size-16);
    // }
    .no-link{
      color:var(--black-45);
      // cursor:not-allowed;
    }
  }
  // .page-wrap {
  //   margin: var(--margin-lg) 0 var(--margin-lg) 0;
  // }
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
        font-weight: 500;
        // font-size: var(--font-size-16);
        color: var(--orangeyellow-6);
        // background-color: blue;
        .stu-info-left {
          // padding-right: var(--padding-xs);
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
.table_black{
  color: var(--black-65);
}
</style>