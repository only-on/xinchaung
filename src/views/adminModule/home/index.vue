<template>
    <div class="home">
        <div class="corlorwhite">
            <div class="entrance">
            <div class="entrance-left" :style="`background-image: url(${systemImages.Ahome.entranceLeft});`">
                <div class="title">快捷入口</div>
                <div class="entranceCon">
                    <div class="enterItem" v-for="(item,index) in enterNumber1" :key="index.toString()" @click="toJump(item.link)">
                        <div class='imgBox'>
                            <img class='img' :src="item.img">
                        </div>
                        <div class="courseNumber">{{item.course}}</div>
                        <div class="number">{{item.number}}</div>
                    </div>
                </div>
            </div>
            <div class="entrance-right" :style="`background-image: url(${systemImages.Ahome.entranceRight});`">
                <div class="title">快捷入口</div>
                <div class="entranceCon">
                    <div class="enterItem" v-for="(item,index) in enterNumber2" :key="index.toString()" @click="toJump(item.link)">
                        <div class='imgBox'>
                            <img class='img' :src="item.img">
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
                        <a-radio-group v-model:value="radioTimeUser" button-style="solid" @change='useractiveChange'>
                            <a-radio-button value="yesterday">昨日</a-radio-button>
                            <a-radio-button value="today">今日</a-radio-button>
                            <a-radio-button value="lastSevenDays">最近7日</a-radio-button>
                        </a-radio-group>
                        <a-date-picker class="pickDay" :disabled-date="disabledDate" valueFormat='YYYY-MM-DD' v-model:value="pickTimeUser" @change='useractivePick' />
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
                        <div><span class="labelCon">内存</span><span class='contentCon'>{{statisticData?.platform_resource.memTotal==null?'--' :statisticData?.platform_resource.memTotal+'G'}}</span></div>
                    </div>
                    <div>
                        <div id="plate2"></div>
                        <div><span class="labelCon">CPU</span><span class='contentCon'>{{statisticData?.platform_resource.cpuCores==null?'--' :statisticData?.platform_resource.cpuCores+'核'}}</span></div>
                    </div>
                    <div>
                        <div id="plate3"></div>
                        <div><span class="labelCon">硬盘</span><span class='contentCon'>{{statisticData?.platform_resource.disk==null?'--' :statisticData?.platform_resource.disk+'G'}}</span></div>
                    </div>
                   <div>
                        <div id="plate4"></div>
                        <div><span class="labelCon">GPU</span><span class='contentCon'>{{statisticData?.platform_resource.gpuMem==null? '--' :statisticData?.platform_resource.gpuMem+'G'}}</span></div>
                   </div>   
                </div>
            </div>
        </div>
        <div class="serverNode">
            <div class="serverNode-left">
                <div class="flexTitle">
                    <div class="title-bac">服务器节点状态</div>
                    <!-- 优秀 -->
                    <div>评级:<span class="status" :class="serveNodeStatus=='优秀'?'youxiu':(serveNodeStatus=='差'?'cha':'lianghao')">{{serveNodeStatus}}</span></div>
                    <div>
                        <a-select class="select-input"  @change="handleChange" v-model:value="serveNodeValue">
                            <a-select-option
                                v-for="item in options"
                                :key="item"
                                :value="item.value"
                                >{{ item.label }}
                            </a-select-option>
                        </a-select>
                        <span class='ifRun'>{{serveNode?.state=='up'?'运行':'关闭'}}</span>
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
                            <div class="warningItem" v-for='(item,i) in warningMessage' :key="i">
                                <span>
                                    {{item.title}}:
                                </span>
                                <span class='percent'>
                                    {{item.percent==null?'--':(item.percent+'%')}}
                                </span>
                                <span>
                                    等级:
                                </span>
                                <span :class="item.grade=='low'?'low':(item.grade=='medium'?'middle':'high')">
                                    {{item.grade=='low'?'低风险':(item.grade=='medium'?'中风险':'高风险')}}
                                </span>
                                <span class='maintain' @click="toMaintain(item.link)">
                                    去维护 
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="nodeOperation">
                    <div class="dohover" @click="nodeOpera(serveNodeValue,serveNodeValue==options[0].value?'master':'slave','stop')">
                        关机 <span class="icon iconfont icon-guanji"></span>
                    </div>
                    <div class="dohover" @click="nodeOpera(serveNodeValue,serveNodeValue==options[0].value?'master':'slave','restart')">
                        重启 
                        <span class="icon iconfont icon-zhongqi"></span>
                    </div>
                    <div class="dohover" @click="doSimJetSoft">
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
                        <a-radio-group v-model:value="radioTime" button-style="solid" @change='resourceChangeTime'>
                            <a-radio-button value="yesterday">昨日</a-radio-button>
                            <a-radio-button value="today">今日</a-radio-button>
                            <a-radio-button value="lastSevenDays">最近7日</a-radio-button>
                        </a-radio-group>
                        <a-date-picker class="pickDay" valueFormat='YYYY-MM-DD' v-model:value="pickTime" @change='resourcePickTime' />
                    </div>
                </div>
                <div id="resource_echarts">

                </div>
            </div>
        </div>
        </div>
        <div class="colorBlack">
            <div class="bottomInfo">
                <div>
                    <div class="productinfo">
                    <div class="infoName">产品信息</div>
                    <div class='infoCon'>
                        <div class="name single_ellipsis" v-for="(item,i) in productInfo" :key="i">{{item.name}}</div>
                        <!-- <div></div> -->
                    </div>
                </div>
                <div class="quickEntrance">
                    <div class="infoName">快捷入口</div>
                    <div class='infoCon'>
                        <div class="name quicklyEnter single_ellipsis" v-for="(item,i) in enterInfo" :key="i" @click="toJump(item.link)">{{item.name}}</div>
                    </div>
                </div>
                </div>
            </div>
            <div class="aboutXiPu">
                <div>
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
        </div>
    </div>
</template>
<script lang='ts' setup>
    import { defineComponent, ref, reactive, onMounted, toRefs, inject, watch } from "vue";
    import * as echarts from 'echarts';
    import moment from 'moment';
    import activityList from './activityLIst.vue'
    import request from "src/api/index";
    import {Modal } from 'ant-design-vue'
    import {activityOption,resourceOption,dashboardResource,dashboardService}  from './echartsOption';
    import router from "src/routers";
    import {getThemeData} from 'src/utils/theme'
    import {useStore} from 'vuex';
    const {systemColor} = getThemeData()
    const http = (request as any).adminHome;
    const {systemImages} = getThemeData()
    var configuration: any = inject("configuration");
    var updata = inject("updataNav") as Function;
    const store = useStore();
    updata({ tabs: [], showContent:false, showNav: false });
    const disabledDate = (current:any) => {
        return current && current > moment().endOf('day');
    };
    const serveNodeValue:any=ref()
    const options:any = ref([
    ])
    const warningMessage:any=ref([
        {title:'CPU使用率',percent:'--',grade:'低风险',link:'/teacher/coursePlan/environmental'},
        {title:'内存使用率',percent:'--',grade:'低风险',link:'/teacher/coursePlan/environmental'},
        {title:'GPU使用率',percent:'--',grade:'中风险',link:'/teacher/coursePlan/environmental'},
        {title:'硬盘使用率',percent:'--',grade:'高风险',link:'/admin/systemMaintenance/diskManagement'}
    ])
    //资源历史使用概览
    const radioTime:any=ref('today')
    const pickTime:any=ref()
    //用户活跃度
    const radioTimeUser:any=ref('today')
    const pickTimeUser:any=ref()
    // 今日
    const today=moment(new Date(), "YYYY-MM-DD")
    const enterNumber1:any=ref([])
    const enterNumber2:any=ref([])
    const statisticData:any=ref()
    enterNumber1.value=[
        {
        img: systemImages.Ahome.adminHome1,
        course:'课程门数',
        number:'--',
        link:'/admin/TeachingResourceManagement/courseManagement'
        },{
        img:systemImages.Ahome.adminHome2,
        course:'实验数',
        number:'--',
        link:'/admin/TeachingResourceManagement/experimentManagement'
        },{
        img:systemImages.Ahome.adminHome3,
        course:'素材数',
        number:'--',
        link:'/admin/TeachingResourceManagement/resourcesManagement'
        }
    ];
    enterNumber2.value=[
        {
        img:systemImages.Ahome.adminHome4,
        course:'教师数',
        number:'--',
        link:'/admin/adminUserManagement/teacherManagement'
        },{
        img:systemImages.Ahome.adminHome5,
        course:'学生数',
        number:'--',
        link:'/admin/adminUserManagement/studentManagement'
        },{
        img:systemImages.Ahome.adminHome6,
        course:'预约人数',
        number:'--',
        link:'/teacher/coursePlan'
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
        {name:store.state.systemInfo.site_name},
        {name:'1.1.0'},
        {name:'2022/03/17 17:34:00'},
        {name:'14567855671'},
    ]
    enterInfo.value=[
        {name:'课程安排',link:'/teacher/coursePlan'},
        {name:'产品授权',link:'/admin/systemMaintenance/systemAuthorization'},
        {name:'方向规划',link:'/admin/TeachingResourceManagement/DirectionPlanning'},
        {name:'个性化设置',link:'/admin/systemMaintenance/personalization'},
        {name:'运行环境清理',link:'/admin/systemMaintenance/diskManagement'},
        {name:'用户登录信息',link:'/admin/systemMaintenance/userloginInformation'},
        {name:'磁盘管理',link:'/admin/systemMaintenance/diskManagement'},
        {name:'平台设置',link:'/admin/systemMaintenance/systemAuthorization'},
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
    const serveNodeStatus:any=ref('')
    function getData(){
        http.statisData().then((res:any)=>{
            if(res.code==1){
                statisticData.value=res.data
                // nodes_ip_list
                res.data?.nodes_ip_list.forEach((item:any)=>{
                    options.value.push({value:item,label:item})
                })
                serveNodeValue.value=options.value[0].value.toString()
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
                drawEcharts('plate1',dashboardResource(statisticData.value.platform_resource.memTotal-statisticData.value.platform_resource.memUsed,statisticData.value.platform_resource.memUseRate,'G',systemColor.Acolor1))
                drawEcharts('plate2',dashboardResource(statisticData.value.platform_resource.cpuCores-statisticData.value.platform_resource.cpuUsed,statisticData.value.platform_resource.cpuUseRate,'核',systemColor.Acolor2))
                drawEcharts('plate3',dashboardResource(statisticData.value.platform_resource.disk-statisticData.value.platform_resource.diskUsed,statisticData.value.platform_resource.diskUseRate,'G',systemColor.Acolor3))
                drawEcharts('plate4',dashboardResource(statisticData.value.platform_resource.gpuMem-statisticData.value.platform_resource.gpuMemUsed,statisticData.value.platform_resource.gpuUseRate,'G',systemColor.Acolor4))
                
                //服务节点状态
                serveNode.value=statisticData.value?.single_node_resource
                warningMessage.value[0].percent=serveNode.value?.cpuUseRate
                warningMessage.value[0].grade=serveNode.value?.cpuRiskLevel
                warningMessage.value[1].percent=serveNode.value?.memUseRate
                warningMessage.value[1].grade=serveNode.value?.memRiskLevel
                warningMessage.value[2].percent=serveNode.value?.gpuUseRate
                warningMessage.value[2].grade=serveNode.value?.gpuRiskLevel
                warningMessage.value[3].percent=serveNode.value?.diskUseRate
                warningMessage.value[3].grade=serveNode.value?.diskRiskLevel
                let obj={'low':'优秀','high':'差','medium':'良好'}      // {'low':'差','high':'优秀','medium':'良好'} 返回的是风险等级   对应的状态是反的
                serveNodeStatus.value=serveNode.value?.nodeRiskLevel?obj[serveNode.value.nodeRiskLevel]:''
                drawEcharts('node1',dashboardService({name:'内存',type:'G',use:serveNode.value?.memUsed,total:serveNode.value?.memTotal,rate:serveNode.value?.memUseRate},systemColor.Acolor1))
                drawEcharts('node2',dashboardService({name:'CPU',type:'core',use:serveNode.value?.cpuUsed,total:serveNode.value?.cpuCores,rate:serveNode.value?.cpuUseRate},systemColor.Acolor2))
                drawEcharts('node3',dashboardService({name:'硬盘',type:'G',use:serveNode.value?.diskUsed,total:serveNode.value?.disk,rate:serveNode.value?.diskUseRate},systemColor.Acolor3))
                drawEcharts('node4',dashboardService({name:'GPU',type:'G',use:serveNode.value?.gpuMemUsed,total:serveNode.value?.gpuMem,rate:serveNode.value?.gpuUseRate},systemColor.Acolor4))
            }
        })
    }
    function changeUserParams(start:any,end:any){
        http.userActive({param:{start_date:start,end_date:end}}).then((res:any)=>{
            userActive.hours=[]
            userActive.teacherCount=[]
            userActive.stuCount=[]
            userActive.totalCount=[]
            userActive.hours=res.data?.user_activity_list.date_list?res.data?.user_activity_list.date_list:res.data?.user_activity_list.hour_list
            res.data.user_activity_list.user_activity_list.forEach((item:any)=> {
                    userActive.teacherCount.push(item.teacher_cnt)
                    userActive.stuCount.push(item.student_cnt)
                    userActive.totalCount.push(item.total_cnt)
                });
            drawEcharts('activity-echats',activityOption(userActive))
        })
    }
    //服务节点变化
    function handleChange(value:any){
        console.log(value,serveNodeValue.value?.value)
        http.serveStatus({param:{id:value}}).then((res:any)=>{
                serveNode.value=res.data?.single_node_resource
                warningMessage.value[0].percent=serveNode.value?.cpuUseRate
                warningMessage.value[0].grade=serveNode.value?.cpuRiskLevel
                warningMessage.value[1].percent=serveNode.value?.memUseRate
                warningMessage.value[1].grade=serveNode.value?.memRiskLevel
                warningMessage.value[2].percent=serveNode.value?.gpuUseRate
                warningMessage.value[2].grade=serveNode.value?.gpuRiskLevel
                warningMessage.value[3].percent=serveNode.value?.diskUseRate
                warningMessage.value[3].grade=serveNode.value?.diskRiskLevel
                let obj={'low':'优秀','high':'差','medium':'良好'}      // {'low':'差','high':'优秀','medium':'良好'} 返回的是风险等级   对应的状态是反的
                serveNodeStatus.value=serveNode.value?.nodeRiskLevel?obj[serveNode.value.nodeRiskLevel]:''
                // serveNodeStatus.value=serveNode.value?.nodeRiskLevel=='low'?'良好':(serveNode.value?.nodeRiskLevel=='high'?'差':'中等')
                drawEcharts('node1',dashboardService({name:'内存',type:'G',use:serveNode.value?.memUsed,total:serveNode.value?.memTotal,rate:serveNode.value?.memUseRate},systemColor.Acolor1))
                drawEcharts('node2',dashboardService({name:'CPU',type:'core',use:serveNode.value?.cpuUsed,total:serveNode.value?.cpuCores,rate:serveNode.value?.cpuUseRate},systemColor.Acolor2))
                drawEcharts('node3',dashboardService({name:'硬盘',type:'G',use:serveNode.value?.diskUsed,total:serveNode.value?.disk,rate:serveNode.value?.diskUseRate},systemColor.Acolor3))
                drawEcharts('node4',dashboardService({name:'GPU',type:'G',use:serveNode.value?.gpuMemUsed,total:serveNode.value?.gpuMem,rate:serveNode.value?.gpuUseRate},systemColor.Acolor4))
        })
    }
    //用户活跃度改变日期
    function useractiveChange(val:any){
        pickTimeUser.value=''
        console.log(radioTimeUser.value,'hhhh')
        if(radioTimeUser.value=='today'){
            changeUserParams(getNextDate(today,0),getNextDate(today,0))
        }else if(radioTimeUser.value=='yesterday'){
            changeUserParams(getNextDate(today,-1),getNextDate(today,-1))
        }else{
            changeUserParams(getNextDate(today,-6),getNextDate(today,0))
        }
    }
    function useractivePick(){
        radioTimeUser.value=''
        console.log(pickTimeUser.value,' pickTimeUser.value')
        changeUserParams(pickTimeUser.value,pickTimeUser.value)
    }
    //资源历史使用概览
    // resourceSearch
    function changeResourceTime(start:any,end:any){
        http.resourceSearch({param:{start_date:start,end_date:end}}).then((res:any)=>{
            resourceHistory.hours=[]
            resourceHistory.cpu=[]
            resourceHistory.mem=[]
            resourceHistory.gpu=[]
            resourceHistory.disk=[]
            resourceHistory.hours=res.data.history_resource.time_list
            res.data.history_resource?.monitoring.forEach((item:any)=> {
                    resourceHistory.cpu.push(item.cpu_use_rate)
                    resourceHistory.mem.push(item.mem_use_rate)
                    resourceHistory.gpu.push(item.gpu_use_rate)
                    resourceHistory.disk.push(item.disk_use_rate)
                });
            drawEcharts('resource_echarts',resourceOption(resourceHistory))
        })
    }
    function resourceChangeTime(val:any){
        pickTime.value=''
        if(radioTime.value=='today'){
            changeResourceTime(getNextDate(today,0),getNextDate(today,0))
        }else if(radioTime.value=='yesterday'){
            changeResourceTime(getNextDate(today,-1),getNextDate(today,-1))
        }else{
            changeResourceTime(getNextDate(today,-6),getNextDate(today,0))
        }
    }
    function resourcePickTime(val:any){
        radioTime.value=''
        changeResourceTime(pickTime.value,pickTime.value)
    }
    function getNextDate(date:any, day:any) { 
    　　var dd = new Date(date);
    　　dd.setDate(dd.getDate() + day);
    　　var y = dd.getFullYear();
    　　var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
    　　var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    　　return y + "-" + m + "-" + d;
    };
    function toMaintain(link:any){
        router.push(link)
    }
    function nodeOpera(ip: any, node_type: any, action: any) {
        Modal.confirm({
          title: "提示",
          content: action === "restart" ? "确定要重启吗？" : "确定要关机吗？",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            http
              .deviceNodeOperation({
                param: { ip: ip, node_type: node_type, action: action },
              })
              .then((res: any) => {
                getData()
              });
          },
        });
      }
    function doSimJetSoft() {
        Modal.confirm({
          title: "提示",
          content: "确定要关闭服务器吗？",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            http.simJetSoft().then((res: any) => {
              console.log(res);
            });
          },
        });
      }
    onMounted(()=>{
        getData()
        drawEcharts('activity-echats',activityOption(userActive))
        drawEcharts('resource_echarts',resourceOption({}))
        drawEcharts('plate1',dashboardResource(0,0,'G',systemColor.Acolor1))
        drawEcharts('plate2',dashboardResource(0,0,'核',systemColor.Acolor2))
        drawEcharts('plate3',dashboardResource(0,0,'G',systemColor.Acolor3))
        drawEcharts('plate4',dashboardResource(0,0,'个',systemColor.Acolor4))
        drawEcharts('node1',dashboardService({},systemColor.Acolor1))
        drawEcharts('node2',dashboardService({},systemColor.Acolor2))
        drawEcharts('node3',dashboardService({},systemColor.Acolor3))
        drawEcharts('node4',dashboardService({},systemColor.Acolor4))
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
            padding: 10px 30px;
        }
        .number{
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
        }
        .courseNumber{
            margin-top: 10px;
            font-size: 16px;
        }
        .enterItem{
            text-align: center;
            .imgBox{
                width:100px;
                height:100px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            img{
                width: 100px;
                height: 100px;
            }
        }
        .enterItem:hover{
            cursor: pointer;
            .img{
                width:90px;
                height:90px;
            }
        }
    }
    .entrance-left{
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .entrance-right{
        background-repeat: no-repeat;
        background-size: 100% 100%;
        border-radius: 10px;
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
                // background-color:#DBFCF3;
                // color: #07A15E;
                border-radius: 13.5px;
                margin-left: 10px;
            }
            .youxiu{
                color: #07A15E;
                background-color: rgba(#07A15E,0.2);
            }
            .lianghao{
                color: var(--primary-color);
                background-color:var(--primary-1);
            }
            .cha{
                color: red;
                background-color: rgba(red,0.1);
            }
            .ifRun{
                color:var(--primary-color);
                margin-left: 10px;
            }
            .close{
                color:red;
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
        height: 359px;
        background-color: var(--white-100);
        // padding: 20px;
    }
    .serverNode-left{
        width:52%,
    }
    .serverNode-right{
        width:47%;
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
       font-size: 16px; 
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
            background-color: var(--primary-1);
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
    >div{
        // width: 50%;
        // padding: 20px;
        display: flex;
        width: var(--center-width);
        margin: 0 auto;
        >div{
            width: 50%;
            padding: 20px;
        }
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
            // margin-right:40px;
            // margin-bottom: 20px;
            width: 25%;
            line-height: 30px;
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
    color:#576078;
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
.home{
    width: 100%;
    margin-top: 20px;
    .corlorwhite{
        display: flex;
        flex-direction: column;
        align-items: center;
        >div{
            width:var(--center-width);
        }
    }
    .colorBlack{
        width: 100%;
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
               
                >div{
                    display: flex;
                    width:var(--center-width);
                    margin:0 auto;
                    height: 100%;
                }
            }
    }
}
.maintain:hover{
    cursor: pointer;
}
.quicklyEnter:hover{
    cursor: pointer;
}
.dohover{
    cursor: pointer;
}
.dohover:hover{
    color: var(--primary-color);
}
.percent{
    display: inline-block;
    width:46px;
}
.icon-guanbi{
    font-size: 14px;
    font-weight: bold;
}
</style>