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
};
const modules:any=ref([])
function slideChangeTransitionEnd(){

}
function setTranslate(){

}
onMounted(()=>{
    var chartDom:any = document.getElementById('courseAchieve');
    var chartDom1:any = document.getElementById('capabilityAnalysis');
    var chartDom2:any = document.getElementById('knowledgePointErrorRate');
    var chartDom3:any = document.getElementById('scoreDistribution');
    var chartDom4:any = document.getElementById('knowledgeGraph');
    var chartDom5:any = document.getElementById('highFrequencyErrorProne');
    

    var myChart = echarts.init(chartDom);
    var myChart1 = echarts.init(chartDom1);
    var myChart2 = echarts.init(chartDom2);
    var myChart3 = echarts.init(chartDom3);
    var myChart4 = echarts.init(chartDom4);
    var myChart5= echarts.init(chartDom5);
    option && myChart.setOption(option);
    option1 && myChart1.setOption(option1);
    option2 && myChart2.setOption(option2);
    option3 && myChart3.setOption(option3);
    option4 && myChart4.setOption(option4);
    option5 && myChart5.setOption(option5);
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
    padding: 20px;
}
:deep(.swiper-button-prev){
    position: absolute;
    left: 10px;
    top: 30px;
    width:64px;
    height:64px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMTAtMTRUMTU6MTI6NDYrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIxLTEyLTE0VDEwOjI5OjExKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTEyLTE0VDEwOjI5OjExKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJkM2JlYTI1LWE3YmMt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) no-repeat;
}
:deep(.swiper-button-next){
    position: absolute;
    right:10px;
    top: 30px;
    width:64px;
    height:64px;
    background-color: aqua;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMTAtMTRUMTU6MTI6NDYrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIxLTEyLTE0VDEwOjI5OjE1KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTEyLTE0VDEwOjI5OjE1KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkwOTIxYzFlLTExYzYt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) no-repeat;
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