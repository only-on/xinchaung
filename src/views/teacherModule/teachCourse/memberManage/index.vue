<template>
  <div id="memberManage">
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="学生"><student></student> </a-tab-pane>
      <a-tab-pane key="2" tab="分组"><group></group></a-tab-pane>
      <a-tab-pane key="3" tab="助教"><assistant></assistant> </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref } from "vue";
import student from "./student/index.vue";
import group from "./group/index.vue";
import assistant from "./assistant/index.vue";
function callback() {}
</script>

<style lang="less" scoped>
#memberManage {
  width: 100%;
  height: 714px;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 var(--black-0-7);
  background: var(--white-100);
  padding: 41px;
}
</style>
