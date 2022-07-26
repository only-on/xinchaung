<template>
  <div class="vncloading">
    <div class="word">
      <div class="loading">
        <img :src="loadingGif" alt="" srcset="" />
        <span>虚拟机加载中，请稍后...</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import loadingGif from "src/assets/images/vmloading.gif";
</script>

<style lang="less" scoped>
.vncloading {
  position: relative;
  height: 100%;
  text-align: center;
  background: radial-gradient(#010b24, #010b24);
  .word {
    width: 100%;
    height: 100%;
    bottom: 0;
    color: #fff;
    left: 0;
    margin: auto;
    right: 0;
    position: absolute;
    // text-shadow: 0 0 10px rgba(117, 121, 224, 0.5),
    //   0 0 5px rgba(117, 121, 224, 0.5);
    // top: 50%;
    // transform: translateY(-50%);
    background-color: var(--black-2);
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      img {
        margin-right: 8px;
      }
    }
  }
  color: var(--white-100);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
