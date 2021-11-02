<script lang="tsx">
import { defineComponent, ref } from "@vue/runtime-core";
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
        poster="src/assets/images/common/video-cover.jpg"
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
