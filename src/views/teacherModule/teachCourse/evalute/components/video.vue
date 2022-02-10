<template>
  <video
    :src="videoUrl"
    :controls="true"
    class="video-js vjs-big-play-centered vjs-fluid"
    webkit-playsinline="true"
    playsinline="true"
    x-webkit-airplay="allow"
    x5-playsinline
    style="width: 100%;height: 600px;"
    :autoplay="true"
    ref="video">
  </video>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: ['videoUrl'],
  setup(props) {
    const videoUrl = ref<string>(props.videoUrl)
    return {
      videoUrl
    }
  },
})
</script>
