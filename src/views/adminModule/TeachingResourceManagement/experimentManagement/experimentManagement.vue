<template>
  <div class="experimentManage">
    <div class="statistic">
      <div id="experStatistic"></div>
      <div id="experType"></div>
      <div id="KnowledgePoints"></div>
    </div>
    <div class="tabsTable">
      <a-tabs v-model:activeKey="activeKey" @change='change'>
        <a-tab-pane key="1" tab="实验管理"></a-tab-pane>
        <a-tab-pane key="2" tab="实验报告模版管理"></a-tab-pane>
      </a-tabs>
      <div v-if="activeKey==1">
        <experManage :data='tableData'></experManage>
      </div>
      <div v-else>
        <experTemplateManage :data='tableData'></experTemplateManage>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted,inject,reactive} from "vue";
import experManage from './experManage/index.vue'
import experTemplateManage from './experTemplateManage/index.vue'
import {HotWords,echartsPie,echartsBar} from './echartsOption';
const colorList = ['#fe9956', ' #fed755', '#32d0db', '#708cf3']
import request from "src/api/index";
const http = (request as any).TeachingResourceManagement;
var updata = inject("updataNav") as Function;
    updata({
      tabs: [
        { name: "实验管理", componenttype: 0 }
      ],
      showContent: true,
      componenttype: undefined,
      showNav:true,
    });
const activeKey:any=ref('1')
const data:any=ref([])
const tableData=ref([])
const experParams:any=reactive({
  search:{
    contentName:'',  //实验名称
    contentAttribute:'',//实验属性(公开1 私有0, 所有'')
    contentType:''
  },
  page:1,
  limit:10
})
const experTemplateParams:any=reactive({
  search:{
    contentName:'',  //实验名称
    contentAttribute:'',//实验属性(公开1 私有0, 所有'')
    contentType:''
  },
  page:1,
  limit:10
})
const echartsData:any=reactive({
  hotLabelList:[],
  statistic:{
    publicContentsCount:'',
    privateContentsCount:''

  },
  experType:{
    names:[],
    numbers:[]
  }
})
const experTypes:any=ref([])
function experData(){
  // http.experList({param:experParams}).then((res:any)=>{
    // console.log(res)
    // tableData.value=res.data.list
    // echartsData.hotLabelList=res.data.analysis.technicalDirection
    echartsData.hotLabelList=[
                {
                    "id": 1,
                    "name": "词云1",
                    "count": 70
                },
                {
                    "id": 2,
                    "name": "词云2",
                    "count": 130
                },
                {
                    "id": 3,
                    "name": "词云3",
                    "count": 60
                },
                {
                    "id": 4,
                    "name": "词云4",
                    "count": 210
                },
                {
                    "id": 5,
                    "name": "词云5",
                    "count": 45
                }
            ]
    HotWords('KnowledgePoints',doHotData(echartsData.hotLabelList))
    // echartsData.statistic.publicContentsCount=res.data.analysis.publicContentsCount
    echartsData.statistic.publicContentsCount=80
    // echartsData.statistic.privateContentsCount=res.data.analysis.privateContentsCount
    echartsData.statistic.privateContentsCount=102
    // echartsData.experType=res.data.contentsCountWithType
    experTypes.value=[
                [
                    "视频实验",
                    '103'
                ],
                [
                    "桌面实验",
                    115
                ],
                [
                    "文档实验",
                    220
                ],
                [
                    "任务制实验",
                    146
                ],
                [
                    "命令行实验",
                    174
                ],
                [
                    "IDE实验",
                    153
                ],
                [
                    "Jupyter实验",
                    90
                ]
            ],
    experTypes.value.forEach((item:any)=> {
      echartsData.experType.names.push(item[0])
      echartsData.experType.numbers.push(item[1]) 
    });
    echartsPie('experStatistic',echartsData.statistic)
    echartsBar('experType',echartsData.experType)
  // })
}
function doHotData(data1:any){
  let i = 0
      const total = data1.reduce((pre: any, cur: any) => {
        return pre+cur.count
      }, 0)
      data1.forEach((v: any, k: number) => {
        if (i % 4 === 0) {
          i = 0
        }
      data.value.push({
          "name": v.name ? v.name : v.id,
          "value": v.count,
          "symbolSize": Math.ceil(v.count/total*300),
          "draggable": true,
          "itemStyle": {
            "normal": {
              // "shadowBlur": 100,
              // "shadowColor": colorList[0],
              "color": colorList[i]
            }
          }
        })
        i++
    })
  return data.value
}
function experTemplateData(){
  http.experTemplateList({param:experTemplateParams}).then((res:any)=>{
    console.log(res)
    tableData.value=res.data.list
  })
}
function change(key:any){
    console.log(key)
    activeKey.value=key
    key==1?experData():experTemplateData()
}
onMounted(()=>{
  experData()
  // const hotLabelList:any=[
  //       {id: 92, name: "不上班", count: 2},
  //       {id: 93, name: "想下班", count:0},
  //      {id: 94, name: "想暴富", count: 2},
  //       {id: 98, name: "2", count: 2},
  //       {id: 112, name: "test", count: 2},
  //       {id: 95, name: "哈哈哈啊", count: 1},
  //       {id: 96, name: "不靠谱", count: 1},
  //       {id: 97, name: "1", count: 1},
  //       {id: 102, name: "7", count: 1},
  //      {id: 103, name: "8", count: 1},
  //     ]
  //     let i = 0
  //     const total = hotLabelList.reduce((pre: any, cur: any) => {
  //       return pre+cur.count
  //     }, 0)
  //     hotLabelList.forEach((v: any, k: number) => {
  //       if (i % 4 === 0) {
  //         i = 0
  //       }
  //       data.value.push({
  //         "name": v.name ? v.name : v.id,
  //         "value": v.count,
  //         "symbolSize": Math.ceil(v.count/total*300),
  //         "draggable": true,
  //         "itemStyle": {
  //           "normal": {
  //             // "shadowBlur": 100,
  //             // "shadowColor": colorList[0],
  //             "color": colorList[i]
  //           }
  //         }
  //       })
  //       i++
  //     })
  // HotWords('KnowledgePoints',{})
  // echartsPie('experStatistic',{})
  // echartsBar('experType',{})
})
</script>

<style lang="less" scoped>
.experimentManage{
  width: 100%;
  height: 100%;
}
.statistic{
  width: 100%;
  height:220px;
  display: flex;
  justify-content: space-between;
}
#experStatistic{
    width:285px;
    height:100%;
    background-color: var(--white);
    padding: 20px;
    border-radius: 10px;
  }
#experType{
  width:519px;
  height: 100%;
  background-color: var(--white);
  padding: 20px;
  border-radius: 10px;
}
#KnowledgePoints{
  width:356px;
  height:100%;
  background-color: var(--white);
  padding: 20px;
  border-radius: 10px;
}
.tabsTable{
  background-color: var(--white);
  margin-top: 20px;
}
</style>