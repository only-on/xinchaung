<script lang="ts" setup>
import {
  ExclamationCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import { Modal, message, Button } from "ant-design-vue";
import { reactive, ref, watch, createVNode, onMounted, h } from "vue";
import { useRouter, useRoute } from "vue-router";
// import http from "src/api";
import extStorage from "src/utils/extStorage";
import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { UnwrapNestedRefs } from "@vue/reactivity/dist/reactivity";
import { IBusinessResp } from "../../typings/fetch";
import request from "src/api/index";
import { getHomePath } from "../../routers/common";
import { PictureOutlined } from "@ant-design/icons-vue";
import { useStore } from "vuex";
import loginA from "src/assets/images/login/loginA.png";
import loginB from "src/assets/images/login/loginB.png";
import loginC from "src/assets/images/login/loginC.png";
const loginBg = {
  A: loginA,
  B: loginB,
  C: loginC,
};
const http = (request as any).common;
const { lStorage, sStorage } = extStorage;
const router = useRouter();
const route = useRoute();
const store = useStore();
const loginInfo = reactive<any>({
  src: "",
  logo: "",
  name: "",
  class: "",
});
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
  http
    .refreshCaptcha({ param: { refresh: 1, _: new Date().getTime() } })
    .then((res: any) => {
      captchaUrl.value = res!.data.url;
    })
    .catch((error: any) => {
      console.log("refresh captcha error: ", error);
    });
};

// 检查是否应该直接登入
const needCheckLoggedIn = route.query.s === undefined;
if (needCheckLoggedIn) {
  http
    .doesLoggedIn({ silent: true })
    .then((res: any) => {
      // res为null代表请求未执行，因为遇到了customState不是wait
      if (res) {
        router.push(getHomePath(res.data.role));
      }
    })
    .catch(() => {
      router.push(getHomePath(9));
    });
}

// 检查是否需要显示验证码
http.doesNeedCaptcha({}).then((res: IBusinessResp | null) => {
  needCaptcha.value = res!.data.need_verify;
  if (needCaptcha.value) {
    captchaUrl.value = "/api/yii/site/captcha?v=" + res!.data.v;
  }
});

// 获取在线用户数信息
http.onlineUserInfo({}).then((res: IBusinessResp | null) => {
  // const {site_setting}=res.data
  onlineUserInfo.value = res!.data.online_info;
  if (res!.data.site_setting) {
    store.commit("setSystemInfo", res!.data.site_setting);
  }
});
watch(
  () => {
    return store.state.systemInfo;
  },
  (newVal: any) => {
    loginInfo.src = loginBg[newVal.theme];
    loginInfo.logo = newVal.logo_url;
    loginInfo.name = newVal.site_name;
    loginInfo.class = "login" + newVal.theme;
  },
  { deep: true, immediate: true }
);
const login = (repeat?: boolean) => {
  message.destroy();
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
      if (repeat && repeat === true) {
        param["force_login"] = true;
      } else {
        param["force_login"] = false;
      }
      http
        .login({
          param: param,
          silent: silentFn,
        })
        .then((res: IBusinessResp | null) => {
          // againLogin()
          // return
          lStorage.set("role", res!.data.role);
          lStorage.set("uid", res!.data.uid);
          lStorage.set("username", res!.data.username);
          lStorage.set("portrait", res!.data.portrait);
          if (res!.data.role === 2) {
            router.replace("/admin");
          } else if (res!.data.role === 3) {
            router.replace("/teacher");
          } else if (res!.data.role === 4) {
            router.replace("/student");
          } else if (res!.data.role === 5) {
            router.replace("/teacher/teacherCourse");
            getTeacherInfo();
          }
          const menuActiveName = res!.data.role === 5 ? "教学过程" : "首页";
          store.commit("changemenuActiveName", menuActiveName);
          store.commit("saveTheme");
          submitLoading.value = false;
        })
        .catch((res: any) => {
          if (res.data.unique_confirm && res.data.unique_confirm === true) {
            againLogin();
            return;
          }
          if (res.data.need_verify) {
            needCaptcha.value = true;
            captchaUrl.value =
              "/api/yii/site/captcha?v=" + new Date().getTime();
          }
          submitLoading.value = false;
        })
        .finally(() => {
          submitLoading.value = false;
        });
    })
    .catch((error: ValidateErrorEntity<FormState>) => {
      console.error("login form error: ", error);
    });
};
function silentFn(res: IBusinessResp) {
  if (res.data.unique_confirm && res.data.unique_confirm === true) {
    return true;
  } else {
    return false;
  }
}
const againLogin = () => {
  submitLoading.value = false;
  Modal.confirm({
    title: "提示",
    icon: createVNode(ExclamationCircleOutlined),
    content: "该账号已在其他终端登录！是否使其下线？",
    okText: "登录",
    cancelText: "取消",
    onOk() {
      login(true);
    },
  });
};
// 获取教师信息接口
const getTeacherInfo = () => {
  http.getTeacherInfo().then((res: IBusinessResp | null) => {
    lStorage.set("tuid", res!.data?.user.id);
  });
};

onMounted(() => {
  const kickOutMsg = createVNode("span", {}, [
    "当前账号已在其他终端登录，您已被强制下线。",
    createVNode(
      Button,
      {
        type: "link",
        style: {
          padding: 0,
          height: "auto",
          lineHeight: "normal",
          borderRadius: "4px",
        },
        onClick: () => {
          message.destroy();
        },
      },
      () => createVNode(CloseOutlined)
    ),
  ]);
  if (store.state.kickedOut) {
    message.destroy();
    message.warn(kickOutMsg, 0);
    store.commit("kickOutReset");
  }
});
</script>
<template>
  <!-- :style="v.url?`background-image: url(${v.url});`:''"  loginInfo.class  -->
  <div :class="['container', loginInfo.class]">
    <div class="online-info">
      <span class="online-title">当前在线人数：</span>
      <span class="online-count">{{ onlineUserInfo }}</span>
    </div>
    <div class="main">
      <div class="banner">
        <img :src="loginInfo.src" />
      </div>
      <div class="login-box">
        <div class="logo">
          <div :style="`background-image: url(${loginInfo.logo});`"></div>
          <h1>欢迎登录{{ loginInfo.name }}</h1>
        </div>
        <div class="form">
          <a-form
            ref="refForm"
            :model="formState"
            :rules="rules"
            :label-col="{ span: 0 }"
            :wrapper-col="{ span: 24 }"
          >
            <a-form-item class="login-item" name="username">
              <a-input
                class="login-input"
                placeholder="请输入您的账号"
                v-model:value="formState.username"
                @keyup.enter="login"
              >
                <template #prefix>
                  <span class="iconfont icon-yonghuming1"></span>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item class="login-item" name="password">
              <a-input-password
                class="login-input"
                placeholder="请输入您的密码"
                v-model:value="formState.password"
                @keyup.enter="login"
              >
                <template #prefix>
                  <span class="iconfont icon-mima1"></span>
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item class="login-item" name="captcha" v-show="needCaptcha">
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
            <a-form-item
              class="login-item"
              :wrapper-col="{ span: 24, offset: 0 }"
            >
              <a-button
                class="login-button"
                type="primary"
                @click="login"
                :loading="submitLoading"
                >登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
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
  &.loginA {
    background: linear-gradient(135deg, #1f227d 0%, #141c65 39%, #00113b);
    .banner {
      width: 871px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .login-button {
      background: linear-gradient(
        90deg,
        #f5c05b,
        #faa94f 35%,
        #fd9a46 71%,
        #ff9544
      );
    }
  }
  &.loginB {
    background: url(src/assets/images/login/bgB.jpg) no-repeat center center;
    background-size: 100% 100%;
    .banner {
      width: 1064px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .login-button {
      background: linear-gradient(90deg, #04eacc, #04bbcc);
    }
  }
  &.loginC {
    background: linear-gradient(46deg, #ffd249 1%, #feb849 1%, #feed9a 100%);
    .banner {
      width: 1064px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .login-button {
      background: linear-gradient(90deg, #f16624, #ffb849 62%, #ffe749);
    }
  }

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
    justify-content: space-around;
    align-items: center;

    .banner {
      width: 871px;
      height: 100%;
    }

    .login-box {
      background: #f7f7f7;
      width: 540px;
      min-height: 300px;
      border-radius: 13px;
      box-shadow: 0 3.26px 11.42px 0 rgba(0, 0, 0, 0.14);
      padding: 50px;

      .logo {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        div {
          width: 70px;
          height: 74px;
          background-size: 100% 100%;
          background-position: center;
        }
      }

      .form {
        margin-top: 36px;
        width: 438px;
        :deep(.ant-input-affix-wrapper) {
          background-color: #f0f3f6;
          input {
            background-color: #f0f3f6;
            color: #b4b6b8;
            font-size: 20px !important;
            &::-webkit-input-placeholder {
              /* WebKit, Blink, Edge */
              font-size: 20px;
            }
            &:-moz-placeholder {
              /* Mozilla Firefox 4 to 18 */
              font-size: 20px;
            }
            &::-moz-placeholder {
              /* Mozilla Firefox 19+ */
              font-size: 20px;
            }
            &:-ms-input-placeholder {
              /* Internet Explorer 10-11 */
              font-size: 20px;
            }
          }
        }

        .login-item {
          :deep(.ant-form-item-control-input-content) {
            display: flex;
            align-items: center;
          }
          :deep(.ant-form-item-explain-error) {
            margin: 2.5px 0;
          }
        }
        .login-input {
          border-radius: 4px !important;
          height: 64px !important;

          :deep(.ant-input-prefix) {
            color: #b4b6b8;
            margin: 0 14px;
            .iconfont {
              font-size: 20px;
            }
            span[role="img"] {
              font-size: 20px;
            }
          }

          :deep(.ant-input-suffix) {
            color: #b4b6b8;
            margin: 0 14px;
            font-size: 20px;
            .ant-input-password-icon {
              color: #b4b6b8;
            }
          }

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
        .login-button {
          width: 100%;
          height: 64px !important;
          border-radius: 4px !important;
          color: #fff;
          font-size: 24px !important;
          border: none !important;
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
