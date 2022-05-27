<template>
    <div class="disManagement">
        <div class="manageTop">
            <div class="manage-item">
                <div class="left-lable left-lable1"></div>
                <div class="content-main">
                    <div class="content">
                        <div class="content-left">
                        <div class="big-icon big-icon1">
                            <span class="icon iconfont icon-zuoyekaoshi"></span>
                        </div>
                        </div>
                        <div class="content-right">
                            <div class="tit tit1">录制视频</div>
                            <a-button type='primary' @click="clean('video',false)">清理</a-button>
                            <div class="detailClear">详细清理</div>
                        </div>
                        
                    </div>
                    <div class="autoclear" @click="clean('video',true)">
                        <span class="icon iconfont icon-zidongqingli"></span>
                        <span>自动清理设置</span>
                    </div>
                </div>
            </div>
            <div class="manage-item">
                <div class=" left-lable left-lable2">
                </div>
                <div class="content-main">
                    <div class="content">
                        <div class="content-left">
                            <div class="big-icon big-icon2">
                                <span class="icon iconfont icon-zuoyekaoshi"></span>
                            </div>
                        </div>
                        <div class="content-right">
                            <div class="tit tit1">系统日志</div>
                            <a-button type='primary' @click="clean('systemLog',false)">清理</a-button>
                            <div class="detailClear">详细清理</div>
                        </div>
                    </div>
                    <div class="autoclear" @click="clean('systemLog',true)">
                        <span class="icon iconfont icon-zidongqingli"></span>
                        <span>自动清理设置</span>
                    </div>
                </div>      
            </div>
            <div class="manage-item">
                <div class=" left-lable left-lable3"></div>
                <div class="content">
                    <div class='content-left'>
                        <div class="tit tit2">更多清理</div>
                        <div class='toMaterial'>
                            <a-button type='primary' class="btn orange">
                                <span class="icon iconfont icon-material"></span>
                                <span> 到素材资源</span>                          
                            </a-button></div>
                        <div>
                            <a-button class="button">
                            <span class="icon iconfont icon-rongqijingxiangfuwu"></span>
                            <span>到镜像</span>
                            </a-button>
                        </div>   
                    </div>
                    <div class="clearImg"></div>
                </div>
            </div>
        </div>
        <div class="managementBottom">
            <div class="diskStatistic">
                <div class="diskTitle">
                   磁盘使用统计
                </div>
                <div id="statiscEcharts"></div>
            </div>
            <div class="diskOperateRecord">
                <div class="diskTitle">
                   操作记录 
                </div>
                <a-table
                    :columns="columns"
                    :data-source="tabledata"
                >
                </a-table>
            </div>
        </div>
        <cleanModal v-model:visible='visible' :diskType='diskType' :cleanType='cleanType'></cleanModal>
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
    import {option}  from './option';
    import * as echarts from 'echarts';
    import cleanModal from './cleanModal.vue'
import { Console } from "console";
    var configuration: any = inject("configuration");
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [
        { name: "磁盘管理", componenttype: 0 }
      ],
      showContent: true,
      componenttype: undefined,
      showNav:true,
    });
const diskType:any=ref('video');
const cleanType:any=ref(false);
const columns: any = ref();
const tabledata: any = ref([]);
columns.value = [
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "清理内容",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "释放空间",
    dataIndex: "space",
    key: "space",
  }
];
const chartdata:any=ref('')
chartdata.value='录制视频'
const visible:any=ref(false)
    function drawEcharts(){
        document.getElementById('statiscEcharts')?.removeAttribute("_echarts_instance_");
        var chartDom:any=document.getElementById('statiscEcharts')
        var myChart = echarts.init(chartDom);
        option && myChart.setOption(option(chartdata.value));
    }
    function clean(type:string,ifauto:any){
        visible.value=true
        diskType.value=type
        cleanType.value=ifauto
    }
    onMounted(()=>{
        drawEcharts()
    })
    </script>
    <style lang="less" scoped>
    .disManagement{
        background-color:#fafafb;
        width: 100%;
        height: 100%;
        .manageTop{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            .manage-item{
                width: 33%;
                height: 170px;
                background-color: var(--white-100);
                display: flex;
                .left-lable{
                    width: 5px;
                    height: 100%;
                    border-top-left-radius: 5px;
                    border-bottom-left-radius: 5px;
                }
                .left-lable1{
                    background:linear-gradient(#9BADFB 0%,#C8ADFC 50%, #D5B3FC 100%);
                }
                .left-lable2{
                    background:linear-gradient(#95EDF3 0%,#74C4E8 50%, #A4CBFB 100%);
                }
                .left-lable3{
                    background:linear-gradient(#FFC5B7 0%,#F2C583 50%, #F9BF99 100%);
                }
                
            }
                
        }
        .content-right{
            position: relative;
        }
        .detailClear{
            position: absolute;
            top: 0;
            right: -150px;
        }
        .content{
            padding: 20px;
            display: flex;
            width: 100%;
            .tit{
               font-size: 16px;
            }
            .tit1{
                margin-bottom: 10px;
            }
            .tit2{
                margin-bottom: 20px;
            }
            .big-icon{
                width: 72px;
                height: 72px;
                border-radius: 11px;
                margin-right: 27px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: 10px;
                .icon{
                    color: var(--white-100);
                    font-size: 34px;
                }
            }
            .big-icon1{
                background:linear-gradient(#9BADFB 0%,#C8ADFC 50%, #D5B3FC 100%);
            }
            .big-icon2{
                background:linear-gradient(#95EDF3 0%,#74C4E8 50%, #A4CBFB 100%);
            }
            .toMaterial{
                :deep(.ant-btn){
                border-radius: 5px!important;
            }
                margin-bottom: 15px;
                .icon{
                    margin-right: 10px;
                }
            }
            .button{
                color: var(--primary-color);
                .icon{
                    margin-right: 10px;
                }
                    
                }
        }
        .content-main{
            width: 100%;
        }
        .autoclear{
        
            height: 40px;
            background-color: #F7F8FB;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 30px;
            margin-right: 20px;
            .icon{
                margin-right: 10px;
            }
        }
        .clearImg{
            margin-left: 30px;
            width: 160px;
            height: 120px;
            background: url(/src/assets/images/admin/systemmain/clear.png);
            background-size: 100% 100%;
        }
        .managementBottom{
            display: flex;
            justify-content: space-between;
            height: 429px;
            .diskTitle{
                font-size: 18px;
                margin-bottom: 20px;
            }
            .diskStatistic,.diskOperateRecord{
                width: 49.5%;
                padding: 20px;
                background-color: var(--white);
            }
            #statiscEcharts{
                width: 100%;
                height:429px;
            }
        }
    }
    </style>