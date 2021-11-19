<template>
  <div class="teacherHome">
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
    @slideChangeTransitionEnd="slideChangeTransitionEnd"
    @setTranslate="setTranslate"
    >
      <swiper-slide v-for="item in courseLists" :key="item.id">{{item.name}}</swiper-slide>
    </swiper>
   </div>
  <a-row :gutter="[16,16]">
    <a-col :span="12">
      <div class="chart-box completion">
        <div class="title">课程完成率</div>
        <div>
          <div id="pie"></div>
          <div class="statistics">
            <div>
              <span>{{courseCompletion.done}}</span>/人
              <div>课程已完成人数</div>
            </div>
            <div>
              <span>{{courseCompletion.undone}}</span>/人
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
              成绩A：<span>{{gradeDistribution.A}}人</span>
            </div>
            <div>
              成绩B：<span>{{gradeDistribution.B}}人</span>
            </div>
            <div>
              成绩C：<span>{{gradeDistribution.C}}人</span>
            </div>
            <div>
              成绩D：<span>{{gradeDistribution.D}}人</span>
            </div>
            <div>
              未完成：<span>{{gradeDistribution["0"]}}人</span>
            </div>
          </div>
        </div>
      </div>
    </a-col>
    <a-col :span="12">
      <div class="chart-box">
        <div class="title">知识点错误率</div>
        <div class="error-rate">
          <div class="item" v-for="(item,index) in errorKonwledge" :key="item.id">
            <template v-if="index < 10">
              <span :title="item.knowledge_map_name">{{item.knowledge_map_name}}</span>
              <a-progress
                :stroke-color="{
                  '0%': '#be8edb',
                  '100%': '#6855b5',
                }"
                :percent="item.error_rate"
              />
            </template>
          </div>
        </div>
      </div>
    </a-col>
    <a-col :span="12">
      <div class="chart-box">
        <div class="title">知识图谱</div>
        <div id="graph"></div>
      </div>
    </a-col>
    <a-col :span="24">
      <div class="chart-box scater-box">
        <div class="title task-tabs">
          <span v-for="(item,index) in tabs" :key="index" :class="{'active':activeIndex === index}" @click="changeTab(index)">{{item.label}}</span>
        </div>
        <div id="scater"></div>
      </div>
    </a-col>
  </a-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper';
import 'swiper/css'
import * as echarts from "echarts";
import { pieOptions, radarOptions, scaterOptions, graphOptions, IpieData } from './chartOption'
import request from "src/api/index";
import { Ihttp } from "./typings";
import { IBusinessResp } from "src/typings/fetch.d";
const tabs = [
    {
      value: 0,
      label: '实验成绩分布图'
    },
    {
      value: 1,
      label: '实验用时分布图'
    }
]
interface Ierror{
  id: number | string,
  knowledge_map_name: string,
  error_rate: number | string
}
interface Ilists{
  id: number | string,
  name: string
}
export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const http = (request as Ihttp).teacherHome
    const activeIndex = ref<number>(0)
    const courseLists = reactive<Ilists[]>([])
    const courseCompletion = reactive<IpieData>({
      done: 0,
      undone: 0
    })
    const gradeDistribution = ref<any>({
      0: 0,
      A: 0,
      B: 0,
      C: 0,
      D: 0
    })
    const errorKonwledge = reactive<Ierror[]>([])
    const score_usedtime = ref<any>({})
    const slideChangeTransitionEnd = (swiper:any) => {
      getData(courseLists[swiper.realIndex].id)
    };
    const setTranslate = (swiper:any) =>{
      var slides = swiper.slides
      slides.forEach((item:any,i:number) => {
        let progress = item.progress
        item.style.transform = 'scale('+(1.5 - Math.abs(progress)/4)+')'
      });
    }
    const setChart =(ele:string, options:object) => {
      document.getElementById(ele)?.removeAttribute("_echarts_instance_")
      let eleChart = (echarts as any).init(document.getElementById(ele));
      eleChart.setOption(options);
    }
    const changeTab =(index:number)=>{
      activeIndex.value = index
      setChart('scater', scaterOptions(index, score_usedtime.value))
    }
    const handleData = (obj: Object, type?:string) =>{
      return  Object.keys(obj).length ? obj : !type ? {} : {0:0,A:0,B:0,C:0,D:0}
    }
    const getData = (courseId: string | number)=>{
      errorKonwledge.length = 0
      if (!courseId) {
        return
      }
      http.courseData({param: {course_id: courseId}}).then((res:IBusinessResp) => {
        if (res && res.data) {
          let result = res.data
          // 课程完成率
          courseCompletion.done = result.done
          courseCompletion.undone = result.undone
          setChart('pie', pieOptions(courseCompletion))
          // 知识点错误率
          errorKonwledge.push(...result.error_knowledge)
          // 课程成绩分布
          gradeDistribution.value = handleData(result.course_rank, 'grade')
          setChart('radar', radarOptions(gradeDistribution.value))
          // 实验成绩分布
          score_usedtime.value =  handleData(result.score_usedtime)
          setChart('scater', scaterOptions(0, score_usedtime.value))
          // 知识图谱
          setChart('graph', graphOptions(handleData(result.knowledge_map)))
        }
      })
    }
    const getCourseList= () => {
      http.courseList().then((res:IBusinessResp) => {
        if (res && res.data) {
          Object.assign(courseLists, res.data.course_ongoing)
          if (courseLists.length>0) {
            getData(courseLists[0].id)
          }
        }
      })
    }
    onMounted(()=>{
      (document.getElementById('app') as any).style.height = 'auto'
      getCourseList()
    })
    onBeforeUnmount(()=>{
      (document.getElementById('app') as any).style.height = '100%'
    })
    return {
      slideChangeTransitionEnd,
      setTranslate,
      changeTab,
      modules: [Navigation],
      tabs,
      activeIndex,
      courseCompletion,
      errorKonwledge,
      gradeDistribution,
      courseLists
    };
  },
})
</script>
<style lang="less" scoped>
.teacherHome{
  padding: 0 60px;
  .banner-wrap{
    width: 100%;
    position: relative;
    margin-bottom: 20px;
  }
  :deep(.swiper){
    padding: 70px 150px;
    .swiper-button-prev, .swiper-button-next{
      position: absolute;
      width: 100px;
      height: 160px;
      top:0;
      bottom: 0;
      margin-top: auto;
      margin-bottom: auto;
      z-index: 99;
      background: #edf0f5;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .swiper-button-prev{
      left: 0;
      &::after{
        content: '';
        width: 60px;
        height: 60px;
        background: url(../../assets/images/teacher-default/left.png) no-repeat;
      }
    }
    .swiper-button-next{
      right: 0;
      &::after{
        content: '';
        width: 60px;
        height: 60px;
        background: url(../../assets/images/teacher-default/right.png) no-repeat;
      }
    }
    .swiper-wrapper{
      width: 100%;
      .swiper-slide{
        color: rgba(255,255,255, 0.72);
        border-radius: 20px;
        text-align: center;
        font-size: 18px;
        background: #fff;
        height: 130px;
        box-shadow: 0 0 15px 2px rgba(122,84,214, 0.84);
        display: flex;
        justify-content: center;
        align-items: center;
        transition-property: all;
        background: url(../../assets/images/teacher-default/banner-bg.png) no-repeat;
        word-break: break-all;
        padding: 10px;
        &.swiper-slide-next{
          z-index: -1;
        }
      }
    }
  }
  .chart-box{
    width: 100%;
    background: #fff;
    padding: 25px;
    height: 400px;
    border-radius: 6px;
    &.completion{
      background: url('../../assets/images/teacher-default/panel-first-bg.png') no-repeat 90% 55%;
      background-color: #fff;
      &>div:nth-child(2){
        display: flex;
      }
      .statistics{
        padding: 50px 0;
        color: #807f7f;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        span{
          font-size: 40px;
          color: #000;
        }
      }
    }
    &.scater-box{
      height: 460px;
    }
    .title{
      line-height: 28px;
      font-size: 18px;
      font-weight: 600;
    }
    #pie,#radar {
      width: 330px;
      height: 330px;
    }
    #scater{
      width: 100%;
      height: 400px;
    }
    #graph{
      width: 100%;
      height: 300px;
    }
    .grade-distribution{
      padding: 0 130px;
      display: flex;
      font-size: 14px;
      &>div:last-child{
        padding: 40px;
        &>div{
          padding: 15px;
          color: #807f7f;
        }
      }
    }
    .task-tabs{
      span{
        cursor: pointer;
        margin-right: 30px;
        color: #949494;
        &.active{
          color: #363636
        }
      }
    }
  }
  .error-rate{
    .item{
      margin-top: 9px;
      display: flex;
      align-items: center;
      span{
        font-size: 14px;

        &:first-of-type{
          display: inline-block;
          width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      :deep(.ant-progress){
        .ant-progress-bg{
          height: 16px !important;
        }
        .ant-progress-text{
          color: #000
        }
      }
    }
  }
}
</style>
