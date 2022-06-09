<template>
  <div class="experimentManage">
    <div class="statistic">
      <!-- <div id="experStatistic"></div> -->
      <div id="experStatistic">
        <StatisticsPie :title="'实验统计'"  
        :data="[{ value:echartsData.statistic.privateContentsCount, name: '私有实验',color:'#03C8BF' }, { value:echartsData.statistic.publicContentsCount, name: '公开实验',color:'#9872EB' }]" />
      </div>
      <div id="experType"></div>
      <div id="directPoints"></div>
    </div>
    <div class="tabsTable">
     <a-tabs v-model:activeKey="activeKey" @change='callBack'>
        <a-tab-pane key="1" tab="实验管理">
          <experManage v-if="activeKey==1"   :total='tableData.total' :listdata='tableData.data' @updateData='updateData'></experManage>
        </a-tab-pane>
        <a-tab-pane key="2" tab="实验报告模版管理">
          <experTemplateManage v-if="activeKey==2"  :total='tableData.total' :listdata='tableData.data' @updateData='updateData'></experTemplateManage>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted,inject,reactive} from "vue";
import StatisticsPie from '../components/StatisticsPie.vue'
import experManage from './experManage/index.vue'
import experTemplateManage from './experTemplateManage/index.vue'
import {HotWords,echartsPie,echartsBar} from './echartsOption';
import request from "src/api/index";
import { resolve } from "path/posix";
const colorList = ['#fe9956', ' #fed755', '#32d0db', '#708cf3']
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
// const activeKey:any=ref()
const activeKey:any=ref('1')
const data:any=ref([])
const tableData=reactive({
  data:[],
  total:0
})
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
    templateName:'',
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
function daWithdata(res:any){
    echartsData.experType={
      names:[],
      numbers:[]
    }
    tableData.data=res.data.list
    tableData.total=res.data.page.totalCount
    echartsData.hotLabelList=[]
    echartsData.statistic.publicContentsCount=res.data.analysis.publicContentsCount
    echartsData.statistic.privateContentsCount=res.data.analysis.privateContentsCount
    res.data?.analysis?.contentsCountWithType.forEach((item:any)=> {
      echartsData.experType.names.push(item[0])
      echartsData.experType.numbers.push(item[1]) 
    });
    console.log(echartsData.experType)
    // echartsPie('experStatistic',echartsData.statistic)
    // echartsBar('experType',echartsData.experType)
    //技术方向
    // for (let i in res.data?.analysis?.technicalDirection) {
    //   echartsData.hotLabelList.push(res.data.analysis.technicalDirection[i])
    //   // echartsData.hotLabelList.push(i)
    // }
    console.log(Object.values(res.data.analysis.technicalDirection))
    echartsData.hotLabelList=Object.values(res.data.analysis.technicalDirection)
    // HotWords('directPoints',doHotData(echartsData.hotLabelList))
}
function updateData(val:any){
  console.log(val)
  if(activeKey.value==1){
    experParams.search.contentName=val?.name
    experParams.search.contentAttribute=val?.attribute
    experParams.search.contentType=val?.type
    experParams.page=val?.page
    experParams.limit=val?.pageSize
    experData()
  }else{
    experTemplateParams.search.templateName=val?.expername
    experTemplateParams.page=val?.page
    experTemplateParams.limit=val?.pageSize
    experTemplateData()
  }
}
const experTypes:any=ref([])
function experTemplateData(){
  console.log(experParams.search.templateName,'jjj')
  const param:any={
    'search[templateName]':experTemplateParams.search.templateName?experTemplateParams.search.templateName:'',
    page:experTemplateParams.page,
    limit:experTemplateParams.limit
  }
  http.experTemplateList({param:param}).then((res:any)=>{
    daWithdata(res)
  })
}
function experData(){
  const param:any={
    'search[contentName]':experParams.search.contentName?experParams.search.contentName:'',
    'search[contentAttribute]':experParams.search.contentAttribute?experParams.search.contentAttribute:'',
    'search[contentType]':experParams.search.contentType?experParams.search.contentType:'',
    page:experParams.page,
    limit:experParams.limit
  }
  http.experList({param:param}).then((res:any)=>{
    daWithdata(res)
  })
}
function doHotData(directData:any){
  const data: any[] = []
  let i = 0
  const total = directData.reduce((pre: any, cur: any) => {
      return pre+cur.count
    }, 0)
    directData.forEach((v: any, k: number) => {
      if ((i) % 4 === 0) {
        i = 0
      }
      data.push({
        "name": v.name ? v.name : v.id,
        "value": v.count,
        "symbolSize": Math.ceil(v.count/total*100),
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
    return data
}
function callBack(key:any){
  // console.log(key)
  experParams.search.contentName=''
    experParams.search.contentAttribute=''
    experParams.search.contentType=''
    experTemplateParams.search.templateName=''
    key==1?experData():experTemplateData()
}
onMounted(()=>{
  const param:any={
    'search[contentName]':'',
    'search[contentAttribute]':'',
    'search[contentType]':'',
    page:experParams.page,
    limit:experParams.limit
  }
  http.experList({param:param}).then((res:any)=>{
    echartsData.experType={
      names:[],
      numbers:[]
    }
    tableData.data=res.data.list
    tableData.total=res.data.page.totalCount
    echartsData.hotLabelList=[]
    echartsData.statistic.publicContentsCount=res.data.analysis.publicContentsCount
    echartsData.statistic.privateContentsCount=res.data.analysis.privateContentsCount
    res.data?.analysis?.contentsCountWithType.forEach((item:any)=> {
      echartsData.experType.names.push(item[0])
      echartsData.experType.numbers.push(item[1]) 
    });
    echartsBar('experType',echartsData.experType)
    echartsData.hotLabelList=Object.values(res.data.analysis.technicalDirection)
    HotWords('directPoints',doHotData(echartsData.hotLabelList))
  })
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
#directPoints{
  width:356px;
  height:100%;
  background-color: var(--white);
  padding: 20px;
  border-radius: 10px;
}
.tabsTable{
  background-color: var(--white);
  margin-top: 20px;
  padding: 20px;
  min-height:750px;
}
</style>