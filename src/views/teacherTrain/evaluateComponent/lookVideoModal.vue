<template>
  <a-modal class="" 
    title="操作视频" 
    :footer="null" 
    :visible="isShowVideo" 
    @cancel="close()"
    :width="1000"
  >
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
      <!-- poster="/src/assets/images/bg1.jpg" 视频初始封面地址--> 
      <!-- @play="onPlayerPlay"
      @pause="onPlayerPause"
      @seeking="seeking" -->
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, onMounted, nextTick } from 'vue'

export default defineComponent({
  props: {
    isShowVideo: Boolean,
    videoUrl: String
  },
  emits: ['update:isShowVideo'],
  setup(props, {emit}) {
    const close = () => {
      emit('update:isShowVideo', false)
    }
    return {
      // ...toRefs(props),
      close,
    }
  },
})
</script>

<style lang="less" scoped>
.ant-modal-body {
  height: 750px;
}
</style>
