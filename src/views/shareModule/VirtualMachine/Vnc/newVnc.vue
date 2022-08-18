<template>
  <layout :navData="navData" ref="layoutRef">
    <template v-slot:right>
      <div class="vm-content" ref="contentRef">
        <div class="vm-top" :style="{ height: topHeight + 'px',overflow: 'hidden'}">
          <template v-if="currentInterface === 'ssh'">
            <div v-if="!sshIsOpen" class="close-vm-bg">
              <img :src="closevmImg" alt="" srcset="" width="324" height="68">
            </div>
            <div class="vncloading" v-else-if="loading || vncLoading">
              <div class="word">
                <div class="loading">
                  <img :src="loadingGif" alt="" srcset="" />
                  <span>虚拟机加载中，请稍后...</span>
                </div>
              </div>
            </div>
            <iframe id="sshIframe" :src="sshUrl" frameborder="0"></iframe>
          </template>
          <template v-else>
            <div class="vncloading" v-if="loading || vncLoading&&!isClose">
              <div class="word">
                <div class="loading">
                  <img :src="loadingGif" alt="" srcset="" />
                  <span>虚拟机加载中，请稍后...</span>
                </div>
              </div>
            </div>
            <div class="vm-right-wrap" id="vncDom" :class="loading ? 'is-none' : ''">
              <vue-no-vnc
                background="rgb(40,40,40)"
                :options="currentOption"
                refName="refName"
                ref="novncEl"
                @clipboard="clipboard"
              />
            </div>
          </template>
        </div>
        <div class="vm-bottom" :style="{ height: bottomHeight + 'px' }">
          <div class="vm-bottom-drag" @mousedown="mousedown" @mouseup="mouseup">
          <span class="iconfont icon-huakuai1 move"></span></div>
          <div class="vm-bottom-content">
            <div class="vm-bottom-content-tit">
              <span>测试结果</span>
              <span class="success">
                <span class="iconfont icon-zhengque"></span>
                <span>成功</span>
              </span>
              <span class="fail">
                <span class="iconfont icon-cuowu"></span>
                <span>失败</span>
              </span>
            </div>
            <div class="vm-bottom-content-con">
              <pre></pre>
            </div>
          </div>
          <div class="vm-bottom-footer">
            <a-button type="primary" class="brightBtn" @click="test">测试</a-button>
            <a-button type="primary" @click="confirm">提交（2/3）</a-button>
          </div>
        </div>
      </div>
    </template>
  </layout>
  <!--禁用modal-->
  <disableStudent
    v-if="disableVisable"
    v-model:visable="disableVisable"
    :data="disableData"
    @save="saveKvm"
    :type="type"
    :uuid="currentUuid"
    :taskId="taskId"
    :opType="opType"
    :current="baseInfo?.current"
    :isAutoRemove="isAutoRemove"
  ></disableStudent>
</template>

<script lang="ts" setup>
import { inject, ref, onMounted,nextTick, computed, WritableComputedRef, watch, provide } from "vue";
import loadingGif from "src/assets/images/vmloading.gif";
import VueNoVnc from "src/components/noVnc/noVnc.vue";
import disableStudent from "../component/disableStudent.vue"
import layout from "../VmLayout/newLayout.vue";
import { message,Modal } from "ant-design-vue";
import { wsConnect } from "src/request/websocket";
import { getVmBaseInfo } from "src/utils/vncInspect";
import {IWmc} from "src/typings/wmc";
import { useStore } from "vuex";
import httpBuildQuery from "http-build-query"
import {
  onBeforeRouteLeave,
  useRoute,
  useRouter,
  LocationQuery,
  LocationQueryValue,
  onBeforeRouteUpdate,
} from "vue-router";
import { WS_CLOSE_CODE_EXP_ENDED, WS_CLOSE_REASON_EXP_ENDED } from "../../../../utils/vm";

import storage from "src/utils/extStorage";
import { getVmConnectSetting } from "src/utils/seeting";
import request from "src/request/getRequest";
import { IBusinessResp } from "src/typings/fetch";
import closevmImg from "src/assets/images/vm/vm_close.png"
const vmApi = request.vmApi;

let ws_config = storage.lStorage.get("ws_config");
let role = storage.lStorage.get("role");
const user_id = storage.lStorage.get("uid");
const route = useRoute();
const router=useRouter();
const store = useStore();
const { opType, type, taskId, topoinst_id, connection_id, experType, recommendType } = route.query;
const currentOption = inject(
  "currentOption",
  ref({ password: "", wsUrl: "", userName: "" })
);
const loading = inject("loading", ref(true));
const sshUrl = inject("sshUrl", ref(""));
const currentInterface = inject("currentInterface", ref("vnc"));
const baseInfo: any = inject("baseInfo", ref({}));
const taskType: any = inject("taskType");
const use_time: any = inject("use_time");
const vmsInfo: any = inject("vmsInfo");
const currentVm: any = inject("currentVm");
const isClose: any = inject("isClose");
const currentVmIndex: any = inject("currentVmIndex");
const currentUuid: any = inject("currentUuid");
const currentClickIndex: any = inject("currentClickIndex");
const novncEl: any = inject("novncEl");
const initVnc: any = inject("initVnc");
const evaluateData:any=inject("evaluateData")
const evaluateVisible:any=inject("evaluateVisible")
const initEvaluate:any=inject("initEvaluate")
const isScreenRecording: any = inject("isScreenRecording", ref(false));
const vncLoading: any = inject("vncLoading", ref(false));

// 非响应式
let historyLength = history.length;

const disableVisable:any=ref(false)
const disableData:any=ref({})
const navData = [
  { name: "指导", key: "guide", icon: "icon-zhidao" },
  { name: "笔记", key: "experimental-note", icon: "icon-biji" },
  { name: "报告", key: "report", icon: "icon-baogao" },
  { name: "问答", key: "forum", icon: "icon-wenda" },
];
let ind = 0;

let isCurrentPage = true;  // 是否是当前页面
let timerout:NodeJS.Timeout|null=null
let ws: WritableComputedRef<IWmc> = computed({
  get: () => {
    return store.state.longWs
  },
  set: val => {
    store.commit("setLongWs",val)
  }
})
function clipboard() {}
// 获取虚拟机基本信息pageinfo
function getVmBase() {
  loading.value = true;
  return new Promise((resolve: any, reject: any) => {
    let params: any = {
      opType: opType,
      type: type,
      taskId: taskId,
    };
    recommendType ? params.recommendType = recommendType : ''
    getVmBaseInfo(params).then((res: any) => {
      if (Number(res.data?.current?.status)>=2) {
        let modal = Modal.confirm({
          title: "提示",
          content: "该实验已结束",
          okText: "确定",
          cancelText: "取消",
          class: "vm-finish-modal",
          cancelButtonProps: {
            type: 'ghost'
          },
          onOk: () => {
            clearTimeout(timer)
            router.go(-1)
          },
        });
        let timer = setTimeout(() => {
          router.go(-1)
          clearTimeout(timer)
          modal.destroy()
        }, 5000)
        return
      }

      baseInfo.value = res.data;

      taskType.value = res.data.base_info.task_type.type;
      if (!res.data.current) {
        resolve();
        return;
      }

      if (!taskType.value) {
        use_time.value = res.data.current.used_time;
      } else {
        use_time.value = res.data.current.remaining_time;
      }
      resolve();
    }).catch((err) => {
      // console.log(err)
      if(err.msg === "当前学生没有相应排课") {
        setTimeout(() => {
          router.go(-1);
        }, 3000)
      }
    });
  });
}

const isAutoRemove = ref(false)
const sshIsOpen = ref(true)   // ssh是否是开机的状态
let layoutRef: any = ref(null)
function initWs() {
  clearTimeout(Number(timerout));
  ws.value = wsConnect({
    url: "://" + ws_config.host + ":" + ws_config.port + "/?uid=" + connection_id,
    open: () => {
      if (baseInfo.value && baseInfo.value?.current) {
        ws.value.join(topoinst_id + "_room");
      }
      if (opType == "help") {
        ws.value.join(topoinst_id + "_room");
      }
    },
    close: (ev: CloseEvent) => {
      if (ev.type === "close") {
            if (isCurrentPage) {
              if (ws.value.isReset()) {
                Modal.confirm({
                  title: "提示",
                  content: "该页面已在其他浏览器存在，是否替换",
                  okText: "是",
                  cancelText: "否",
                  class: "reset-ws-modal",
                  onOk: () => {
                    ws.value.refresh();
                    initWs();
                    initVnc.value();
                  },
                });
              } else {
                console.log('[newVnc] longWs closed: ', ev.code, ev.reason);
                // ws主动断开时，不用重连
                if (ev.code !== WS_CLOSE_CODE_EXP_ENDED) {
                  timerout = setTimeout(() => {
                    initWs();
                  }, 300);
                }
              }
            }
            // message.success("ws关闭成功");
          }
    },
    message: (ev: MessageEvent) => {
      let regex = /\{.*?\}/g;
      if (typeof ev.data === "string" && regex.test(ev.data)) {
        let wsJsonData = JSON.parse(ev.data);
        let oldVmsInfo = vmsInfo.value
        if (wsJsonData.type == "base_vminfo") {
          vmsInfo.value = wsJsonData.data;
          currentVm.value = wsJsonData.data.vms[currentVmIndex.value];
          if (wsJsonData.data.vms && wsJsonData.data.vms.length > 0) {
            Object.keys(oldVmsInfo).length ? '' : vncLoading.value = true
            if (
              ind === 0 &&
              baseInfo.value.base_info &&
              baseInfo.value.base_info.is_webssh === 1
              // && ((role == 4 && vmsInfo.value.vms[currentVmIndex.value].switch == 0) ||
              //   role != 4)
            ) {
              ind++;
              currentInterface.value = "ssh";
              currentVm.value = wsJsonData.data.vms[currentVmIndex.value];
              currentUuid.value = currentVm.value.uuid;
              // setTimeout(() => {
              //   console.log(sshUrl)
              //   sshUrl.value =
              //     getVmConnectSetting.SSHHOST +
              //     ":2222/ssh/host/" +
              //     currentVm.value.host_ip +
              //     "/" +
              //     currentVm.value.ssh_port;
              // }, 2000);
              loading.value = false;
              setTimeout(() => {
                if (currentVm.value.status == "ACTIVE") {
                  isClose.value = false;
                }
              }, 1500);
              if (currentVm.value.status == "SHUTOFF") {
                sshIsOpen.value = false
              }
            } else {
              if (
                currentInterface.value == "ssh" ||
                (wsJsonData.data.vms[currentVmIndex.value].status == "ACTIVE"&&isClose.value==false)
              ) {
              } else {
                currentInterface.value = "vnc";
                if (wsJsonData.data.vms[currentVmIndex.value].status == "SHUTOFF") {
                  currentUuid.value = wsJsonData.data.vms[currentVmIndex.value].uuid;
                  loading.value=false
                  isClose.value=true
                  return;
                }

                settingCurrentVM(wsJsonData.data.vms[currentVmIndex.value]);

                if (
                  wsJsonData.data.vms[currentVmIndex.value] &&
                  wsJsonData.data.vms[currentVmIndex.value].status == "ACTIVE"
                ) {
                  isClose.value = false;
                  if (currentClickIndex.value == currentVmIndex.value) {
                    loading.value = false;
                  }

                  initVnc.value();
                } else {
                  isClose.value = false;
                }
              }
            }
          }
        } else if (wsJsonData.type == "success") {
          if (wsJsonData.data?.message) {
            message.warn(wsJsonData.data.message);
          } else {
            if (typeof wsJsonData.data == "string") {
              message.warn(wsJsonData.data);
            }
          }
        } else if (wsJsonData.type == "error") {
          if (wsJsonData.data?.message) {
            message.warn(wsJsonData.data.message);
          } else {
            message.warn(wsJsonData.data);
          }
        }else if (wsJsonData.type=="message") {
          if (typeof(wsJsonData.data)=="string"&&!(baseInfo.value.current.is_teamed==1)) {
            message.warn(wsJsonData.data)
          }
        }else if (wsJsonData.type=="vm_act_message"){
          // 分组成员在操作或教师在操作
          if (wsJsonData.data?.send_user_id!=user_id && wsJsonData.data?.uuid===currentVm.value.uuid) {
            message.warn(wsJsonData.data.msg)
            isScreenRecording.value ? layoutRef.value.vmHeaderRef.stopRecord() : ''
            if (baseInfo.value.base_info.is_webssh === 1) {
              if (currentVm.value.status == "SHUTOFF"&&wsJsonData.data.msg.indexOf('关闭')!==-1) {
                currentInterface.value = 'ssh'
                sshIsOpen.value = false
                return
              }
              vncLoading.value = true
              if (currentVm.value.status == "ACTIVE"&&wsJsonData.data.msg.indexOf('开启')!==-1) {
                currentInterface.value = 'ssh'
                sshIsOpen.value = true
              }
              if (currentInterface.value === 'ssh') {  // ssh重连
                timerNum = 1
                setTimeout(() => {
                  sshUrl.value = ''
                  testSSHServe()
                }, 3000)
              } else {
                currentInterface.value = 'ssh'
              }
            }
          }
        }else if (wsJsonData.type=="return_message") {
          if (Object.keys(wsJsonData).length>0&&wsJsonData.data?.sender?.indexOf(connection_id)===-1) {
            if (wsJsonData.data?.msg) {
              message.warn(wsJsonData.data.msg)
            }else{
              message.warn(wsJsonData.data)
            }
          }
          if (layout.value) {
            baseInfo.value?.current?.is_teamed==1 && baseInfo.value?.current?.is_lead==1 ? '' : router.go(historyLength - history.length - 1);
            // 自评推荐
            evaluateVisible.value=true
            evaluateData.value = wsJsonData.data;

            nextTick(()=>{
              // initEvaluate()
            })
            sendDisconnect();
            isClose.value=true
          } else {
            layoutRef.value.vmHeaderRef.finishingExperimentVisible = true
            sendDisconnect();
            // baseInfo.value?.current?.is_teamed==1 && baseInfo.value?.current?.is_lead==1 ? '' : router.go(historyLength - history.length - 1);
            if (opType === 'help' && route.query.isClose) {
              window.close();
            } else {
              baseInfo.value?.current?.is_teamed==1 && baseInfo.value?.current?.is_lead==1 ? '' : router.go(historyLength - history.length - 1);
            }
          }
        }else if (wsJsonData.type=="recommends") {
          // 推荐
          // recommendExperimentData.value = wsJsonData.data;
          // recommendVisible.value = true;
        }else if (wsJsonData.type=="help") {

        }else if (wsJsonData.type=="delay") {
          use_time.value = wsJsonData.data.remaining_time
        }else if (wsJsonData.type=="manual-disable") {
          // 禁用学生
          disableVisable.value=true
          disableData.value=wsJsonData.data
        }else if (wsJsonData.type=="auto-remove") {
          isAutoRemove.value = true
          disableVisable.value=true
          disableData.value=wsJsonData.data
        }else if (wsJsonData.type=="switch_success") {
          // message.success("切换成功")
          // currentInterface.value = "vnc";
            vmsInfo.value = wsJsonData.data;
              // settingCurrentVM(
              //   wsJsonData.data.vms[currentVmIndex.value]
              // );
              // loading.value=false
              // initVnc.value()
        }else if (wsJsonData.type=="save_return_message") {
          if (Object.keys(wsJsonData).length>0) {
            if (wsJsonData.data?.msg) {
              message.warn(wsJsonData.data.msg)
            }else{
              message.warn(wsJsonData.data)
            }
          }
          layoutRef.value.vmHeaderRef.finishingExperimentVisible = true
          if (opType === 'help' && route.query.isClose) {
            window.close();
          } else {
            router.go(historyLength - history.length - 1)
          }
        }
      }
    },
  });
}

// saveKvm
function saveKvm() {

}
// 设置当前虚拟机信息
function settingCurrentVM(data: any) {
  currentVm.value = data;
  currentOption.value.password = getVmConnectSetting.VNCPASS;
  currentOption.value.wsUrl =
    getVmConnectSetting.VNCPROTOC +
    "://" +
    data.base_ip +
    ":" +
    getVmConnectSetting.VNCPORT +
    "/websockify?vm_uuid=" +
    data.uuid;
  currentUuid.value = data.uuid;
}

// 关闭ws
    function closeWs() {
      (ws.value as any)?.close();
    }
// 开启虚拟机
initVnc.value = () => {
  if (novncEl.value) {
    novncEl.value.connectVnc();
  }
};
 // 断开虚拟机
    function sendDisconnect() {
       if (novncEl.value) {
        novncEl.value.sendDisconnect();
      }
    }
    onBeforeRouteLeave(() => {
      isCurrentPage = false;
      clearTimeout(Number(timerout));
      clearTimeout(testSSHServeTimer)
      closeWs();
    });
onMounted(async () => {
  await getVmBase();
  if (Number(baseInfo.value?.current?.status)<2||role !== 4 || recommendType) {
    initWs();
  }
});

// 测试ssh服务
let testSSHServeTimer: any = null
let timerNum = 1
const testSSHServe = () => {
  console.log(timerNum)
  const param = {
    hostname: currentVm.value.host_ip,
    port: currentVm.value.ssh_port
  }
  vmApi.testSSHServe({urlParams: param, silent: true}).then((res: IBusinessResp | null) => {
    if (res?.code === 1) {
      // setTimeout(() => {
        vncLoading.value = false
        sshIsOpen.value = true
        clearTimeout(testSSHServeTimer)
        sshUrl.value = getVmConnectSetting.SSHHOST + ':' + getVmConnectSetting.SSHPORT + '?' + httpBuildQuery(param)

        timerNum = 1
      // }, 2000);
    }
  }).catch(() => {
    if (timerNum >= getVmConnectSetting.SSHConnectNum) {
      clearTimeout(testSSHServeTimer)
      message.warn(`已超过最大连接次数${getVmConnectSetting.SSHConnectNum}次`);
      timerNum = 1
      return
    }
    testSSHServeTimer = setTimeout(() => {
      timerNum++
      testSSHServe()
    }, timerNum*getVmConnectSetting.SSHConnectSpace)
  })
}
provide("testSSHServe", testSSHServe);
provide("sshIsOpen", sshIsOpen);
watch(
  () => currentInterface.value,
  (val) => {
    if (currentInterface.value === 'ssh'&&sshIsOpen.value) {
      timerNum = 1
      testSSHServe()
    }
  },
  { deep: true, immediate: true }
)

// 鼠标按下事件
let contentRef = ref()
let mouseStart = 0
let mouseEnd = 0
let bottomHeight = ref(342)
let topHeight = ref(342)
function mousedown(e: MouseEvent) {
  mouseStart = e.pageY;
  document.onmousemove = (event: any) => {
    document.body.style.pointerEvents = "none";
    document.body.style.userSelect = "none";
    mouseEnd = event.pageY
    // 向上移动
    if (mouseStart > mouseEnd) {
      bottomHeight.value = bottomHeight.value + (mouseStart - mouseEnd);
      topHeight.value = contentRef.value.offsetHeight - bottomHeight.value;
    } else {
      // 向下移动
      bottomHeight.value = bottomHeight.value - (mouseEnd - mouseStart);
      topHeight.value = contentRef.value.offsetHeight - bottomHeight.value;
    }
    mouseStart = mouseEnd;
    console.log(contentRef.value.offsetHeight)
  };
}
// 鼠标抬起事件
function mouseup() {
  document.onmousemove = null;
}
// 测试ssh服务
function test() {}
// 提交
function confirm() {}
</script>
<style lang="less">
.vm-layout {
  .vm-content-right {
    .vncloading {
      position: relative;
      height: 100%;
      text-align: center;
      background: radial-gradient(#010b24, #010b24);
      .word {
        width: 100%;
        height: 100%;
        bottom: 0;
        color: #fff;
        left: 0;
        margin: auto;
        right: 0;
        position: absolute;
        // text-shadow: 0 0 10px rgba(117, 121, 224, 0.5),
        //   0 0 5px rgba(117, 121, 224, 0.5);
        // top: 50%;
        // transform: translateY(-50%);
        background-color: var(--black-2);
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          img {
            margin-right: 8px;
          }
        }
      }
      color: var(--white-100);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .vnc-box {
      height: calc(100% - 46px);
      background: radial-gradient(#010b24, #010b24);
    }
    .tab-btn {
      height: 46px;
      line-height: 46px;
      background-color: var(--black-100);
      color: var(--white-100);
      text-align: center;
    }
  }
}
#sshIframe {
  width: 100%;
  height: 100%;
}
.vm-right-wrap {
  height: 100%;
}
.is-none {
  display: none;
}
.vm-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  .vm-top {
    flex: 1;
  }
  .vm-bottom {
    height: 200px;
    background-color: var(--black-0-14);
    position: relative;
    .iconfont.move {
      color: #1cb2b3;
      position: absolute;
      top: -12px;
      left: 50%;
    }
    &-drag {
      height: 1px;
      background-color: rgba(28,178,179,0.50);
      cursor: row-resize;
      &:hover {
        .move {
          display: inline-block;
        }
      }
    }
    &-footer {
      padding: 15px 0;
      background-color: #0a1933;
      margin-right: 24px;
      text-align: right;
      .brightBtn {
        margin-right: 8px;
      }
    }
    &-content {
      height: calc(100% - 64px);
      background-color: #172743;
      &-tit {
        height: 34px;
        line-height: 34px;
        color: var(--white);
        padding: 0 49px;
        border-bottom: 1px solid rgba(142,190,255,0.15);
        .success, .fail {
          display: inline-block;
          height: 20px;
          line-height: 20px;
          padding: 0 12px;
          border-radius: 2px;
          font-size: var(--font-size-sm);
          .iconfont {
            vertical-align: middle;
            font-size: 20px;
          }
          margin-left: 16px;
        }
        .success {
          background-color: #ddf9f3;
          color: #1cb2b3;
        }
        .fail {
          background-color: #fff3f3;
          color: #E22D2D;
        }
      }
      &-con {
        pre {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
