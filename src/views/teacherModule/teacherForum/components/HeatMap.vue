<template>
  <div class="heat-map">
    <div class="components_title">热力图</div>
    <div class="map-content">
      <div :id="props.id" style="width: 300px;height: 300px"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  watch,
  toRefs,
  nextTick,
} from "vue";
import { ILabelList } from "./../forumnTyping.d";
import * as echarts from "echarts";
const props = withDefaults(defineProps<{id?: string}>(), {
  id: 'd3-echarts',
});
let hotLabelList: ILabelList[] = inject('hotLabelList') as any
let myChart: any = null
const colorList = ['#fe9956', ' #fed755', '#32d0db', '#708cf3']
const option = {
  // 图表标题
  title: {
    show:false,//显示策略，默认值true,可选为：true（显示） | false（隐藏）
    text: '',//主标题文本，'\n'指定换行
    x: 'center',        // 水平安放位置，默认为左对齐，可选为：
                      // 'center' ¦ 'left' ¦ 'right'
                      // ¦ {number}（x坐标，单位px）
    y: 'bottom',             // 垂直安放位置，默认为全图顶端，可选为：
                      // 'top' ¦ 'bottom' ¦ 'center'
                      // ¦ {number}（y坐标，单位px）
    //textAlign: null          // 水平对齐方式，默认根据x设置自动调整
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: '#ccc',    // 标题边框颜色
    borderWidth: 0,         // 标题边框线宽，单位px，默认为0（无边框）
    padding: 5,             // 标题内边距，单位px，默认各方向内边距为5，
                            // 接受数组分别设定上右下左边距，同css
    itemGap: 10,            // 主副标题纵向间隔，单位px，默认为10，
    textStyle: {
      fontSize: 18,
      fontWeight: 'bolder',
      color: '#333'        // 主标题文字颜色
    },
    subtextStyle: {
      color: '#aaa'        // 副标题文字颜色
    }
  },
  backgroundColor: '#fff',
  tooltip: {},
  // animationDurationUpdate: function(idx) {
      // 越往后的数据延迟越大
      //  return idx * 100;
  // },
  // animationEasingUpdate: 'bounceIn',
  color: ['#fff', '#fff', '#fff'],
  series: [{
    type: 'graph',
    layout: 'force',
    force: {
      repulsion: 100,
      edgeLength: 10
    },
    roam: true,
    label: {
      show: true,
      formatter: (params: any) => {
        return params.name+'\n'+params.value
      }
    },
    data: [{
      "name": "新冠肺炎愈后一般6个月内不会再得",
      "value": 2373,
      "symbolSize": 48,
      "draggable": true,
      "itemStyle": {
        // "normal": {
          "shadowBlur": 100,
          "shadowColor": colorList[0],
          "color": colorList[0]
        // }
      }
    }]
  }]
}
onMounted(() => {
  myChart = (echarts as any).init(document.getElementById(props.id))
  const data: any[] = []
  let i = 0
  setTimeout(() => {
    const total = hotLabelList.reduce((pre: any, cur: any) => {
      return pre+cur.count
    }, 0)
    hotLabelList.forEach((v: any, k: number) => {
      if ((i) % 4 === 0) {
        i = 0
      }
      data.push({
        "name": v.name ? v.name : v.id,
        "value": v.count,
        "symbolSize": Math.ceil(v.count/total*500),
        "draggable": true,
        "itemStyle": {
          // "normal": {
            // "shadowBlur": 100,
            // "shadowColor": colorList[0],
            "color": colorList[i]
          // }
        }
      })
      i++
    })
    option.series[0].data = data
    Echart()
  }, 400)
})
const Echart = () => {
  myChart.setOption(option);
}
</script>

<style scoped lang="less">
.heat-map {
  margin-top: 40px;
  .map-content {
    height: 300px;
    // background-color: var(--primary-3);
    margin-top: 16px;
    border-radius: 50%;
  }
}
</style>
