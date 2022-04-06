<template>
  <div class="simple-tree-wrap">
    <div @click="select('sc')">实操类实验</div>
    <div @click="select('wd')">文档视频类实验</div>
    <div @click="select('xt')">习题类</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref,defineEmits } from "vue";

// 初始数据
const emit=defineEmits(['select'])
function select(type:'sc'|'wd'|'xt') {
  emit('select',type)
}
</script>

<style lang="less" scoped>
.simple-tree-wrap{
  div{
    cursor: pointer;
  }
}
</style>
