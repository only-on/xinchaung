<template>
    <div class="home">
        <div class="entrance">
            <div class="entrance-left">
                <div class="title">快捷入口</div>
                <div class="entranceCon">
                    <div class="enterItem" v-for="(item,index) in enterNumber1" :key="index.toString()" @click="toJump(item.link)">
                        <div>
                            <img :src="item.img">
                        </div>
                        <div class="courseNumber">{{item.course}}</div>
                        <div class="number">{{item.number}}</div>
                    </div>
                </div>
            </div>
            <div class="entrance-right">
                <div class="title">快捷入口</div>
                <div class="entranceCon">
                    <div class="enterItem" v-for="(item,index) in enterNumber2" :key="index.toString()">
                        <div>
                            <img :src="item.img">
                        </div>
                        <div class="courseNumber">{{item.course}}</div>
                        <div class="number">{{item.number}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="activity">
            <div class="activity-left">
                <div class="flexTitle">
                    <div class="title-bac">
                    用户活跃度 
                    </div>
                    <div>
                        <a-radio-group v-model:value="value1" button-style="solid">
                            <a-radio-button value="a">昨日</a-radio-button>
                            <a-radio-button value="b">今日</a-radio-button>
                            <a-radio-button value="c">最近7日</a-radio-button>
                        </a-radio-group>
                        <a-date-picker class="pickDay" v-model:value="value2" />
                    </div>
                </div>
                <div id='activity-echats'></div>
            </div>
            <div class="activity-right">
                <div class="title-bac">
                课程活跃榜
                </div>
                <div>
                    <activityList :activeList='statisticData?.course_activity_list'></activityList>
                </div>   
            </div>
        </div>
        <div class="platformResources">
            <div class="title-bac">
                  平台资源概览
            </div>
            <div class="plate">
                <div class="plateLeft"></div>
                <div class="plateRight">
                    <div>
                        <div id="plate1"></div>
                        <div><span class="labelCon">内存</span><span class='contentCon'>{{statisticData?.platform_resource.memTotal}}G</span></div>
                    </div>
                    <div>
                        <div id="plate2"></div>
                        <div><span class="labelCon">CPU</span><span class='contentCon'>{{statisticData?.platform_resource.cpuCores}}核</span></div>
                    </div>
                    <div>
                        <div id="plate3"></div>
                        <div><span class="labelCon">硬盘</span><span class='contentCon'>{{statisticData?.platform_resource.disk}}G</span></div>
                    </div>
                   <div>
                        <div id="plate4"></div>
                        <div><span class="labelCon">GPU</span><span class='contentCon'>{{statisticData?.platform_resource.gpuMem}}个</span></div>
                   </div>   
                </div>
            </div>
        </div>
        <div class="serverNode">
            <div class="serverNode-left">
                <div class="flexTitle">
                    <div class="title-bac">服务器节点状态</div>
                    <div>评级:<span class="status">良好</span></div>
                    <div>
                        <a-select
                            v-model:value="value"
                            label-in-value
                            style="width: 170px"
                            :options="options"
                            @change="handleChange"
                            class="select-input"
                        >
                        </a-select>
                        <span class="ifRun">运行</span>
                    </div>
                </div>
                <div class="node">
                    <div class="node-left">
                        <div class="node-left-top">
                            <div id="node1"></div>
                            <div id="node2"></div>
                        </div>
                        <div class="node-left-bottom">
                            <div id="node3"></div>
                            <div id="node4"></div>
                        </div>
                    </div>
                    <div class="node-right">
                        <div class="infoalerm">
                            信息警告：
                        </div>
                        <div>
                            <div class="warningItem" v-for='(item,i) in warningMessage' key="i">
                                <span>
                                    {{item.title}}:
                                </span>
                                <span>
                                    {{item.percent}}%
                                </span>
                                <span>
                                    等级:
                                </span>
                                <span :class="item.grade=='低风险'?'low':(item.grade=='中风险'?'middle':'high')">
                                    {{item.grade}}
                                </span>
                                <span>
                                    去维护 >
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="nodeOperation">
                    <div>
                        关机 <span class="icon iconfont icon-kaiguanshenx"></span>
                    </div>
                    <div>
                        重启 <span class="icon iconfont icon-loading"></span>
                    </div>
                    <div>
                        一键关闭 <span class="icon iconfont icon-guanbi"></span>
                    </div>
                </div>
            </div>
            <div class="serverNode-right">
                <div class="flexTitle">
                    <div class="title-bac">
                    资源历史使用概览
                    </div>
                    <div>
                        <a-radio-group v-model:value="value1" button-style="solid">
                            <a-radio-button value="a">昨日</a-radio-button>
                            <a-radio-button value="b">今日</a-radio-button>
                            <a-radio-button value="c">最近7日</a-radio-button>
                        </a-radio-group>
                        <a-date-picker class="pickDay" v-model:value="value2" />
                    </div>
                </div>
                <div id="resource_echarts">

                </div>
            </div>
        </div>
        <div class="bottomInfo">
            <div class="productinfo">
                <div class="infoName">产品信息</div>
                <div class='infoCon'>
                    <div class="name" v-for="(item,i) in productInfo" :key="i">{{item.name}}</div>
                </div>
            </div>
            <div class="quickEntrance">
                <div class="infoName">快捷入口</div>
                <div class='infoCon'>
                    <div class="name" v-for="(item,i) in enterInfo" :key="i">{{item.name}}</div>
                </div>
            </div>
        </div>
        <div class="aboutXiPu">
            <div class="aboutLeft">
                <div class="aboutItem" v-for="(item,i) in aboutData" :key="i">
                    {{item.name}}
                </div>
            </div>
            <div class="aboutRight">
                Copyright © 2022 simpleedu.com.cn保留所有权利 京ICP备15049788号-7
            </div>
        </div>
    </div>
</template>
<script lang='ts' setup>
    import { defineComponent, ref, reactive, onMounted, toRefs, inject, watch } from "vue";
    import * as echarts from 'echarts';
    import activityList from './activityLIst.vue'
    import request from "src/api/index";
    const http = (request as any).adminHome;
    var configuration: any = inject("configuration");
    var updata = inject("updataNav") as Function;
    updata({ tabs: [], showContent: true, showNav: false });
    import img1 from 'src/assets/images/admin/home/1.png'
    import img2 from 'src/assets/images/admin/home/2.png'
    import img3 from 'src/assets/images/admin/home/3.png'
    import img4 from 'src/assets/images/admin/home/4.png'
    import img5 from 'src/assets/images/admin/home/5.png'
    import img6 from 'src/assets/images/admin/home/6.png'
    const value:any=ref()
    const options:any = ref([
      {
        value: '192.168.112',
        label: '192.168.112',
      },
      {
        value: '192.168.224',
        label: '192.168.224',
      }
    ])
    const warningMessage:any=ref([
        {title:'CPU使用率',percent:'--',grade:'低风险',link:''},
        {title:'内存使用率',percent:'--',grade:'低风险',link:''},
        {title:'GPU使用率',percent:'--',grade:'中风险',link:''},
        {title:'硬盘使用率',percent:'--',grade:'高风险',link:''}
    ])
    const value1:any=ref('a')
    const value2:any=ref('')
    const enterNumber1:any=ref([])
    const enterNumber2:any=ref([])
    const statisticData:any=ref()
    enterNumber1.value=[
        {
        img:img1,
        course:'课程门数',
        number:'--',
        link:'/admin/TeachingResourceManagement/courseManagement'
        },{
        img:img2,
        course:'实验数',
        number:'--',
        link:'/admin/TeachingResourceManagement/experimentManagement'
        },{
        img:img3,
        course:'素材数',
        number:'--',
        link:'/admin/TeachingResourceManagement/resourcesManagement'
        }
    ];
    enterNumber2.value=[
        {
        img:img4,
        course:'教师数',
        number:'--',
        link:''
        },{
        img:img5,
        course:'学生数',
        number:'--',
        link:''
        },{
        img:img6,
        course:'预约人数',
        number:'--',
        link:''
        }
    ]
    const productInfo:any=ref([])
    const enterInfo:any=ref([])
    const aboutData:any=ref([])
    productInfo.value=[
        {name:'产品名称'},
        {name:'版本信息'},
        {name:'实施时间息'},
        {name:'售后联系方式'},
        {name:'人工只能平台'},
        {name:'4.1.10'},
        {name:'2022/03/17 17:34:00'},
        {name:'14567855671'},
    ]
    enterInfo.value=[
        {name:'课程安排'},
        {name:'产品授权'},
        {name:'方向规划'},
        {name:'个性化设置'},
        {name:'运行环境清理'},
        {name:'用户登录信息'},
        {name:'磁盘管理'},
        {name:'平台设置'},
    ]
    aboutData.value=[
        {name:'了解西普'},
        {name:'西普科技'},
        {name:'联系我们'},
        {name:'招贤纳士'},
        {name:'关注西普科技'},
    ]
    function toJump(value:any){
        router.push(value)
    }
    function handleChange(value:any){
        console.log(value)
    }
    import {activityOption,resourceOption,dashboardResource,dashboardService}  from './echartsOption';
import router from "src/routers";
    function drawEcharts(id:any,option:any){
        document.getElementById(id)?.removeAttribute("_echarts_instance_");
        var chartDom:any=document.getElementById(id)
        var myChart = echarts.init(chartDom);
        myChart.setOption(option);
    }
    const userActive:any=reactive({
        hours:[],
        teacherCount:[],
        stuCount:[],
        totalCount:[]
    })
    const resourceHistory:any=reactive({
        hours:[],
        cpu:[],
        mem:[],
        gpu:[],
        disk:[]
    })
    const serveNode:any=ref()
    function getData(){
        http.statisData().then((res:any)=>{
            if(res.code==1){
                statisticData.value=res.data
                enterNumber1.value[0].number=statisticData.value.course_content_cnt.course_cnt
                enterNumber1.value[1].number=statisticData.value.course_content_cnt.content_cnt
                enterNumber1.value[2].number=statisticData.value.course_content_cnt.dataset_cnt
                enterNumber2.value[0].number=statisticData.value.user_cnt.teacher_cnt
                enterNumber2.value[1].number=statisticData.value.user_cnt.student_cnt
                enterNumber2.value[2].number=statisticData.value.user_cnt.curriculum_user_cnt
                userActive.hours=statisticData.value.user_activity_list.hour_list
                statisticData.value.user_activity_list.user_activity_list.forEach((item:any)=> {
                    userActive.teacherCount.push(item.teacher_cnt)
                    userActive.stuCount.push(item.student_cnt)
                    userActive.totalCount.push(item.total_cnt)
                });
                drawEcharts('activity-echats',activityOption(userActive))
                //历史资源
                resourceHistory.hours=statisticData.value.history_recource.time_list
                statisticData.value.history_recource.monitoring.forEach((item:any)=> {
                    resourceHistory.cpu.push(item.cpu_use_rate)
                    resourceHistory.mem.push(item.mem_use_rate)
                    resourceHistory.gpu.push(item.gpu_use_rate)
                    resourceHistory.disk.push(item.disk_use_rate)
                });
                drawEcharts('resource_echarts',resourceOption(resourceHistory))
                //平台资源概览
                drawEcharts('plate1',dashboardResource(statisticData.value.platform_resource.memTotal-statisticData.value.platform_resource.memUsed,statisticData.value.platform_resource.memUseRate,'G','#00cbc2'))
                drawEcharts('plate2',dashboardResource(statisticData.value.platform_resource.cpuCores-statisticData.value.platform_resource.cpuUsed,statisticData.value.platform_resource.cpuUseRate,'核','#ff9544'))
                drawEcharts('plate3',dashboardResource(statisticData.value.platform_resource.disk-statisticData.value.platform_resource.diskUsed,statisticData.value.platform_resource.diskUseRate,'G','#9872eb'))
                drawEcharts('plate4',dashboardResource(statisticData.value.platform_resource.gpuMem-statisticData.value.platform_resource.gpuMemUsed,statisticData.value.platform_resource.gpuUseRate,'个','#6993fe'))
                
                //服务节点状态
                serveNode.value=statisticData.value?.single_node_resource
                warningMessage.value[0].percent=serveNode.value?.cpuUseRate
                warningMessage.value[1].percent=serveNode.value?.memUseRate
                warningMessage.value[2].percent=serveNode.value?.gpuUseRate
                warningMessage.value[3].percent=serveNode.value?.diskUseRate
                drawEcharts('node1',dashboardService({name:'内存',type:'G',use:serveNode.value?.gpuMemUsed,total:serveNode.value?.gpuMem,rate:serveNode.value?.memUseRate},'#00cbc2'))
                drawEcharts('node2',dashboardService({name:'CPU',type:'core',use:serveNode.value?.cpuUsed,total:serveNode.value?.cpuCores,rate:serveNode.value?.cpuUseRate},'#ff9544'))
                drawEcharts('node3',dashboardService({name:'硬盘',type:'G',use:serveNode.value?.diskUsed,total:serveNode.value?.disk,rate:serveNode.value?.diskUseRate},'#9872eb'))
                drawEcharts('node4',dashboardService({name:'GPU',type:'块',use:serveNode.value?.memUsed,total:serveNode.value?.memTotal,rate:serveNode.value?.gpuUseRate},'#6993fe'))
            }
        })
    }
    onMounted(()=>{
        getData()
        // drawEcharts('activity-echats',activityOption(userActive))
        // drawEcharts('resource_echarts',resourceOption({}))
        // drawEcharts('plate1',dashboardResource({},'#00cbc2'))
        // drawEcharts('plate2',dashboardResource({},'#ff9544'))
        // drawEcharts('plate3',dashboardResource({},'#9872eb'))
        // drawEcharts('plate4',dashboardResource({},'#6993fe'))
        drawEcharts('node1',dashboardService({},'#00cbc2'))
        drawEcharts('node2',dashboardService({},'#ff9544'))
        drawEcharts('node3',dashboardService({},'#9872eb'))
        drawEcharts('node4',dashboardService({},'#6993fe'))
    })
</script>
<style lang="less" scoped>
.entrance{
    display: flex;
    justify-content: space-between;
    .entrance-left,.entrance-right{
        padding: 20px;
        color: var(--white-100);
        width: 49%;
        height:247px;
        .title{
            color: var(--white-100);
            font-size: 18px;
        }
        .entranceCon{
            display: flex;
            justify-content: space-between;
            padding: 30px;
        }
        .number{
            font-weight:20px;
            font-weight: bold;
            margin-top: 10px;
        }
        .courseNumber{
            margin-top: 10px;
        }
        .enterItem{
            text-align: center;
        }
    }
    .entrance-left{
        background-image: url('src/assets/images/admin/home/enter.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .entrance-right{
        background-image: url('src/assets/images/admin/home/enter1.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
}


.title-bac{
    color:#31394D;
    font-size: 18px;
}

.activity{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .activity-left{
        width: 65%;
        height: 480px;
        background-color: var(--white-100);
        padding: 20px;
    }
    .activity-right{
        width: 33%;
        height: 480px;
        background-color: var(--white-100);
        padding: 20px;
        overflow-y: auto;
    }
}
.flexTitle{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            .status{
                display: inline-block;
                width:70px;
                height: 27px;
                text-align: center;
                line-height: 27px;
                background-color:#DBFCF3;
                color: #07A15E;
                border-radius: 13.5px;
                margin-left: 10px;
            }
            .ifRun{
                color:var(--primary-color);
                margin-left: 10px;
            }
            :deep(.ant-select-selector){
                border-radius: 20px;
            }
        }
.platformResources{
    margin-top: 20px;
    height: 360px;
    background-color: var(--white-100);
    padding: 20px;
}
.serverNode{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .serverNode-left,.serverNode-right{
        // width: 49%;
        height: 359px;
        background-color: var(--white-100);
        // padding: 20px;
    }
    .serverNode-left{
        width:53%;
    }
    .serverNode-right{
        width:46;
    }
}
.serverNode-right{
    padding: 20px;
}
.serverNode-left{
    .flexTitle{
        padding:20px;
        padding-bottom: 0px;
    }
}
.bottomInfo{
    width: 100%;
    height:204px;
    background-color:#192843;
    margin-top: 40px;
}
.aboutXiPu{
    width: 100%;
    height:70px;
    background-color:#131F34;
    display: flex;
}

#activity-echats,#resource_echarts{
    width: 100%;
    height:90%;
}
.plate{
    width: 100%;
    height: 100%;
    display: flex;
    background-image: url(src/assets/images/admin/home/plate.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.plateLeft{
    width: 28%;
    height: 100%;
}
.plateRight{
    width: 72%;
    height: 100%;
    display: flex;
    padding-right: 100px;
    .labelCon{
       font-size: 18px; 
       font-weight: bold;
    }
    .contentCon{
        font-size: 16px;
        margin-left: 10px;
    }
    >div{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // background-color: yellow;
    }
}
#plate1,#plate2,#plate3,#plate4{
    width:100%;
    height:60%;
    // background-color: aqua;
}
.node{
    display: flex;
    justify-content:space-between;
    width: 100%;
    height:70%;
    padding: 20px;
    padding-top: 0px;
    padding-bottom: 0px;
    .node-left{
        width: 49%;
        height:100%;
        .node-left-top{
            display: flex;
            width: 100%;
            height: 50%;
        }
        .node-left-bottom{
            display: flex;
            width: 100%;
            height: 50%;
        }
    }
    .node-right{
        width: 49%;
        height:100%;
        .infoalerm{
            margin-bottom: 20px;
        }
        .warningItem{
            margin-bottom: 20px;
            background-color: #FFFBF6;
            border-radius: 14px;
            height: 34px;
            line-height: 34px;
            >span{
                margin-left:4px;
            }
            >span:nth-last-child(1){
                color: var(--primary-color);
            }
            .low{
                color:#00cbc2;
            }
            .middle{
                color: var(--primary-color);
            }
            .high{
                color: red;
            }
        }
    }
}
.nodeOperation{
    display: flex;
    height: 40px;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #DFDFDF;
    padding-left: 50px;
    padding-right: 50px;
    width: 100%;
    >div{
        padding-right: 30px;
        padding-left: 30px;
        width:33.3%;
        text-align: center;
    }
    >div:nth-child(1){
        border-right: 1px solid #DFDFDF;
        
    }
    >div:nth-child(2){
        border-right: 1px solid #DFDFDF;
        
    }
}
#node1,#node2,#node3,#node4{
    width: 50%;
    height: 100%;
}

.bottomInfo{
    display: flex;
    >div{
        width: 50%;
        padding: 20px;
    }
    .infoName{
        font-size: 18px;
    color: var(--white-100);
    margin-bottom: 30px;
    }
    .infoCon{
        display: flex;
        flex-wrap: wrap;
        .name{
            // width: 150px;
            color:#7E8085;
            margin-right:40px;
            margin-bottom: 20px;
        }
    }
}
.aboutLeft{
    display: flex;
    width: 50%;
    height: 100%;
    align-items: center;
    flex-wrap: wrap;
    padding: 20px;
}
.aboutRight{
    display: flex;
    width: 50%;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: #576078;
}
.aboutItem{
    font-size:16px;
    color:var(--white-100);
    margin-right:30px;
}
:deep(.ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover){
    background:var(--primary-color);
    border-color: var(--primary-color);
}
:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover::before){
    background-color: var(--primary-color);
}
:deep(.ant-radio-button-wrapper:last-child){
    border-top-right-radius:20px;
    border-bottom-right-radius:20px;
}
:deep(.ant-radio-button-wrapper:first-child){
    border-top-left-radius:20px;
    border-bottom-left-radius:20px;
}
:deep(.ant-calendar-picker-input.ant-input){
    border-radius: 20px;
}
.pickDay{
    margin-left: 10px;
    width: 120px;
}
</style>