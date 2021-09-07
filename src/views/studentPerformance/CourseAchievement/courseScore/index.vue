<template>
    <div id="courseScore">
        <div class="courseScoreContent">
            <div class="course-info">
                <div class="course-info-left">
                    <div class="card-pic">
                        <img src="../../../../assets/images/stuAchievement/d3.jpg" alt="">
                    </div>
                    <div class="card-info">
                        <h3 class="card-info-top">课程名称课程名称课程名称课程</h3>
                        <div class="card-info-bottom">
                            <p>起止时间：2021-05-20 - 2021-05-23</p>
                            <p>课程状态：进行中</p>
                            <p>
                                <img src="../../../../assets/images/stuAchievement/teacher.png" alt="" srcset="">
                                sihai fu
                            </p>
                            <a href="">课程资源&nbsp;>></a>
                        </div>
                    </div>
                </div>
                <div class="card-score">
                    <p class="score"><img src="../../../../assets/images/stuAchievement/icon_score.jpg" alt=""> 课程得分：<span>--</span> </p>
                    <p class="order"><img src="../../../../assets/images/stuAchievement/icon_order.jpg" alt=""> 班级排名： <span>--</span> </p>
                    <p class="hihgest"><img src="../../../../assets/images/stuAchievement/icon_highest.jpg" alt=""> 实验最高分： <span>D</span> </p>
                    <p class="lowest"><img src="../../../../assets/images/stuAchievement/icon_lowest.png" alt=""> 实验最低分： <span>D</span> </p>
                </div>
            </div>
            <div class="course-content">
                <div class="content-info">
                    <ul v-for="(item,index) in CourseScoreInfo" :key="index">
                        <div class="courseChapter">
                            <div>{{item.chapter}}</div>
                            <div>
                                <span class="chapterScore">章节得分：{{item.score}}</span>
                                <span  class="stowOrUnfold unfold" @click="expand(index)">
                                    <span v-if="item.dis">收起</span>
                                    <span v-else>展开</span>
                                </span>
                            </div>
                        </div>
                        <div v-if="item.dis">
                            <li v-bind="{class:flag}" class="exper-con" v-for="(itm,j) in item.exper" :key="j">
                            <div class="task">
                                <div class="task-left">{{itm.expername}}</div>
                                <div class="task-right" @click="viewResults(index,j,itm.experdis)">查看成绩</div>
                            </div>
                            <div class="score-table" v-if="itm.experdis">
                                <a-table :columns="columns" :data-source="data" :bordered='true' :pagination="false">
                                </a-table>
                            </div>
                        </li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent,onMounted,reactive, toRefs,inject,watch} from 'vue'
interface ObjectD{
    expername?:string,
    experdis?:boolean,
}
interface ObjectArrType{
    exper:ObjectD[],
    dis?:boolean,
    chapter?:string,
    score?:any,
}
interface State{
    CourseScoreInfo:ObjectArrType[],
    columns:any[],
    data:any[],
    flag?:boolean
}
export default defineComponent({
    name:'courseScore',
    setup:(props,context)=>{

        const state:State=reactive({
            CourseScoreInfo:[{
                chapter:'第一章节',
                score:'D',
                exper:[{
                    expername:'创建内置实验知识点2',
                },{
                    expername:'webideinit',
                }]
            },{
                chapter:'第二章节',
                score:'D',
                exper:[{
                    expername:'创建内置实验知识点2',
                },{
                    expername:'webideinit',
                }]
            }],
             columns:[
                    {   title:'花费时间',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '实训报告',
                        dataIndex: 'age',
                        key: 'age',
                    },
                    {
                        title: '实训结果',
                        dataIndex: 'address',
                        key: 'address',
                    },
                    {
                        title: '操作视频',
                        key: 'tags',
                        dataIndex: 'tags',
                        scopedSlots: { customRender: 'tags' },
                    },
                    {
                        title: '实训成绩',
                        key: 'action',
                        scopedSlots: { customRender: 'action' },
                    },
                    {
                        title: '班级排名',
                        key: 'tags1',
                        scopedSlots: { customRender: 'action' },
                    },
                     {
                        title: '班级最高分',
                        key: 'tags2',
                        scopedSlots: { customRender: 'action' },
                    },
                ],
            data:[{
                key: '1',
                name: 'John Brown',
                age: 32,
                address: 'New ',
                tags: ['nice'],
                tags1: ['nice'],
                tags2: ['nice'],
            }]
        })
        var updata=inject('updataNav') as Function
        updata({tabs:[],navPosition:'outside',navType:false,showContent:true,componenttype:0})
        function expand(index:number){
            state.CourseScoreInfo[index].dis=!state.CourseScoreInfo[index].dis
        }
        function viewResults(index:number,j:number,c:any){
            state.CourseScoreInfo[index].exper[j].experdis=!state.CourseScoreInfo[index].exper[j].experdis
        }
         onMounted(() => {
            state.CourseScoreInfo.forEach((item:any,j)=>{
                if(j==0){
                    item.dis=true
                }else{
                    item.dis=false
                }
                console.log(item,item.exper)
            })
            
            for(var i=0;i<state.CourseScoreInfo.length;i++){
                state.CourseScoreInfo[i].exper?.forEach((item,index)=>{
                    item.experdis=true
                })
            }
         })
        return {...toRefs(state),expand,viewResults}
    }
    
})
</script>
<style lang="less" scoped>
.courseScoreContent{
    width: 1330px;
    min-height:750px;
    border-radius:6px;
    background-color:@body-background;
    margin: 0 auto;
    margin-top: 60px;
    padding: @padding-md 21px @padding-md @padding-sm;
    .course-info{
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;
        .course-info-left{
            display: flex;
            .card-pic{
            height: 166px;
            width:290px;
            img{
                width: 100%;
                height: 100%;
                border-radius: 6px;
                }
            }
            .card-info{
                padding: 13px 21px;
                .card-info-top{
                    color: #333;
                    font-weight:400;
                    margin: 0;
                    white-space: nowrap;
                }
                .card-info-bottom{
                    img{
                        width: 24px;
                        height: 24px;
                        margin-right: 8px;
                       }
                    }
                }
            }
        }
    .content-info{
        ul{
             padding-bottom: 30px;
             margin-bottom: 0px;
            background: url(../../../../assets/images/stuAchievement/line02.jpg) repeat-y 45px 0;
         .courseChapter{
            width: 100%;
            height: 46px;
            display: flex;
            justify-content: space-between;
            border: 1px solid #8955B5;
            background-color: #fdfaff;
            line-height: 46px;
            padding-left: 20px;
           }
         .courseChapter:hover{
             background-color:#efddfb;
         }
         .chapterScore{
            font-size: 16px;
            color: #f36a1f;
            line-height: 44px;
         }
         .stowOrUnfold{
             margin: 12px 27px;
         }
         .exper-con{
             background: url(../../../../assets/images/stuAchievement/task_finish.png) no-repeat 38px 42px;
             .task{
             display: flex;
             justify-content: space-between;
             margin-left: 80px;
             height: 40px;
             line-height: 40px;
             padding: 30px 0 20px;
             box-sizing: content-box;
             border-bottom: 1px solid #ddd;
              }
            .score-table{
                margin-top: 30px;
                margin-left: 80px;
            }
           }
         }
        }
    }
</style>
<style lang='less'>
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
        padding: 8px;
        text-align: center;
    }
    .ant-table-thead>tr>th{
        background-color:#f6f0fa;
    }
    .ant-table-bordered .ant-table-thead > tr > th, .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 1px solid @white;
    }
    .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background:white;
   }
    .ant-radio-button-wrapper{
        display: none;
    }
    .footer-box{
    display: none;
    }
</style>