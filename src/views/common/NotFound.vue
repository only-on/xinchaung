<template>
  <!-- <h3>404，您无权访问或者页面不存在，请检查访问链接是否正确。</h3> -->
  <div class="NotFound flexCenter">
    <div class="flexCenter">
      <img :src="NotFoundPng" alt="">
    </div>
    <div class="tips">您无权访问或者页面不存在，请检查访问链接是否正确！</div>
  </div>
</template>
<script lang="ts" setup>
// import 404 from 'src/'
import NotFoundPng from "src/assets/images/common/404.png";
import { defineComponent } from "vue";
// export default defineComponent({
//   name: "NotFound",
// });
</script>
<style lang="less" scoped>
.NotFound{
  margin-top: 140px;
  flex-direction: column;
  .tips{
    margin-top: 2rem;
    text-align: center;
    color: var(--black-65);
  }
}
</style>