<template>
    <div id='statistic' class="setScrollbar">
        <div class="box-left">
            <div class="left-f1 f1">
                <p class="hint">{{staticInfo.userProfile?.name}}，又是元气满满的一天！</p>
                <div class="hint-msg">每天进步一点点，成长足迹看得见！</div>
            </div>
            <div class="left-f2 f2">
                <div id="myChart"></div>
            </div>
            <div class="left-f3 f3">
               <div class="left-f3-course">
                    <list-item :infoList='staticInfo.weakKnowledges' :title='"课程薄弱点"' :listname='"knowledge_map_name"' :color1='linePurple' :circlecolor="circlecolor1"></list-item>
               </div>
               <div class="left-f3-exper">
                    <list-item :infoList='staticInfo?.weakCourseContents' :title='"推荐实验"' :listname='"name"' :color1='lineOrange' :circlecolor="circlecolor2"></list-item>
                </div>
            </div>
        </div>
        <div class="box-right">
            <div class="right-f1 f1">
                <div class="right-f1-left">
                    <div class="top-title">教师综合评价</div>
                    <div class="evaluate">
                        <img src="../../assets/images/excellent-no.png">
                    </div>
                </div>
                <div class="right-f1-img">
                    <img src="../../assets/images/evaluate-no.png">
                </div>
            </div>
            <div class="right-f2 f2">
                <div class="stu-proess">学习进度概况</div>
                <div class="stu-proess-con">
                    <div class="proess-con-left">
                        <div class="stu-state-row">
                             <div class="study-left course-state-icon"></div>
                     <div class="study-right">
                        <div class="study-right-left">
                           <span>学习进度排名</span>
                        </div>
                        <div class="courseProgress">
                           <span>NO.</span><span>{{staticInfo.courseProgress?.id}}</span>
                        </div>
                     </div>
                        </div>
                        <div class="stu-state-row">
                             <div class="study-left course-state-icon"></div>
                     <div class="study-right">
                        <div class="study-right-left">
                           <span>课已完成实验数</span>
                        </div>
                        <div class="progressdiv">
                           <span class="courseProgress">{{staticInfo.courseProgress?.finished_content_count}}</span><span class="unit">/ 个</span>
                        </div>
                     </div>
                        </div>
                        <div class="stu-state-row">
                             <div class="study-left course-state-icon"></div>
                     <div class="study-right">
                        <div class="study-right-left">
                           <span>未完成实验数</span>
                        </div>
                        <div class="progressdiv">
                           <span class="courseProgress">{{staticInfo.courseProgress?.left_content_count}}</span><span class="unit">/ 个</span>
                        </div>
                     </div>
                        </div>
                    </div>
                    <div class="proess-con-right">
                        
                    </div>
                </div>
            </div>
            <div class="right-f3 f3">
                <!-- <div class="content-title">发展方向</div>
                <div class="content-list" v-for="(item,index) in staticInfo.jobDirections" :key="index">
                    <div :class="staticInfo.jobDirections.length>3?'content-item min-content-item':'content-item max-content-item'">
                        <span>
                            <span>{{index+1}}</span>
                        </span>
                        <span>{{item.name}}</span>
                    </div>
                </div> -->
                <list-item :infoList='staticInfo.jobDirections' :title='"发展方向"' :listname='"name"' :color1='lineBlue' :circlecolor="circlecolor3"></list-item>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { message } from 'ant-design-vue';
import {defineComponent,inject,onMounted,provide,reactive, toRefs} from 'vue'
import request from '../../api'
import listItem from './listItem/index.vue'
import * as echarts from 'echarts'
interface objType{
    name?:string
}
interface StatisType{
    // 用户信息
    userProfile?:objType;
    // 课程成绩
    courseGrade?:any[];
    // 学习进度排名
    avgRank?:any;
    // 课程薄弱点
    weakKnowledges?:any[];
    weakCourseContents?:any[];
    jobDirections?:any[];
    courseProgress?:any;
    number?:number;
    index?:number;
    content?:string;
}
interface State{
    staticInfo:StatisType;
    lineBlue:string;
    lineOrange:string;
    linePurple:string;
    circlecolor1:string;
    circlecolor2:string;
    circlecolor3:string;
}

export default defineComponent({
    name:'Statistic',
    components:{
        listItem
    },
    setup: (props, { emit }) => {
    var courseGrandEcharName:any[]=[];
    var courseGrandEcharValue:any[]=[];
    var updata=inject('updataNav') as Function
    updata({tabs:[],showContent:false,showNav:false})
    const state: State = reactive({
        staticInfo:{},
        lineBlue:'linear-gradient(90deg, rgba(18, 144, 239, 0.12) 24%, rgba(98, 126, 234, 0) 78%)',
        lineOrange:'linear-gradient(90deg,rgba(247,147,26,0.12) 24%, rgba(98,126,234,0.00) 78%)',
        linePurple:'linear-gradient(90deg,rgba(98,126,234,0.12) 24%, rgba(98,126,234,0.00) 78%)',
        circlecolor1:'#647fea',
        circlecolor2:'#f79620',
        circlecolor3:'#1290ef'
    })
     // 绘制图表
    // let echarts=inject("echarts");
    // var myChart = (echarts as any).init(document.getElementById("myChart"));
    var courseOption={
        title: { text: "课程成绩" },  //图标中的表题
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' ,       // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
            color: "rgba(51,51,51,0.2)"
            }
          }
        },
        grid: {
            left:40,
            right: 40,
            top:80,
            bottom:80,
        },
        xAxis: {
          name:'课程',
          nameLocation:'end',
          nameTextStyle:{
              color:'999'
          },
          data:courseGrandEcharName,
          axisLabel: {
                color:'#999'
            },
        interval:0,
          axisTick: {
                  show: false
               },
               axisLine:{
                  lineStyle:{
                     color:'#d2d2d2'
                  }
               },
               splitLine: {
                  show: false
               },
        },
        
        yAxis: {   
                    name: '成绩',
                    nameTextStyle: {
                        color:'#666'
                    },
                    max: 100,
                    min: 0,
                    interval: 20,
                    axisLabel: {
                        show: true,
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine:{
                        show:false,
                    },
                    splitLine: {
                        show: true
                    },
                },
                series: [
                {
                    name: "销量",
                    type: "bar",
                    barWidth:30,
                    data:courseGrandEcharValue,
                    itemStyle: {
                    color: '#a693e1'
                    },
                },
                ],
      }
    function DrawEchar(){
        var myChart = (echarts as any).init(document.getElementById("myChart"));
        myChart.setOption(courseOption);
        return myChart  
    }
    function getData(){
    const infoRequest=(request as any).studentStatistic
     infoRequest.getInfo()
     .then((res:any)=>{
        state.staticInfo=res.data
        state.staticInfo.courseGrade?.forEach(item=>{
            courseGrandEcharName.push(item.name)
            courseGrandEcharValue.push(item.value)
        })
        let courseEchar:any=DrawEchar()
        courseEchar.setOption(courseOption)
     })
     provide('staticInfo','state.staticInfo')
    }
    onMounted(()=>{
        getData()    
    })
    return {getData,...toRefs(state)};
    },
})
</script>
<style lang="less" scoped>
#statistic{
    width:var(--center-width);
    // height: 100%;
    display: flex;
    margin: 0 auto;
    // overflow-y: auto;
    .box-left{
        width:64.7%;
        display: flex;
        flex-direction: column;
    }
    .box-right{
        width:calc(35.3% - 30px);
        margin-left: 30px;
    }
    .content-title{
        font-size: @var(--font-size-16);
        color: #050101;
        letter-spacing: 1px;
        font-weight: 700;
        flex-shrink: 0;
        line-height: 45px;
    }
    .min-content-item{
        height: 32px;
    }
    .max-content-item{
        height: 44px;
    }
    .content-item{
        border-radius: 14px;
        padding-left: 13px;                                             
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        font-size: 12px;
        background: linear-gradient(90deg,rgba(18,144,239,0.12) 24%, rgba(98,126,234,0.00) 78%);
        >span:nth-child(1) {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: inline-block;
        line-height: 22px;
        text-align: center;
        padding: 2px;
        margin-right: 14px;
        border: 1px solid #1290ef;
            >span {
                display: inline-block;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: #1290ef;
                color:var(--white-100);
            }
        }
    }
    .f1{
        height: 170px;
    }
    .f2{
        height:375px;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .f3{
        height:361px;
    }
    .left-f1{
        width: 100%;
        background-image: url('../../assets/images/bg1.jpg');
        background-repeat: no-repeat;
        background-size:cover;
        border-radius: 8px;
        padding: 41px 44px;
        box-sizing: border-box;
        .hint{
            color:var(--white-100);
            font-size: @var(--font-size-16);
        }
        .hint-msg{
             color:var(--white-100);
            font-size:32px;
        }
    }
    .right-f1{
        background-image: url(../../assets/images/bg2.jpg);
        border-radius: 8px;
        background-repeat: no-repeat;
        background-size: 100%;
        display: flex;
        flex-direction: row;
        .right-f1-left{
            width: 60%;
            padding: 14px 0px 14px 30px;
            .top-title{
            color: var(--white-100);
            font-size: @var(--font-size-16);
            letter-spacing: 1px;
            line-height: 50px;
            }
        }
        .right-f1-img{
            width: 40%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
    }
    .left-f2{
        border-radius: 8px;
        padding: @padding-lg 30px;
        box-sizing: border-box;
        background: var(--white-100);
         #myChart{
        height:375px;
        }
    }
    .right-f2{
          border-radius: 8px;
        padding: @padding-lg 30px;
        box-sizing: border-box;
        background: var(--white-100); 
       .stu-proess{
            font-size: @var(--font-size-16);
            color: #050101;
            letter-spacing: 1px;
            font-weight: 700;
            height: 20px;
       }
        .stu-proess-con{
           display: flex;
           width:100%;
           height:93%;
           .proess-con-left{
               width: 50%;
               .stu-state-row{
                display: flex;
                flex-direction: row;
                align-items: flex-end;
                height: 33.33%;
                .study-right{
                    font-size: 12px;
                    color: rgba(5,1,1,0.45);
                    .study-right-left>{
                        span:nth-child(1){
                            font-size: 12px;
                        }
                    }
                    .progressdiv{
                        width: 100%;
                        .courseProgress{
                            color: #050101;
                            font-size: 24px;
                            font-weight: 700;
                        }
                    }
                }
                .course-state-icon{
                    width: 70px;
                    height:48px;
                    background-image: url(../../assets/images/study-state-1.png);
                    background-repeat: no-repeat;
                }
               }
             
           }
           .proess-con-right{
                width: 50%;
                height: 100%;
                background-image: url(../../assets/images/person-bg.png);
                background-repeat: no-repeat;
           }
       } 
    }
    .left-f3{
       display: flex;
       justify-content: space-between;
       .left-f3-course{
           width: 49%;
           height: 100%;
           min-height: 361px;
           border-radius: 8px;
           padding: 15px 26px 30px 26px;
           box-sizing: border-box;
           background: var(--white-100);
       }
       .left-f3-exper{
             width:49%;
           height: 100%;
           border-radius: 8px;
           padding: 15px 26px 30px 26px;
           box-sizing: border-box;
           background:var(--white-100);
       }
    }
    .right-f3{
        border-radius: 8px;
        padding: 15px 26px 30px 26px;
        box-sizing: border-box;
        background: var(--white-100); 
    }
}
</style>