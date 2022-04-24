<script lang="ts" setup>
import { ref, reactive } from "vue";
import http from "../../api/index";
import { useRouter } from "vue-router";
import { IBusinessResp } from "src/typings/fetch";
import extStorage from "src/utils/extStorage";

const { lStorage } = extStorage;

const router = useRouter();

const formState = reactive({
  username: "",
  password: "",
});
const submitLoading = ref(false);
const login = () => {
  submitLoading.value = true;
  http.common
    .login({
      param: { username: formState.username, password: formState.password },
    })
    .then((res: IBusinessResp | null) => {
      lStorage.set("role", res!.data.role);
      lStorage.set("uid", res!.data.uid);
      lStorage.set("username", res!.data.username);
      if (res!.data.role === 2) {
        router.push("/admin");
      } else if (res!.data.role === 3) {
        router.push("/teacher");
      } else if (res!.data.role === 4) {
        router.push("/student");
      }
      submitLoading.value = false;
    })
    .catch((res) => {
      submitLoading.value = false;
    });
};
</script>
<template>
  <div class="container">
    <div class="login-box">
      <div class="logo">
        <h1>XinChuang</h1>
      </div>
      <div class="form">
        <a-form
          :model="formState"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-form-item label="用户名">
            <a-input v-model:value="formState.username" @keyup.enter="login" />
          </a-form-item>
          <a-form-item label="密码">
            <a-input-password
              v-model:value="formState.password"
              @keyup.enter="login"
            />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="login" :loading="submitLoading"
              >登录</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box {
    width: 500px;
    min-height: 300px;
    border-radius: 5px;
    box-shadow: 0px 2px 8px #000;
    padding: 15px;
    .logo {
      text-align: center;
      h1 {
        margin: 10px 0;
      }
    }
    .form {
      width: 100%;
    }
  }
}
</style>
