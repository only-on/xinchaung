<template>
  <div class="classical__disk-usage">
    <div class="classical__disk-usage--desc">
      <div>磁盘使用</div>
      <div>93GB可用（共99GB）</div>
    </div>
    <div class="classical__disk-usage--progress">
      <a-progress :percent="progress" :show-info="false" status="success"/>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "DiskUsage",
  setup() {
    const progress = ref(((6 / 99) * 100).toFixed(2));
    return {
        progress
    }
  },
});
</script>
<style lang="less">
.classical__disk-usage--desc {
    display: flex;
    justify-content: space-between;
}
</style>
