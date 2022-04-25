<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import http from "src/api";
import extStorage from "src/utils/extStorage";
import {
  UserOutlined,
  LockOutlined,
  PictureOutlined,
} from "@ant-design/icons-vue";
import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { UnwrapNestedRefs } from "@vue/reactivity/dist/reactivity";
import { IBusinessResp } from "../../typings/fetch";

const { lStorage } = extStorage;
const router = useRouter();

interface FormState {
  username: string;
  password: string;
  captcha: string | undefined;
}

const formState: UnwrapNestedRefs<FormState> = reactive({
  username: "",
  password: "",
  captcha: undefined,
});
const submitLoading = ref(false);
const year = new Date().getFullYear();
const needCaptcha = ref(false);
const captchaUrl = ref("");
const onlineUserInfo = ref("--/--");

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captcha: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur",
      asyncValidator: (rule: any, value: string) => {
        console.log("validating captcha...");
        return new Promise((resolve, reject) => {
          if (!needCaptcha.value) {
            resolve(true);
            return;
          }
          if (needCaptcha.value && value) {
            resolve(true);
            return;
          }
          reject("请输入验证码");
        });
      },
    },
  ],
};
const refForm = ref();

// 刷新验证码
const refreshCaptcha = () => {
  http.common
    .refreshCaptcha({ param: { refresh: 1, _: new Date().getTime() } })
    .then((res) => {
      captchaUrl.value = res!.data.url;
    })
    .catch((error) => {
      console.log("refresh captcha error: ", error);
    });
};

// 检查是否需要显示验证码
http.common.doesNeedCaptcha({}).then((res: IBusinessResp | null) => {
  needCaptcha.value = res!.data.need_verify;
  if (needCaptcha.value) {
    captchaUrl.value = "/api/yii/site/captcha?v=" + res!.data.v;
  }
});

// 获取在线用户数信息
http.common.onlineUserInfo({}).then((res: IBusinessResp | null) => {
  onlineUserInfo.value = res!.data.online_info;
});

const login = () => {
  refForm.value
    .validate()
    .then(() => {
      submitLoading.value = true;
      let param = {
        username: formState.username,
        password: formState.password,
      };
      if (needCaptcha.value) {
        param["verifyCode"] = formState.captcha;
      }
      http.common
        .login({
          param: param,
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
          console.error("login failed: ", res);
          if (res.data.need_verify) {
            needCaptcha.value = true;
          }
          submitLoading.value = false;
        });
    })
    .catch((error: ValidateErrorEntity<FormState>) => {
      console.error("login form error: ", error);
    });
};
</script>
<template>
  <div class="container">
    <div class="online-info">
      <span class="online-title">当前在线人数：</span>
      <span class="online-count">{{ onlineUserInfo }}</span>
    </div>
    <div class="main">
      <div class="banner">
        <h1>XinChuang Banner is here.</h1>
      </div>
      <div class="login-box">
        <div class="logo">
          <h1>XinChuang</h1>
        </div>
        <div class="form">
          <a-form
            ref="refForm"
            :model="formState"
            :rules="rules"
            :label-col="{ span: 0 }"
            :wrapper-col="{ span: 24 }"
          >
            <a-form-item name="username">
              <a-input
                class="login-input"
                placeholder="用户名"
                v-model:value="formState.username"
                @keyup.enter="login"
              >
                <template #prefix>
                  <user-outlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="password">
              <a-input-password
                class="login-input"
                placeholder="密码"
                v-model:value="formState.password"
                @keyup.enter="login"
              >
                <template #prefix>
                  <lock-outlined />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item name="captcha" v-show="needCaptcha">
              <a-input
                class="login-input captcha"
                placeholder="验证码"
                v-model:value="formState.captcha"
                @keyup.enter="login"
              >
                <template #prefix>
                  <picture-outlined />
                </template>
              </a-input>
              <img class="captcha" :src="captchaUrl" @click="refreshCaptcha" />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
              <a-button type="primary" @click="login" :loading="submitLoading"
                >登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
    <div class="footer">
      <p class="copyright">
        版权|北京西普阳光科技股份有限公司版权所有© {{ year }}
      </p>
    </div>
  </div>
</template>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative; 

  .online-info {
    position: absolute;
    top: 30px;
    right: 30px;
    color: var(--primary-5);
    .online-title {
      font-size: 20px;
    }
    .online-count {
      font-size: 40px;
    }
  }

  .main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .banner {
      width: 740px;
    }

    .login-box {
      background: #f7f7f7;
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
          height: 45px;

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

          &.captcha {
            width: 338px;
          }
        }
        img.captcha {
          height: 45px;
        }
      }
    }
  }

  .footer {
    .copyright {
      text-align: center;
    }
  }
}
</style>
