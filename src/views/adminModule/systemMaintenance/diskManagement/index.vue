<template>
    <div class="disManagement">
        <div class="manageTop">

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
    function drawEcharts(){
        document.getElementById('statiscEcharts')?.removeAttribute("_echarts_instance_");
        var chartDom:any=document.getElementById('statiscEcharts')
        var myChart = echarts.init(chartDom);
        option && myChart.setOption(option(chartdata.value));
    }
    onMounted(()=>{
        drawEcharts()
    })
    </script>
    <style lang="less" scoped>
    .disManagement{
        background-color:#fafafb;
    }
        .managementBottom{
            display: flex;
            justify-content: space-between;
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
                height:400px;
            }
        }
    </style>