<template>
  <div class="experimental-guide-tab">
    <h2 class="guide-title">实训概述</h2>
    <div v-html="html">

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
  setup() {
    const html=`<div>
      <h2>一、项目背景</h2>
      <p>展低花很不发经次效如下加龙光从示内合各六治作那行行花自物段飞改部然机老想教动积张存小收从查运心出阶五许领响易示者些圆济种关步。果取少把电飞六说存米等百志千们标它候较具支相类四和问特界权民型精代回反度队全再使小路始委传先。育没风属京传能总去类动办取却准少接其实治义持安年调小斗子低至般九部不教几国科布由极作精但术候几选类易每适运在张。先消西府导上与军说老正五热况毛压般参飞看但候备油选热部表基去大就展响再算统对指金须好位决展取影离持单儿通天米济系速极包历任交业政。问般家手得反解群持分年上这美这九元六基共族口还快争精满收生总满而团低属同大也计必验志影厂克指法快资写人史较王没生值况接三。增声多整称深验科眼也选六带每众进矿存所单现保平亲去数中记记带次只地难子定界。</p>
    </div>`
    return {html}
  },
})
</script>

<style lang="less">
.experimental-guide-tab {
    padding: 16px 25px;
    white-space: break-spaces;
  .guide-title {
    font-size: 20px;
    color: #050101;
    font-weight: 700;
  }
}
</style>