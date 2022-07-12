<template>
  <div class="teacherHome setScrollbar">
    <div class="banner-wrap">
      <swiper
        v-if="courseLists.length > 0"
        :modules="modules"
        navigation
        loop
        centeredSlides
        watchSlidesProgress
        :slides-per-view="5"
        :space-between="33"
        :slideToClickedSlide="true"
        @slideChange="slideChangeTransitionEnd"
        @setTranslate="setTranslate"
      >
      <!-- @slideChangeTransitionEnd="slideChangeTransitionEnd" -->
        <swiper-slide v-for="item in courseLists" :key="item.id" :style="`background-image: url(${systemImages.ThomeLunbo.bannerlunBo});`">
          {{ item.name }}
        </swiper-slide>
      </swiper>
    </div>
    <a-row :gutter="[24, 24]">
      <a-col :span="12">
        <div class="chart-box completion">
          <div class="title">课程完成率</div>
          <div>
            <div id="pie"></div>
            <div class="statistics">
              <div>
                <span>{{ courseCompletion.done }}</span
                >/人
                <div>课程已完成人数</div>
              </div>
              <div>
                <span>{{ courseCompletion.undone }}</span
                >/人
                <div>课程未完成人数</div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="chart-box">
          <div class="title">课程成绩分布</div>
          <div class="grade-distribution">
            <div id="radar"></div>
            <div>
              <div>
                成绩A：<span>{{ gradeDistribution.A }}人</span>
              </div>
              <div>
                成绩B：<span>{{ gradeDistribution.B }}人</span>
              </div>
              <div>
                成绩C：<span>{{ gradeDistribution.C }}人</span>
              </div>
              <div>
                成绩D：<span>{{ gradeDistribution.D }}人</span>
              </div>
              <div>
                未完成：<span>{{ gradeDistribution["0"] }}人</span>
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="chart-box">
          <div class="title">知识点错误率</div>
          <div class="error-rate" v-if="errorKonwledge.length">
            <div class="item" v-for="(item, index) in errorKonwledge" :key="item.id">
              <template v-if="index < 10">
                <span :title="item.knowledge_map_name">{{
                  item.knowledge_map_name
                }}</span>
                <a-progress
                  :stroke-color="{
                    '0%': systemColor.primary,
                    '100%': systemColor.primary,
                  }"
                  :percent="Number(item.error_rate)"
                />
              </template>
            </div>
          </div>
          <empty :height="255" v-else />
        </div>
      </a-col>
      <a-col :span="12">
        <div class="chart-box">
          <div class="title">知识图谱</div>
          <div id="graph" v-show="echartData?.knowledge_map?.parentNode"></div>
          <empty :height="255" v-show="!echartData?.knowledge_map?.parentNode" />
        </div>
      </a-col>
      <a-col :span="24">
        <div class="chart-box scater-box">
          <div class="title task-tabs">
            <span
              v-for="(item, index) in tabs"
              :key="index"
              :class="{ active: activeIndex === index }"
              @click="changeTab(index)"
              >{{ item.label }}</span
            >
          </div>
          <div id="scater"></div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, onBeforeUnmount, onMounted, reactive, ref, inject } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper";
import "swiper/css";
import * as echarts from "echarts";
import {
  pieOptions,
  radarOptions,
  scaterOptions,
  graphOptions,
  IpieData,
} from "./chartOption";
import request from "src/api/index";
import { Ihttp } from "./typings";
import { IBusinessResp } from "src/typings/fetch.d";
import { theme } from "src/utils/theme";
import { useI18n } from "vue-i18n";
import {getThemeData} from 'src/utils/theme'
const {systemColor,systemImages} = getThemeData()
// console.log(systemImages)
interface Ierror {
  id: number | string;
  knowledge_map_name: string;
  error_rate: number | string;
}
interface Ilists {
  id: number | string;
  name: string;
}
    const { t } = useI18n();
    const http = (request as Ihttp).teacherHome;
    const activeIndex = ref<number>(0);
    const echartData = ref<any>("");
    const courseLists = reactive<Ilists[]>([]);
    const courseCompletion = reactive<IpieData>({
      done: 0,
      undone: 0,
    });
    const gradeDistribution = ref<any>({
      0: 0,
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    });
    const errorKonwledge = reactive<Ierror[]>([]);
    const score_usedtime = ref<any>({});
    const chartDom = reactive<any>([]);
    const showGraph = ref<boolean>(true);
    const tabs = [
      {
        value: 0,
        label: t("word.content") + "成绩分布图",
      },
      {
        value: 1,
        label: t("word.content") + "用时分布图",
      },
    ];
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [],
      showContent: false,
      componenttype: undefined,
      showNav: false,
    });
    const slideChangeTransitionEnd = (swiper: any) => {
      getData(courseLists[swiper.realIndex].id);
      getErrorRoate(courseLists[swiper.realIndex].id)
    };
    const setTranslate = (swiper: any) => {
      var slides = swiper.slides;
      slides.forEach((item: any, i: number) => {
        let progress = item.progress;
        item.style.transform = "scale(" + (1.5 - Math.abs(progress) / 4) + ")";
        activeIndex.value = 0;
        setChart("scater", scaterOptions(0, score_usedtime.value));
      });
    };
    const setChart = (ele: string, options: object) => {
      document.getElementById(ele)?.removeAttribute("_echarts_instance_");
      let eleChart = (echarts as any).init(document.getElementById(ele));
      chartDom.push(eleChart);
      eleChart.setOption(options);
    };
    const changeTab = (index: number) => {
      activeIndex.value = index;
      setChart("scater", scaterOptions(index, score_usedtime.value));
    };
    const handleData = (obj: Object, type?: string) => {
      return Object.keys(obj).length
        ? obj
        : !type
        ? {}
        : { 0: 0, A: 0, B: 0, C: 0, D: 0 };
    };
    const reset = () => {
      courseCompletion.done = 0;
      courseCompletion.undone = 0;
      setChart("pie", pieOptions(courseCompletion));
      setChart("radar", radarOptions(handleData({}, "grade")));
      setChart("scater", scaterOptions(0, {}));
      setChart("graph", graphOptions({}));
    };
    const getErrorRoate=(courseId: string | number)=>{
      if (!courseId) {
        return;
      }
      http.pointErrorRate({urlParams: { courseId:courseId } }).then((res: IBusinessResp) => {
        if(res && res.data){
          let result = res.data;
          errorKonwledge.push(...result.error_knowledge);
        }
      })
    }
    const getData = (courseId: string | number) => {
      errorKonwledge.length = 0;
      if (!courseId) {
        echartData.value = "";
        gradeDistribution.value = handleData({}, "grade");
        reset();
        return;
      }
      http.courseData({ param: { course_id: courseId } }).then((res: IBusinessResp) => {
      // http.courseData({urlParams: { courseId:courseId } }).then((res: IBusinessResp) => {
        if (res && res.data) {
          let result = res.data;
          echartData.value = res.data;
          // 课程完成率
          courseCompletion.done = result.done;
          courseCompletion.undone = result.undone;
          setChart("pie", pieOptions(courseCompletion));
          // 知识点错误率
          // errorKonwledge.push(...result.error_knowledge);
          // 课程成绩分布
          gradeDistribution.value = handleData(result.course_rank, "grade");
          setChart("radar", radarOptions(gradeDistribution.value));
          // 实验成绩分布
          score_usedtime.value = handleData(result.score_usedtime);
          setChart("scater", scaterOptions(0, score_usedtime.value));
          // 知识图谱
          setChart("graph", graphOptions(handleData(result.knowledge_map)));
          // Object.keys(result.knowledge_map).length
          //   ? (showGraph.value = true)
          //   : (showGraph.value = false);
        }
      });
    };
    const getCourseList = () => {
      http.courseList().then((res: IBusinessResp) => {
        if (res && res.data) {
          Object.assign(courseLists, res.data.course_ongoing);
          if (courseLists.length > 0) {
            getData(courseLists[0].id);
            getErrorRoate(courseLists[0].id)
          }
        }
      });
    };
    onMounted(() => {

      getCourseList();
      // window.addEventListener("resize", () => {
      //   chartDom.forEach((item: any) => {
      //     item.resize();
      //   });
      // });
    });
    const formatProgress = (percent: any) => {
      return percent + "%";
    };
    const modules:any=[Navigation]
    const left = `url(${systemImages.ThomeLunbo.left})`
    const right = `url(${systemImages.ThomeLunbo.right})`
    const bannerlunBo= `url(${systemImages.ThomeLunbo.bannerlunBo})`
    // console.log(bannerlunBo);
    
</script>
<style lang="less" scoped>
.teacherHome {
  // color: rgba(255, 149, 68,.25);
  min-width: var(--center-width);
  // overflow: auto;
  height: 100%;
  padding: 0 60px;
  .banner-wrap {
    width: 100%;
    position: relative;
    margin-bottom: 20px;
  }
  :deep(.swiper) {
    padding: 70px 150px;
    .swiper-button-prev,
    .swiper-button-next {
      position: absolute;
      width: 100px;
      height: 160px;
      top: 0;
      bottom: 0;
      margin-top: auto;
      margin-bottom: auto;
      z-index: 99;
      background: #fafafb;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .swiper-button-prev {
      left: 0;
      &::after {
        content: "";
        width: 64px;
        height: 64px;
        // background: url(src/assets/images/teacher-default/left.png) no-repeat;
        background-image: v-bind(left);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .swiper-button-next {
      right: 0;
      &::after {
        content: "";
        width: 64px;
        height: 64px;
        // background: url(src/assets/images/teacher-default/right.png) no-repeat;
        background-image: v-bind(right);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .swiper-wrapper {
      width: 100%;
      .swiper-slide {
        color: #fff;
        border-radius: 20px;
        text-align: center;
        font-size: 18px;
        background: var(--primary-color);
        height: 130px;
        box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.34);
        display: flex;
        justify-content: center;
        align-items: center;
        transition-property: all;
        // background: url(src/assets/images/teacher-default/banner-bg2.png) no-repeat;
        // background-image: v-bind(bannerlunBo);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        word-break: break-all;
        padding: 10px;
        &.swiper-slide-next {
          z-index: -1;
        }
      }
    }
  }
  .chart-box {
    width: 100%;
    background: var(--white-100);
    padding: 25px;
    height: 400px;
    border-radius: 6px;
    &.completion {
      background: url("src/assets/images/teacher-default/panel-first-bg2.png") no-repeat
        90% 55%;
      background-color: var(--white-100);
      & > div:nth-child(2) {
        display: flex;
      }
      .statistics {
        padding: 50px 0;
        color: var(--black-25);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        span {
          font-size: 40px;
          color: var(--black-100);
        }
      }
    }
    &.scater-box {
      height: 460px;
    }
    .title {
      line-height: 28px;
      font-size: 18px;
      font-weight: 500;
      
    }
    #pie,
    #radar {
      width: 40%;
      height: 330px;
    }
    #scater {
      width: 100%;
      height: 400px;
    }
    #graph {
      width: 671px;
      height: 300px;
    }
    .grade-distribution {
      display: flex;
      justify-content: center;
      font-size: 14px;
      & > div:last-child {
        padding: 40px;
        & > div {
          padding: 15px;
          color: var(--black-25);
        }
      }
    }
    .task-tabs {
      span {
        cursor: pointer;
        margin-right: 30px;
        color: var(--black-25);
        &.active {
          color: var(--black-85);
        }
      }
    }
  }
  .error-rate {
    .item {
      margin-top: 9px;
      display: flex;
      align-items: center;
      span {
        font-size: 14px;

        &:first-of-type {
          display: inline-block;
          width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      :deep(.ant-progress) {
        .ant-progress-bg {
          height: 16px !important;
        }
        .ant-progress-text {
          color: var(--black-100);
        }
      }
    }
  }
}
.cont {
  width: 100%;
  :deep(img) {
    max-width: 100%;
  }
}
</style>
