<template>
  <textarea v-model="message" cols="200" rows="100"></textarea>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Wmc from "js-wm";
export default defineComponent({
  name: "Webmsg",
  setup() {
    const message = ref("");
    onMounted(() => {
      const wmc = Wmc({
        url: `ws://${document.location.host}/ws?uid=abc&attach=abc`,
        close: function (evt) {
          message.value += "\nConnection closed.";
        },
        message: function (evt, data) {
          message.value += `\ngot message: ${data}`;
        },
      });
    });
    return {
      message,
    };
  },
});
</script>
