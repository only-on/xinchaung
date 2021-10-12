<template>
  <div class="train-coursewar">
    <iframe class="train-coursewar-pdf" :src="pdfUrl" frameborder="0"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const pdfUrl = ref("");
    pdfUrl.value = "/public/pdfjs-2.5.207/web/viewer.html?file=''";
    return {
      pdfUrl,
    };
  },
});
</script>

<style lang="less">
.train-coursewar {
  width: 100%;
  height: 100%;
  .train-coursewar-pdf {
    width: 100%;
    height: 100%;
  }
}
</style>