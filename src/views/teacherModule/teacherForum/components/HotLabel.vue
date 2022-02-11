<template>
  <div class="hot-label">
    <div class="components-title">热门标签</div>
    <div class="label-list">
      <span class="list" v-for="list in labelList" :key="list.id">{{
        list.name
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  watch,
  toRefs,
} from "vue";
export default defineComponent({
  name: "HotLabel",
  setup: (props, { emit }) => {
    let labelList = reactive([
      { id: 1, name: "Bootstrap" },
      { id: 2, name: "C++基础" },
      { id: 3, name: "Java" },
      { id: 4, name: "大学计算机基础" },
    ]);
    return {
      labelList,
    };
  },
});
</script>

<style scoped lang="less">
.hot-label {
  margin-top: 40px;
  .label-list {
    .list {
      display: inline-block;
      height: 24px;
      line-height: 24px;
      padding: 0 23px;
      margin-top: 16px;
      margin-right: 16px;
      border: 1px solid var(--lightgray-6);
      border-radius: 12px;
      color: var(--orangeyellow-6);
      letter-spacing: 0.34px;
    }
  }
}
</style>
