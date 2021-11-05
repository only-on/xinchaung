<template>
  <div class="custom-layout" id="main-box">
    <Header></Header>
    <div class="custom-main">
      <breadcrumb :type="false" />
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Header from "./Header.vue";
export default defineComponent({
  components: {
    Header,
  },
  setup() {},
});
</script>

<style lang="less">
.custom-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-position-y: 60px;
  .custom-main{
      width: 1330px;
      margin: 21px auto;
  }
  
  .header-box {
    flex-shrink: 0;
  }
  .header-right {
    flex-shrink: 0;
  }
}
</style>