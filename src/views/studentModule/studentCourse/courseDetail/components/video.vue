<template>
  <div class="content">
    <common-video
      :src="videoUrl"
      controls="true"
      width="950"
    ></common-video>
  </div>
</template>
<script lang="ts">
import videoCover from 'src/assets/images/common/videoCover.jpg'
import { defineComponent, reactive, toRefs, watch } from "vue";
import CommonVideo from "../../../../../components/common/CommonVideo.vue";

interface Istate {
  videoUrl: string;
}
export default defineComponent({
  name: "video1",
  components: {CommonVideo},
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
    return { ...toRefs(state),videoCover };
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
