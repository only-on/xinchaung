<template>
  <layout :navData="navData">
    <template v-slot:right>
      <div v-if="isLoading" class="jupyter-loading">
        <img :src="loadingGif" alt="" srcset="" />
        <span>虚拟机加载中，请稍后...</span>
      </div>
      <div id="vncDom" class="jupyter-box">
        <iframe
          id="iframe"
          :src="'http://' + noteUrl"
          frameborder="0"
          style="width: 100%; height: 100%"
          v-show="showIframe"
        ></iframe>
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
import { ref, toRefs, onMounted, Ref, inject, computed,WritableComputedRef, nextTick } from "vue";
import layout from "../VmLayout/newLayout.vue";
import { getVmBaseInfo } from "src/utils/vncInspect";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import storage from "src/utils/extStorage";
import { wsConnect } from "src/request/websocket";
import { Modal, message } from "ant-design-vue";
import disableStudent from "../component/disableStudent.vue"
import {IWmc} from "src/typings/wmc";
import { useStore } from "vuex";
import loadingGif from "src/assets/images/vmloading.gif";

const route = useRoute();
const router = useRouter();
const { opType, type, taskId, topoinst_id, connection_id, recommendType } = route.query;

let ws_config = storage.lStorage.get("ws_config");
let role = storage.lStorage.get("role");
const user_id = storage.lStorage.get("uid");

const baseInfo: any = inject("baseInfo", ref({}));
const loading: any = inject("loading", ref(true));
const taskType: any = inject("taskType");
const use_time: any = inject("use_time");
const currentVm: any = inject("currentVm");
const currentUuid: any = inject("currentUuid");
const vmsInfo: any = inject("vmsInfo");
const currentVmIndex: any = inject("currentVmIndex");
const noteUrl: any = ref("");
const store = useStore();

const navData = [
  { name: "指导", key: "guide", icon: "icon-zhidao" },
  { name: "笔记", key: "experimental-note", icon: "icon-biji" },
  { name: "报告", key: "report", icon: "icon-baogao" },
  { name: "问答", key: "forum", icon: "icon-wenda" },
];

let timerout: NodeJS.Timeout | null = null;
let isCurrentPage = true; // 是否是当前页面
const disableVisable: any = ref(false);
const disableData: any = ref({});

let TimerIframe: NodeJS.Timeout | null = null;

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
    }).catch((err: any) => {
      if(err.msg === "当前学生没有相应排课") {
        setTimeout(() => {
          router.go(-1);
        }, 3000)
      }
    });
  });
}
let ws: WritableComputedRef<IWmc> = computed({
  get: () => {
    return store.state.longWs
  },
  set: val => {
    store.commit("setLongWs",val)
  }
})

const isAutoRemove = ref(false)   // 是否是自动排课结束前15分钟，推送消息
// 初始化ws
function initWs() {
  // if (ws.value) {
  //   ws.value.leave(topoinst_id + "_room");
  // }
  clearTimeout(Number(timerout));
  ws.value = wsConnect({
    url: "://" + ws_config.host + ":" + ws_config.port + "/?uid=" + connection_id,
    open: () => {
      if (baseInfo.value && baseInfo.value?.current) {
        // console.log(11111);

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
              content: "改页面已在其他浏览器存在，是否替换",
              okText: "是",
              cancelText: "否",
              class: "reset-ws-modal",
              onOk: () => {
                (ws.value as any).refresh();
                initWs();
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
          currentVm.value = wsJsonData.data.vms[currentVmIndex.value];
          if (JSON.parse(ev.data).data.vms && JSON.parse(ev.data).data.vms.length > 0) {
            currentVm.value = JSON.parse(ev.data).data.vms[0];
            currentUuid.value = currentVm.value.uuid;
            noteUrl.value = currentVm.value.host_ip + ":" + currentVm.value.note_port;
            loading.value = false
          }
        } else if (wsJsonData.type == "success") {
          if (wsJsonData.data?.message) {
            message.warn(wsJsonData.data.message);
          } else {
            message.warn(wsJsonData.data);
          }
        } else if (wsJsonData.type == "error") {
          if (wsJsonData.data?.message) {
            message.warn(wsJsonData.data.message);
          } else {
            message.warn(wsJsonData.data);
          }
        } else if (wsJsonData.type == "message") {
          if (typeof(wsJsonData.data)=="string") {
            message.warn(wsJsonData.data)
          }
        }else if (wsJsonData.type=="vm_act_message"){ 
          // 分组成员在操作或教师在操作
          if (wsJsonData.data?.send_user_id!=user_id && wsJsonData.data?.uuid===currentVm.value.uuid) {
            message.warn(wsJsonData.data.msg)
          }
        }else if (wsJsonData.type=="return_message") {
          if (Object.keys(wsJsonData).length>0&&wsJsonData.data?.sender?.indexOf(connection_id)===-1) {
            if (wsJsonData.data?.msg) {
              message.warn(wsJsonData.data.msg)
            }else{
              message.warn(wsJsonData.data)
            }
          }
          // router.go(-1)
        } else if (wsJsonData.type == "recommends") {
        } else if (wsJsonData.type == "help") {
        } else if (wsJsonData.type == "delay") {
          use_time.value = wsJsonData.data.remaining_time;
        } else if (wsJsonData.type == "manual-disable") {
          // 禁用学生
          disableVisable.value = true;
          disableData.value = wsJsonData.data;
        } else if (wsJsonData.type=="auto-remove") {
          isAutoRemove.value = true
          disableVisable.value = true
          disableData.value = wsJsonData.data
        }
      }
    },
  });
}
// saveKvm
function saveKvm() {
  
}
// 关闭ws
function closeWs() {
  (ws.value as any)?.close();
}
onBeforeRouteLeave(() => {
  isCurrentPage = false;
  clearTimeout(Number(timerout));
  closeWs();
  clearTimeout(Number(TimerIframe));
});
let showIframe = ref(true)
let isLoading = ref(true)
onMounted(async () => {
  await getVmBase();
  if (Number(baseInfo.value?.current?.status)<2||role !== 4||recommendType) {
    initWs();
  }
  nextTick(() => {
    const iframe: any = document.querySelector('#iframe')
    let onloadIframe = false
    // 处理兼容性问题
    if (iframe?.attachEvent) {
      iframe.attachEvent('onload', () => {
        clearInterval(Number(TimerIframe));
        onloadIframe = true
        setTimeout(() =>{
          isLoading.value = false
        }, 2000)
      })
    } else {
      iframe.onload = () => {
        clearInterval(Number(TimerIframe));
        onloadIframe = true
        setTimeout(() =>{
          isLoading.value = false
        }, 2000)
      }
    }
    TimerIframe = setInterval(() => {
      // console.log(onloadIframe)
      if (!onloadIframe) {
        showIframe.value = false
        setTimeout(() => {showIframe.value = true}, 200);
      }
      // onloadIframe ? '' : iframe?.contentWindow?.location?.reload(true);
    }, 6000)
  })
});
</script>

<style lang="less" scoped>

.jupyter-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  color: var(--white);
  img {
    margin-right: 8px;
  }
}
.jupyter-box {
  height: 100%;
}
</style>
