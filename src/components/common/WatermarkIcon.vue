<template>
  <div class="wmi__container" :style="style">
    <span class="wmi__icon iconfont" :class="'icon-' + icon" />
    <span class="wmi__title">{{ title }}</span>
    <span class="wmi__description">{{ description }}</span>
    <span class="watermark iconfont" :class="'icon-' + icon" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "WatermarkIcon",
  props: {
    icon: {
      type: String,
      default: "fuzhi",
    },
    title: {
      type: String,
      default: "水印图标",
    },
    description: {
      type: String,
      default: "描述信息",
    },
    style: {
      type: Object,
      default: { backgroundColor: "#8955b5" },
    },
  },
});
</script>

<style lang="less" scoped>
.wmi__container {
  width: 160px;
  height: 115px;
  padding: var(--padding-xs);
  color: #fff;
  position: relative;
  border-radius: var(--border-radius-default);
  display: inline-block;
  letter-spacing: 1px;
  overflow: hidden;
  text-overflow: ellipsis;

  .wmi__icon {
    font-size: 30px;
    color: #fff;
    opacity: 0.8;
  }

  .wmi__title {
    display: block;
    font-size: 22px;
  }

  .wmi__description {
    opacity: 0.7;
    white-space: nowrap;
  }

  .watermark {
    position: absolute;
    right: var(--padding-sm);
    bottom: var(--padding-sm);
    font-size: 75px;
    opacity: 0.2;
    height: 80px;
    line-height: 80px;
  }
}
</style>
