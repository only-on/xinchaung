<template>
  <div class="echarts-bar">
    <div id="echartsBar" style="width: 100%;height: 100%;"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref } from 'vue'
import * as echarts from 'echarts'
import * as option from './barOption'
export default defineComponent({
  components: {},
  setup() {

    function drawEchartsBar() {
      let echartsBar = (echarts as any).init(document.getElementById("echartsBar"))
      echartsBar.setOption(option.barOption)
    }
    onMounted(() => {
      drawEchartsBar()
    })
    
    return {

    }
  }
})
</script>

<style lang="less" scoped>
  .echarts-bar {
    height: 380px;
    margin-top: 40px;
  }
</style>