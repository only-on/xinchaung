<template>
  <div class="port">
    <a-spin size="large" tip="请稍候..." />
    <!-- <p>请稍候...</p> -->
  </div>
</template>

<script lang="ts" setup>
import api from "src/api";
import { getHomePath } from "../../routers/common";
import { useRouter } from "vue-router";
const router = useRouter();

api.common
  .doesLoggedIn({ silent: true })
  .then((res: any) => {
    // res为null代表请求未执行，因为遇到了customState不是wait
    if (res) {
      router.replace(getHomePath(res.data.role));
    }
  })
  .catch((err:any) => {
    router.replace(getHomePath(9));
  });
</script>

<style lang="less" scoped>
.port {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    margin-top: var(--margin-md);
    color: var(--primary-6);
  }
}
</style>
