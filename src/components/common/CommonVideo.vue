<script lang="tsx">
import { defineComponent, ref, onMounted } from "@vue/runtime-core";
import videoCover from "src/assets/images/common/videoCover.jpg";
import imageVideoNotFound from "src/assets/images/common/video-not-found.jpg";
export default defineComponent({
  name: "CommonVideo",
  props: {
    src: {
      type: String,
      default: "",
    },
  },
  setup() {
    const videoRef = ref(null);
    const cover = ref(videoCover);
    onMounted(() => {
      (videoRef.value! as HTMLVideoElement).addEventListener("error", (ev) => {
        cover.value = imageVideoNotFound;
        (videoRef.value! as HTMLVideoElement).controls = false;
      });
    });

    return {
      videoRef,
      cover,
    };
  },
  render() {
    return (
      <video
        webkit-playsinline="true"
        playsinline="true"
        x-webkit-airplay="allow"
        x5-playsinline
        ref="videoRef"
        poster={this.cover}
        {...this.$props}
        {...this.$attrs}
      >
        {this.$slots.default
          ? this.$slots.default()
          : "您的浏览器不支持 video 标签"}
      </video>
    );
  },
});
</script>
