<template>
    <div class="home">
        <div class="entrance">
            <div class="entrance-left">
                <div class="title">快捷入口</div>
                <div class="entranceCon">
                    <div class="enterItem" v-for="(item,index) in enterNumber1" :key="index.toString()">
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
                <div>
                    <div class="title-bac">
                    用户活跃度 
                    </div>
                    <div></div>
                </div>
                <div id='activity-echats'></div>
            </div>
            <div class="activity-right">
                <div class="title-bac">
                课程活跃榜
                </div>
                <div>
                    <activityList></activityList>
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
                    <div id="plate1"></div>
                    <div id="plate2"></div>
                    <div id="plate3"></div>
                    <div id="plate4"></div>
                </div>
            </div>
        </div>
        <div class="serverNode">
            <div class="serverNode-left">
                <div class="title-bac">
                  服务器节点状态
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
                        <div>
                            信息警告：
                        </div>
                        <div>
                            cpu使用率：
                        </div>
                    </div>
                </div>
            </div>
            <div class="serverNode-right">
                <div>
                    <div class="title-bac">
                    资源历史使用概览
                    </div>
                </div>
                <div id="resource_echarts">

                </div>
            </div>
        </div>
        <div class="bottomInfo">
            <div class="productinfo"></div>
            <div class="quickEntrance"></div>
        </div>
        <div class="aboutXiPu">

        </div>
    </div>
</template>
<script lang='ts' setup>
    import { defineComponent, ref, reactive, onMounted, toRefs, inject, watch } from "vue";
    import * as echarts from 'echarts';
    import activityList from './activityLIst.vue'
    var configuration: any = inject("configuration");
    var updata = inject("updataNav") as Function;
    updata({ tabs: [], showContent: true, showNav: false });
    import img1 from 'src/assets/images/admin/home/1.png'
    import img2 from 'src/assets/images/admin/home/2.png'
    import img3 from 'src/assets/images/admin/home/3.png'
    import img4 from 'src/assets/images/admin/home/4.png'
    import img5 from 'src/assets/images/admin/home/5.png'
    import img6 from 'src/assets/images/admin/home/6.png'

    const enterNumber1:any=ref([])
    const enterNumber2:any=ref([])
    enterNumber1.value=[
        {
        img:img1,
        course:'课程门数',
        number:'200',
        link:''
        },{
        img:img2,
        course:'实验数',
        number:'10',
        link:''
        },{
        img:img3,
        course:'素材数',
        number:'80',
        link:''
        }
    ];
    enterNumber2.value=[
        {
        img:img4,
        course:'教师数',
        number:'200',
        link:''
        },{
        img:img5,
        course:'学生数',
        number:'10',
        link:''
        },{
        img:img6,
        course:'预约人数',
        number:'80',
        link:''
        }
    ]
    import {activityOption,resourceOption,dashboardResource,dashboardService}  from './echartsOption';
    function drawEcharts(id:any,option:any){
        document.getElementById(id)?.removeAttribute("_echarts_instance_");
        var chartDom:any=document.getElementById(id)
        var myChart = echarts.init(chartDom);
        myChart.setOption(option);
    }
    onMounted(()=>{
        drawEcharts('activity-echats',activityOption({}))
        drawEcharts('resource_echarts',resourceOption({}))
        drawEcharts('plate1',dashboardResource({},'#00cbc2'))
        drawEcharts('plate2',dashboardResource({},'#ff9544'))
        drawEcharts('plate3',dashboardResource({},'#9872eb'))
        drawEcharts('plate4',dashboardResource({},'#6993fe'))
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
        width: 49%;
        height: 359px;
        background-color: var(--white-100);
        padding: 20px;
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
}

#activity-echats,#resource_echarts{
    width: 100%;
    height:100%;
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
}
#plate1,#plate2,#plate3,#plate4{
    width: 25%;
    height: 100%;
}
.node{
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    .node-left{
        width: 49%;
        height: 100%;
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
        height: 100%;
    }
}
#node1,#node2,#node3,#node4{
    width: 50%;
    height: 100%;
}
</style>