<template>
  <!-- <router-view  name="outward" /> -->
  <div class="row">
    <div style="logo">人工智能教学系统</div>
    <div class="nav">
      <router-link to="/Experimental/index" tag="span">实验1</router-link>
      <router-link to="/Course/index" tag="span">课程</router-link>
    </div>
  </div>
  <div>
    <router-view />
  </div>
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
<style scoped lang="scss">
  .row,.nav{
    display: flex;
  }
  .row{
    padding: 3em 0;
  }
  .logo{
    padding: 0 2em;
  }
  .nav{
    padding: 0 2em;
    span{
      font-size: 18px;
      padding: 0 2em;
    }
  }
</style>