<script lang="ts" setup>
import {ref, reactive} from "vue";
import http from "../../api/index";
import {useRouter} from "vue-router";
import {IBusinessResp} from "src/typings/fetch";
import extStorage from "src/utils/extStorage";
import {UserOutlined, LockOutlined} from '@ant-design/icons-vue';

const {lStorage} = extStorage;

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
        param: {username: formState.username, password: formState.password},
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
            :label-col="{ span: 0 }"
            :wrapper-col="{ span: 24 }"
        >
          <a-form-item>
            <a-input class="login-input" placeholder="用户名" v-model:value="formState.username" @keyup.enter="login">
              <template #prefix>
                <user-outlined/>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input-password class="login-input"
                              placeholder="密码"
                              v-model:value="formState.password"
                              @keyup.enter="login"
            >
              <template #prefix>
                <lock-outlined/>
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
            <a-button type="primary" @click="login" :loading="submitLoading"
            >登录
            </a-button
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
    min-height: 300px;
    border-radius: 22px;
    box-shadow: 0px 2px 8px var(--primary-5);
    padding: 50px;

    .logo {
      text-align: center;

      h1 {
        margin: 10px 0;
      }
    }

    .form {
      width: 438px;
      .login-input {
        border-radius: 22px;
        &:focus {
          border-color: var(--primary-5);
          box-shadow: 0 0 2px var(--primary-5);
        }
        &:hover {
          border-color: var(--primary-5);
        }
        &.ant-input-affix-wrapper-focused {
          border-color: var(--primary-5);
          box-shadow: 0 0 2px var(--primary-5);
        }
      }
    }
  }
}
</style>
