<template>
  <p>
    <a-tag :color="statusColor">
      {{ status }}
    </a-tag>
  </p>
  <p v-show="!finished">
    前往登录：
    <a href="http://192.168.101.150/site/login-port">
      http://192.168.101.150:85/site/login-port</a
    >
  </p>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, computed } from "vue";
export default defineComponent({
  name: "Layout",
  setup: () => {
    const count = ref(0);
    const status = ref("接驳登录信息中...");
    const finished = ref(false);

    // 获取查询参数
    function getQueryString(name: string): string {
      const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      const r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURI(r[2]);
      return "";
    }

    // 设置cookie
    function setCookie(cname: string, cvalue: string, exdays: number) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      const expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    const statusColor = computed(() => {
      return finished.value ? "green" : "orange";
    });

    onMounted(() => {
      const sessionName = "advanced-backend";
      const advancedBackend = getQueryString(sessionName);
      if (!advancedBackend) {
        return;
      }
      setCookie(sessionName, advancedBackend, 1);
      status.value = "接驳完成";
      finished.value = true;
    });

    return { count, status, finished, statusColor };
  },
});
</script>
<style lang="less" scoped>
.login__page {
  border: none;
  width: 100%;
  height: 100%;
}
</style>
