<template>
  <div class="vm-nav">
    <ul class="vm-nav-list">
      <li
        class="vm-nav-item"
        :class="lastKey === item.key ? 'active' : ''"
        v-for="(item, index) in navData"
        :key="index.toString()"
        @click="open(item.key)"
      >
        <span class="iconfont" :class="item.icon"></span>
        <span class="nav-title">{{ item.name }}</span>
      </li>
    </ul>
  </div>
  <div class="lectContent" v-if="contentShow">
    <guide v-if="lastKey=='guide'"></guide>
    <note v-if="lastKey=='experimental-note'"></note>
    <report v-if="lastKey=='report'"></report>
    <questionsAndAnswers v-if="lastKey=='forum'"></questionsAndAnswers>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, watch, inject } from "vue";
import guide from "../component/guide/index.vue";
import note from "../component/note/index.vue"
import report from "../component/report/index.vue"
import questionsAndAnswers from "../component/questionsAndAnswers/index.vue"

const leftWidth: Ref<any> = inject("leftWidth", ref(70));
const rightWidth: Ref<any> = inject("rightWidth", ref(window.innerWidth - 70));
const navData = [
  { name: "指导", key: "guide", icon: "icon-zhidao" },
  { name: "笔记", key: "experimental-note", icon: "icon-biji" },
  { name: "报告", key: "report", icon: "icon-baogao" },
  { name: "问答", key: "forum", icon: "icon-wenda" },
];
const currentNavKey = ref("");
let lastKey=ref(navData[0].key)
const contentShow=ref(false)
watch(
  () => leftWidth,
  () => {
    console.log(leftWidth.value);
  },
  {
    deep: true,
  }
);

function open(key:string) {
    lastKey.value=key
    if (currentNavKey.value!=key) {
        contentShow.value=true
        if (leftWidth.value==70) {
            leftWidth.value=400
            rightWidth.value=window.innerWidth - leftWidth.value
            currentNavKey.value=key
        }else{
            
        }
        currentNavKey.value=key
        
    }else{
         contentShow.value=false
         leftWidth.value=70
         rightWidth.value=window.innerWidth - leftWidth.value
         currentNavKey.value=""
    }
}
</script>

<style lang="less" scoped>
.leftPanel{
    
    .vm-nav{
        height: 100%;
        flex-shrink: 0;
        width: 70px;
        background: #e2e2e2;
        
    }
    .vm-nav-list{
        text-align: center;
    }
    .vm-nav-item{
        line-height: 44px;
        cursor: pointer;
        &.active{
            color: #FF9544;
        }
    }
    .lectContent{
        flex: 1;
        word-spacing: normal;
        word-break: break-all;
        white-space:normal;
    }
}
</style>
