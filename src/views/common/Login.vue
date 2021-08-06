<template>
  <h3>登录页</h3>
</template>
<script lang="ts">
import { ref, defineComponent } from "vue";
export default defineComponent({
  name: "Layout",
  setup: () => {
    const count = ref(0);
    return { count };
  },
});
</script>