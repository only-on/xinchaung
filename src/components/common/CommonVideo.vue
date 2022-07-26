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
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#events
      (videoRef.value! as HTMLVideoElement).addEventListener("error", (ev) => {
        // 视频加载遇到错误，默认视频文件不存在
        cover.value = imageVideoNotFound;
        if (videoRef.value) {
          (videoRef.value! as HTMLVideoElement).controls = false;
        }
        console.log("[CommonVideo] error", videoRef.value);
      });

      (videoRef.value! as HTMLVideoElement).addEventListener(
        "loadedmetadata",
        (ev) => {
          // 视频元数据加载成功，说明视频文件能找到，元数据包括：时长、尺寸、音轨等
          cover.value = videoCover;
          if (videoRef.value) {
            (videoRef.value! as HTMLVideoElement).controls = true;
          }
          console.log("[CommonVideo] loadedmetadata", videoRef.value);
        }
      );
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
