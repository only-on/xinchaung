<template>
  <div>
    创建排课
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, inject, reactive } from "vue";
import { message } from "ant-design-vue";

var updata = inject("updataNav") as Function;
updata({
  tabs: [
    {
      name: "环境管理",
    },
  ],
  showContent: false,
  componenttype: undefined,
  showNav: false,
});
</script>

<style lang="less" scoped>

</style>