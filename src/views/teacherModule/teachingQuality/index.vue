<template>
  <div class="teachingQuality">
    <div class="echarts-1">
      <div class="left">
        <div class="header">
          <span class="text-name">课程成绩对比</span>
          <span class="tit">最近开设课程的学生成绩最高分和平均分的对比</span>
        </div>
        <div id="courseAchieve" v-show="scoreData.name.length"></div>
        <empty :height="230" v-show="!scoreData.name.length" />
      </div>
      <div class="right">
        <div class="header">
          <span class="text-name">岗位能力分析</span>
          <span class="tit">岗位对应的课程成绩分布情况</span>
        </div>
        <template v-if="categoryTags.length">
          <a-tabs
            tab-position="top"
            :style="{ height: '45px' }"
            @prevClick="changeTabs"
            @nextClick="changeTabs"
            @change="changeTabs"
            v-model:activeKey="activeKey"
          >
            <a-tab-pane
              v-for="i in categoryTags"
              :key="i.name"
              :tab="i.name"
            ></a-tab-pane>
          </a-tabs>
          <div id="capabilityAnalysis" v-show="jobData.name.length"></div>
          <empty :height="200" v-show="!jobData.name.length" />
        </template>
        <template v-else>
          <empty :height="230" />
        </template>
      </div>
    </div>
    <div class="banner-2" v-if="courseSwitchData.length">
      <!-- centeredSlides -->
      <swiper
        :modules="modules"
        navigation
        loop
        watchSlidesProgress
        :slides-per-view="4"
        :space-between="30"
        :slideToClickedSlide="true"
        @slideChange="slideChangeTransitionEnd"
      >
        <swiper-slide v-for="item in courseSwitchData" :key="item.id">
          <img :src="item.url" alt="" />
          <div class="mask">
            <span>{{ item.name }}</span>
            <span @click.stop="goAnalysis(item.id)">学情分析 >></span>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="echarts-3">
      <div class="left">
        <div class="header">
          <div class="name">知识点错误率</div>
          <div class="tit">
            以矩形树图的形式展现所选课程中错误率最高的前10个知识点，错误率越高矩形越大。
          </div>
        </div>
        <div
          id="knowledgePointErrorRate"
          v-show="fourChart.error_knowledge.length"
        ></div>
        <empty :height="230" v-show="!fourChart.error_knowledge.length" />
      </div>
      <div class="right">
        <div class="header">
          <div class="name">实验成绩分布</div>
          <div class="tit">以箱线图展示所选课程的每个实验的成绩分布情况</div>
        </div>
        <div
          id="scoreDistribution"
          v-show="fourChart.content_score.name.length"
        ></div>
        <empty :height="230" v-show="!fourChart.content_score.name.length" />
      </div>
    </div>
    <div class="echarts-4">
      <div class="left">
        <div class="header">
          <div class="name">知识图谱</div>
          <div class="tit">
            以关系图显示课程-实验-知识点之间的关系，知识点错误率越高，圈越大。
          </div>
        </div>
        <div
          id="knowledgeGraph"
          v-show="fourChart.knowledge_map.length"
        ></div>
        <empty :height="230" v-show="!fourChart.knowledge_map.length" />
      </div>
      <div class="right">
        <div class="header">
          <div class="name">高频易错点梳理图</div>
          <div class="tit">
            以桑基图展示所选课程中错误率最高的10个知识点与实验、习题之间的关系
          </div>
        </div>
        <div
          id="highFrequencyErrorProne"
          v-show="fourChart.combData.data.length"
        ></div>
        <empty :height="230" v-show="!fourChart.combData.data.length" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  inject,
  nextTick,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import * as echarts from "echarts";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper";
import "swiper/css";
import {
  courseScoreOption,
  jobAbilityOption,
  knowledageErrorOption,
  gradeDistributionOption,
  setOption4,
  combOption,
} from "./echartOption";
import { Knowledge3 } from "src/views/teacherModule/teachCourse/courseDetail/components/Chapter/echartsOption";
import { ICourseScore, IjobData, IfourChart } from "./qualityTyping";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "教学质量", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
const http = (request as any).teachingQuality;
const httpCourse = (request as any).teachCourse;
const router = useRouter();
const activeKey = ref("1");
const scoreData = reactive<any>({
  name: [],
  max_score: [],
  average_score: [],
});
const categoryTags = reactive<any>([]);
const jobData = reactive<IjobData>({
  name: [],
  value: [],
});
const courseSwitchData = reactive<any>([]);
const currentCourseId = ref(); // 当前课程id
const fourChart = reactive<IfourChart>({
  error_knowledge: [],
  content_score: {
    name: [],
    score: [],
  },
  knowledge_map: [],
  combData: {
    data: [],
    links: []
  }
});
function changeTabs(val: string) {
  drawAnalysis(val);
}
const modules: any = ref([Navigation]);
function slideChangeTransitionEnd(swiper: any) {
  console.log(courseSwitchData[swiper.realIndex].id);
  currentCourseId.value = courseSwitchData[swiper.realIndex].id
}
function setChartOption(id: any, option: any) {
  document.getElementById(id)?.removeAttribute("_echarts_instance_");
  var chartDom: any = document.getElementById(id);
  var myChart = echarts.init(chartDom);
  option && myChart.setOption(option);
  if (!option) {
    myChart.dispose();
  }
}
const chartData: any = ref({});
function getKnoledgeData() {
  httpCourse
    .courseknowledge({ urlParams: { courseId: 500229 } })
    .then((res: any) => {
      const { data } = res;
      chartData.value = { ...data };
      // list.push(...data)
      nextTick(() => {
        //   Knowledge3('knowledgeGraph',chartData.value,50)
        setChartOption("knowledgeGraph", setOption4(chartData.value));
      });
    });
}
// 课程成绩对比
function getCourseScore() {
  http.courseScore().then((res: IBusinessResp) => {
    res.data.forEach((item: ICourseScore) => {
      scoreData.name.push(item.name);
      scoreData.max_score.push(item.max_score);
      scoreData.average_score.push(item.average_score);
    });
    setChartOption("courseAchieve", courseScoreOption(scoreData));
  });
}
// 获取岗位列表
function getCategoryTags() {
  categoryTags.length = 0;
  http.categoryTags().then((res: IBusinessResp) => {
    categoryTags.push(...res.data);
    activeKey.value = categoryTags.length && categoryTags[0].name;
  });
}
// 岗位能力分析
function drawAnalysis(jobName: string) {
  jobData.name.length = 0;
  jobData.value.length = 0;
  http
    .jobAbility({ urlParams: { jobName: jobName } })
    .then((res: IBusinessResp) => {
      res?.data.forEach((item: any) => {
        jobData.name.push({ name: item.name, min: 0, max: 100 });
        jobData.value.push(item.average_score);
      });
      setChartOption(
        "capabilityAnalysis",
        jobData.name.length ? jobAbilityOption(jobData) : null
      );
    });
}
// 课程轮播列表
function getCourseSwitch() {
  courseSwitchData.length = 0;
  http.coursesSwitch().then((res: IBusinessResp) => {
    courseSwitchData.push(...res.data);
    if (courseSwitchData.length) {
      currentCourseId.value = courseSwitchData[0].id;
    }
    // currentCourseId.value = 500238
    // getFourChartData()
  });
}
// 查看学情分析
function goAnalysis(id: number) {
  router.push({
    path: "/teacher/teacherCourse/Detail",
    query: { currentTab: 0, courseId: id, activeTabOrder: 4 },
  });
}
// 处理桑基图需要的数据格式
function handleCombData(sankey_error_rate: any) {
  if (!Object.keys(sankey_error_rate).length) return
  let contentsIdArr:any[] = [];
  let contentsNameArr:any[] = [];
  let colorList = ["#FF9544", "#FFBF50", "#33D0DB", "#748ADE", "#A782F3"]
  sankey_error_rate.contents.forEach((item: any) => {
    fourChart.combData.data.push({ 
      name: item.name,
      label: {
        position: 'left'
      }
    });
    contentsIdArr.push(item.content_id);
    contentsNameArr.push(item.name);
  });
  sankey_error_rate.knoledge_error_rate.forEach((item: any, index:number) => {
    fourChart.combData.data.push({ 
      name: item.knowledge_map_name,
      label: {
        position: 'right'
      },
      itemStyle: {
        normal: {
          color: colorList[index % 5]
        }
      }
    });
    item.names = [];
    item.content_ids.forEach((itemId: any, index: number) => {
      let subs = contentsIdArr.indexOf(Number(itemId));
      if (subs !== -1) {
        item.names.push(contentsNameArr[subs]);
      }
    });
  });
  sankey_error_rate.knoledge_error_rate.forEach((item: any) => {
    item.names.forEach((itemName: any) => {
      fourChart.combData.links.push({
        source: item.knowledge_map_name,
        target: itemName,
        value: item.error_rate,
      });
    });
  });
}
// 四图联动(知识点错误率、实验成绩分布、知识图谱、高频易错点梳理)
function getFourChartData() {
  init();
  if (!currentCourseId.value) return;
  http
    .coursesResult({ urlParams: { courseId: currentCourseId.value } })
    .then((res: IBusinessResp) => {
      let result = res.data;
      // 知识点错误率
      result.error_knowledge.forEach((item: any) => {
        fourChart.error_knowledge.push({
          name: item.knowledge_map_name,
          value: item.error_rate,
        });
      });
      setChartOption(
        "knowledgePointErrorRate",
        knowledageErrorOption(fourChart.error_knowledge)
      );
      // 实验成绩分布
      result.content_score.forEach((item: any) => {
        fourChart.content_score.name.push(item.content_name);
        fourChart.content_score.score.push(item.scores);
      });
      setChartOption(
        "scoreDistribution",
        gradeDistributionOption(fourChart.content_score)
      );
      // 知识图谱
      fourChart.knowledge_map = result.knowledge_map;
      setChartOption("knowledgeGraph", setOption4(fourChart.knowledge_map));
      // 高频易错点梳理
      handleCombData(result.sankey_error_rate);
      setChartOption("highFrequencyErrorProne", combOption(fourChart.combData));
    });
}
function init() {
  fourChart.error_knowledge = [];
  fourChart.content_score.name = [];
  fourChart.content_score.score = [];
  fourChart.combData.data = [];
  fourChart.combData.links = [];
}
watch(
  () => activeKey.value,
  (newVal) => {
    nextTick(() => {
      drawAnalysis(newVal);
    });
  }
);
watch(()=>currentCourseId.value, newVal => {
  getFourChartData()
})
onMounted(() => {
  // 课程成绩对比
  getCourseScore();
  // 岗位列表
  getCategoryTags();
  // 课程轮播
  getCourseSwitch();
});
</script>
<style lang="less" scoped>
.teachingQuality > div:not(.banner-2) {
  padding: 0 22px;
}
.banner-2 {
  width: 100%;
  height: 150px;
  position: relative;
  display: flex;
}
:deep(.swiper-button-prev) {
  position: absolute;
  left: -8px;
  top: 50px;
  z-index: 10;
  width: 48px;
  height: 48px;
  background: url(src/assets/images/prev.png) no-repeat;
}
:deep(.swiper-button-next) {
  position: absolute;
  right: -8px;
  top: 50px;
  z-index: 10;
  width: 48px;
  height: 48px;
  background-color: aqua;
  background: url(src/assets/images/next.png) no-repeat;
}
.swiper {
  padding: 0 25px 3px;
}
.swiper-wrapper {
  .swiper-slide {
    width: 282px;
    height: 150px;
    border-radius: 10px;
    position: relative;
    transition: all 0.5s;
    border: 2px solid transparent;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
    .mask {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 40px;
      background: var(--black-75);
      text-align: center;
      color: var(--white-100);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      & > span:last-of-type {
        display: none;
        color: var(--primary-color);
        cursor: pointer;
      }
    }
    &:hover {
      border-color: var(--primary-color);
      .mask {
        height: 60px;
        & > span:last-of-type {
          display: block;
        }
      }
    }
    &.swiper-slide-active {
      border: 4px solid var(--primary-color);
    }
  }
}
.echarts-1,
.echarts-2,
.echarts-3,
.echarts-4 {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .left,
  .right {
    width: 50%;
    height: 443px;
    background-color: var(--white-100);
    padding: 24px;
  }
}
.echarts-1{
  margin-bottom: 20px;
  .left,.right{
    width: 49%;
  }
}
.text-name {
  font-size: 16px;
  font-weight: 400;
  margin-right: 20px;
}
.header {
  .name {
    font-size: 16px;
    font-weight: 400;
    margin-right: 20px;
    width: 100%;
    height: 30px;
    border-bottom: 1px solid var(--gray-6);
  }
  .tit {
    margin-top: 10px;
    color: var(--black-45);
    font-size: 12px;
  }
}
#courseAchieve,
#capabilityAnalysis,
#knowledgePointErrorRate,
#scoreDistribution,
#knowledgeGraph,
#highFrequencyErrorProne {
  width: 540px;
  height: 350px;
}
#courseAchieve{
  height: 400px;
}
.emptyContent {
  padding-top: 45px;
}
</style>
