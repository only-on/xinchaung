<template>
  <div class="exam-layout-bg">
    <div class="exam-layout">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    
    
  },
});
</script>


<style lang="less">
.exam-layout-bg {
  width: 100%;
  min-height: 100%;
  background: linear-gradient(var(--purplebule-3), var(--purpleblue-6));
  .exam-layout {
    width: 100%;
    height: 100%;
    background-image: url("../../assets/images/exam/start-exam.png");
    background-position: right bottom;
    background-repeat: no-repeat;
    padding: 50px 100px;
    min-width: 1330px;
  }
}
</style>