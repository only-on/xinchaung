<template>
  <watermark-icon />
  <watermark-icon icon="xuniji" title="虚拟机" description="4c16G512G" style="background-color: #37b7f7" />
  <watermark-icon icon="jiaoshi1" title="张老师" description="数学很厉害的大帅哥" style="background-color: #feba4a" />
  <watermark-icon icon="jiaoshi" title="教案" description="他的教案很长，有这么长，这么长，都放不下了" style="background-color: #f90e27" />
</template>

<script lang="ts">
import WatermarkIcon from "../common/WatermarkIcon.vue";
import {defineComponent} from "vue";
export default defineComponent({
  name: "Demo",
  components: {
    WatermarkIcon
  }
})
</script>
