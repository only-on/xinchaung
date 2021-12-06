<template>
  <div class="content">
    <video
      :src="detailInfo"
      :controls="true"
      webkit-playsinline="true"
      playsinline="true"
      x-webkit-airplay="allow"
      x5-playsinline
      width="950"
    ></video>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
interface Istate {
  videoUrl: string;
}
export default defineComponent({
  name: "CourseAchievement",
  props: ["detailInfo"],
  setup: (props, context) => {
    const state: Istate = reactive({
      // videoUrl:
      //   "localhost:3000/proxyPrefix" +
      //   "/trainvideo/453850030/ffmpeg14b542ae-566a-11ec-8350-ac1f6b3681fa.mp4",
      videoUrl:
        "http://192.168.101.130/trainvideo/453850030/ffmpeg14b542ae-566a-11ec-8350-ac1f6b3681fa.mp4",
    });
    return { ...toRefs(state) };
  },
});
</script>
<style lang="less" scoped>
.content {
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
}
</style>
