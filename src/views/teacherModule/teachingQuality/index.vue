<template>
    <div class='teachingQuality'>
       <div class="echarts-1">
           <div class="left">
               <div class="header">
                   <span class="text-name">课程成绩对比</span>
                   <span class="tit">最近开设课程的学生成绩最高分和最低分的对比</span>
               </div>
               <div id="courseAchieve"></div>
           </div>
           <div class="right">
                <div class="header">
                   <span class="text-name">岗位能力分析</span>
                   <span class="tit">岗位对应的课程成绩分布情况</span>
               </div>
               <a-tabs
                :tab-position="mode"
                :style="{ height: '45px' }"
                @prevClick="callback"
                @nextClick="callback"
                @change='callback'
                v-model:activeKey="activeKey"
                >
                    <a-tab-pane v-for="i in 30" :key="i" :tab="`Tab-${i}`"></a-tab-pane>
                </a-tabs>
                <div id="capabilityAnalysis"></div>
           </div>
       </div>
       <div class="banner-2">
            <swiper
                :modules="modules"
                navigation
                loop
                centeredSlides
                watchSlidesProgress
                :slides-per-view="5"
                :space-between="33"
                :slideToClickedSlide="true"
                @slideChange="slideChangeTransitionEnd"
                @slideChangeTransitionEnd="slideChangeTransitionEnd"
                @setTranslate="setTranslate"
            >
                <swiper-slide>Slide 1</swiper-slide>
                <swiper-slide>Slide 2</swiper-slide>
                <swiper-slide>Slide 3</swiper-slide>
                <swiper-slide>Slide 4</swiper-slide>
                <swiper-slide>Slide 5</swiper-slide>
                <swiper-slide>Slide 6</swiper-slide>
            </swiper>
       </div>
       <div class="echarts-3">
            <div class="left">
                <div class="header">
                   <div class="name">知识点错误率</div>
                   <div class="tit">以矩形树图的形式展现所选课程中错误率最高的前10个知识点，错误率越高矩形越大。</div>
               </div>
               <div id="knowledgePointErrorRate"></div>
            </div>
           <div class="right">
            <div class="header">
                   <div class="name">实验成绩分布</div>
                   <div class="tit">以箱线图展示所选课程的每个实验的成绩分布情况</div>
               </div>
               <div id="scoreDistribution"></div>
           </div>
       </div>
       <div class="echarts-4">
            <div class="left">
                <div class="header">
                   <div class="name">知识图谱</div>
                   <div class="tit">以关系图显示课程-实验-知识点之间的关系，知识点错误率越高，圈越大。</div>
               </div>
               <div id="knowledgeGraph"></div>
            </div>
           <div class="right">
            <div class="header">
                   <div class="name">高频易错点梳理图</div>
                   <div class="tit">以桑基图展示所选课程中错误率最高的10个知识点与实验、习题之间的关系</div>
               </div>
               <div id="highFrequencyErrorProne"></div>
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
  inject
} from "vue";
import * as echarts from 'echarts';
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import {option,option1,option2,option3,option4,option5}  from './echartOption';
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    { name: "教学质量", componenttype: 0 }
  ],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
const mode = ref('top');
const activeKey = ref('1');
function callback(val: string){
    console.log(val);
    drawAnalysis()
};
const modules:any=ref([])
function slideChangeTransitionEnd(){

}
function setTranslate(){

}
function drawAnalysis(){
    setChartOption('capabilityAnalysis',option1)
}
function setChartOption(id:any,option:any){
    document.getElementById(id)?.removeAttribute("_echarts_instance_");
    var chartDom:any=document.getElementById(id)
    var myChart = echarts.init(chartDom);
    option && myChart.setOption(option);
}
onMounted(()=>{
    drawAnalysis()
    setChartOption('courseAchieve',option)
    setChartOption('knowledgePointErrorRate',option2)
    setChartOption('scoreDistribution',option3)
    setChartOption('knowledgeGraph',option4)
    setChartOption('highFrequencyErrorProne',option5)
})
</script>
<style lang="less" scoped>
.banner-2{
    width:100%;
    height: 150px;
    position: relative;
    background-color: var(--white-100);
    margin-bottom: 20px;
    display: flex;
}
:deep(.swiper-button-prev){
    position: absolute;
    left: 10px;
    top: 50px;
    width:64px;
    height:64px;
    background: url(src/assets/images/prev.png) no-repeat;
}
:deep(.swiper-button-next){
    position: absolute;
    right:10px;
    top: 50px;
    width:64px;
    height:64px;
    background-color: aqua;
    background: url(src/assets/images/next.png) no-repeat;
}
.echarts-1,.echarts-2,.echarts-3,.echarts-4{
    display: flex;
    justify-content:space-between;
    width: 100%;
    margin-bottom: 20px;
    .left,.right{
        width: 49%;
        height: 443px;
        background-color: var(--white-100);
        padding: 24px;
    }
}
.text-name{
    font-size: 16px;
    font-weight: 400;
    margin-right: 20px;
}
.header{
        .name{
            font-size: 16px;
            font-weight: 400;
            margin-right: 20px;
            width: 100%;
            height: 30px;
            border-bottom: 1px solid var(--gray-6);
        }
        .tit{
            margin-top: 10px;
            color: var(--black-45);
        }
    }
#courseAchieve,#capabilityAnalysis,#knowledgePointErrorRate,#scoreDistribution,#knowledgeGraph,#highFrequencyErrorProne{
    width:100%;
    height: 400px;
}
</style>