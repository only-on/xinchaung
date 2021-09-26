<template>
  <div class="classical__asset-folder" @click="handleClick">
    <div class="classical__asset-main">
      <div class="classical__asset-title">title</div>
    </div>
    <div class="classical__asset-right">
      <ul>
        <li><span class="iconfont icon-shijian"/><span class="classical__asset-item">2021-07-12</span></li>
        <li><span class="iconfont icon-cunchuzhi"/><span class="classical__asset-item">10.2MB</span></li>
        <li><span class="iconfont icon-wenjian"/><span class="classical__asset-item">3个</span></li>
        <li><span class="iconfont icon-shanchu"/></li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "AssetFolder",
  emits: ["click"],
  setup(props, {emit}) {
    const handleClick = function () {
      emit('click')
    }
    return {handleClick}
  }
});
</script>
<style lang="less">
.classical__asset-folder {
  border: 1px solid @normal-color;
  border-radius: @border-radius-card;
  padding: @padding-sm;
  display: flex;
  justify-content: space-between;
  // https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing
  // 相同块元素之间，在垂直方向上，其margin会叠加，css这样设计的意义在于避免产生双倍边距
  margin: @margin-md 0px;
  color: @text-color-secondary;
  cursor: pointer;

  &:hover {
    box-shadow: @shadow-ring;
  }

  .classical__asset-title {
    font-size: @font-size-lg;
    color: @text-color;
  }

  .classical__asset-right {
    ul {
      margin: 0;
      padding: 0;

      li {
        display: inline-block;
        margin-right: @margin-md;

        .classical__asset-item {
          margin-left: @margin-xss;
        }
      }
    }
  }
}
</style>
