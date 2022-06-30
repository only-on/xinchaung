<template>
  <layout :navData="navData" ref="layoutRef">
    <template v-slot:right
      >
      <template v-if="currentInterface === 'ssh'">
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
import { inject, ref, onMounted,nextTick, computed, WritableComputedRef, watch } from "vue";
import loadingGif from "src/assets/images/vmloading.gif";
import VueNoVnc from "src/components/noVnc/noVnc.vue";
import disableStudent from "../component/disableStudent.vue"
import layout from "../VmLayout/newLayout.vue";
import { message,Modal } from "ant-design-vue";
import { wsConnect } from "src/request/websocket";
import { getVmBaseInfo } from "src/utils/vncInspect";
import {IWmc} from "src/typings/wmc";
import { useStore } from "vuex";
import {
  onBeforeRouteLeave,
  useRoute,
  useRouter,
  LocationQuery,
  LocationQueryValue,
  onBeforeRouteUpdate,
} from "vue-router";

import storage from "src/utils/extStorage";
import { getVmConnectSetting } from "src/utils/seeting";

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
                timerout = setTimeout(() => {
                  initWs();
                }, 300);
              }
            }
            // message.success("ws关闭成功");
          }
    },
    message: (ev: MessageEvent) => {
      let regex = /\{.*?\}/g;
      if (typeof ev.data === "string" && regex.test(ev.data)) {
        let wsJsonData = JSON.parse(ev.data);
        if (wsJsonData.type == "base_vminfo") {
          vmsInfo.value = wsJsonData.data;
          if (wsJsonData.data.vms && wsJsonData.data.vms.length > 0) {
            vncLoading.value = true
            if (
              ind === 0 &&
              baseInfo.value.base_info &&
              baseInfo.value.base_info.is_webssh === 1 &&
              ((role == 4 &&
                baseInfo.value.current &&
                baseInfo.value.current.is_switch == 0) ||
                role == 3)
            ) {
              ind++;
              currentInterface.value = "ssh";
              currentVm.value = wsJsonData.data.vms[currentVmIndex.value];
              currentUuid.value = currentVm.value.uuid;
              setTimeout(() => {
                console.log(sshUrl)
                sshUrl.value =
                  getVmConnectSetting.SSHHOST +
                  ":2222/ssh/host/" +
                  currentVm.value.host_ip +
                  "/" +
                  currentVm.value.ssh_port;
              }, 2000);
              setTimeout(() => {
                loading.value = false;
                if (currentVm.value.status == "ACTIVE") {
                  isClose.value = false;
                }
              }, 1500);
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
          if (wsJsonData.data?.send_user_id!==user_id && wsJsonData.data?.uuid===currentVm.value.uuid) {
            message.warn(wsJsonData.data.msg)
            isScreenRecording.value ? layoutRef.value.vmHeaderRef.stopRecord() : ''
          }
        }else if (wsJsonData.type=="return_message") {
          if (Object.keys(wsJsonData).length>0) {
            if (wsJsonData.data?.msg) {
              message.warn(wsJsonData.data.msg)
            }else{
              message.warn(wsJsonData.data)
            }
          }
          if (layout.value) {
            baseInfo.value?.current?.is_teamed==1 && baseInfo.value?.current?.is_lead==1 ? '' : router.go(-1);
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
            baseInfo.value?.current?.is_teamed==1 && baseInfo.value?.current?.is_lead==1 ? '' : router.go(-1);
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
          message.success("切换成功")
          currentInterface.value = "vnc";
            vmsInfo.value = wsJsonData.data;
              settingCurrentVM(
                wsJsonData.data.vms[currentVmIndex.value]
              );
              loading.value=false
              initVnc.value()
        }else if (wsJsonData.type=="save_return_message") {
          if (Object.keys(wsJsonData).length>0) {
            if (wsJsonData.data?.msg) {
              message.warn(wsJsonData.data.msg)
            }else{
              message.warn(wsJsonData.data)
            }
          }
          router.go(-1)
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
      closeWs();
    });
onMounted(async () => {
  await getVmBase();
  if (Number(baseInfo.value?.current?.status)<2||role !== 4 || recommendType) {
    initWs();
  }
});
watch(
  () => sshUrl.value,
  (val) => {
    if (!val) return
    nextTick(() => {
      const sshIframe: any = document.querySelector('#sshIframe')
      // 处理兼容性问题
      if (sshIframe?.attachEvent) {
        sshIframe.attachEvent('onload', () => {
          loading.value = false
        })
      } else {
        sshIframe.onload = () => {
          loading.value = false
        }
      }
    })
  },
  { deep: true, immediate: true }
)
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
</style>
