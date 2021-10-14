<template>
  <div class="classical__disk-usage">
    <div class="classical__disk-usage--desc">
      <div>磁盘使用</div>
      <div>{{ available }}可用（共{{ total }}）</div>
    </div>
    <div class="classical__disk-usage--progress">
      <a-progress
          :percent="ratio"
          :show-info="false"
          strokeColor="#FF9A34"
          trailColor="#e8e8e8"
      />
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, ref, Ref} from "vue";

export default defineComponent({
  name: "DiskUsage",
  props: {
    available: {
      type: String,
      default: '0GB'
    },
    total: {
      type: String,
      default: '0GB'
    },
    ratio: {
      type: Number,
      default: 0
    }
  },
  setup() {
    const progress: Ref<number> = ref(parseFloat(((6 / 99) * 100).toFixed(2)));
    return {
      progress,
    };
  },
});
</script>
<style lang="less">
.classical__disk-usage {
  width: 370px;
  line-height: 16px;

  .classical__disk-usage--desc {
    display: flex;
    justify-content: space-between;
  }

  .classical__disk-usage--progress {
    line-height: 5px;

    .ant-progress {
      line-height: 8px;
    }
  }
}
</style>
