<script lang="tsx">
import { defineComponent, ref } from "@vue/runtime-core";
// import videoCover from "src/assets/images/common/video-cover.jpg";
import videoCover from 'src/assets/images/common/videoCover.jpg'
export default defineComponent({
  name: "CommonVideo",
  setup() {
    const videoRef = ref(null);
    return {
      videoRef,
    };
  },
  render() {
    return (
      <video
        poster={videoCover}
        class="common-video video-js vjs-big-play-centered vjs-fluid"
        webkit-playsinline="true"
        playsinline="true"
        x-webkit-airplay="allow"
        x5-playsinline
        style="width: 100%;height: auto;"
        ref="videoRef"
        {...this.$props}
        {...this.$attrs}
      ></video>
    );
  },
});
</script>
