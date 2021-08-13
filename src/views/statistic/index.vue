<template>
    <div id='statistic'>
        <div class="box-left">
            <div class="left-f1 f1">
                <p class="hint">sy，又是元气满满的一天！</p>
                <div class="hint-msg">每天进步一点点，成长足迹看得见！</div>
            </div>
            <div class="left-f2 f2">
                <div id="myChart" style="width:100%;height:100%"></div>
            </div>
            <div class="left-f3 f3">
               <div class="left-f3-course">
                   <div class="content-title">课程薄弱点</div>
                   <div class="content-list" v-for="(item,index) in course" :key="index">
                    <div class="content-item">
                        <span>
                            <span>{{item.number}}</span>
                        </span>
                        <span>{{item.content}}</span>
                    </div>
                </div>
               </div>
               <div class="left-f3-exper">
                   <div class="content-title">推荐实验</div>
                   <div class="content-list" v-for="(item,index) in exper" :key="index">
                    <div class="content-item">
                        <span>
                            <span>{{item.number}}</span>
                        </span>
                        <span>{{item.content}}</span>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div class="box-right">
            <div class="right-f1 f1">
                <div class="right-f1-left">
                    <div class="top-title">教师综合评价</div>
                    <div class="evaluate">
                        <img src="../../assets/images/excellent-no.png" alt="" srcset="">
                    </div>
                </div>
                <div class="right-f1-img">
                    <img src="../../assets/images/evaluate-no.png" alt="" srcset="">
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
                           <span>课已完成实验数</span>
                        </div>
                        <div style="width: 100%;color: #050101;font-size: 24px;font-weight: 700;">
                           10                                 <span class="unit">/ 个</span>
                        </div>
                     </div>
                        </div>
                        <div class="stu-state-row">
                             <div class="study-left course-state-icon"></div>
                     <div class="study-right">
                        <div class="study-right-left">
                           <span>课已完成实验数</span>
                        </div>
                        <div style="width: 100%;color: #050101;font-size: 24px;font-weight: 700;">
                           10                                 <span class="unit">/ 个</span>
                        </div>
                     </div>
                        </div>
                        <div class="stu-state-row">
                             <div class="study-left course-state-icon"></div>
                     <div class="study-right">
                        <div class="study-right-left">
                           <span>课已完成实验数</span>
                        </div>
                        <div style="width: 100%;color: #050101;font-size: 24px;font-weight: 700;">
                           10                                 <span class="unit">/ 个</span>
                        </div>
                     </div>
                        </div>
                    </div>
                    <div class="proess-con-right">
                        
                    </div>
                </div>
            </div>
            <div class="right-f3 f3">
                <div class="content-title">发展方向</div>
                <a-button @click="getData">获取数据</a-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent,inject,onMounted,reactive} from 'vue'
import request from '../../api'
interface ObjType{
    number?:number;
    index?:number;
    content?:string;
}
interface State{
    course:ObjType[];
    exper:ObjType[];
}
export default defineComponent({
    name:'Statistic',
    setup:(props,{emit})=>{
    // let course:ObjType[]=[{content:'wwhaah'}]
    // let exper:ObjType[]=[]
    const state: State = reactive({
        course:[{content:'wwhaah44444444445'}],
        exper:[]
    })
    function DrawEchar(){
    let echarts=inject("ec");
    let myChart = (echarts as any).init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: { text: "课程成绩" },  //图标中的表题
        tooltip: {},
        grid: {
            left: 15,
            right: 40,
            containLabel: true
        },
        xAxis: {
          name:'课程',
          nameLocation:'end',
          nameTextStyle:{
              color:'999'
          },
          data: ["衬衫", "羊毛衫", "雪纺衫"],
          axisLabel: {
            textStyle:{
                color:'#999'
            }
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
            data: [5, 10, 20],
            itemStyle: {
             color: '#a693e1'
            },
          },
        ],
      });
    }
    function getData(){
    const infoRequest=(request as any).statistic
     infoRequest.getInfo().then((res:any)=>{
        //  staticInfo=res.data
     })
    }
    onMounted(()=>{
        DrawEchar()
        getData()
        console.log(state,'state')
    })
    return {getData,...state};
    },
})
</script>
<style lang="less" scoped>
#statistic{
    width:1330px;
    display: flex;
    margin: 0 auto;
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
        font-size: @font-size-base;
        color: #050101;
        letter-spacing: 1px;
        font-weight: 700;
        flex-shrink: 0;
        line-height: 45px;
    }
    .content-item{
        border-radius: 14px;
        height: 44px;
        padding-left: 13px;                                             
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        background: linear-gradient(90deg,rgba(18,144,239,0.12) 24%, rgba(98,126,234,0.00) 78%);
        >span:nth-child(1) {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: inline-block;
        line-height: 26px;
        text-align: center;
        padding: 2px;
        margin-right: 14px;
        background: #e2f1fd;
        border: 1px solid #1290ef;
            >span {
                display: inline-block;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: #1290ef;
                color:@white;
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
        height: 290px;
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
            color:@white;
            font-size: @font-size-base;
        }
        .hint-msg{
             color:@white;
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
            color: @white;
            font-size: @font-size-base;
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
        background: @white; 
    }
    .right-f2{
          border-radius: 8px;
        padding: @padding-lg 30px;
        box-sizing: border-box;
        background: @white; 
       .stu-proess{
            font-size: @font-size-base;
            color: #050101;
            letter-spacing: 1px;
            font-weight: 700;
            height: 20px;
       }
        .stu-proess-con{
           display: flex;
           width:100%;
           height: 80%;
           .proess-con-left{
               width: 50%;
               .stu-state-row{
                display: flex;
                flex-direction: row;
                align-items: flex-end;
                height: 33.33%;
                .study-right{
                    .study-right-left>{
                        span:nth-child(1){
                            font-size: 12px;
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
           border-radius: 8px;
           padding: 15px 26px 30px 26px;
           box-sizing: border-box;
        background: @white;
       }
       .left-f3-exper{
             width:49%;
           height: 100%;
           border-radius: 8px;
           padding: 15px 26px 30px 26px;
           box-sizing: border-box;
           background:@white;
       }
    }
    .right-f3{
        border-radius: 8px;
        padding: 15px 26px 30px 26px;
        box-sizing: border-box;
        background: @white; 
    }
}
</style>