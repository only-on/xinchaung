<template>
  <div class="content">
    <video
      :src="videoUrl"
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
import { defineComponent, reactive, toRefs, watch } from "vue";
interface Istate {
  videoUrl: string;
}
export default defineComponent({
  name: "video1",
  props: ["detailInfo"],
  setup: (props, context) => {
    const state: Istate = reactive({
      videoUrl: "",
    });
    watch(
      () => props.detailInfo,
      () => {
        console.log(props.detailInfo,'props.detailInfo')
        let development = process.env.NODE_ENV == "development" ? true : false;
        let baseurl = development ? "http://localhost:3000/proxyPrefix" : "";
        state.videoUrl = baseurl + props.detailInfo;
      },
      { immediate: true, deep: true }
    );
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
