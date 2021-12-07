<template>
  <div class="admin-system-setting-box">
    <div class="system-setting-left">
      <div class="class-setting-box box-1">
        <tabTitle name="课时设置"></tabTitle>
        <div class="flex-line">
          <span>实验每课时</span>
          <a-input v-model:value="classTime"></a-input>
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
                <a-input v-model:value="authorizationCode"></a-input>
                <a-button type="primary" @click="saveClassTime"
                  >生成授权码</a-button
                >
                <a-button type="primary" @click="saveClassTime"
                  >复制授权码</a-button
                >
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
                  :multiple="true"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                >
                  <a-button type="primary" @click="saveClassTime"
                    >选择文件</a-button
                  >
                </a-upload>
                <div class="progress-box active">
                  <div class="progress-bg">
                    <div class="progress"></div>
                  </div>
                  <span class="iconfont icon-shanchu"></span>
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
                  @click="saveClassTime"
                  >授权</a-button
                >
              </div>
            </div>
          </div>
          <div class="no-authorization-wrap">
            <no-authorization :data="authorizationData" />
          </div>
        </div>
      </div>
    </div>
    <div class="system-setting-right">
      <div class="system-log-box box-1">
        <tabTitle name="系统日志"></tabTitle>
        <div class="flex-line">
          <span>系统自动保存最近</span>
          <a-select>
            <a-select-option :value="1">一个月</a-select-option>
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
} from "vue";

import noImg from "src/assets/setting/is-authorization.png";
import { getAuthorizationInfoApi } from "./api";
// 标题
const tabTitle: any = (props: any, context: any) => {
  return h(`div`, { class: { "title-name": true } }, [
    props.name,
    context.slots.hint && h(context.slots.hint),
  ]);
};
tabTitle.props = ["name"];

// 暂无授权
const noAuthorization: any = (props: any, context: any) => {
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
                  day > 0?
                        h("span", { class: ["day"] }, [
                          day,
                          h("i", { class: ["day-unit"] }, "天"),
                        ])
                    : [(h("span", { class: ["hour"] }, [
                        hour,
                        h("i", { class: ["day-unit"] }, "时"),
                      ])),
                      h("span", { class: ["minute"] }, [
                        minute,
                        h("i", { class: ["minute-unit"] }, "分"),
                      ])]
                )
          ]),
        ]),
  ]);
};
noAuthorization.props = ["data"];

type TreactiveData = {
  classTime: number;
  authorizationCode: string;
  authorizationData: any;
  isShowBtn: boolean;
};
export default defineComponent({
  components: {
    tabTitle,
    "no-authorization": noAuthorization,
  },
  setup() {
    const reactiveData: TreactiveData = reactive({
      classTime: 30,
      authorizationCode: "",
      authorizationData: {},
      isShowBtn: false,
    });
    onMounted(() => {
      method.getAuthorizationInfo();
    });
    const method = {
      saveClassTime: () => {
        console.log("保存课时");
      },
      saveLog() {
        console.log("保存日志");
      },
      getAuthorizationInfo() {
        getAuthorizationInfoApi().then((res: any) => {
          console.log(res);
          reactiveData.authorizationData = res?.datas;
          
          if (!reactiveData.authorizationData.number) {
            reactiveData.isShowBtn = true;
          }
        });
      },
    };
    return {
      ...toRefs(reactiveData),
      ...method,
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
      width: 70px;
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
            .day-unit{
              // display: inline-block;
              vertical-align: bottom;
            }
            .minute{
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
}
</style>
