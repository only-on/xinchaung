<template>
  <div class="labelList flexCenter">
    <div
      class="item flexCenter"
      :class="k !== list.length - 1 ? 'margin-right' : ''"
      v-for="(v, k) in list"
      :key="v"
    >
      <span class="name single-ellipsis">{{ v.name ? v.name : v.text }}</span>
      <span class="iconfont icon-guanbi" @click="remove(v, k)"></span>
    </div>
  </div>
</template>
<script lang="ts" setup>
// labelList

import { computed } from "vue";

// 采用ts专有声明，有默认值
interface Props {
  labels: any[]; //  数组对象或者 纯  string[]   都行
}
const props = withDefaults(defineProps<Props>(), {
  labels: () => [],
});
const emit = defineEmits<{
  (e: "remove", val: any, k: number): void;
}>();
const remove = (val: any, k: number) => {
  let arr = Object.keys(val);
  if (arr.length === 1) {
    emit("remove", val.name, k);
  } else {
    emit("remove", val, k);
  }
};
var list: any = computed(() => {
  var arr: any = [];
  props.labels.length
    ? props.labels.forEach((val: any) => {
        typeof val === "object" ? arr.push(val) : arr.push({ name: val });
      })
    : "";
  return arr;
});
</script>
<style scoped lang="less">
.labelList {
  .item {
    height: 24px;
    background: #fbfbfb;
    border: 1px solid #e1e1e1;
    border-radius: 13px;
    padding: 0 6px;
    .iconfont {
      color: var(--black);
      cursor: pointer;
      font-size: 12px;
      padding: 0px 6px;
    }
    .name {
      font-size: 12px;
      color: var(--black-85);
      padding: 0px 6px;
    }
  }
  .margin-right {
    margin-right: 10px;
  }
}
</style>
