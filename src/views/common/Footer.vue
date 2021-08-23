<template>
  <div class="footer-box">
    <div>
      临时menu：<router-link to="/exam/list">考试管理</router-link>
      <router-link to="/vm/ace">ace</router-link>
      <router-link to="/vm/vnc">vnc</router-link>
    </div>
  </div>
</template>

<style lang="scss">
.footer-box {
  flex-shrink: 0;
  text-align: center;
  background: #fff;
  a {
    margin-left: 15px;
  }
}
</style>