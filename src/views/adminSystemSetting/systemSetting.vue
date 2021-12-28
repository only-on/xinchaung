<template>
  <div class="admin-system-setting-box">
    <div class="system-setting-left">
      <div class="class-setting-box box-1">
        <tabTitle name="课时设置"></tabTitle>
        <div class="flex-line">
          <span>实验每课时</span>
          <a-input v-model:value="sysetmInfo.each_class_time"></a-input>
          <span>分钟。</span>
          <a-button type="primary" @click="saveClassTime">保存</a-button>
        </div>
      </div>
      <div class="authorization-box box-2">
        <tabTitle name="授权设置"></tabTitle>
        <div class="author-content-box">
          <div class="w-row row-1">
            <span class="row-num">1</span>
            <div class="content-right">
              <span class="row-title">点击生成授权码</span>
              <div class="code-box">
                <a-input
                  v-model:value="authorizationData.authorization_code"
                  ref="codeRef"
                  style="pointer-events: none; background: #fafafa"
                ></a-input>
                <a-button type="primary" @click="createAuthorizationCode"
                  >生成授权码</a-button
                >
                <a-button type="primary" @click="copyCode">复制授权码</a-button>
              </div>
            </div>
          </div>
          <div class="w-row row-2">
            <span class="row-num">2</span>
            <div class="content-right">
              <span class="row-title"> 导入授权文件 </span>
              <div class="upload-code-file">
                <a-upload
                  name="file"
                  :multiple="false"
                  :showUploadList="false"
                  :beforeUpload="beforeUpload"
                >
                  <a-button type="primary">选择文件</a-button>
                </a-upload>
                <div
                  class="progress-box active"
                  v-if="authorizationFile.progress"
                >
                  <a-progress :percent="authorizationFile.progress" />
                  <span
                    @click="removeFile"
                    class="iconfont icon-shanchu"
                  ></span>
                </div>
              </div>
            </div>
          </div>
          <div class="w-row row-3">
            <span class="row-num">3</span>
            <div class="content-right">
              <span class="row-title">系统授权</span>
              <div>
                <a-button
                  type="primary"
                  :disabled="isShowBtn"
                  @click="authorizationFun"
                  >授权</a-button
                >
              </div>
            </div>
          </div>
          <div class="no-authorization-wrap">
            <authorization :data="authorizationData" />
          </div>
        </div>
      </div>
    </div>
    <div class="system-setting-right">
      <div class="system-log-box box-1">
        <tabTitle name="系统日志"></tabTitle>
        <div class="flex-line">
          <span>系统自动保存最近</span>
          <a-select v-model:value="logSelectId">
            <a-select-option
              v-for="item in logTimeSelectData"
              :value="item.value.toString()"
              :key="item.value"
              >{{ item.title }}</a-select-option
            >
          </a-select>
          <span>内的系统日志</span>
          <a-button type="primary" @click="saveLog">保存</a-button>
        </div>
      </div>
      <div class="system-name-logo-box box-2">
        <tabTitle name="系统名称/LOGO设置">
          <template #hint>
            <div class="hint">
              修改系统信息后请清除浏览器缓存并重新登录系统！
            </div>
          </template>
        </tabTitle>
        <div class="system-name-setting-box">
          <div class="flex-row">
            <label class="label">系统名：</label>
            <a-input
              :disabled="isEdit"
              class="system-name"
              v-model:value="systemBaseInfo.name"
            />
          </div>
          <div class="flex-row">
            <label class="label">LOGO：</label>
            <div class="form-right">
              <div class="upload-logo-box">
                <div class="logo-box">
                  <span class="logo-title">登录</span>
                  <div class="upload-logo">
                    <a-upload
                      name="avatar"
                      list-type="picture-card"
                      class="avatar-uploader login-logo"
                      :show-upload-list="false"
                      :beforeUpload="logUploadBefore"
                    >
                      <img
                        v-if="systemBaseInfo.login_logo"
                        :src="
                          env
                            ? '/proxyPrefix' + systemBaseInfo.login_logo
                            : systemBaseInfo.login_logo
                        "
                        alt="avatar"
                      />
                      <div>
                        <span class="icon-huigun iconfont"></span>
                      </div>
                    </a-upload>
                  </div>
                  <i>58x58px</i>
                </div>
                <div class="logo-box">
                  <span class="logo-title">顶部-png</span>
                  <div class="upload-logo">
                    <a-upload
                      name="avatar"
                      list-type="picture-card"
                      class="avatar-uploader top-logo"
                      :show-upload-list="false"
                      :beforeUpload="topUploadBefore"
                    >
                      <img
                        v-if="systemBaseInfo.inner_logo"
                        :src="
                          env
                            ? '/proxyPrefix' + systemBaseInfo.inner_logo
                            : systemBaseInfo.inner_logo
                        "
                        alt="avatar"
                      />
                      <div>
                        <span class="icon-huigun iconfont"></span>
                      </div>
                    </a-upload>
                  </div>
                  <i>40x40px</i>
                </div>
                <div class="logo-hint">支持小于20K的png文件</div>
              </div>
              <div class="upload-logo-box">
                <div class="logo-box">
                  <span class="logo-title">标签-ico</span>
                  <div class="upload-logo">
                    <a-upload
                      name="avatar"
                      list-type="picture-card"
                      class="avatar-uploader ico-logo"
                      :show-upload-list="false"
                      :beforeUpload="iconUploadBefore"
                    >
                      <img
                        v-if="systemBaseInfo.icon"
                        :src="systemBaseInfo.icon"
                        alt="avatar"
                      />
                      <div>
                        <span class="icon-huigun iconfont"></span>
                      </div>
                    </a-upload>
                  </div>
                  <i>16x16px</i>
                  <div class="logo-hint">支持小于10k的png文件</div>
                </div>
              </div>
            </div>
          </div>
          <div class="setting-btn-box">
            <a-button type="primary" @click="editOrSave">{{
              isEdit ? "编辑" : "保存"
            }}</a-button>
            <a-button type="primary" @click="initBaseInfo">设置初始化</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  h,
  VNodeProps,
  AppContext,
  reactive,
  toRefs,
  onMounted,
  ref,
} from "vue";

import noImg from "src/assets/images/setting/is-authorization.png";
import {
  getAuthorizationInfoApi,
  saveCourseConfigApi,
  getSystemSettingApi,
  settingAutoKeyApi,
  saveSettingApi,
  getSystemLogTimeApi,
  saveSystemLogApi,
  uploadLogoImageApi,
  updateSettingSiteApi,
  getSettingSiteApi,
  resetSystemSiteApi
} from "./api";
import { message, Modal } from "ant-design-vue";
import uploadFile from "src/request/uploadFile";
// 标题
const tabTitle: any = (props: any, context: any) => {
  return h(`div`, { class: { "title-name": true } }, [
    props.name,
    context.slots.hint && h(context.slots.hint),
  ]);
};
tabTitle.props = ["name"];

// 授权
const Authorization: any = (props: any, context: any) => {
  const data = props.data;
  console.log(data);
  let showType = true;
  let day: any = "";
  let hour = "";
  let minute = "";
  let peopleNum = 0;
  let permanent = "";
  if (!data.number) {
    showType = true;
  } else {
    showType = false;
    peopleNum = data.number ? data.number : 0;
    if (!data.effective_time || data.effective_time == 0) {
      permanent = "永久";
    } else {
      if (data.time_left && data.time_left.length > 0) {
        if (data.time_left[0] > 0) {
          day = data.time_left[0];
        } else if (data.time_left[1] > 0) {
          hour = data.time_left[1];
          minute = data.time_left[2];
        }
      }
    }
  }
  console.log(day, hour, minute, "day > 0", day > 0);
  return h("div", { class: ["authorization-wrap"] }, [
    showType
      ? h("div", { class: ["none-wrap"] }, h("img", { src: noImg }))
      : h("div", { class: ["authorization-info"] }, [
          h(
            "div",
            { class: ["info-left"] },
            h("div", { class: ["people-num-box"] }, [
              h("span", { class: ["label"] }, "授权人数"),
              h("span", { class: ["people-num"] }, [
                peopleNum,
                h("i", {}, "人"),
              ]),
            ])
          ),
          h("div", { class: ["info-right"] }, [
            h("span", { class: ["label"] }, "授权剩余时长"),
            permanent
              ? h("div", { class: [""] }, "永久")
              : h(
                  "div",
                  { class: ["num-box"] },
                  day > 0
                    ? h("span", { class: ["day"] }, [
                        day,
                        h("i", { class: ["day-unit"] }, "天"),
                      ])
                    : [
                        h("span", { class: ["hour"] }, [
                          hour,
                          h("i", { class: ["day-unit"] }, "时"),
                        ]),
                        h("span", { class: ["minute"] }, [
                          minute,
                          h("i", { class: ["minute-unit"] }, "分"),
                        ]),
                      ]
                ),
          ]),
        ]),
  ]);
};
Authorization.props = ["data"];

const modalEl = () => {
  return h(
    "div",
    { style: { color: "red", "font-size": "20px", margin: "auto" } },
    "本次生成会导致以前授权文件失效,您确定要重新生成授权码"
  );
};
type TreactiveData = {
  authorizationCode: string;
  authorizationData: any;
  isShowBtn: boolean;
  loginImg: string;
  sysetmInfo: any;
  upload: any;
  authorizationFile: any;
  logTimeSelectData: any[];
  logSelectId: any;
  log: any;
  isEdit: boolean;
  systemBaseInfo: any;
};
export default defineComponent({
  components: {
    tabTitle,
    authorization: Authorization,
  },
  setup() {
    const env = process.env.NODE_ENV == "development" ? true : false;
    const codeRef = ref(null);
    const reactiveData: TreactiveData = reactive({
      authorizationCode: "",
      authorizationData: {},
      isShowBtn: false,
      loginImg: "",
      sysetmInfo: {},
      upload: {},
      authorizationFile: {},
      logTimeSelectData: [],
      logSelectId: "",
      log: {},
      isEdit: true,
      systemBaseInfo: {},
    });
    onMounted(() => {
      method.getAuthorizationInfo();
      method.getSystemSetting();
      method.getSystemLogTime();
      method.getSettingSite();
    });
    const method = {
      saveClassTime: () => {
        console.log("保存课时");
        const body = new FormData();
        body.append(
          "course_count",
          reactiveData.sysetmInfo.selective_course_count
        );
        body.append("class_time", reactiveData.sysetmInfo.each_class_time);
        saveCourseConfigApi(body).then(() => {
          message.success("保存成功");
        });
      },
      saveLog() {
        console.log("保存日志");
        saveSystemLogApi({ clearTime: reactiveData.logSelectId }).then(() => {
          message.success("保存成功");
        });
      },
      copyCode(e: Event) {
        e.preventDefault();
        (codeRef.value as any).select();
        document.execCommand("Copy"); //
      },
      // 获取授权信息
      getAuthorizationInfo() {
        getAuthorizationInfoApi().then((res: any) => {
          console.log(res);
          reactiveData.authorizationData = res?.data;
          reactiveData.isShowBtn = true;
          if (!reactiveData.authorizationData.number) {
          }
        });
      },
      // 获取系统设置
      getSystemSetting() {
        getSystemSettingApi().then((res: any) => {
          reactiveData.sysetmInfo = res.data;
        });
      },
      // 生成授权码
      createAuthorizationCode() {
        Modal.confirm({
          title: "提示信息",
          content: modalEl(),
          width: "615px",
          onOk: () => {
            console.log("ok");
            method.settingAutoKey();
          },
          onCancel: () => {
            console.log("cancel");
          },
        });
      },
      // 设置授权码
      settingAutoKey() {
        settingAutoKeyApi().then((res: any) => {
          reactiveData.authorizationData.authorization_code = res.datas.key;
        });
      },
      // 上传授权文件
      beforeUpload(file: any) {
        console.log(file);
        reactiveData.authorizationFile.filename = file.name;
        let body = {
          file_url: file,
          file_id: 0,
        };
        reactiveData.upload = new uploadFile({
          url: env
            ? "/proxyPrefix/authorization/setting/upload-file"
            : "/authorization/setting/upload-file",
          body,
          success: (res: any) => {
            if (res.status === 1) {
              reactiveData.authorizationFile.url = res.data.url;
              reactiveData.isShowBtn = false;
              reactiveData.authorizationFile.progress = 100;
            } else {
              message.error("上传失败");
            }
            reactiveData.upload = "";
          },
          progress: (e: ProgressEvent) => {
            if (e.total > 0) {
              reactiveData.authorizationFile.progress = Number(
                Number((e.loaded / e.total) * 100).toFixed(2)
              );
              reactiveData.authorizationFile.progress =
                reactiveData.authorizationFile.progress == 100
                  ? 99
                  : reactiveData.authorizationFile.progress;
            }
          },
          abort: (xhr: XMLHttpRequest) => {
            console.log("终止上传成功", xhr);
          },
          error: (err) => {
            console.log(err);
          },
        });
        reactiveData.upload.request();
        return false;
      },
      removeFile() {
        if (reactiveData.upload) {
          reactiveData.upload.abortUpload();
          reactiveData.authorizationFile = {};
        }
      },
      // 授权
      authorizationFun() {
        if (!reactiveData.authorizationFile.filename) {
          message.warn("请上传图片");
          return;
        }
        if (!reactiveData.authorizationData.authorization_code) {
          message.warn("请输入授权码");
          return;
        }
        reactiveData.isShowBtn = true;
        let params: any = {
          params: reactiveData.authorizationFile.filename,
          authNumber: reactiveData.authorizationData.authorization_code,
          url: reactiveData.authorizationFile.url,
        };
        saveSettingApi(params).then((res: any) => {
          reactiveData.authorizationData.authorization_code =
            res.authNumber;
          method.getAuthorizationInfo();
        });
      },
      // 获取系统日志时间配置
      getSystemLogTime() {
        getSystemLogTimeApi().then((res: any) => {
          console.log(res);
          
          reactiveData.logTimeSelectData = res.data.select;
          console.log(reactiveData.logTimeSelectData);
          
          reactiveData.logSelectId = res.data.data.value;
        });
      },
      logUploadBefore(file:any){
        method.uploadLogoImage(file, 'loginLogo')
        return false
      },
      topUploadBefore(file:any){
        method.uploadLogoImage(file, 'innerLogo')
        return false
      },
      iconUploadBefore(file:any){
        method.uploadLogoImage(file, 'ico')
        return false
      },
      uploadLogoImage(file: any, type: any) {
        let objType = {
          loginLogo: "login_logo",
          innerLogo: "inner_logo",
          ico: "icon",
        };
        console.log(file, type);
        const body = new FormData();
        body.append(type, file);
        body.append("file_id", "0");
        body.append("type", type);
        uploadLogoImageApi(body).then((res: any) => {
          console.log(res);
          reactiveData.log[objType[type]] = res.datas.url;
        });
        return false;
      },
      getSettingSite() {
        getSettingSiteApi().then((res: any) => {
          reactiveData.systemBaseInfo = res.data;
        });
      },
      initBaseInfo() {
        console.log("初始化");
        Modal.confirm({
          title:"信息提示",
          content:"确定要初始化名称和Logo吗？",
          onOk:()=>{
            resetSystemSiteApi().then((res)=>{
              window.location.reload()
            })
          }
        })
      },
      editOrSave() {
        console.log("编辑保存");
        if (reactiveData.isEdit) {
          reactiveData.isEdit = false;
        } else {
          const body=new FormData();
          body.append("name",reactiveData.systemBaseInfo.name)
          body.append("login_logo",reactiveData.systemBaseInfo.login_logo)
          body.append("inner_logo",reactiveData.systemBaseInfo.inner_logo)
          body.append("ico",reactiveData.systemBaseInfo.icon)
          updateSettingSiteApi(body).then((res)=>{
            reactiveData.isEdit = true;
            message.success("更新成功")
          });
        }
      },
    };
    return {
      ...toRefs(reactiveData),
      ...method,
      codeRef,
      env,
    };
  },
});
</script>

<style lang="less">
.admin-system-setting-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .system-setting-left {
    width: 47%;
    flex-shrink: 0;
  }
  .system-setting-right {
    width: 47%;
    flex-shrink: 0;
  }
  .title-name {
    font-weight: 400;
    font-size: 16px;
    border-bottom: 1px solid #e9e9e9;
    padding-bottom: 15px;
    display: flex;
    .hint {
      margin-left: 30px;
      font-weight: 500;
      font-size: 13px;
      color: #ff8f00;
      margin-top: 5px;
    }
  }
  .box-1 {
    height: 130px;
  }
  .flex-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
    > span {
      margin-right: 5px;
      margin-left: 5px;
      &:nth-child(1) {
        margin-left: 0;
      }
    }
    > input {
      width: 70px;
    }
    > .ant-select {
      width: 100px;
    }
  }
  .author-content-box {
    position: relative;
    padding: 20px 0;
    > .w-row {
      position: relative;
      display: flex;
      flex-direction: row;
      &::before {
        display: block;
        content: " ";
        width: 3px;
        // height: 100%;
        background-color: #f1f3f4;
        position: absolute;
        left: 10px;
        z-index: 1;
        top: 26px;
        bottom: 2px;
      }
      &:last-child {
        &::before {
          display: none;
        }
      }
      .row-num {
        flex-shrink: 0;
        border-radius: 50%;
        position: relative;
        z-index: 2;
        width: 24px;
        height: 24px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid rgba(5, 1, 1, 0.65);
        background: #fff;
      }
    }
    .row-title {
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      line-height: 24px;
    }
    .content-right {
      flex: 1;
      margin-left: 10px;
    }
    .code-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      min-height: 80px;
      > input {
        flex: 1;
      }
      > button {
        margin-right: 20px;
      }
    }
    .upload-code-file {
      padding: 20px 0;
      .progress-box {
        display: none;
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .progress-bg {
          height: 10px;
          width: 100%;
          background: #f5f5f5;

          .progress {
            background: #ff7f50;
            height: 100%;
            width: 100%;
          }
        }
        .iconfont {
          flex-shrink: 0;
        }
        &.active {
          display: flex;
        }
      }
    }
  }
  .no-authorization-wrap {
    position: absolute;
    width: 250px;
    height: 130px;
    bottom: 0;
    right: 0;
    background: #fafafa;
    .authorization-wrap {
      width: 100%;
      height: 100%;
    }
    .none-wrap {
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }
    .authorization-info {
      display: flex;
      flex-direction: row;
      justify-content: center;
      text-align: center;
      align-items: center;
      height: 100%;
      .info-left {
        width: 50%;
        .label {
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: rgba(5, 1, 1, 0.45);
          display: block;
          margin-bottom: 5px;
        }
        .people-num-box {
          display: flex;
          flex-direction: column;
          .people-num {
            font-size: 45px;
            line-height: 1;
            color: rgba(5, 1, 1, 0.45);
            > i {
              font-style: normal;
              font-size: 12px;
            }
          }
        }
      }
      .info-right {
        width: 50%;
        .label {
          display: block;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: rgba(5, 1, 1, 0.45);
          margin-bottom: 5px;
        }
        > div {
          font-size: 45px;
          line-height: 1;
          color: rgba(5, 1, 1, 0.45);
          &.num-box {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: center;
            .day {
              font-size: 45px;
            }
            .day-unit {
              // display: inline-block;
              vertical-align: bottom;
            }
            .minute {
              font-size: 14px;
              margin-left: 5px;
            }
            i {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  .system-name-setting-box {
    padding: 30px 0;
    .flex-row {
      display: flex;
      margin-bottom: 30px;
      .label {
        width: 70px;
        flex-shrink: 0;
      }
      .form-right {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        > .upload-logo-box {
          display: flex;
          flex-wrap: wrap;
          &:nth-child(1) {
            width: 200px;
            flex-shrink: 0;
            .logo-box {
              width: 100px;
            }
          }
          &:nth-child(2) {
            flex: 1;
          }
          .logo-title {
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
          }
          .logo-hint {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.25);
            width: 140px;
            border-top: 1px dashed rgba(0, 0, 0, 0.25);
            margin-top: 10px;
            padding-top: 10px;
          }
          .ant-upload-select-picture-card {
            display: block;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            overflow: hidden;
            .ant-upload {
              padding: 0;
              display: block;
              > div {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }
          i {
            margin-top: auto;
            color: rgba(0, 0, 0, 0.25);
            font-style: normal;
          }
          .logo-box {
            display: flex;
            flex-direction: column;

            .login-logo {
              width: 58px;
              height: 58px;
            }
            .ico-logo {
              width: 24px;
              height: 24px;
              .ant-upload-select-picture-card {
                display: block;
                width: 100%;
                height: 100%;
                padding: 0;
                margin: 0;
                overflow: hidden;
              }
            }
            .top-logo {
              width: 40px;
              height: 40px;
              .ant-upload-select-picture-card {
                display: block;
                width: 100%;
                height: 100%;
                padding: 0;
                margin: 0;
                overflow: hidden;
              }
            }
            > .logo-hint {
              width: 100%;
              font-size: 12px;
              color: rgba(0, 0, 0, 0.25);
            }
          }
        }
      }
    }
    .setting-btn-box {
      padding-left: 70px;
      > button {
        margin-right: 20px;
      }
    }
  }
}
</style>
