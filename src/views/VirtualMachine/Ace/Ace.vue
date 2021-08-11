<template>
  <layout :VmData="data">
    <template v-slot:header>
      <div><span @click="back">返回</span></div>
    </template>
    <template v-slot:right>right</template>
  </layout>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import layout from "../VmLayout/VmLayout.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    layout,
  },
  setup(props, { emit }) {
    const router = useRouter();
    let navData = [
      { name: "虚拟机", key: "vm", icon: "icon-xuniji" },
      { name: "实验指导", key: "guide", icon: "icon-zhidao" },
      { name: "实验习题", key: "exercises", icon: "icon-xiti1" },
      { name: "实验报告", key: "report", icon: "icon-baogao1" },
      { name: "随堂练习", key: "practice", icon: "icon-biji" },
      { name: "随堂论坛", key: "forum", icon: "icon-luntan1" },
    ];
    const data = reactive(navData);
    function back() {
      router.go(-1);
    }
    return { back, data };
  },
});
</script>
