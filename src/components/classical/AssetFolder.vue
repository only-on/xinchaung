<template>
  <div class="classical__asset-folder">
    <div class="classical__asset-main">
      <div class="classical__asset-title">title</div>
      <div class="classical__asset-detail">
          <ul>
              <li><span class="iconfont icon-shijian"></span>2021-07-12</li>
              <li><span class="iconfont icon-cunchuzhi"></span>10.2MB</li>
              <li><span class="iconfont icon-wenjian"></span>3个</li>
          </ul>
      </div>
    </div>
    <div class="classical__asset-right">
      <span class="iconfont icon-shanchu"></span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "AssetFolder",
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

  &:hover {
      box-shadow: @shadow-ring;
  }

  .classical__asset-title {
    font-size: @font-size-lg;
    color: @text-color;
  }

  .classical__asset-right {
    line-height: 53px;
  }

  .classical__asset-detail {
      ul {
          margin: 0;
          padding: 0;
          li {
              display: inline-block;
              margin-right: @margin-md;
          }
      }
  }
}
</style>
