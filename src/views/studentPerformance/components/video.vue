<template>
  <div>
    <video
      :src="videoUrl"
      :controls="true"
      class="video-js vjs-big-play-centered vjs-fluid"
      webkit-playsinline="true"
      playsinline="true"
      x-webkit-airplay="allow"
      x5-playsinline
      style="width: 100%; height: 600px"
      :autoplay="true"
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
      videoUrl: "",
    });
    return { ...toRefs(state) };
  },
});
</script>
