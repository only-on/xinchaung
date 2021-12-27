<template>
  <div class="footer-box">
    <div class="box">
      临时menu：<router-link to="/exam/list">考试管理</router-link>
      <router-link to="/vm/ace">ace</router-link>
      <router-link to="/vm/vnc">vnc</router-link>
      <router-link to="/vm/test">测试连接虚拟机</router-link>
      <router-link to="/dev/login">登录</router-link>
    </div>
  </div>
</template>

<style lang="less">
.footer-box {
  flex-shrink: 0;
  text-align: center;
  background: #fff;
  height: 22px;
  a {
    margin-left: 15px;
  }
  .box{
    height: 100%;
  }
}
</style>