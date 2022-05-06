<template>
  <div class="experimentManage">
    <div class="statistic">
      <div id="experStatistic"></div>
      <div id="experType"></div>
      <div id="KnowledgePoints"></div>
    </div>
    <div class="tabsTable">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane :key="1" tab="实验管理"></a-tab-pane>
        <a-tab-pane :key="2" tab="实验报告模版管理" force-render></a-tab-pane>
      </a-tabs>
      <div v-if="activeKey==1">
        <experManage></experManage>
      </div>
      <div v-else>
        <experTemplateManage></experTemplateManage>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted,inject} from "vue";
import experManage from './experManage/index.vue'
import experTemplateManage from './experTemplateManage/index.vue'
import {HotWords,echartsPie,echartsBar} from './echartsOption';
const colorList = ['#fe9956', ' #fed755', '#32d0db', '#708cf3']

var updata = inject("updataNav") as Function;
    updata({
      tabs: [
        { name: "实验管理", componenttype: 0 }
      ],
      showContent: true,
      componenttype: undefined,
      showNav:true,
    });
const activeKey:any=ref(1)
const data:any=ref([])
onMounted(()=>{
  const hotLabelList:any=[
        {id: 92, name: "不上班", count: 2},
        {id: 93, name: "想下班", count:0},
       {id: 94, name: "想暴富", count: 2},
        {id: 98, name: "2", count: 2},
        {id: 112, name: "test", count: 2},
        {id: 95, name: "哈哈哈啊", count: 1},
        {id: 96, name: "不靠谱", count: 1},
        {id: 97, name: "1", count: 1},
        {id: 102, name: "7", count: 1},
       {id: 103, name: "8", count: 1},
      ]
      let i = 0
      const total = hotLabelList.reduce((pre: any, cur: any) => {
        return pre+cur.count
      }, 0)
      hotLabelList.forEach((v: any, k: number) => {
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
  HotWords('KnowledgePoints',data.value)
  echartsPie('experStatistic',{})
  echartsBar('experType',{})
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