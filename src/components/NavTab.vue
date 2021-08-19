<template>
  <div class="navList">
    <div class="tab">
      <div
        v-for="v in tabs"
        :key="v.name"
        :class="activeName === v.name ? 'active' : ''"
        @click="activeName !== v.name ? tabChange(v) : ''"
      >
        {{ v.name }}
      </div>
    </div>
    <div class="nav__tab--middle">
      <slot></slot>
    </div>
    <breadcrumb />
  </div>
</template>

<script lang="ts">
import { number } from "echarts";
import { defineComponent, ref, onMounted, reactive, Ref, watch } from "vue";
import { useStore } from "vuex";

export declare interface ITab {
  name: string;
  componenttype: number;
}

export default defineComponent({
  name: "NavTab",
  props: {
    tabs: {
      required: true,
      type: Array,
      default: () => [{ name: "未知模块", componenttype: 0 }],
    },
    current: {
      required: false,
      type: Number,
      default: 0,
    },
  },
  emits: ["tabSwitch"],
  setup: (props, context) => {
    const tabs = reactive(props.tabs) as ITab[];
    const activeName: Ref<string> = ref("");
    const currentTab: Ref<number> = ref(props.current);
    function tabChange(item: ITab) {
      context.emit("tabSwitch", item);
      activeName.value = item.name;
    }
    onMounted(() => {
      activeName.value = tabs[currentTab.value].name;
    });
    watch(props, () => {
      activeName.value = tabs[props.current].name;
    });
    return { tabs, activeName, tabChange };
  },
});
</script>

<style scoped lang="less">
.navList {
  width: 1330px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #d0d0d0;
  line-height: 43px;
  .tab {
    display: flex;
    div {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      margin-right: 15px;
      color: #444;
      font-size: 16px;
      padding: 0 15px;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: #999;
      }
    }
    .active {
      background: @primary-color;
      color: #fff;
      &:hover {
        color: #fff;
      }
    }
  }
  .nav__tab--middle {
    flex: 1;
    display: flex;
    align-items: center;
  }
}
</style>
