<template>
  <div class="hot-label">
    <div class="components_title">热门标签</div>
    <div class="label-list">
      <span v-for="list in hotLabelList" :key="list.id">
      <!-- <span class="list">{{list.name}}</span> -->
        <a-tooltip placement="top">
          <template #title v-if="list.name">
            <span class="list">{{list.name}}</span>
          </template>
          <span class="list pointer">{{list.name}}</span>
        </a-tooltip>
      </span>
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
import { ILabelList } from "./../forumnTyping.d";
export default defineComponent({
  name: "HotLabel",
  setup: (props, { emit }) => {
    let hotLabelList: ILabelList[] = inject('hotLabelList') as any
    return {
      hotLabelList
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
      max-width: 98px;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      margin-top: 16px;
      margin-right: 16px;
      border: 1px solid var(--lightgray-6);
      border-radius: 12px;
      color: var(--primary-color);
      letter-spacing: 0.34px;
      background-color: var(--white);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
