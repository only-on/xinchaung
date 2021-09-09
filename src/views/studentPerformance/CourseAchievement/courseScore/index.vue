<template>
    <div id="courseScore" v-layout-bg>
        <div class="courseScoreContent">
            <div class="course-info">
                <div class="course-info-left">
                    <div class="card-pic">
                        <img src="../../../../assets/images/stuAchievement/d3.jpg" alt="">
                    </div>
                    <div class="card-info">
                        <h3 class="card-info-top">{{courseDetail.name}}</h3>
                        <div class="card-info-bottom">
                            <p>起止时间：{{courseDetail.expire}}</p>
                            <p>课程状态：{{courseDetail.state}}</p>
                            <p>
                                <img src="../../../../assets/images/stuAchievement/teacher.png" alt="" srcset="">
                                {{courseDetail.teacher}}
                            </p>
                            <a href="">课程资源&nbsp;>></a>
                        </div>
                    </div>
                </div>
                <div class="card-score">
                    <p class="score"><img src="../../../../assets/images/stuAchievement/icon_score.jpg" alt=""> 课程得分：<span>{{courseDetail.course_score}}</span> </p>
                    <p class="order"><img src="../../../../assets/images/stuAchievement/icon_order.jpg" alt=""> 班级排名： <span>{{courseDetail.score_rank}}</span> </p>
                    <p class="hihgest"><img src="../../../../assets/images/stuAchievement/icon_highest.jpg" alt=""> 实验最高分： <span>{{courseDetail.task_highest_score}}</span> </p>
                    <p class="lowest"><img src="../../../../assets/images/stuAchievement/icon_lowest.png" alt=""> 实验最低分： <span>{{courseDetail.task_minimum_score}}</span> </p>
                </div>
            </div>
            <div class="course-content">
                <div class="content-info">
                    <ul v-for="(item,index) in CourseScoreInfo" :key="index">
                        <div class="courseChapter">
                            <div><img src="../../../../assets/images/stuAchievement/project_icon.png" alt="">{{item.chapter_name}}</div>
                            <div>
                                <span class="chapterScore">章节得分：{{item.chapter_score}}</span>
                                <span  class="stowOrUnfold unfold" @click="expand(index)">
                                    <span v-if="item.dis"><span class="icon iconfont icon-zhankai2-copy"></span>收起</span>
                                    <span v-else><span class="icon iconfont icon-shouqi-copy"></span>展开</span>
                                </span>
                            </div>
                        </div>
                        <div v-if="item.dis">
                            <li v-bind="{class:flag}" class="exper-con" v-for="(itm,j) in item.children" :key="j">
                            <div class="task">
                                <div class="task-left">{{itm.name}}</div>
                                <div :class="itm.has_result?'task-right':'cant-check'" @click="viewResults(index,j,itm.experdis,itm.has_result)">
                                    <span class="iconfont icon-chakan1"></span>
                                    <span> 查看成绩</span>
                                </div>
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
import { message } from 'ant-design-vue'
import {defineComponent,onMounted,reactive,toRefs,inject,getCurrentInstance} from 'vue'
import { useRouter } from 'vue-router'
import request from '../../../../api'
interface ObjectD{
    name?:string,
    has_result?:string,
    expername?:string,
    experdis?:boolean,
}
interface ObjectArrType{
    chapter_name?:string,
    chapter_score?:number,
    children:ObjectD[],
    dis?:boolean,   
    index?:string,
}
interface courseDetailType{
    name?:string,
    expire?:any,
    state?:any,
    teacher?:any,
    course_score?:number,
    score_rank?:any,
    task_highest_score?:any,
    task_minimum_score?:any,
}
interface State{
    courseDetail:courseDetailType,
    CourseScoreInfo:ObjectArrType[],
    columns:any[],
    data:any[],
    flag?:boolean
}
export default defineComponent({
    name:'courseScore',
    setup:(props,context)=>{

        const state:State=reactive({
            courseDetail:{},
            CourseScoreInfo:[],
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
        function viewResults(index:number,j:number,c:any,ifcheck:any){
            console.log(ifcheck)
            ifcheck=true
            console.log(ifcheck)
            if(ifcheck){
                console.log('展开')
                state.CourseScoreInfo[index].children[j].experdis=!state.CourseScoreInfo[index].children[j].experdis
            }
        }
         function getData(){
            const router = useRouter();
            const relateId=router.currentRoute.value.query.id
            console.log(router.currentRoute.value.query.id)
            const infoRequest=(request as any).studentPerformance
             infoRequest.experimentalResults(
                {    
                param: {type:'course',relate_id:relateId}
                })
            .then((res:any)=>{
                if(res.status==1){
                    console.log('获取课程成绩')
                    console.log(res.data)
                    state.courseDetail=res.data
                    state.CourseScoreInfo=res.data.tree
                }
            })
            
        }
         onMounted(() => {
            getData()
            state.CourseScoreInfo.forEach((item:any,j)=>{
                if(j==0){
                    item.dis=true
                }else{
                    item.dis=false
                }
                console.log(item,item.children)
            })
            
            for(var i=0;i<state.CourseScoreInfo.length;i++){
                state.CourseScoreInfo[i].children?.forEach((item,index)=>{
                    item.experdis=true
                })
            }
         })
        return {...toRefs(state),expand,viewResults,getData}
    }
    
})
</script>
<style lang="less" scoped>
.courseScoreContent{
    min-height:750px;
    border-radius:6px;
    background-color:@body-background;
    margin: 0 auto;
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
                padding: 0px 21px;
                .card-info-top{
                    margin: 0;
                    white-space: nowrap;
                    font-size: 22px;
                    color: #333;
                    font-weight: 600;
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
        .card-score{
            color: #8955b5;
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
            padding-left: 30px;
            color:#8955b5;
            img{
               margin-right: 20px;  
            }
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
             .task-right{
                 color:#8955b5;
             }
             .cant-check{
                 color:#ccc;
             }
            .icon-chakan1{
                     font-size:20px;
            }
             
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
<style lang="less">
    .courseScoreContent{
        .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
            padding: 8px;
            text-align:center;
        }
        .ant-table-thead>tr>th{
            background-color:#f6f0fa!important;
        }
        .ant-table-bordered .ant-table-thead > tr > th, .ant-table-bordered .ant-table-tbody > tr > td {
        border-right: 1px solid white;
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
    }
</style>