<template>
  <div class="ai-icon-input-wrap">
    <i class="b-icon" :style="styles"></i>
    <slot name="default"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["icon"],
  setup(props) {
    const icon:any = props.icon;
    const styles:any={
      'background-image':'url('+icon+')'
    }
    return {
      styles,
    };
  },
});
</script>

<style lang="less" scoped>
.ai-icon-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  .b-icon {
    position: absolute;
    left: 10px;
    z-index: 1;
    font-style: normal;
    width: 14px;
    height: 14px;
    display: inline-block;
    background-size: 100%;
    background-repeat: no-repeat;
    // background-image: url('/src/assets/images/screenicon/Group9.png');
  }
  &:deep(.ant-select) {
    .ant-select-selector {
      padding-left: 28px;
    }
  }
  &:deep(.ant-input) {
      padding-left:28px;
    }
}
</style>
