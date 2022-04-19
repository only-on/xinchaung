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
        <div v-if="roleArry.includes(item.key as any)">
          <span class="iconfont" :class="item.icon"></span>
          <span class="nav-title">{{ item.name }}</span>
        </div>
      </li>
    </ul>
  </div>
  <div class="leftContent" v-if="contentShow">
    <guide v-if="lastKey == 'guide'"></guide>
    <note v-if="lastKey == 'note'"></note>
    <report v-if="lastKey == 'report'"></report>
    <questionsAndAnswers v-if="lastKey == 'question'"></questionsAndAnswers>
    <create-post></create-post>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, watch, inject } from "vue";
import guide from "../component/guide/index.vue";
import note from "../component/note/index.vue";
import report from "../component/report/index.vue";
import questionsAndAnswers from "../component/questionsAndAnswers/index.vue";
import createPost from "src/views/shareModule/VirtualMachine/component/createPost.vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import getMenuRole, { menuTypeArr } from "../menuRole";
import storage from "src/utils/extStorage";

const route = useRoute();
const router = useRouter();

const { type, opType, taskId, topoinst_id, topoinst_uuid } = route.query;

let role = storage.lStorage.get("role");

const leftWidth: Ref<any> = inject("leftWidth", ref(70));
const rightWidth: Ref<any> = inject("rightWidth", ref(window.innerWidth - 70));
const navData = [
  { name: "指导", key: "guide", icon: "icon-zhidao" },
  { name: "笔记", key: "note", icon: "icon-biji" },
  { name: "报告", key: "report", icon: "icon-baogao" },
  { name: "问答", key: "question", icon: "icon-wenda" },
];
const currentNavKey = ref("");
let lastKey = ref(navData[0].key);
const contentShow = ref(false);
watch(
  () => leftWidth,
  () => {
    console.log(leftWidth.value);
  },
  {
    deep: true,
  }
);
const roleArry: menuTypeArr = ["recommend", "test"].includes(opType as any)
  ? (getMenuRole(role as any, "vnc", opType as any) as any)
  : (getMenuRole(role as any, "vnc") as any);
console.log(roleArry.includes("note"));

function open(key: string) {
  lastKey.value = key;
  if (currentNavKey.value != key) {
    contentShow.value = true;
    if (leftWidth.value == 70) {
      leftWidth.value = 400;
      rightWidth.value = window.innerWidth - leftWidth.value;
      currentNavKey.value = key;
    } else {
    }
    currentNavKey.value = key;
  } else {
    contentShow.value = false;
    leftWidth.value = 70;
    rightWidth.value = window.innerWidth - leftWidth.value;
    currentNavKey.value = "";
  }
}
</script>

<style lang="less" scoped>
.leftPanel {
  .vm-nav {
    height: 100%;
    flex-shrink: 0;
    width: 70px;
    background: #e2e2e2;
  }
  .vm-nav-list {
    text-align: center;
  }
  .vm-nav-item {
    line-height: 44px;
    cursor: pointer;
    &.active {
      background: var(--white-100);
      color: #ff9544;
    }
  }
  .leftContent {
    background: var(--white-100);
    flex: 1;
    word-spacing: normal;
    word-break: break-all;
    white-space: normal;
    position: relative;
  }
}
</style>
