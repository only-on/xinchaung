<template>
    <div id="statistic" class="setScrollbar">
      <div class="box-left">
        <div class="left-f1 f1">
          <p class="hint">{{ state.staticInfo.userProfile?.name }}，又是元气满满的一天！</p>
          <div class="hint-msg">每天进步一点点，成长足迹看得见！</div>
        </div>
        <div class="left-f2 f2">
          <div :id="myChartid" class="myCharts"></div>
        </div>
        <div class="left-f3 f3">
          <div class="left-f3-course">
            <list-item
              :infoList="state.staticInfo.weakKnowledges"
              :title="'课程薄弱点'"
              :listname="'knowledge_map_name'"
              :color1="state.linePurple"
              :circlecolor="state.circlecolor1"
            ></list-item>
          </div>
          <div class="left-f3-exper">
            <list-item
              :infoList="state?.staticInfo?.weakCourseContents"
              :title="'推荐实验'"
              :listname="'name'"
              :color1="state.lineOrange"
              :circlecolor="state.circlecolor2"
            ></list-item>
          </div>
        </div>
      </div>
      <div class="box-right">
        <div class="right-f1 f1">
          <div class="right-f1-left">
            <div class="top-title">综合评价</div>
            <div class="evaluate">
            <img v-if="state.staticInfo.avgRank=='差'" src="src/assets/images/unhege.png">
            <img v-if="state.staticInfo.avgRank=='及格'" src="src/assets/images/hege.png">
            <img v-if="state.staticInfo.avgRank=='良'" src="src/assets/images/lianghao.png">
            <img v-if="state.staticInfo.avgRank=='优'" src="src/assets/images/youxiu.png">
            <img v-if="state.staticInfo.avgRank==''" src="src/assets/images/excellent-no.png" />
            </div>
          </div>
          <div class="right-f1-img">
            <img v-if="state.staticInfo.avgRank=='差'" src="src/assets/images/unqualified.png">
            <img v-if="state.staticInfo.avgRank=='及格'" src="src/assets/images/qualified.png">
            <img v-if="state.staticInfo.avgRank=='良'" src="src/assets/images/good.png">
            <img v-if="state.staticInfo.avgRank=='优'" src="src/assets/images/excellent.png">
            <img v-if="state.staticInfo.avgRank==''" src="src/assets/images/evaluate-no.png" />
          </div>
        </div>
        <div class="right-f2 f2">
          <div class="stu-proess">学习进度概况</div>
          <div class="stu-proess-con">
            <div class="proess-con-left">
              <div class="stu-state-row">
                <div class="study-left course-state-icon course-state-icon1"></div>
                <div class="study-right">
                  <div class="study-right-left">
                    <span>学习进度排名</span>
                  </div>
                  <div class="progressdiv">
                    <span class="courseProgress">NO.</span
                    ><span class="courseProgress">{{ state.staticInfo.courseProgress?.id }}</span>
                  </div>
                </div>
              </div>
              <div class="stu-state-row">
                <div class="study-left course-state-icon course-state-icon2"></div>
                <div class="study-right">
                  <div class="study-right-left">
                    <span>课程已完成实验数</span>
                  </div>
                  <div class="progressdiv">
                    <span class="courseProgress">{{
                      state.staticInfo.courseProgress?.finished_content_count
                    }}</span
                    ><span class="unit">/ 个</span>
                  </div>
                </div>
              </div>
              <div class="stu-state-row">
                <div class="study-left course-state-icon course-state-icon3"></div>
                <div class="study-right">
                  <div class="study-right-left">
                    <span>未完成实验数</span>
                  </div>
                  <div class="progressdiv">
                    <span class="courseProgress">{{
                      state.staticInfo.courseProgress?.left_content_count
                    }}</span
                    ><span class="unit">/ 个</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="proess-con-right"></div>
          </div>
        </div>
        <div class="right-f3 f3">
          <list-item
            :infoList="state.staticInfo.jobDirections"
            :title="'发展方向'"
            :listname="'name'"
            :color1="state.lineBlue"
            :circlecolor="state.circlecolor3"
          ></list-item>
        </div>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
  import { message } from "ant-design-vue";
  import { defineComponent, inject, onMounted, provide, reactive, toRefs, ref } from "vue";
  import request from 'src/api/index'
  import listItem from "./listItem/index.vue";
  import * as echarts from "echarts";
  interface objType {
    name?: string;
  }
  interface StatisType {
    // 用户信息
    userProfile?:any;
    // userProfile?: objType;
    // 课程成绩
    courseGrade?: any[];
    // 学习进度排名
    avgRank?: any;
    // 课程薄弱点
    weakKnowledges?: any[];
    weakCourseContents?: any[];
    jobDirections?: any[];
    courseProgress?: any;
    number?: number;
    index?: number;
    content?: string;
  }
  interface State {
    staticInfo: StatisType;
    lineBlue: string;
    lineOrange: string;
    linePurple: string;
    circlecolor1: string;
    circlecolor2: string;
    circlecolor3: string;
  }
  
      var courseGrandEcharName: any= ref([]);
      var courseGrandEcharValue: any= ref([]);
      const myChartid: any = ref("myChartid" + Math.random());
      var updata = inject("updataNav") as Function;
      updata({ tabs: [], showContent: true, showNav: false });
      const state: State = reactive({
        staticInfo: {},
        lineBlue:
        "linear-gradient(90deg,rgba(76,160,255,0.12) 24%, rgba(76,160,255,0.00) 78%)",
        lineOrange:
          "linear-gradient(90deg,rgba(255,149,68,0.12) 24%, rgba(255,149,68,0.00) 78%)",
        linePurple:
        "linear-gradient(90deg,rgba(28,178,179,0.12) 24%, rgba(28,178,179,0.00) 78%)",
        circlecolor1: "#1CB2B3",
        circlecolor2: "#F7931A",
        circlecolor3: "#4CA0FF",
      });
      // 绘制图表
      var courseOption = {
        title: { text: "课程成绩" }, //图标中的表题
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              color: "rgba(51,51,51,0.2)",
            },
          },
        },
        grid: {
          left: 40,
          right: 40,
          top: 80,
          bottom: 80,
        },
        xAxis: {
          name: "课程",
          nameLocation: "end",
          nameTextStyle: {
            color: "999",
          },
          data: courseGrandEcharName.value,
          axisLabel: {
            color: "#999",
            interval:0,
          },
          interval: 0,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#d2d2d2",
              // color: "red",
            },
          },
          splitLine: {
            show: false,
          },
        },
  
        yAxis: {
          name: "成绩",
          nameTextStyle: {
            color: "#666",
          },
          max: 100,
          min: 0,
          interval: 20,
          axisLabel: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
          },
        },
        series: [
          {
            name: "成绩",
            type: "bar",
            barWidth: 30,
            data: courseGrandEcharValue.value,
            itemStyle: {
              color: "#FFBA49",
            },
            showBackground: true,
            backgroundStyle: {
              color: "#FFF2DB"
            },
          },
        ],
      };
      function DrawEchar() {
        console.log("重新渲染Echarts");
        var myChart: any = (echarts as any).init(document.getElementById(myChartid.value));
        myChart.setOption(courseOption);
        return myChart;
      }
      function getData() {
        console.log("获取数据", myChartid.value);
        const infoRequest = (request as any).index;
        infoRequest.getInfo().then((res: any) => {
          state.staticInfo = res.data;
            state.staticInfo.courseGrade?.forEach((item:any) => {
            console.log(item,'item')
            courseGrandEcharName.value.push(item.name);
            courseGrandEcharValue.value.push(item.value);
          });
          let courseEchar: any = DrawEchar();
          courseEchar.setOption(courseOption);
        });
        var myChart: any = (echarts as any).init(document.getElementById(myChartid.value));
        let courseEchar: any = DrawEchar();
        courseEchar.setOption(courseOption);
        provide("staticInfo", "state.staticInfo");
      }
      onMounted(() => {
        getData();
      })
  </script>
  <style lang="less" scoped>
  #statistic {
    display: flex;
    margin: 0 auto;
    background: #f7f7f7;
    .box-left {
      width: 64.7%;
      display: flex;
      flex-direction: column;
    }
    .box-right {
      width: calc(35.3% - 30px);
      margin-left: 30px;
    }
    .content-title {
      font-size: var(--font-size-16);
      color: #050101;
      letter-spacing: 1px;
      font-weight: 700;
      flex-shrink: 0;
      line-height: 45px;
    }
    .min-content-item {
      height: 44px;
    }
    .max-content-item {
      height: 44px;
    }
    .content-item {
      border-radius: 14px;
      padding-left: 13px;
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      font-size: 12px;
      background: linear-gradient(
        90deg,
        rgba(18, 144, 239, 0.12) 24%,
        rgba(98, 126, 234, 0) 78%
      );
      > span:nth-child(1) {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: inline-block;
        line-height: 22px;
        text-align: center;
        padding: 2px;
        margin-right: 14px;
        border: 1px solid #1290ef;
        > span {
          display: inline-block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #1290ef;
          color: var(--white-100);
        }
      }
    }
    .f1 {
      height: 170px;
    }
    .f2 {
      height: 375px;
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .f3 {
      height: 300px;
    }
    .left-f1 {
      width: 100%;
      background-image: url("src/assets/images/bg1.jpg");
      background-repeat: no-repeat;
      background-size:100% 100%;
      border-radius: 8px;
      padding: 41px 44px;
      box-sizing: border-box;
      .hint {
        color: var(--white-100);
        font-size: var(--font-size-16);
      }
      .hint-msg {
        color: var(--white-100);
        font-size: 32px;
      }
    }
    .right-f1 {
      background-image: url(src/assets/images/bg2.jpg);
      border-radius: 8px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      flex-direction: row;
      .right-f1-left {
        width: 60%;
        padding: 14px 0px 14px 30px;
        .top-title {
          color: var(--white-100);
          font-size: var(--font-size-16);
          letter-spacing: 1px;
          line-height: 50px;
        }
      }
      .right-f1-img {
        width: 40%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }
    .left-f2 {
      border-radius: 8px;
      padding: var(--padding-lg) 30px;
      box-sizing: border-box;
      background: var(--white-100);
      #myChart {
        height: 375px;
      }
      .myCharts {
        height: 375px;
      }
    }
    .right-f2 {
      border-radius: 8px;
      padding: var(--padding-lg) 30px;
      box-sizing: border-box;
      background: var(--white-100);
      .stu-proess {
        font-size: var(--font-size-16);
        color: #050101;
        letter-spacing: 1px;
        font-weight: 700;
        height: 20px;
      }
      .stu-proess-con {
        display: flex;
        width: 100%;
        height: 93%;
        .proess-con-left {
          width: 50%;
          .stu-state-row {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            height: 33.33%;
            .study-right {
              font-size: 12px;
              color: rgba(5, 1, 1, 0.45);
              .study-right-left > {
                span:nth-child(1) {
                  font-size: 12px;
                }
              }
              .progressdiv {
                width: 100%;
                line-height: 1;
                margin-top: 7px;
                .courseProgress {
                  color: #050101;
                  font-size: 24px;
                  font-weight: 700;
                }
              }
            }
            .course-state-icon {
              width: 70px;
              height: 48px;
              background-image: url(src/assets/images/study-state-1.png);
              background-repeat: no-repeat;
            }
            .course-state-icon1 {
              background-image: url(src/assets/images/study-state-1.png);
            }
            .course-state-icon2 {
              background-image: url(src/assets/images/finish.png);
            }
            .course-state-icon3 {
              background-image: url(src/assets/images/no-finish.png);
            }
          }
        }
        .proess-con-right {
          width: 50%;
          height: 100%;
          background-image: url(src/assets/images/person-bg.png);
          background-repeat: no-repeat;
        }
      }
    }
    .left-f3 {
      display: flex;
      justify-content: space-between;
      .left-f3-course {
        width: 49%;
        height: 100%;
        min-height: 300px;
        border-radius: 8px;
        padding: 15px 26px 30px 26px;
        box-sizing: border-box;
        background: var(--white-100);
      }
      .left-f3-exper {
        width: 49%;
        height: 100%;
        border-radius: 8px;
        padding: 15px 26px 30px 26px;
        box-sizing: border-box;
        background: var(--white-100);
      }
    }
    .right-f3 {
      border-radius: 8px;
      padding: 15px 26px 30px 26px;
      box-sizing: border-box;
      background: var(--white-100);
    }
  }
  
  </style>
  <style>
  #app div.main-box div#customSide.c1{
    height: auto;
  }
  </style>
  